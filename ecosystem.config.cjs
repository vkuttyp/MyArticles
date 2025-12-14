const path = require('path');
const fs = require('fs');

// Load environment variables from .env file
const envFile = path.join(__dirname, '.env');
const env = { NODE_ENV: 'production', PORT: 3000 };

if (fs.existsSync(envFile)) {
  const envConfig = fs.readFileSync(envFile, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      env[key.trim()] = values.join('=').trim();
    }
  });
}

module.exports = {
  apps: [
    {
      name: 'myarticles',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: env
    }
  ]
}
