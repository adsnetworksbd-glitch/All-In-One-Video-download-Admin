import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, rtdb } from '../services/firebase';
const AuthContext = createContext({
    currentUser: null, adminProfile: null, isLoading: true, isAuthorizedAdmin: false, signOut: async () => { }
});
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [adminProfile, setAdminProfile] = useState(null);
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
                    }
                    else {
                        setIsAuthorizedAdmin(false);
                    }
                }
                catch {
                    setIsAuthorizedAdmin(false);
                }
            }
            else {
                setCurrentUser(null);
                setIsAuthorizedAdmin(false);
            }
            setIsLoading(false);
        });
    }, []);
    return (_jsx(AuthContext.Provider, { value: { currentUser, adminProfile, isLoading, isAuthorizedAdmin, signOut: () => fbSignOut(auth) }, children: children }));
};
export const useAuth = () => useContext(AuthContext);
