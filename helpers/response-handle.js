const successResponse = (res, code = 200, data) => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(data));
};

const errorResponse = (res, code = 500, errors = ['operation failed']) => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({ errors }));
};

module.exports = {
  successResponse,
  errorResponse,
};
