import express from 'express'
import { ResponseHandler } from '../utils/response'
import { getAllSessionTypes, getSessionConfig, getSessionPrice } from '../config/pricing'

const router = express.Router()

// @route   GET /api/pricing/sessions
// @desc    Get all available session types with pricing
// @access  Public
router.get('/sessions', async (req: express.Request, res: express.Response) => {
  try {
    const sessionTypes = await getAllSessionTypes()
    
    return ResponseHandler.success(res, { 
      sessionTypes 
    }, 'Session types and pricing retrieved successfully')
  } catch (error) {
    console.error('Error fetching session pricing:', error)
    return ResponseHandler.error(res, 'Failed to fetch session pricing', 500)
  }
})

// @route   GET /api/pricing/sessions/:field
// @desc    Get pricing for a specific session field
// @access  Public
router.get('/sessions/:field', async (req: express.Request, res: express.Response) => {
  try {
    const { field } = req.params
    const config = await getSessionConfig(field)
    const price = await getSessionPrice(field)
    
    return ResponseHandler.success(res, { 
      field,
      config,
      price
    }, 'Session pricing retrieved successfully')
  } catch (error) {
    console.error('Error fetching session pricing:', error)
    return ResponseHandler.error(res, 'Failed to fetch session pricing', 500)
  }
})

export default router
