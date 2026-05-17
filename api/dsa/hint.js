// level -1 = free chat, 0 = nudge, 1 = hint, 2 = approach, 3 = full solution

// problem_type: 'lc' = LC-style class/method only | 'custom' = full stdin/stdout solution

// Extract variable names assigned in the boilerplate header so we can tell the AI exactly
// what is and isn't in scope for the MIDDLE section.
function listBoilerplateVars(code) {
  if (!code?.trim()) return [];
  const vars = new Set();
  for (const line of code.split('\n')) {
    // Simple assignments:  a, b = ...  /  n = ...  /  arr = ...
    const assign = line.match(/^([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*)\s*=/);
    if (assign) assign[1].split(',').forEach(v => vars.add(v.trim()));
    // import sys  /  import os
    const imp = line.match(/^import\s+(\w+)/);
    if (imp) vars.add(imp[1]);
  }
  // Remove Python builtins / keywords that aren't useful to list
  ['True', 'False', 'None', 'input'].forEach(v => vars.delete(v));
  return [...vars].filter(Boolean);
}

const SYSTEM_BASE = (contextBlock, problemType, boilerplateHeader, boilerplateFooter) => {
  const hasBoilerplate = boilerplateHeader?.trim() || boilerplateFooter?.trim();

  let boilerplateRule;
  if (problemType === 'lc') {
    boilerplateRule = `BOILERPLATE RULE (LeetCode-style):
The editor has a class skeleton (e.g. "class Solution"). Only fill in the method body.
Do NOT add main(), I/O handling, print statements, or anything outside the class/method.`;
  } else if (hasBoilerplate) {
    const definedVars = listBoilerplateVars(boilerplateHeader);
    const varLine = definedVars.length > 0
      ? `Variables already defined by the TOP boilerplate and ready to use: ${definedVars.join(', ')}.`
      : `The TOP boilerplate defines NO parsed variables (only imports/stdin setup).`;
    boilerplateRule = `BOILERPLATE RULE (3-section editor):
The editor is split into three sections:
  TOP (editable boilerplate): handles imports and input parsing — already present, do NOT repeat it.
  MIDDLE (editable): where the student writes their core solution logic.
  BOTTOM (editable boilerplate): handles output/closing code — already present, do NOT repeat it.

When you generate code, output ONLY the MIDDLE section — the core algorithm/logic.
Do NOT include imports, input parsing, main(), return statements for I/O, or closing braces.

SCOPE RULE — this is mandatory:
${varLine}
Any variable NOT in that list (e.g. n, q, arr, t, capacity) is UNDEFINED at runtime.
If your solution needs such a variable, you MUST either:
  a) Read it from input() yourself at the start of the MIDDLE section, OR
  b) Use an unbounded structure (e.g. Python list instead of [0]*n).
Never write code that references a variable you cannot see in the TOP boilerplate above.`;
  } else {
    boilerplateRule = `BOILERPLATE RULE (stdin/stdout problem):
The editor shows the ENTIRE program that gets executed — there is no hidden runner.
Your code MUST include: input parsing, algorithm, AND output printing — a complete runnable program.
Replace the placeholder comment with the full working solution.`;
  }

  return `You are an AI DSA mentor embedded in a coding practice tool.
You have full context of the problem and the student's current code.
Always be accurate — if you provide code, double-check it handles all edge cases.

${boilerplateRule}

${contextBlock}`;
};

const LEVEL_INSTRUCTION = [
  `Ask ONE short probing question (max 2 sentences) to make the student think.
Do NOT name any algorithm, data structure, or technique. Under 40 words.`,

  `Give ONE concrete hint naming the key pattern (e.g. "two pointers", "hash map", "binary search").
Do NOT explain how to apply it. Max 3 sentences.`,

  `Explain the full algorithm step by step in plain English.
Numbered steps, no code (pseudocode ok). Include intuition. Max 200 words.`,

  `Complete solution walkthrough:
1. Key insight (1–2 sentences)
2. Step-by-step algorithm
3. Complete working code following the boilerplate rule above
4. Time & space complexity`,
];

const CHAT_INSTRUCTION = `Answer the student's question directly. Provide code when asked, following the boilerplate rule.

IMPORTANT — when fixing an error or wrong answer in the student's existing code:
Always output the COMPLETE corrected code (every function, every line), not just the changed section.
The "Send to Editor" button replaces the entire editor content with whatever is in the code block.
If you only output the fixed function, the rest of their solution gets deleted and nothing runs.
Show the full working code so the student can click "Send to Editor" and run it immediately.`;

// ─── quick model probe: send one token, check it works ───
async function probeModel(apiUrl, apiKey, model, isAnthropic = false) {
  try {
    const body = isAnthropic
      ? JSON.stringify({ model, max_tokens: 5, stream: false, messages: [{ role: 'user', content: 'hi' }] })
      : JSON.stringify({ model, max_tokens: 5, stream: false, messages: [{ role: 'user', content: 'hi' }] });

    const headers = isAnthropic
      ? { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }
      : { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' };

    const url = isAnthropic ? 'https://api.anthropic.com/v1/messages' : apiUrl;
    const r = await fetch(url, { method: 'POST', headers, body, signal: AbortSignal.timeout(8000) });
    if (r.status === 429) return 'quota';
    if (!r.ok) return 'error';
    return 'ok';
  } catch { return 'error'; }
}

// ─── model listing + probing ───
async function listModels(provider, apiKey) {
  const ENDPOINTS = {
    openai: 'https://api.openai.com/v1/chat/completions',
    gemini: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    groq:   'https://api.groq.com/openai/v1/chat/completions',
  };

  let candidates = [];

  if (provider === 'openai') {
    const r = await fetch('https://api.openai.com/v1/models', { headers: { 'Authorization': `Bearer ${apiKey}` } });
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error?.message || `HTTP ${r.status}`); }
    const d = await r.json();
    candidates = (d.data || []).map(m => m.id)
      .filter(id => /^gpt-4|^gpt-3\.5-turbo|^o[1-9]/.test(id))
      .sort((a, b) => b.localeCompare(a));
  }

  if (provider === 'gemini') {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error?.message || `HTTP ${r.status}`); }
    const d = await r.json();
    const SKIP = /embedding|aqa|vision|1\.0|thinking|imagen|tts|live|preview|exp\b/i;
    candidates = (d.models || [])
      .filter(m => (m.supportedGenerationMethods || []).includes('generateContent') && m.name.includes('gemini') && !SKIP.test(m.name))
      .map(m => m.name.replace('models/', ''))
      .sort((a, b) => b.localeCompare(a));
  }

  if (provider === 'anthropic') {
    const r = await fetch('https://api.anthropic.com/v1/models', { headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' } });
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error?.message || `HTTP ${r.status}`); }
    const d = await r.json();
    candidates = (d.data || []).map(m => m.id).sort((a, b) => b.localeCompare(a));
  }

  if (provider === 'groq') {
    const r = await fetch('https://api.groq.com/openai/v1/models', { headers: { 'Authorization': `Bearer ${apiKey}` } });
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error?.message || `HTTP ${r.status}`); }
    const d = await r.json();
    candidates = (d.data || [])
      .filter(m => m.object === 'model' && !/(whisper|guard|tool)/i.test(m.id))
      .map(m => m.id).sort((a, b) => b.localeCompare(a));
  }

  if (!candidates.length) throw new Error('No compatible models found for this key.');

  // Probe up to 5 models concurrently to find working ones
  const probeTargets = candidates.slice(0, 5);
  const apiUrl = ENDPOINTS[provider];
  const results = await Promise.all(
    probeTargets.map(m => probeModel(apiUrl, apiKey, m, provider === 'anthropic').then(status => ({ m, status })))
  );

  const working   = results.filter(r => r.status === 'ok').map(r => r.m);
  const quotaHit  = results.filter(r => r.status === 'quota').map(r => r.m);
  const remaining = candidates.slice(5); // untested — include but deprioritised

  // Return: working first, then untested, skip errored ones
  const verified = [...new Set([...working, ...remaining])];
  if (!verified.length && quotaHit.length) {
    // All tested models hit quota — key is valid but rate-limited
    throw new Error(`Key is valid but rate-limited on ${provider}. Wait a moment and try again.`);
  }
  if (!verified.length) throw new Error('No working models found — check your key or plan.');

  return verified;
}

