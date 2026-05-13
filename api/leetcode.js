module.exports = async function handler(req, res) {
  const { slug } = req.query;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  const query = `query questionContent($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      title
      content
      difficulty
      topicTags { name }
    }
  }`;

  let r;
  try {
    r = await fetch('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/',
        'Origin': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ query, variables: { titleSlug: slug } }),
    });
  } catch (e) {
    return res.status(502).json({ error: 'LeetCode unreachable: ' + e.message });
  }

  if (!r.ok) return res.status(502).json({ error: `LeetCode API error: ${r.status}` });

  const data = await r.json();
  const q = data?.data?.question;
  if (!q?.content) return res.status(404).json({ error: 'Content unavailable (may require LC Premium)' });

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.json({
    title:      q.title,
    html:       q.content,
    difficulty: q.difficulty,
    tags:       (q.topicTags || []).map(t => t.name),
  });
};
