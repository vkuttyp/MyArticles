export default defineEventHandler(async (event) => {
  // Configuration from environment variables
  const webhookSecret = process.env.WEBHOOK_SECRET
  const deployPath = process.env.DEPLOY_PATH || '/data/websites/myarticles'
  const gitRepo = process.env.GIT_REPO || 'https://github.com/vkuttyp/myarticles.git'
  const gitBranch = process.env.GIT_BRANCH || 'main'
  const pm2AppName = process.env.PM2_APP_NAME || 'myarticles'
  
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
    // Initialize git if needed, then pull and deploy
    const deployCommand = `
      cd ${deployPath} && \\
      if [ ! -d .git ]; then \\
        git init && \\
        git remote add origin ${gitRepo}; \\
      fi && \\
      git fetch origin && \\
      git reset --hard origin/${gitBranch} && \\
      npm ci --include=dev && \\
      npm run build && \\
      pm2 restart ${pm2AppName}
    `
    
    exec(deployCommand, (error, stdout, stderr) => {
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
