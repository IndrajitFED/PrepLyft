export interface PricingConfig {
  [key: string]: {
    id: string
    name: string
    price: number // Price in rupees
    description: string
  }
}

export const SESSION_PRICING: PricingConfig = {
  'DSA': {
    id: 'DSA',
    name: 'Data Structures & Algorithms',
    price: 999,
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
  }
}

export const getSessionPrice = (field: string): number => {
  const config = SESSION_PRICING[field]
  return config ? config.price : 999 // Default price
}

export const getSessionConfig = (field: string) => {
  return SESSION_PRICING[field] || SESSION_PRICING['DSA']
}

export const getAllSessionTypes = () => {
  return Object.values(SESSION_PRICING)
}
