#!/usr/bin/env node

// This script generates R2 Access Key ID and Secret Access Key from a Cloudflare API token
// Run with: node scripts/generate-r2-credentials.js

const API_TOKEN = 'wLM278x8seTuAjPAwfYlGZgi-uqEKD_9pb9tMj-Y';
const ACCOUNT_ID = '869d264631782baa5a086f21329c8e31';

async function generateR2Credentials() {
  try {
    console.log('Generating R2 credentials from API token...\n');

    // Create the R2 token
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/tokens`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'wealthwave-r2-token',
          policies: [
            {
              effect: 'Allow',
              actions: [
                's3:GetObject',
                's3:PutObject',
                's3:DeleteObject',
                's3:ListBucket',
              ],
              resources: ['*'],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Error response:', error);
      throw new Error(
        `Failed to create R2 token: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.success && data.result) {
      console.log('✅ R2 Credentials Generated Successfully!\n');
      console.log('Add these to your .env.local file:\n');
      console.log('R2_ACCESS_KEY_ID=' + data.result.access_key_id);
      console.log('R2_SECRET_ACCESS_KEY=' + data.result.secret_access_key);
      console.log(
        "\n⚠️  IMPORTANT: Save the secret access key now! It won't be shown again."
      );
    } else {
      console.error('Unexpected response:', data);
    }
  } catch (error) {
    console.error('Error generating R2 credentials:', error);
    console.log('\nIf this fails, you can also:');
    console.log('1. Go to https://dash.cloudflare.com/');
    console.log('2. Select your account');
    console.log('3. Go to R2 > Manage R2 API tokens');
    console.log('4. Click "Create API token"');
    console.log('5. Configure permissions for your "beats" bucket');
    console.log('6. Copy the Access Key ID and Secret Access Key');
  }
}

generateR2Credentials();
