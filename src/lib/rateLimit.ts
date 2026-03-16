import { NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  return async (request: Request, { ip }: { ip?: string }) => {
    const identifier = ip || 'unknown';
    const now = Date.now();
    
    const record = rateLimitStore.get(identifier);
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return { success: true, remaining: config.maxRequests - 1 };
    }
    
    if (record.count >= config.maxRequests) {
      return { 
        success: false, 
        error: 'Too many requests, please try again later',
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      };
    }
    
    record.count++;
    return { success: true, remaining: config.maxRequests - record.count };
  };
}

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 100
});
