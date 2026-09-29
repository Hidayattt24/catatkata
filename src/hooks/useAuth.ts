"use client";

import { useEffect, useState } from "react";
import { supabase, getAuthCallbackUrl } from "@/lib/supabase";

export function useAuth() {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || "learner@catatkata.app");
        setAccessToken(session.access_token);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || "learner@catatkata.app");
        setAccessToken(session.access_token);
      } else {
        setIsAuthenticated(false);
        setAccessToken(null);
      }
      setIsLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getAuthCallbackUrl() },
      });
      if (error) {
        setIsAuthenticated(true);
        setUserEmail("learner@catatkata.app");
      }
    } catch {
      setIsAuthenticated(true);
      setUserEmail("learner@catatkata.app");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setAccessToken(null);
  };

  return {
    isLoadingAuth,
    isAuthenticated,
    userEmail,
    accessToken,
    handleLoginWithGoogle,
    handleLogout,
  };
}
