import { createContext, useContext, useEffect, useState } from "react";
import { db } from '../supabase';
const AuthContext = createContext();

export function AuthProvider({ children}) {
    const [currentUser, setCurrentUser] = useState(null);
    const signIn = async (email, password) => {
        const { error } = await db.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };
    const signUp = async (email, password) => {
        const { error } = await db.auth.signUp({ email, password });
        if (error) throw error;
    };
    const signOut = async () => {
            await db.auth.signOut();
            setCurrentUser(null);
    };
    useEffect(() => {
        const fetchUser = async() => {
            const {data} = await db.auth.getUser();
            setCurrentUser(data.user);
        }
        fetchUser();
        const {data: {subscription}} = db.auth.onAuthStateChange((event, session) => {
            setCurrentUser(session?.user || null);
        });
        return () => subscription.unsubscribe();
    },[]);
    
    return(
        <AuthContext.Provider value={{currentUser, signIn, signUp, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
  return useContext(AuthContext);
}
