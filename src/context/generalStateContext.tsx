import React, {createContext, useContext, useState, ReactNode} from 'react';

type language = 'he' | 'en';
type theme = 'light' | 'dark';

interface GeneralStateContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    checkAuthentication: () => Promise<void>;
    logout: () => Promise<void>;
    language: language;
    setLanguage: (language: language) => void;
    theme: theme;
    setTheme: (theme: theme) => void;
}

const GeneralStateContext = createContext<GeneralStateContextType | undefined>(undefined);

export const GeneralStateProvider: React.FC<{ children: ReactNode }> = ({children}) => {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [language, setLanguage] = useState<language>('en');
    const [theme, setTheme] = useState<theme>('light');

    const checkAuthentication = async (): Promise<void> => {
        try {
            const response = await fetch('/.netlify/functions/protected', {
                method: 'get',
                credentials: 'same-origin',
            });

            if (response.ok) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (err) {
            console.error(err);
            setIsLoggedIn(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            const response = await fetch('/.netlify/functions/logout', {
                method: 'get',
                credentials: 'same-origin',
            });

            if (response.ok) {
                setIsLoggedIn(false);
            } else {
                console.error(response);
                setIsLoggedIn(false);
            }
        } catch (err) {
            console.error(err);
            setIsLoggedIn(false);
        }
    };

    return (
        <GeneralStateContext.Provider
            value={{isLoggedIn, setIsLoggedIn, checkAuthentication, logout, language, setLanguage, theme, setTheme}}>
            {children}
        </GeneralStateContext.Provider>
    );
};

export const useGeneralStateContext = () => {
    const context = useContext(GeneralStateContext);
    if (context === undefined) {
        throw new Error('useGeneralStateContext must be used within an AppProvider');
    }
    return context;
};
