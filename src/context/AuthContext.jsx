import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, functions, db } from '../firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import WebApp from '@twa-dev/sdk';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // By default, if Firebase configuration is missing, we fall back to Demo Mode.
  const hasFirebaseConfig = !!import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const [isDemoMode, setIsDemoMode] = useState(!hasFirebaseConfig);

  useEffect(() => {
    if (isDemoMode) {
      setLoading(false);
      return;
    }

    if (!auth) {
      console.warn("Auth object not initialized, falling back to Demo Mode.");
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const loginWithTelegram = async () => {
    if (isDemoMode) {
      console.log("Demo Mode: Simulated Telegram Login");
      return;
    }

    if (!functions) throw new Error("Firebase Functions not initialized");

    try {
      const initData = WebApp.initData;
      if (!initData) {
        throw new Error("No Telegram init data found");
      }

      const verifyAuth = httpsCallable(functions, 'verifyTelegramAuth');
      const response = await verifyAuth({ initData });

      // In a full implementation, the backend would return a custom token here:
      // const customToken = response.data.customToken;
      // await signInWithCustomToken(auth, customToken);

      console.log("Successfully verified Telegram auth:", response.data);
    } catch (error) {
      console.error("Error logging in with Telegram:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (!isDemoMode && auth) {
      await auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isDemoMode,
      setIsDemoMode,
      loginWithTelegram,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
