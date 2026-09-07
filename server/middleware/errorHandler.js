function notFound(req, res, next) {
  res.status(404).json({ error: `NOT_FOUND // ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  console.error(`[ERROR] ${err.message}`);
  res.status(status).json({
    error: status === 500 ? 'INTERNAL_SYSTEM_ERROR' : err.message
  });
}

module.exports = { notFound, errorHandler };
