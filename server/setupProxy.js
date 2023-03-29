module.exports = function (app) {
    const { createProxyMiddleware } = require('http-proxy-middleware');
    
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://178.238.228.102:4000',
            changeOrigin: true,
        })
    );
};
