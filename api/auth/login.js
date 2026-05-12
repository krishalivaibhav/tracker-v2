const crypto = require('crypto');

module.exports = function handler(req, res) {
  const state = crypto.randomBytes(16).toString('hex');
  const base = process.env.APP_URL ||
    (() => {
      const proto = req.headers['x-forwarded-proto'] || 'http';
      const host  = req.headers['x-forwarded-host'] || req.headers.host;
      return `${proto}://${host}`;
    })();
  const redirectUri = `${base}/api/auth/callback`;

  const params = new URLSearchParams({
    client_id:     process.env.GOOGLE_CLIENT_ID,
    redirect_uri:  redirectUri,
    response_type: 'code',
    scope:         'openid email profile',
    state,
    access_type:   'online',
  });

  res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax`);
  res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};
