const crypto = require('crypto');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

// Wandbox: free, no auth, real GCC/OpenJDK/Node on Linux
const WANDBOX = {
  python:     { compiler: 'cpython-3.13.8',    options: '' },
  cpp:        { compiler: 'gcc-head',           options: '-std=c++17\n-O2' },
  c:          { compiler: 'gcc-head-c',         options: '-std=c11\n-lm' },
  java:       { compiler: 'openjdk-jdk-22+36',  options: '' },
  javascript: { compiler: 'nodejs-20.17.0',     options: '' },
};

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
    let stdout = '', stderr = '', timedOut = false;
    const timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, timeoutMs);
    child.stdout.on('data', chunk => { stdout += chunk.toString(); });
    child.stderr.on('data', chunk => { stderr += chunk.toString(); });
    child.on('error', err => { clearTimeout(timer); resolve({ code: 127, stdout, stderr: err.message, timedOut }); });
    child.on('close', code => { clearTimeout(timer); resolve({ code, stdout, stderr, timedOut }); });
    child.stdin.end(stdin || '');
  });
}

async function runLocally(language, sourceCode, stdin) {
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
      await fs.writeFile(path.join(dir, 'main.js'), sourceCode);
      const run = await runProcess('node', [path.join(dir, 'main.js')], stdin, 5000);
      if (run.timedOut) return { output: 'Time limit exceeded (5 s)', is_error: true };
      if (run.code !== 0 && !run.stdout) return { output: (run.stderr || `Runtime error (exit ${run.code})`).trim(), is_error: true };
      return { output: [run.stdout, run.stderr].filter(Boolean).join('\n').trim() || '(no output)' };
    } finally { await fs.rm(dir, { recursive: true, force: true }); }
  }

  if (language === 'java') {
    const dir = path.join(os.tmpdir(), `track-plus-${crypto.randomUUID()}`);
    await fs.mkdir(dir, { recursive: true });
    try {
      await fs.writeFile(path.join(dir, 'Main.java'), sourceCode);
      const compile = await runProcess('javac', [path.join(dir, 'Main.java')], '', 15000);
      if (compile.timedOut) return { output: 'Compilation timed out (15 s)', is_error: true };
      if (compile.code !== 0) return { output: 'Compilation Error:\n' + (compile.stderr || compile.stdout || '').trim(), is_error: true };
      const run = await runProcess('java', ['-cp', dir, 'Main'], stdin, 5000);
      if (run.timedOut) return { output: 'Time limit exceeded (5 s)', is_error: true };
      if (run.code !== 0 && !run.stdout) return { output: (run.stderr || `Runtime error (exit ${run.code})`).trim(), is_error: true };
      return { output: [run.stdout, run.stderr].filter(Boolean).join('\n').trim() || '(no output)' };
    } finally { await fs.rm(dir, { recursive: true, force: true }); }
  }

  if (language === 'c') {
    const dir = path.join(os.tmpdir(), `track-plus-${crypto.randomUUID()}`);
    await fs.mkdir(dir, { recursive: true });
    try {
      const src = path.join(dir, 'main.c'), bin = path.join(dir, 'main');
      await fs.writeFile(src, sourceCode);
      const compile = await runProcess('gcc', ['-std=c11', src, '-lm', '-o', bin], '', 10000);
      if (compile.timedOut) return { output: 'Compilation timed out (10 s)', is_error: true };
      if (compile.code !== 0) return { output: 'Compilation Error:\n' + (compile.stderr || compile.stdout || '').trim(), is_error: true };
      const run = await runProcess(bin, [], stdin, 5000);
      if (run.timedOut) return { output: 'Time limit exceeded (5 s)', is_error: true };
      if (run.code !== 0 && !run.stdout) return { output: (run.stderr || `Runtime error (exit ${run.code})`).trim(), is_error: true };
      return { output: [run.stdout, run.stderr].filter(Boolean).join('\n').trim() || '(no output)' };
    } finally { await fs.rm(dir, { recursive: true, force: true }); }
  }

  // C++
  const dir = path.join(os.tmpdir(), `track-plus-${crypto.randomUUID()}`);
  await fs.mkdir(dir, { recursive: true });
  try {
    const src = path.join(dir, 'main.cpp'), bin = path.join(dir, 'main');
    const bitsDir = path.join(dir, 'bits');
    await fs.writeFile(src, sourceCode);
    await fs.mkdir(bitsDir, { recursive: true });
    await fs.writeFile(path.join(bitsDir, 'stdc++.h'), ['algorithm','array','bitset','cmath','deque','functional','iostream','limits','list','map','numeric','queue','set','stack','string','tuple','unordered_map','unordered_set','utility','vector'].map(h => `#include <${h}>`).join('\n') + '\n');
    const compile = await runProcess('g++', ['-std=c++17', '-I', dir, src, '-O2', '-o', bin], '', 10000);
    if (compile.timedOut) return { output: 'Compilation timed out (10 s)', is_error: true };
    if (compile.code !== 0) return { output: 'Compilation Error:\n' + (compile.stderr || compile.stdout || '').trim(), is_error: true };
    const run = await runProcess(bin, [], stdin, 5000);
    if (run.timedOut) return { output: 'Time limit exceeded (5 s)', is_error: true };
    if (run.code !== 0 && !run.stdout) return { output: (run.stderr || `Runtime error (exit ${run.code})`).trim(), is_error: true };
    return { output: [run.stdout, run.stderr].filter(Boolean).join('\n').trim() || '(no output)' };
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runViaWandbox(language, sourceCode, stdin, attempt = 0) {
  // Wandbox saves Java as prog.java — public class requires filename to match
  if (language === 'java') {
    sourceCode = sourceCode.replace(/\bpublic\s+(class\s+\w)/g, '$1');
  }

  const { compiler, options } = WANDBOX[language];
  const r = await fetch('https://wandbox.org/api/compile.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compiler,
      code:                  sourceCode,
      stdin,
      'compiler-option-raw': options,
      save:                  false,
    }),
  });

  if (!r.ok) throw new Error(`Wandbox returned ${r.status}`);

  const data = await r.json();

  if (data.compiler_error) {
    return { output: 'Compilation Error:\n' + data.compiler_error.trim(), is_error: true };
  }
  if (data.signal === 'Killed' || data.signal === 'SIGKILL') {
    return { output: 'Time limit exceeded', is_error: true };
  }

  const stdout = (data.program_output || '').trim();
  const stderr = (data.program_error  || '').trim();

  // Retry once on OCI/container resource errors (transient Wandbox infrastructure issue)
  if (/OCI runtime|crun:|Resource temporarily unavailable/i.test(stderr) && attempt === 0) {
    await sleep(700);
    return runViaWandbox(language, sourceCode, stdin, 1);
  }

  if (data.status !== '0' && !stdout) {
    return { output: stderr || `Runtime error (exit ${data.status})`, is_error: true };
  }
  return { output: [stdout, stderr].filter(Boolean).join('\n') || '(no output)' };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  let body;
  try { body = await parseBody(req); }
  catch (e) { return res.status(400).json({ error: e.message }); }

  const { source_code, language, stdin = '' } = body;
  if (!source_code || !WANDBOX[language]) {
    return res.status(400).json({ error: `Unsupported language: "${language}"` });
  }

  // In production use Wandbox; locally use the native toolchain
  if (process.env.VERCEL) {
    try {
      return res.json(await runViaWandbox(language, source_code, stdin));
    } catch (err) {
      return res.status(502).json({ error: 'Execution service unreachable: ' + err.message });
    }
  }

  // Local dev: native toolchain, fall back to Wandbox if tool not found
  try {
    return res.json(await runLocally(language, source_code, stdin));
  } catch (err) {
    try {
      return res.json(await runViaWandbox(language, source_code, stdin));
    } catch (wandboxErr) {
      return res.status(500).json({ error: err.message + '. Wandbox fallback failed: ' + wandboxErr.message });
    }
  }
};
