"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { firebaseConfigError, getFirebaseAuth, isFirebaseConfigured } from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  firebaseReady: boolean;
  firebaseError: string | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  firebaseReady: false,
  firebaseError: null,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(firebaseConfigError);
  const firebaseReady = isFirebaseConfigured && !firebaseError;

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};
    try {
      const auth = getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, (nextUser: User | null) => {
        setUser(nextUser);
        setLoading(false);
      });
      setFirebaseError(null);
    } catch (err: any) {
      setFirebaseError(err?.message || "Firebase initialization failed.");
      setLoading(false);
    }

    return unsubscribe;
  }, []);

  const assertAuthReady = () => {
    if (!firebaseReady) {
      throw new Error(firebaseError || "Authentication is unavailable. Please contact support.");
    }
  };

  const signup = async (email: string, password: string) => {
    assertAuthReady();
    const auth = getFirebaseAuth();
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    assertAuthReady();
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    assertAuthReady();
    const auth = getFirebaseAuth();
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    assertAuthReady();
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    loading,
    firebaseReady,
    firebaseError,
    signup,
    login,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