// ─── streaming helpers ───
async function streamOpenAICompat({ apiUrl, apiKey, model, messages, res }) {
  const apiRes = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, temperature: 0.4, stream: true, max_tokens: 2048, messages }),
  });

  if (!apiRes.ok) {
    const body = await apiRes.text().catch(() => '');
    let msg = `API error ${apiRes.status}`;
    try { const e = JSON.parse(body); msg = e.error?.message || e.message || msg; } catch {}
    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    return;
  }

  const reader = apiRes.body.getReader(), decoder = new TextDecoder();
  let buf = '', tokenCount = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n'); buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') { res.write('data: [DONE]\n\n'); continue; }
      try {
        const chunk = JSON.parse(payload);
        if (chunk.error) { res.write(`data: ${JSON.stringify({ error: chunk.error.message || JSON.stringify(chunk.error) })}\n\n`); return; }
        const finish = chunk.choices?.[0]?.finish_reason;
        if (finish && finish !== 'stop' && finish !== 'length' && tokenCount === 0) {
          res.write(`data: ${JSON.stringify({ error: `Blocked by provider (${finish}). Try a different model.` })}\n\n`); return;
        }
        const token = chunk.choices?.[0]?.delta?.content;
        if (token) { tokenCount++; res.write(`data: ${JSON.stringify({ token })}\n\n`); }
      } catch {}
    }
  }
  if (tokenCount === 0)
    res.write(`data: ${JSON.stringify({ error: 'Empty response — try gemini-1.5-flash or gemini-2.0-flash.' })}\n\n`);
}

