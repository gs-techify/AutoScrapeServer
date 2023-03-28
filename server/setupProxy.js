module.exports = function (app) {
    const { createProxyMiddleware } = require('http-proxy-middleware');
    
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:4000',
            changeOrigin: true,
        })
    );
};
