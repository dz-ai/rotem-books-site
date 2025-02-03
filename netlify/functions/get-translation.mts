import {Handler, HandlerEvent} from "@netlify/functions";
import {generateResponse} from "../../netlify-functions-util/validateRequest.ts";
import OpenAI from "openai";
import dotenv from 'dotenv';
import {mongoClientPromise} from "../../netlify-functions-util/mongoDB-connection.ts";
import {Collection, Db, OptionalId, WithId} from "mongodb";
import {language} from "../../src/context/generalStateContext.tsx";

dotenv.config();

const translations: [string, string][] = [
    ['שמאי המילטון', 'Shamai Hamilton'],
    ['שלי יחומוביץ', 'Shelly Yachimovich'],
    ['מרים בת חלוף', 'Miriam Bat Khalof'],
    ['הזמנה לנסיון כריכה', 'Invitation for Binding Trial'],
    ['יעקוב בראבי', 'Yaakov Baravi'],
    ['חברון בן ברוך', 'Hevron Ben Baruch'],
    ['שלום רחמני', 'Shalom Rachmani'],
    ['אבי ששון בן משה', 'Avi Sasson Ben Moshe'],
    ['חאלד גולזאר', 'Khaled Golzar'],
    ['David Zim', 'David Zim'],
    ['דוד צים', 'David Tzim'],
    ['יונתן אורן', 'Yonatan Oren'],
    ['שמואל בן אבי', 'Shmuel Ben Avi'],
    ['יניב המגניב', 'Yaniv the Cool'],
    ['דוד שלמה צים', 'David Shlomo Tzim']
];


const translationsCashNames: Map<string, string> = new Map();
const translationsCashAddress: Map<string, string> = new Map();

type TranslationFor = 'names' | 'addresses';

interface TranslationRequest {
    translationRequest: string[];
    translationFor: TranslationFor;
    lang: language;
}

// Document to save on the Mongo DB.
interface TranslationDocument {
    he: string;
    en: string;
}

const translationObjects: TranslationDocument[] = translations.map(([he, en]) => ({he, en}));

// HANDLE THE DYNAMIC TRANSLATION OF NAMES LIST THAT IS NOT PREDICTABLE.
const handler: Handler = async (event: HandlerEvent) => {

    if (!event.body) return generateResponse(400, 'text or target language is missing');

    const {translationRequest, translationFor, lang}: TranslationRequest = JSON.parse(event.body);
    if (!translationRequest || !translationFor || !Array.isArray(translationRequest)) return generateResponse(400, 'Invalid JSON format')

    try {
        const database: Db = (await mongoClientPromise).db(process.env.MONGODB_DATABASE);
        const translationsStorageNames: Collection = database.collection(process.env.MONGODB_COLLECTION_TRANSLATIONS_NAMES as string);
        const translationsStorageAddresses: Collection = database.collection(process.env.MONGODB_COLLECTION_TRANSLATIONS_ADDRESSES as string);
        // await translationsStorageNames.insertMany(translationObjects);

        // first check if we have something on the cash
        if (translationFor === 'names' && translationsCashNames.size === 0) {
            getTranslationsFromDB(translationsStorageNames, translationFor);
        }

        if (translationFor === 'addresses' && translationsCashNames.size === 0) {
            getTranslationsFromDB(translationsStorageAddresses, translationFor);
        }


        let translationResults: string[] = [];
        let newWordsTranslation: string[] = [];

        const unKnownWordsIndex: number[] = [];
        const unKnownWords: string[] = [];

        // check each word to find if there is translation for it in the cash.
        translationRequest.forEach((word, index) => {

            const cashTranslation =
                translationFor === 'names' ?
                    translationsCashNames.get(word)
                    :
                    translationsCashAddress.get(word);

            if (cashTranslation && cashTranslation !== '' &&  /[א-ת]/.test(word)) {
                // translationResults.push(cashTranslation)
                translationRequest[index] = cashTranslation;
            } else {
                /[א-ת]/.test(word) &&
                unKnownWords.push(word);
                /[א-ת]/.test(word) &&
                unKnownWordsIndex.push(index);
            }
        }
    )
        console.log(unKnownWords);
        // get translation from openAI if the words are new
        if (unKnownWords.length > 0) {
            newWordsTranslation = await getTranslationsFromAI(unKnownWords);

            // if we got any translation, it will be updated in the cash and saved in the Database.
            if (newWordsTranslation.length > 0 && newWordsTranslation !== unKnownWords) {

                // set each word to the cash and convert prepare the words and there translation to an Object.
                const translationObjects: TranslationDocument[] = unKnownWords.map((word, index) => {

                    translationsCashNames.set(word, newWordsTranslation[index]);

                    return {
                        he: word,
                        en: newWordsTranslation[index]
                    }
                });

                // save the new translated words in the Database.
                translationFor === 'names' &&
                await translationsStorageNames.insertMany(translationObjects);

                translationFor === 'addresses' &&
                await translationsStorageAddresses.insertMany(translationObjects);
            }

            unKnownWordsIndex.forEach((translationRequestIndex: number, index: number) => translationRequest[index] = newWordsTranslation[index]);
        }

        // translationResults = [...translationResults, ...newWordsTranslation];

        if (lang === 'he') {
            // translationResults = Array.from(translationCash.keys());
        }

        return {
            statusCode: 200,
            body: JSON.stringify(translationRequest),
        };
    } catch (error) {
        return generateResponse(500, 'Something went wrong');
    }
}

export {handler};


async function getTranslationsFromAI(toTranslate: string[]): Promise<string[]> {

    const apiKey = process.env.OPEN_AI_APIKEY;
    if (!apiKey) {
        console.error('open ai api key is missing');
        return toTranslate;
    }

    const openai = new OpenAI({apiKey});

    try {

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {role: "system", content: "You are a helpful assistant."},
                {
                    role: "user",
                    content: `rewrite this array of words to english: ${toTranslate} don't translate it. give a rewrite english array only, as an output`,
                },
            ],
        });

        let translationResults: string[] = [];

        if (completion.choices[0].message.content) {
            translationResults = JSON.parse(completion.choices[0].message.content);
        }

        return translationResults.length > 0 ? translationResults : toTranslate;

    } catch (err) {
        console.error(err);
        return toTranslate;
    }
}

async function getTranslationsFromDB(translationsStorage: Collection, translationFor: TranslationFor): Promise<void> {

    const translationsFromDB = await translationsStorage.find({}).toArray();

    translationsFromDB.forEach((doc) => {

        if (doc.he && doc.en) {
            translationFor === 'names' ?
                translationsCashNames.set(doc.he, doc.en)
                :
                translationsCashAddress.set(doc.he, doc.en)
            ;
        }
    });
}
