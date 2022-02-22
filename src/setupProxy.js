// This file controls the setup of the dev proxy
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/',
    createProxyMiddleware('!/dev/**', {
      target: 'https://ci.kbase.us/',
      changeOrigin: true,
    })
  );
};
