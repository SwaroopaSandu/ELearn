import { useEffect,useState } from "react";
import Login from "./login";
import Dashboard from "./Dashboard"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase'



export default function Home() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <h1>Loading.......</h1>;
  if (!user) return <Login />;

  return <Dashboard />;
}
