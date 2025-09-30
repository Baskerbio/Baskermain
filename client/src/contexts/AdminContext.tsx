import React, { createContext, useContext, useState, useEffect } from 'react';
import { atprotocol } from '../lib/atprotocol';

interface AdminContextType {
  isAdmin: boolean;
  adminPermissions: string[];
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  adminPermissions: [],
  loading: true,
});

// Admin DIDs that have admin access
const ADMIN_DIDS = [
  'did:plc:uw2cz5hnxy2i6jbmh6t2i7hi', // @samthibault.bsky.social
  'did:plc:example-admin-did', // @basker.bio (placeholder)
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPermissions, setAdminPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const currentDid = atprotocol.getCurrentDid();
        if (!currentDid) {
          setIsAdmin(false);
          setAdminPermissions([]);
          setLoading(false);
          return;
        }

        // Check if current user is an admin
        const isAdminUser = ADMIN_DIDS.includes(currentDid);
        setIsAdmin(isAdminUser);
        
        if (isAdminUser) {
          // Set admin permissions
          setAdminPermissions(['verify_work', 'manage_companies', 'view_analytics', 'manage_users']);
        } else {
          setAdminPermissions([]);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setAdminPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, adminPermissions, loading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
