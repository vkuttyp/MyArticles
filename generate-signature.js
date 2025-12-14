// Script to generate valid HMAC-SHA256 signature for GitHub webhook testing
import crypto from 'crypto';

const secret = 'cf2a92d8ed2697037c01586729ffa640cc785bd539e28aa688898d028762d81a';

const payload = JSON.stringify({
  "ref": "refs/heads/main",
  "repository": {
    "name": "myarticles",
    "full_name": "vkuttyp/myarticles"
  },
  "pusher": {
    "name": "test-user"
  },
  "commits": [
    {
      "message": "Test deployment"
    }
  ]
});

const signature = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');

console.log('Generated signature:');
console.log(signature);
console.log('\nUse this in the x-hub-signature-256 header');
