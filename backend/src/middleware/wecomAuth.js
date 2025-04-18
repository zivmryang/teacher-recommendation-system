import axios from 'axios'
import jwt from 'jsonwebtoken'
import { logger } from './logger.js'

const WE_COM_CORP_ID = process.env.WE_COM_CORP_ID
const WE_COM_SECRET = process.env.WE_COM_SECRET
const JWT_SECRET = process.env.JWT_SECRET
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN
const JWT_ISSUER = process.env.JWT_ISSUER

// Token blacklist (in production, use Redis)
const tokenBlacklist = new Set()

class AuthError extends Error {
  constructor(message, status = 401) {
    super(message)
    this.status = status
    this.name = 'AuthError'
  }
}

export async function authenticate(ctx, next) {
  try {
    // Check for JWT token first
    const token = ctx.headers.authorization?.split(' ')[1]
    
    if (token) {
      if (tokenBlacklist.has(token)) {
        throw new AuthError('Token revoked')
      }

      const decoded = jwt.verify(token, JWT_SECRET)
      
      // Verify token issuer
      if (decoded.iss !== JWT_ISSUER) {
        throw new AuthError('Invalid token issuer')
      }

      ctx.state.user = {
        ...decoded,
        token
      }

      logger.info({ userId: decoded.userId }, 'User authenticated via JWT')
      return await next()
    }

    // Fall back to WeCom auth if no token
    const code = ctx.query.code
    if (!code) {
      throw new AuthError('Authorization code required')
    }

    // Get WeCom user info
    const userInfo = await getWeComUserInfo(code)
    
    // Generate tokens
    const accessToken = generateToken(userInfo, JWT_ACCESS_EXPIRES_IN)
    const refreshToken = generateToken(userInfo, JWT_REFRESH_EXPIRES_IN)

    ctx.state.user = {
      userId: userInfo.UserId,
      name: userInfo.name,
      department: userInfo.department,
      roles: ['user'], // Default role
      accessToken,
      refreshToken
    }

    logger.info({ userId: userInfo.UserId }, 'User authenticated via WeCom')
    await next()
  } catch (err) {
    logger.error({ err }, 'Authentication failed')
    ctx.status = err.status || 401
    ctx.body = { 
      error: err.message,
      requestId: ctx.requestId
    }
  }
}

export function requireRole(role) {
  return async (ctx, next) => {
    const user = ctx.state.user
    if (!user?.roles?.includes(role)) {
      logger.warn({ userId: user?.userId }, 'Attempted unauthorized access')
      throw new AuthError('Insufficient permissions', 403)
    }
    await next()
  }
}

export function revokeToken(token) {
  tokenBlacklist.add(token)
  logger.info('Token revoked')
}

function generateToken(userInfo, expiresIn) {
  return jwt.sign({
    userId: userInfo.UserId,
    name: userInfo.name,
    department: userInfo.department,
    roles: ['user'], // Default role
    iss: JWT_ISSUER
  }, JWT_SECRET, { expiresIn })
}

async function getWeComAccessToken() {
  try {
    const response = await axios.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken', {
      params: {
        corpid: WE_COM_CORP_ID,
        corpsecret: WE_COM_SECRET
      }
    })
    return response.data.access_token
  } catch (err) {
    logger.error({ err }, 'Failed to get WeCom access token')
    throw new AuthError('WeCom service unavailable', 503)
  }
}

export async function getWeComUserInfo(code) {
  try {
    const accessToken = await getWeComAccessToken()
    const response = await axios.get('https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo', {
      params: { code, access_token: accessToken }
    })
    return response.data
  } catch (err) {
    logger.error({ err }, 'Failed to get WeCom user info')
    throw new AuthError('WeCom authentication failed')
  }
}
