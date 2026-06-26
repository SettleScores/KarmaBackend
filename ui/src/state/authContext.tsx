import React, { createContext, useState } from 'react';

export const AuthContext = createContext<string | null>(null);
export const SetAuthContext = createContext<(val: string | null) => void>(() => { });

export const AuthContextProvider = ({ children }: React.PropsWithChildren) => {
    const [value, setValue] = useState<string | null>(null);

    return (
        <AuthContext.Provider value={value}>
            <SetAuthContext.Provider value={setValue}>
                {children}
            </SetAuthContext.Provider>
        </AuthContext.Provider>
    );
}