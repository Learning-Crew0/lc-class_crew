/**
 * Helper script to call the migration API endpoint
 * 
 * Usage:
 *   node scripts/run-migration.js
 * 
 * Make sure to set your admin token before running this script.
 */

const https = require('https');

// Configuration
const API_BASE_URL = 'class-crew.onrender.com';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'YOUR_ADMIN_TOKEN_HERE';

if (!ADMIN_TOKEN || ADMIN_TOKEN === 'YOUR_ADMIN_TOKEN_HERE') {
    console.error('❌ Error: ADMIN_TOKEN not set!');
    console.log('\nPlease set your admin token:');
    console.log('  ADMIN_TOKEN=your_token_here node scripts/run-migration.js');
    console.log('\nOr export it first:');
    console.log('  export ADMIN_TOKEN=your_token_here  # Linux/Mac');
    console.log('  $env:ADMIN_TOKEN="your_token_here"  # PowerShell');
    console.log('  set ADMIN_TOKEN=your_token_here     # Windows CMD');
    process.exit(1);
}

console.log('🚀 Running temp image migration on production...\n');

const options = {
    hostname: API_BASE_URL,
    path: '/api/v1/admin/migrations/temp-images',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            
            if (res.statusCode === 200) {
                console.log('✅ Migration completed successfully!\n');
                console.log(`📊 Results:`);
                console.log(`  • Migrated: ${response.data.migrated} courses`);
                console.log(`  • Cleared: ${response.data.cleared} missing images`);
                console.log(`  • Failed: ${response.data.failed} courses`);
                console.log(`  • Total Processed: ${response.data.totalProcessed}`);
                
                if (response.data.details && response.data.details.length > 0) {
                    console.log('\n📝 Details:');
                    response.data.details.forEach((detail, index) => {
                        console.log(`\n  ${index + 1}. ${detail.title} (${detail.id})`);
                        console.log(`     Status: ${detail.status}`);
                        if (detail.changes && detail.changes.length > 0) {
                            detail.changes.forEach(change => {
                                console.log(`     • ${change.field}: ${change.reason}`);
                                if (change.newUrl) {
                                    console.log(`       → ${change.newUrl}`);
                                }
                            });
                        }
                        if (detail.error) {
                            console.log(`     Error: ${detail.error}`);
                        }
                    });
                }
            } else {
                console.error('❌ Migration failed!');
                console.error(`Status: ${res.statusCode}`);
                console.error(`Response: ${JSON.stringify(response, null, 2)}`);
            }
        } catch (error) {
            console.error('❌ Error parsing response:', error.message);
            console.error('Raw response:', data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
});

req.end();

