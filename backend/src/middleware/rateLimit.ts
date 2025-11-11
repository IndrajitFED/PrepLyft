import type { NextFunction, Request, Response } from 'express'

const noopLimiter = (_req: Request, _res: Response, next: NextFunction) => {
  next()
}

export const authLimiter = noopLimiter
export const registerLimiter = noopLimiter
export const apiLimiter = noopLimiter
export const passwordResetLimiter = noopLimiter