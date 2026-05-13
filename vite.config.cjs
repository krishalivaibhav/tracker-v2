const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const runCode = require('./api/code/run');

function withVercelResponse(res) {
  res.status = code => {
    res.statusCode = code;
    return res;
  };
  res.json = body => {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify(body));
  };
  res.send = body => {
    res.end(body);
  };
  return res;
}

module.exports = defineConfig({
  plugins: [
    react(),
    {
      name: 'track-plus-local-api',
      configureServer(server) {
        server.middlewares.use('/api/code/run', async (req, res) => {
          try {
            await runCode(req, withVercelResponse(res));
          } catch (err) {
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: err.message || 'Local compiler API failed.' }));
            }
          }
        });
      },
    },
  ],
});
