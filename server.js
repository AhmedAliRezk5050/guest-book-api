const http = require('http');
const { register, login } = require('./controllers/authController');
const {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
} = require('./controllers/messagesController');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', 2592000);

  console.log('method - ', req.method);
  console.log('url - ', req.url);

  if (req.url === '/api/messages' && req.method === 'GET') {
    getMessages(req, res);
  } else if (req.url.match(/\/api\/messages\/(.+)/) && req.method === 'GET') {
    const id = req.url.split('/')[3];

    getMessage(req, res, id);
  } else if (req.url === '/api/messages' && req.method === 'POST') {
    createMessage(req, res);
  } else if (req.url.match(/\/api\/messages\/(.+)/) && req.method === 'PUT') {
    const id = req.url.split('/')[3];

    updateMessage(req, res, id);
  } else if (
    req.url.match(/\/api\/messages\/(.+)/) &&
    req.method === 'DELETE'
  ) {
    const id = req.url.split('/')[3];

    deleteMessage(req, res, id);
  } else if (req.url === '/api/register' && req.method === 'POST') {
    register(req, res);
  } else if (req.url === '/api/login' && req.method === 'POST') {
    login(req, res);
  } else if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(405);

    res.end(JSON.stringify({ errors: ['Route Not Found'] }));
  }
});

const PORT = 5000;

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
