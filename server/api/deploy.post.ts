export default defineEventHandler(async (event) => {
  // Get the webhook secret from environment variables
  const webhookSecret = process.env.WEBHOOK_SECRET
  
  if (!webhookSecret) {
    console.error('WEBHOOK_SECRET not configured')
    throw createError({
      statusCode: 500,
      statusMessage: 'Webhook not configured'
    })
  }

  // Get the signature from GitHub
  const signature = getHeader(event, 'x-hub-signature-256')
  
  if (!signature) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No signature provided'
    })
  }

  // Read the raw body
  const body = await readRawBody(event)
  
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No body provided'
    })
  }

  // Verify the signature using crypto
  const crypto = await import('crypto')
  const hmac = crypto.createHmac('sha256', webhookSecret)
  const digest = 'sha256=' + hmac.update(body).digest('hex')
  
  // Compare signatures
  if (signature !== digest) {
    console.error('Invalid signature')
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid signature'
    })
  }

  // Execute the deployment script in background
  try {
    const { exec } = await import('child_process')

    console.log('Starting deployment in background...')
    
    // Run deployment in background without waiting
    // Reset local changes and pull fresh from remote
    exec('cd /data/websites/myarticles && git fetch origin && git reset --hard origin/main && npm install && npm run build && pm2 restart myarticles', (error, stdout, stderr) => {
      if (error) {
        console.error('Deployment error:', error)
        return
      }
      console.log('Deployment completed successfully')
      console.log('stdout:', stdout)
      if (stderr) console.error('stderr:', stderr)
    })
    
    // Respond immediately to GitHub
    return {
      success: true,
      message: 'Deployment started in background'
    }
  } catch (error: any) {
    console.error('Failed to start deployment:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to start deployment',
      data: error.message
    })
  }
})
