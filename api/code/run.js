// Server-side proxy: runs code via Piston (free, no auth)
// Versions are auto-detected from /runtimes so we never break on upgrades.

const crypto = require('crypto');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

let _versions     = null;
let _versionsTTL  = 0;

async function getVersions() {
  if (_versions && Date.now() < _versionsTTL) return _versions;
  const r = await fetch('https://emkc.org/api/v2/piston/runtimes');
  if (!r.ok) throw new Error(`Piston runtimes unreachable (${r.status})`);
  const list = await r.json();
  const latest = lang => list
    .filter(e => e.language === lang)
    .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))[0]?.version;
  _versions    = { python: latest('python'), cpp: latest('c++'), c: latest('c'), java: latest('java'), javascript: latest('javascript') };
  _versionsTTL = Date.now() + 10 * 60 * 1000; // 10-min cache
  return _versions;
}

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk.toString(); });
    req.on('end', () => {
      try { resolve(JSON.parse(raw)); }
      catch (e) { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

function runProcess(cmd, args, stdin, timeoutMs) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', chunk => { stdout += chunk.toString(); });
    child.stderr.on('data', chunk => { stderr += chunk.toString(); });
    child.on('error', err => {
      clearTimeout(timer);
      resolve({ code: 127, stdout, stderr: err.message, timedOut });
    });
    child.on('close', code => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut });
    });

    child.stdin.end(stdin || '');
  });
}

