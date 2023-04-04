module.exports = function (app) {
    const { createProxyMiddleware } = require('http-proxy-middleware');
    
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://autorefresher.info',
            changeOrigin: true,
        })
    );
};
