import { UserProfile } from '@shared/schema';

/**
 * Check if a Bluesky profile is a trusted verifier/labeler
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
 * Check if a Bluesky profile is verified (any type)
 * Verification in Bluesky is indicated by:
 * 1. The account being a labeler (associated.labeler === true) - 7-scalloped badge
 * 2. Having specific verification labels
 * 
 * Note: Custom domain handles alone don't guarantee verification on Bluesky.
 * The domain must actually verify ownership through DNS/well-known files,
 * but we can't easily check this from the client side.
 */
export function isVerifiedAccount(profile?: UserProfile | null): boolean {
  if (!profile) return false;
  
  // Check if the account is a verified labeler (trusted verifier)
  if (profile.associated?.labeler === true) {
    console.log('✅ Verified as labeler:', profile.handle);
    return true;
  }
  
  // Check for verification labels (e.g., official accounts)
  // This is more reliable than just checking custom domains
  if (profile.labels && profile.labels.length > 0) {
    const hasVerificationLabel = profile.labels.some(
      label => 
        label.val === '!no-unauthenticated' || // Official Bluesky label for verified accounts
        label.val === 'verified' // Custom verification labels
    );
    if (hasVerificationLabel) {
      console.log('✅ Verified by label:', profile.handle);
      return true;
    }
  }
  
  console.log('❌ Not verified:', profile.handle);
  return false;
}

/**
 * Get the verification tooltip text
 */
export function getVerificationTooltip(profile?: UserProfile | null): string {
  if (!profile) return '';
  
  if (profile.associated?.labeler === true) {
    return 'Verified Organization';
  }
  
  return 'Verified Account';
}

