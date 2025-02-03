import he from "./hebrew/hebrew.json";
import heBooks from "./hebrew/heBooks.json"
import en from "./english/english.json";
import enBooks from "./english/enBooks.json"
import de from "./deutsch/deutsch.json";
import deBooks from "./deutsch/deBooks.json"

export interface ITranslations {
    [key: string]: string | ITranslations;
}

type IBooksJson = {
    books:
        {
            id: string
            title: string
            price: string
            coverImage: string
            coverType: string[]
            illustratorName: string
            description: string
        }[]
};

export type TTranslate = {
    [key: string]: {
        translate: ITranslations;
        books: IBooksJson;
    }
}

export default {
    he: {translate: he, books: heBooks},
    en: {translate: en, books: enBooks},
    de: {translate: de, books: deBooks},
} as TTranslate;
