import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, rtdb } from '../services/firebase';
import { AdminUser } from '../types';

interface AuthContextType {
  currentUser: User | null;
  adminProfile: AdminUser | null;
  isLoading: boolean;
  isAuthorizedAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null, adminProfile: null, isLoading: true, isAuthorizedAdmin: false, signOut: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        setCurrentUser(user);
        try {
          const snap = await get(ref(rtdb, `admins/${user.uid}`));
          if (snap.exists()) {
            setAdminProfile({ uid: user.uid, email: user.email || '', role: snap.val().role || 'admin' });
            setIsAuthorizedAdmin(true);
          } else {
            setIsAuthorizedAdmin(false);
          }
        } catch { setIsAuthorizedAdmin(false); }
      } else {
        setCurrentUser(null);
        setIsAuthorizedAdmin(false);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, adminProfile, isLoading, isAuthorizedAdmin, signOut: () => fbSignOut(auth) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);