async function streamAnthropic({ apiKey, model, system, messages, res }) {
  const antRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: 2048, stream: true, system, messages: messages.filter(m => m.role !== 'system') }),
  });
  if (!antRes.ok) {
    const e = await antRes.json().catch(() => ({}));
    res.write(`data: ${JSON.stringify({ error: e.error?.message || `Anthropic error ${antRes.status}` })}\n\n`); return;
  }
  const reader = antRes.body.getReader(), decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n'); buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        const chunk = JSON.parse(line.slice(6).trim());
        if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta')
          res.write(`data: ${JSON.stringify({ token: chunk.delta.text })}\n\n`);
      } catch {}
    }
  }
}

const { checkRateLimit, rateLimitExceeded } = require('../_lib/rateLimit');

// ─── main handler ───
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Model listing + probing
  if (req.body?.action === 'list_models') {
    const { provider = 'groq', user_api_key } = req.body;
    const apiKey = provider === 'groq' ? process.env.GROQ_API_KEY : user_api_key;
    if (!apiKey) return res.status(400).json({ error: 'API key required.' });
    try {
      const models = await listModels(provider, apiKey);
      return res.json({ models });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  const {
    problem_title, problem_slug, problem_desc, problem_type = 'custom',
    user_code, boilerplate_header = '', boilerplate_footer = '',
    lang, messages = [], level = 0,
    provider = 'groq', model: userModel, user_api_key,
  } = req.body || {};

  if (!problem_title) return res.status(400).json({ error: 'problem_title is required' });
  if (provider !== 'groq' && !user_api_key?.trim())
    return res.status(400).json({ error: `API key required for ${provider}.` });

  // Only rate-limit when using the shared free Groq key
  if (provider === 'groq') {
    const rl = await checkRateLimit(req, 'hint', 20);
    if (!rl.allowed) return rateLimitExceeded(res, rl.resetAt);
  }

  const hasBoilerplate = boilerplate_header?.trim() || boilerplate_footer?.trim();

  const ctxParts = [`### Problem: ${problem_title}`];
  if (problem_slug) ctxParts.push(`LeetCode slug: ${problem_slug}`);
  if (problem_desc?.trim()) ctxParts.push(`\n### Problem Statement\n${problem_desc.trim()}`);

  if (hasBoilerplate) {
    if (boilerplate_header?.trim())
      ctxParts.push(`\n### TOP boilerplate (already in editor — do not repeat)\n\`\`\`${lang || ''}\n${boilerplate_header.trim()}\n\`\`\``);
    // Extract just the body (middle section) from the full user_code
    const bodyOnly = user_code?.trim()
      ? user_code.replace(boilerplate_header || '', '').replace(boilerplate_footer || '', '').trim()
      : '';
    ctxParts.push(bodyOnly
      ? `\n### Student's solution (MIDDLE section — the only part they write)\n\`\`\`${lang || ''}\n${bodyOnly.slice(0, 2000)}\n\`\`\``
      : '\n### Student\'s solution\n(Nothing written yet — only the placeholder comment.)');
    if (boilerplate_footer?.trim())
      ctxParts.push(`\n### BOTTOM boilerplate (already in editor — do not repeat)\n\`\`\`${lang || ''}\n${boilerplate_footer.trim()}\n\`\`\``);
  } else {
    ctxParts.push(user_code?.trim()
      ? `\n### Full editor code (${lang || 'unknown'})\n\`\`\`${lang || ''}\n${user_code.slice(0, 2500)}\n\`\`\``
      : '\n### Student\'s code\n(Nothing written yet.)');
  }

  const levelInstruction = level < 0
    ? CHAT_INSTRUCTION
    : LEVEL_INSTRUCTION[Math.min(level, LEVEL_INSTRUCTION.length - 1)];
  const systemContent = SYSTEM_BASE(ctxParts.join('\n'), problem_type, boilerplate_header, boilerplate_footer) + '\n\n### Your task\n' + levelInstruction;

  const chatMessages = [{ role: 'system', content: systemContent }, ...messages.slice(-8)];

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    if (provider === 'anthropic') {
      await streamAnthropic({ apiKey: user_api_key, model: userModel || 'claude-sonnet-4-5', system: systemContent, messages: chatMessages, res });
    } else {
      const URLS = {
        groq:   'https://api.groq.com/openai/v1/chat/completions',
        openai: 'https://api.openai.com/v1/chat/completions',
        gemini: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      };
      const apiUrl = URLS[provider] || URLS.groq;
      const apiKey = provider === 'groq' ? process.env.GROQ_API_KEY : user_api_key;
      const model  = userModel || (provider === 'groq' ? (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile') : undefined);
      if (!apiKey) { res.write(`data: ${JSON.stringify({ error: 'GROQ_API_KEY not configured.' })}\n\n`); return res.end(); }
      await streamOpenAICompat({ apiUrl, apiKey, model, messages: chatMessages, res });
    }
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
  }
  res.end();
};
