'use client';

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function RootPage() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      redirect('/dashboard');
    } else {
      redirect('/login');
    }
  }, [isAuthenticated]);

  return null;
}
