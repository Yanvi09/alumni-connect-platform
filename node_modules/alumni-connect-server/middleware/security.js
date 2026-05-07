const WINDOW_MS = 60 * 1000
const MAX_REQUESTS = 120
const bucket = new Map()

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
}

export function rateLimit(req, res, next) {
  const ip = getClientIp(req)
  const now = Date.now()
  const current = bucket.get(ip)

  if (!current || now > current.resetAt) {
    bucket.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return next()
  }

  current.count += 1
  if (current.count > MAX_REQUESTS) {
    return res.status(429).json({ message: 'Too many requests, please try again shortly.' })
  }
  return next()
}

function sanitizeValue(value) {
  if (typeof value === 'string') {
    return value.replace(/[<>]/g, '').trim()
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = sanitizeValue(v)
    }
    return out
  }
  return value
}

export function sanitizeBody(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body)
  }
  next()
}
