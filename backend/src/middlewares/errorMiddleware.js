// middlewares/errorMiddleware.js
export function errorHandler(err, req, res, next) {
  console.error('[ERROR]:', err)

  // Si les headers ont déjà été envoyés, ne rien faire
  if (res.headersSent) {
    return next(err)
  }

  const status = err.statusCode || err.status || 500
  const message = err.message || 'Internal Server Error'

  res.status(status).json({
    error: message
  })
}