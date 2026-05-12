const crypto = require('crypto');

function parseCookies(header) {
  const out = {};
  for (const part of (header || '').split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  }
  return out;
}

function signSession(payload, secret) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig  = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${sig}`;
}

module.exports = async function handler(req, res) {
  const { code, state } = req.query;
  const cookies = parseCookies(req.headers.cookie);

  if (!state || state !== cookies.oauth_state) {
    return res.status(400).send('OAuth state mismatch — please try signing in again.');
  }

  const base = process.env.APP_URL ||
    (() => {
      const proto = req.headers['x-forwarded-proto'] || 'http';
      const host  = req.headers['x-forwarded-host'] || req.headers.host;
      return `${proto}://${host}`;
    })();
  const redirectUri = `${base}/api/auth/callback`;

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    new URLSearchParams({
      client_id:     process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri:  redirectUri,
      grant_type:    'authorization_code',
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return res.status(400).send('Google did not return an access token. Please try again.');
  }

  // Fetch user profile
  const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const user = await userRes.json();

  const session = signSession(
    {
      id:     user.sub,
      name:   user.name,
      email:  user.email,
      avatar: user.picture,
    },
    process.env.SESSION_SECRET,
  );

  const secure = req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : '';
  res.setHeader('Set-Cookie', [
    `oauth_state=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
    `session=${session}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax${secure}`,
  ]);
  res.redirect(302, '/');
};
