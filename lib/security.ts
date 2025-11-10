// Security utilities for JuryChain

/**
 * Validate Ethereum address format
 */
export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 5000) // Limit length
}

/**
 * Validate case submission data
 */
export function validateCaseSubmission(data: {
  claimant: string
  respondent: string
  description: string
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check required fields
  if (!data.claimant?.trim()) {
    errors.push('Claimant name is required')
  }
  if (!data.respondent?.trim()) {
    errors.push('Respondent name is required')
  }
  if (!data.description?.trim()) {
    errors.push('Case description is required')
  }

  // Check length limits
  if (data.claimant && data.claimant.length > 100) {
    errors.push('Claimant name must be less than 100 characters')
  }
  if (data.respondent && data.respondent.length > 100) {
    errors.push('Respondent name must be less than 100 characters')
  }
  if (data.description && data.description.length < 50) {
    errors.push('Case description must be at least 50 characters')
  }
  if (data.description && data.description.length > 5000) {
    errors.push('Case description must be less than 5000 characters')
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Rate limiting check (simple client-side check)
 */
export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now()
  const storageKey = `rate_limit_${key}`
  
  try {
    const data = localStorage.getItem(storageKey)
    if (!data) {
      localStorage.setItem(storageKey, JSON.stringify({ count: 1, timestamp: now }))
      return true
    }

    const { count, timestamp } = JSON.parse(data)
    
    // Reset if window expired
    if (now - timestamp > windowMs) {
      localStorage.setItem(storageKey, JSON.stringify({ count: 1, timestamp: now }))
      return true
    }

    // Check if rate limit exceeded
    if (count >= maxAttempts) {
      return false
    }

    // Increment counter
    localStorage.setItem(storageKey, JSON.stringify({ count: count + 1, timestamp }))
    return true
  } catch (error) {
    console.error('Rate limit check failed:', error)
    return true // Fail open if localStorage is unavailable
  }
}

/**
 * Verify transaction hash format
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

/**
 * Check if amount is valid for payment
 */
export function isValidPaymentAmount(amount: string, maxAmount: string): boolean {
  try {
    const amountNum = parseFloat(amount)
    const maxNum = parseFloat(maxAmount)
    return !isNaN(amountNum) && amountNum > 0 && amountNum <= maxNum
  } catch {
    return false
  }
}

/**
 * Generate secure random case ID
 */
export function generateSecureCaseId(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  return `CASE-${timestamp}-${randomPart}`
}

/**
 * Validate network chain ID
 */
export function isValidChainId(chainId: string): boolean {
  const validChainIds = ['0x14a34', '0x1', '0x89', '0xa4b1'] // Base Sepolia, Mainnet, Polygon, Arbitrum
  return validChainIds.includes(chainId.toLowerCase())
}

/**
 * Content Security Policy headers
 */
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://sepolia.base.org https://*.basescan.org https://*.firebaseio.com https://*.googleapis.com wss://*.firebaseio.com;",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}
