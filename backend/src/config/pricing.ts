import Pricing, { IPricing } from '../models/Pricing'

export interface PricingConfig {
  [key: string]: {
    id: string
    name: string
    price: number // Price in rupees
    description: string
  }
}

// Fallback pricing configuration (used if MongoDB is unavailable)
const FALLBACK_PRICING: PricingConfig = {
  'DSA': {
    id: 'DSA',
    name: 'Data Structures & Algorithms',
    price: 9,
    description: 'Comprehensive DSA interview preparation'
  },
  'Data Science': {
    id: 'Data Science',
    name: 'Data Science',
    price: 1299,
    description: 'Data Science and ML interview preparation'
  },
  'Analytics': {
    id: 'Analytics',
    name: 'Data Analytics',
    price: 899,
    description: 'Data Analytics interview preparation'
  },
  'System Design': {
    id: 'System Design',
    name: 'System Design',
    price: 1499,
    description: 'System Design interview preparation'
  },
  'Behavioral': {
    id: 'Behavioral',
    name: 'Behavioral Interview',
    price: 599,
    description: 'Behavioral and soft skills interview preparation'
  },
  'Frontend-Junior': {
    id: 'Frontend-Junior',
    name: 'Frontend Resources (1-3 yrs)',
    price: 799,
    description: 'Junior track covering core web foundations and modern JavaScript'
  },
  'Frontend-Mid': {
    id: 'Frontend-Mid',
    name: 'Frontend Resources (3-5 yrs)',
    price: 1199,
    description: 'Mid-level track focusing on advanced JS, React architecture, tooling'
  },
  'Frontend-Senior': {
    id: 'Frontend-Senior',
    name: 'Frontend Resources (5+ yrs)',
    price: 1799,
    description: 'Senior track targeting system design, performance and leadership interviews'
  }
}

// In-memory cache for pricing (refreshed periodically)
let pricingCache: PricingConfig | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch pricing from MongoDB and cache it
 */
const fetchPricingFromDB = async (): Promise<PricingConfig> => {
  try {
    const pricingDocs = await Pricing.find({ isActive: true }).lean()
    
    const pricing: PricingConfig = {}
    pricingDocs.forEach((doc: IPricing) => {
      pricing[doc.id] = {
        id: doc.id,
        name: doc.name,
        price: doc.price,
        description: doc.description
      }
    })
    
    return pricing
  } catch (error) {
    console.error('Error fetching pricing from MongoDB:', error)
    throw error
  }
}

/**
 * Get pricing configuration (from cache or MongoDB)
 */
const getPricingConfig = async (): Promise<PricingConfig> => {
  const now = Date.now()
  
  // Return cached data if still valid
  if (pricingCache && (now - cacheTimestamp) < CACHE_TTL) {
    return pricingCache
  }
  
  try {
    // Fetch from MongoDB
    pricingCache = await fetchPricingFromDB()
    cacheTimestamp = now
    
    // If no pricing found in DB, use fallback
    if (Object.keys(pricingCache).length === 0) {
      console.warn('No pricing found in MongoDB, using fallback pricing')
      pricingCache = FALLBACK_PRICING
    }
    
    return pricingCache
  } catch (error) {
    console.error('Failed to fetch pricing from MongoDB, using fallback:', error)
    // Use fallback if MongoDB is unavailable
    return FALLBACK_PRICING
  }
}

/**
 * Get price for a specific session field
 */
export const getSessionPrice = async (field: string): Promise<number> => {
  const config = await getPricingConfig()
  const sessionConfig = config[field]
  return sessionConfig ? sessionConfig.price : 999 // Default price
}

/**
 * Get configuration for a specific session field
 */
export const getSessionConfig = async (field: string) => {
  const config = await getPricingConfig()
  return config[field] || config['DSA'] || {
    id: 'DSA',
    name: 'Data Structures & Algorithms',
    price: 999,
    description: 'Default session type'
  }
}

/**
 * Get all available session types with pricing
 */
export const getAllSessionTypes = async () => {
  const config = await getPricingConfig()
  return Object.values(config)
}

/**
 * Clear the pricing cache (useful after updating pricing in DB)
 */
export const clearPricingCache = () => {
  pricingCache = null
  cacheTimestamp = 0
}

/**
 * Initialize pricing in MongoDB with default values if collection is empty
 */
export const initializePricing = async (): Promise<void> => {
  try {
    const count = await Pricing.countDocuments()
    
    if (count === 0) {
      console.log('Initializing pricing in MongoDB with default values...')
      const defaultPricing = Object.values(FALLBACK_PRICING).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        isActive: true
      }))
      
      await Pricing.insertMany(defaultPricing)
      console.log('✅ Default pricing initialized in MongoDB')
      
      // Clear cache to force refresh
      clearPricingCache()
    }
  } catch (error) {
    console.error('Error initializing pricing:', error)
  }
}
