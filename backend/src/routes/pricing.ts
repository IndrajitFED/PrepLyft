import express from 'express'
import { ResponseHandler } from '../utils/response'
import { asyncHandler } from '../middleware/errorHandler'
import { getAllSessionTypes, getSessionConfig, getSessionPrice } from '../config/pricing'

const router = express.Router()

// @route   GET /api/pricing/sessions
// @desc    Get all available session types with pricing
// @access  Public
router.get('/sessions', asyncHandler(async (req: express.Request, res: express.Response) => {
  const sessionTypes = await getAllSessionTypes()
  
  return ResponseHandler.success(res, { 
    sessionTypes 
  }, 'Session types and pricing retrieved successfully')
}))

// @route   GET /api/pricing/sessions/:field
// @desc    Get pricing for a specific session field
// @access  Public
router.get('/sessions/:field', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { field } = req.params
  const config = await getSessionConfig(field)
  const price = await getSessionPrice(field)
  
  return ResponseHandler.success(res, { 
    field,
    config,
    price
  }, 'Session pricing retrieved successfully')
}))

export default router
