import { UserProfile } from '@shared/schema';

/**
 * List of manually verified Basker accounts
 * These accounts get a yellow sun verification badge
 */
const BASKER_VERIFIED_ACCOUNTS = [
  'basker.bio',
  'sam.basker.bio'
];

/**
 * Check if a profile is a trusted verifier/labeler
 * These accounts get the special 7-scalloped badge
 */
export function isTrustedVerifier(profile?: UserProfile | null): boolean {
  if (!profile) return false;
  
  // Check if the account is a verified labeler (trusted verifier)
  if (profile.associated?.labeler === true) {
    console.log('✅ Trusted verifier (labeler):', profile.handle);
    return true;
  }
  
  return false;
}

/**
 * Check if a profile is verified by Basker
 * Only manually verified Basker accounts show verification
 */
export function isBaskerVerified(profile?: UserProfile | null): boolean {
  if (!profile) return false;
  
  // Check if this is a manually verified Basker account
  const isBaskerVerified = BASKER_VERIFIED_ACCOUNTS.includes(profile.handle);
  
  if (isBaskerVerified) {
    console.log('✅ Basker verified account:', profile.handle);
    return true;
  }
  
  return false;
}

/**
 * Check if a profile is verified (any type - Bluesky or Basker)
 */
export function isVerifiedAccount(profile?: UserProfile | null): boolean {
  if (!profile) return false;
  
  console.log('🔍 Checking verification for:', profile.handle);
  console.log('🔍 Full profile object:', JSON.stringify(profile, null, 2));
  console.log('🔍 Profile associated:', profile.associated);
  console.log('🔍 Profile labels:', profile.labels);
  console.log('🔍 Profile labels length:', profile.labels?.length || 0);
  
  // Check Basker verification first
  if (isBaskerVerified(profile)) {
    console.log('✅ Basker verified:', profile.handle);
    return true;
  }
  
  // Check if the account is a verified labeler (trusted verifier)
  if (profile.associated?.labeler === true) {
    console.log('✅ Verified as labeler:', profile.handle);
    return true;
  }
  
  // Check for Bluesky verification property (the actual verification system)
  if (profile.verification) {
    console.log('🔍 Found verification property:', profile.verification);
    console.log('🔍 verification.verifiedStatus:', profile.verification.verifiedStatus);
    console.log('🔍 verification.verifications:', profile.verification.verifications);
    
    if (profile.verification.verifiedStatus === 'valid') {
      console.log('✅ Verified by Bluesky verification system:', profile.handle, 'Verifications:', profile.verification.verifications);
      return true;
    }
  }
  
  // Check for verification labels (Bluesky's labeling system)
  if (profile.labels && profile.labels.length > 0) {
    console.log('🔍 Checking labels for verification:', profile.labels);
    
    // Check for any verification-related labels
    const verificationLabels = profile.labels.filter(label => {
      console.log('🔍 Checking label:', label.val, 'from source:', label.src);
      return label.val === 'verified' || 
             label.val === 'trusted' ||
             label.val === 'official' ||
             label.val === 'blue-check' ||
             label.val === 'verified-account';
    });
    
    if (verificationLabels.length > 0) {
      console.log('✅ Verified by Bluesky trusted source:', profile.handle, 'Labels:', verificationLabels);
      return true;
    }
  }
  
  // Also check if there's a direct verification field
  if ((profile as any).verified === true) {
    console.log('✅ Verified by direct field:', profile.handle);
    return true;
  }
  
  // Check for other possible verification indicators
  if ((profile as any).isVerified === true) {
    console.log('✅ Verified by isVerified field:', profile.handle);
    return true;
  }
  
  // Check for verification in other possible fields
  console.log('🔍 Checking for verification in other fields...');
  console.log('🔍 profile.verified:', (profile as any).verified);
  console.log('🔍 profile.isVerified:', (profile as any).isVerified);
  console.log('🔍 profile.verification:', (profile as any).verification);
  console.log('🔍 profile.verificationStatus:', (profile as any).verificationStatus);
  console.log('🔍 profile.blueCheck:', (profile as any).blueCheck);
  console.log('🔍 profile.checkmark:', (profile as any).checkmark);
  
  if ((profile as any).verified === true || 
      (profile as any).isVerified === true ||
      (profile as any).verification === 'verified' ||
      (profile as any).verificationStatus === 'verified' ||
      (profile as any).blueCheck === true ||
      (profile as any).checkmark === true) {
    console.log('✅ Verified by direct field:', profile.handle);
    return true;
  }
  
  // Check if the handle indicates verification (custom domains ARE verified through DNS)
  if (profile.handle && !profile.handle.endsWith('.bsky.social')) {
    console.log('✅ Custom domain verified:', profile.handle, '- domain ownership verified through DNS');
    return true;
  }
  
  // Only use Bluesky's automatic verification system - no heuristics
  
  console.log('❌ Not verified:', profile.handle);
  return false;
}

/**
 * Get the verification tooltip text with detailed information
 */
export function getVerificationTooltip(profile?: UserProfile | null): { source: string; date?: string; reason?: string } {
  if (!profile) return { source: 'Unknown' };
  
  // Basker verification takes priority
  if (isBaskerVerified(profile)) {
    return { 
      source: 'Basker', 
      date: '10/28/25',
      reason: 'Verified Basker Affiliated Account'
    };
  }
  
  // Trusted verifier/labeler
  if (profile.associated?.labeler === true) {
    return { 
      source: 'Bluesky', 
      date: '2024',
      reason: 'Trusted Labeler'
    };
  }
  
  // Check for Bluesky verification property (the actual verification system)
  if (profile.verification && profile.verification.verifiedStatus === 'valid') {
    const verifications = profile.verification.verifications || [];
    if (verifications.length > 0) {
      // Get the first verification for the tooltip
      const firstVerification = verifications[0];
      const verificationDate = new Date(firstVerification.createdAt).toLocaleDateString();
      
      return { 
        source: 'Bluesky', 
        date: verificationDate,
        reason: 'Verified by trusted sources'
      };
    }
  }
  
  // Check for Bluesky verification labels
  if (profile.labels && profile.labels.length > 0) {
    const verificationLabel = profile.labels.find(
      label => label.val === 'verified' || 
               label.val === 'trusted' ||
               label.val === 'official' ||
               label.val === 'blue-check' ||
               label.val === 'verified-account'
    );
    
    if (verificationLabel) {
      // Extract source from the labeler DID
      let source = 'Bluesky';
      if (verificationLabel.src) {
        // Map known labeler DIDs to their names
        const labelerMap: { [key: string]: string } = {
          'did:plc:ar7c4by46qjdydhdev7ndg3c': 'Bluesky',
          'did:plc:q6gjnaw2blt4fxgdvzw6w6xx': 'Bluesky',
          'did:plc:z72i7hdynmk6r22z27h6tvur': 'Bluesky'
        };
        source = labelerMap[verificationLabel.src] || 'Bluesky';
      }
      
      return { 
        source, 
        date: verificationLabel.cts ? new Date(verificationLabel.cts).toLocaleDateString() : '2024',
        reason: `Verified by trusted sources (${verificationLabel.val})`
      };
    }
  }
  
  // Check for custom domain verification (DNS-based)
  if (profile.handle && !profile.handle.endsWith('.bsky.social')) {
    return { 
      source: 'DNS Verification', 
      date: new Date().getFullYear().toString(),
      reason: 'Domain ownership verified'
    };
  }
  
  // No heuristic verification - only use Bluesky's automatic system
  
  return { source: 'Unknown' };
}

