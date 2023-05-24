const allowedCors = [
    'http://katyzhe.nomoredomains.rocks/',
    'https://katyzhe.nomoredomains.rocks',
    'http://api.katyzhe.nomoredomains.rocks/',
    'https://api.katyzhe.nomoredomains.rocks',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3000',
  ];
  
  module.exports = (req, res, next) => {
    const { origin } = req.headers;
    const { method } = req;
    const requestHeaders = req.headers['access-control-request-headers'];
    const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
    if (allowedCors.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    if (method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.header('Access-Control-Allow-Headers', requestHeaders);
      res.end();
    }
    next();
  };