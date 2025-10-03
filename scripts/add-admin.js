#!/usr/bin/env node

/**
 * Script to add an admin user to the Basker platform
 * Usage: node scripts/add-admin.js <DID> <handle>
 * 
 * Example: node scripts/add-admin.js "did:plc:your-did-here" "your-handle.bsky.social"
 */

const fs = require('fs');
const path = require('path');

function addAdmin(did, handle) {
  if (!did || !handle) {
    console.error('❌ Error: Both DID and handle are required');
    console.log('Usage: node scripts/add-admin.js <DID> <handle>');
    console.log('Example: node scripts/add-admin.js "did:plc:your-did-here" "your-handle.bsky.social"');
    process.exit(1);
  }

  // Validate DID format
  if (!did.startsWith('did:')) {
    console.error('❌ Error: DID must start with "did:"');
    process.exit(1);
  }

  // Validate handle format
  if (!handle.includes('.') || !handle.includes('bsky.social')) {
    console.error('❌ Error: Handle must be in format "username.bsky.social"');
    process.exit(1);
  }

  const adminFilePath = path.join(__dirname, '..', 'server', 'admin.ts');
  
  try {
    let adminContent = fs.readFileSync(adminFilePath, 'utf8');
    
    // Check if DID already exists
    if (adminContent.includes(did)) {
      console.log('⚠️  Warning: This DID is already in the admin list');
      return;
    }
    
    // Add DID to ADMIN_DIDS array
    const adminDidsRegex = /const ADMIN_DIDS = \[([\s\S]*?)\];/;
    const match = adminContent.match(adminDidsRegex);
    
    if (match) {
      const currentDids = match[1].trim();
      const newDids = currentDids + `,\n  '${did}', // ${handle}`;
      adminContent = adminContent.replace(adminDidsRegex, `const ADMIN_DIDS = [${newDids}\n];`);
    }
    
    // Add to adminUsers array
    const adminUsersRegex = /const adminUsers: AdminUser\[\] = \[([\s\S]*?)\];/;
    const usersMatch = adminContent.match(adminUsersRegex);
    
    if (usersMatch) {
      const currentUsers = usersMatch[1].trim();
      const newUser = `,
  {
    did: '${did}',
    handle: '${handle}',
    permissions: ['verify_work', 'manage_companies', 'view_analytics', 'manage_users'],
    addedBy: 'script',
    addedAt: '${new Date().toISOString()}'
  }`;
      adminContent = adminContent.replace(adminUsersRegex, `const adminUsers: AdminUser[] = [${currentUsers}${newUser}\n];`);
    }
    
    // Write the updated file
    fs.writeFileSync(adminFilePath, adminContent);
    
    console.log('✅ Successfully added admin user:');
    console.log(`   DID: ${did}`);
    console.log(`   Handle: ${handle}`);
    console.log('');
    console.log('🔄 Next steps:');
    console.log('1. Run: npm run build');
    console.log('2. Restart your server');
    console.log('3. Login with your account');
    console.log('4. Check the console for admin status confirmation');
    
  } catch (error) {
    console.error('❌ Error updating admin file:', error.message);
    process.exit(1);
  }
}

// Get command line arguments
const [, , did, handle] = process.argv;

addAdmin(did, handle);
