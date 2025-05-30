import React, {createContext, useContext, useState, ReactNode} from 'react';
import translations, {ITranslations} from "../translations/index.ts";
import {coverType, IBook} from "../components/book/book.tsx";

export type language = 'he' | 'en' | 'de';
export type theme = 'light' | 'dark';

export interface GeneralStateContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    checkAuthentication: () => Promise<void>;
    logout: () => Promise<void>;
    language: language;
    setLanguage: (language: language) => void;
    t: (key: string) => string;
    books: IBook[];
    theme: theme;
    setTheme: (theme: theme) => void;
}

const GeneralStateContext = createContext<GeneralStateContextType | undefined>(undefined);

export const GeneralStateProvider: React.FC<{ children: ReactNode }> = ({children}) => {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [language, setLanguage] = useState<language>('he');
    const [theme, setTheme] = useState<theme>('light');

    const t = (key: string): string => {
        const keys: string[] = key.split('.');
        let translation: ITranslations | string = translations[language].translate;

        keys.forEach(key => {
            if (!translation || typeof translation === 'string') {
                return key;
            }
            translation = translation[key];
        });

        return typeof translation === 'string' ? translation : key;
    }

    // -- transform the JSON to "Ibook" Type -- //
    // Function to transform a string to the coverType type
    function toCoverType(value: string): coverType {
        if (value === 'soft-cover' || value === 'hard-cover') {
            return value;
        }
        throw new Error(`Invalid cover type: ${value}`);
    }

    // Function to transform the JSON data to IBook type
    function transformBookData(jsonData: any): IBook[] {
        return jsonData.map((data: IBook) => {
            return {
                id: data.id,
                title: data.title,
                price: data.price,
                coverImage: data.coverImage,
                description: data.description,
                illustratorName: data.illustratorName,
                coverType: data.coverType.map(toCoverType),
            };
        });
    }

    const books: IBook[] = transformBookData(translations[language].books.books);
    // -----

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
    }

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
            value={{
                isLoggedIn,
                setIsLoggedIn,
                checkAuthentication,
                logout,
                language,
                setLanguage,
                t,
                books,
                theme,
                setTheme
            }}>
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
