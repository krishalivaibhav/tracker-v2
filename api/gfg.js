module.exports = async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('https://www.geeksforgeeks.org/problems/')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const pageRes = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html',
    },
  });

  const html = await pageRes.text();

  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
  if (!match) return res.status(502).json({ error: 'Could not parse GFG page' });

  let data;
  try { data = JSON.parse(match[1]); } catch { return res.status(502).json({ error: 'Invalid JSON from GFG' }); }

  const prob = data?.props?.pageProps?.initialState?.problemData?.allData?.probData;
  if (!prob) return res.status(404).json({ error: 'Problem data not found in page' });

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.json({
    title:      prob.problem_name,
    html:       prob.problem_question || '',
    difficulty: prob.problem_level_text,
  });
};
