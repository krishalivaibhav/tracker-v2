function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  return (h >>> 0).toString(36);
}

export async function runCode(lang, code, stdin) {
  const cacheKey = `cc_${lang}_${hash(code + '\x00' + stdin)}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached !== null) return cached;

  let res;
  try {
    res = await fetch('/api/code/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_code: code, language: lang, stdin }),
    });
  } catch {
    throw new Error('Compiler API is unreachable. Start the app with npm run dev or vercel dev, then try again.');
  }

  let data;
  try {
    data = await res.json();
  } catch {
    if (res.status === 404)
      throw new Error('Compiler API route was not found. Restart the dev server.');
    throw new Error(`Compiler API returned an invalid response (${res.status}).`);
  }

  if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
  const out = data.output || '(no output)';
  if (!data.is_error) { try { sessionStorage.setItem(cacheKey, out); } catch {} }
  return out;
}

export async function warmupCodeApi() {
  try {
    await fetch('/api/code/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_code: 'print(1)', language: 'python', stdin: '' }),
    });
  } catch {}
}
