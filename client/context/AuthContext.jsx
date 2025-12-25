import { Children, createContext } from "react";



export const AuthContext = createContext();

export const AuthProvider = ({Children})={
    const value = {

    }
    return (
        <AuthContext.Provider>
        </AuthContext.Provider>
    )
}