async function runLocally(language, sourceCode, stdin) {
  if (process.env.VERCEL) {
    throw new Error('Public Piston is whitelist-only. Configure a self-hosted Piston/Judge0 runner for production code execution.');
  }

  if (language === 'python') {
    const run = await runProcess('python3', ['-c', sourceCode], stdin, 5000);
    if (run.timedOut) return { output: 'Time limit exceeded (5 s)', is_error: true };
    if (run.code !== 0) return { output: (run.stderr || `Runtime error (exit ${run.code})`).trim(), is_error: true };
    return { output: (run.stdout || run.stderr || '(no output)').trim() };
  }

  if (language === 'javascript') {
    const dir = path.join(os.tmpdir(), `track-plus-${crypto.randomUUID()}`);
    await fs.mkdir(dir, { recursive: true });
    try {
      const src = path.join(dir, 'main.js');
      await fs.writeFile(src, sourceCode);
      const run = await runProcess('node', [src], stdin, 5000);
      if (run.timedOut) return { output: 'Time limit exceeded (5 s)', is_error: true };
      if (run.code !== 0 && !run.stdout) return { output: (run.stderr || `Runtime error (exit ${run.code})`).trim(), is_error: true };
      return { output: [run.stdout, run.stderr].filter(Boolean).join('\n').trim() || '(no output)' };
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  }

  if (language === 'java') {
    const dir = path.join(os.tmpdir(), `track-plus-${crypto.randomUUID()}`);
    await fs.mkdir(dir, { recursive: true });
    try {
      const src = path.join(dir, 'Main.java');
      await fs.writeFile(src, sourceCode);
      const compile = await runProcess('javac', [src], '', 15000);
      if (compile.timedOut) return { output: 'Compilation timed out (15 s)', is_error: true };
      if (compile.code !== 0) return { output: 'Compilation Error:\n' + (compile.stderr || compile.stdout || '').trim(), is_error: true };
      const run = await runProcess('java', ['-cp', dir, 'Main'], stdin, 5000);
      if (run.timedOut) return { output: 'Time limit exceeded (5 s)', is_error: true };
      if (run.code !== 0 && !run.stdout) return { output: (run.stderr || `Runtime error (exit ${run.code})`).trim(), is_error: true };
      return { output: [run.stdout, run.stderr].filter(Boolean).join('\n').trim() || '(no output)' };
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  }

  if (language === 'c') {
    const dir = path.join(os.tmpdir(), `track-plus-${crypto.randomUUID()}`);
    await fs.mkdir(dir, { recursive: true });
    try {
      const src = path.join(dir, 'main.c');
      const bin = path.join(dir, 'main');
      await fs.writeFile(src, sourceCode);
      const compile = await runProcess('gcc', ['-std=c11', src, '-lm', '-o', bin], '', 10000);
      if (compile.timedOut) return { output: 'Compilation timed out (10 s)', is_error: true };
      if (compile.code !== 0) return { output: 'Compilation Error:\n' + (compile.stderr || compile.stdout || '').trim(), is_error: true };
      const run = await runProcess(bin, [], stdin, 5000);
      if (run.timedOut) return { output: 'Time limit exceeded (5 s)', is_error: true };
      if (run.code !== 0 && !run.stdout) return { output: (run.stderr || `Runtime error (exit ${run.code})`).trim(), is_error: true };
      return { output: [run.stdout, run.stderr].filter(Boolean).join('\n').trim() || '(no output)' };
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  }

  // C++
  const dir = path.join(os.tmpdir(), `track-plus-${crypto.randomUUID()}`);
  await fs.mkdir(dir, { recursive: true });
  try {
    const src = path.join(dir, 'main.cpp');
    const bin = path.join(dir, 'main');
    const bitsDir = path.join(dir, 'bits');
    await fs.writeFile(src, sourceCode);
    await fs.mkdir(bitsDir, { recursive: true });
    await fs.writeFile(path.join(bitsDir, 'stdc++.h'), [
      '#include <algorithm>',
      '#include <array>',
      '#include <bitset>',
      '#include <cmath>',
      '#include <deque>',
      '#include <functional>',
      '#include <iostream>',
      '#include <limits>',
      '#include <list>',
      '#include <map>',
      '#include <numeric>',
      '#include <queue>',
      '#include <set>',
      '#include <stack>',
      '#include <string>',
      '#include <tuple>',
      '#include <unordered_map>',
      '#include <unordered_set>',
      '#include <utility>',
      '#include <vector>',
      '',
    ].join('\n'));

    const compile = await runProcess('g++', ['-std=c++17', '-I', dir, src, '-O2', '-o', bin], '', 10000);
    if (compile.timedOut) return { output: 'Compilation timed out (10 s)', is_error: true };
    if (compile.code !== 0) {
      return { output: 'Compilation Error:\n' + (compile.stderr || compile.stdout || '').trim(), is_error: true };
    }

    const run = await runProcess(bin, [], stdin, 5000);
    if (run.timedOut) return { output: 'Time limit exceeded (5 s)', is_error: true };
    if (run.code !== 0 && !run.stdout) {
      return { output: (run.stderr || `Runtime error (exit ${run.code})`).trim(), is_error: true };
    }
    return { output: [run.stdout, run.stderr].filter(Boolean).join('\n').trim() || '(no output)' };
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  let body;
  try { body = await parseBody(req); }
  catch (e) { return res.status(400).json({ error: e.message }); }

  const { source_code, language, stdin = '' } = body;
  if (!source_code || !['python', 'cpp', 'c', 'java', 'javascript'].includes(language)) {
    return res.status(400).json({ error: `Unsupported language: "${language}"` });
  }

  let versions;
  try { versions = await getVersions(); }
  catch (e) {
    try { return res.json(await runLocally(language, source_code, stdin)); }
    catch (localErr) { return res.status(502).json({ error: `${e.message}. Local fallback failed: ${localErr.message}` }); }
  }

  const pistonLang    = language === 'cpp' ? 'c++' : language;
  const pistonVersion = versions[language];
  if (!pistonVersion) {
    return res.status(502).json({ error: `No runtime found for ${language}` });
  }

  try {
    const r = await fetch('https://emkc.org/api/v2/piston/execute', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language:        pistonLang,
        version:         pistonVersion,
        files:           language === 'java' ? [{ name: 'Main.java', content: source_code }] : [{ content: source_code }],
        stdin,
        compile_timeout: 10000,
        run_timeout:     5000,
      }),
    });

    if (!r.ok) {
      try { return res.json(await runLocally(language, source_code, stdin)); }
      catch (localErr) { return res.status(502).json({ error: `Piston error (${r.status}). Local fallback failed: ${localErr.message}` }); }
    }

    const data = await r.json();

    // Compilation failure (C++ only)
    if (data.compile && data.compile.code !== 0) {
      return res.json({
        output:   'Compilation Error:\n' + (data.compile.stderr || data.compile.output || '').trim(),
        is_error: true,
      });
    }

    const run    = data.run || {};
    const stdout = (run.stdout || '').trim();
    const stderr = (run.stderr || '').trim();

    if (run.signal === 'SIGKILL') {
      return res.json({ output: 'Time limit exceeded (5 s)', is_error: true });
    }
    if (run.code !== 0 && !stdout) {
      return res.json({ output: stderr || `Runtime error (exit ${run.code})`, is_error: true });
    }

    res.json({ output: [stdout, stderr].filter(Boolean).join('\n') || '(no output)' });
  } catch (err) {
    try { return res.json(await runLocally(language, source_code, stdin)); }
    catch (localErr) { res.status(500).json({ error: 'Execution service unreachable: ' + err.message + '. Local fallback failed: ' + localErr.message }); }
  }
};
