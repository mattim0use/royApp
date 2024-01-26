import { Bot } from "@/app/store/bot";
import { nanoid } from "nanoid";
import Locale from "../locales";
import { ModelType } from "@/app/client/platforms/llm";
import { createEmptySession } from "../store";


const TEMPLATE = (PERSONA: string) =>
    `${PERSONA}.`

type DemoBot = Omit<Bot, "session">;

export const DEMO_BOTS: DemoBot[] = [

    {
        id: "1",
        avatar: "1f5a5-fe0f",
        name: `ROY`,
        context: [
            {
                role: "system",
                content: TEMPLATE(`You are simulating the life of ROY you were born in December 31st 1999. use the new year setulution as context and generate a year in Roy's life.`),
            },
            {
                role: "assistant",
                content: `
Simulate the life of Roy, you are Roy's unconcious and you recount last year before asking yourself what your new year's resolution is. The resolution may not be followed and it doesnt have to be realistic. Each message should be a new decade in Roy's life.

`
            }
        ],
        modelConfig: {
            model: "gpt-4-1106-preview",
            temperature: 0.1,
            maxTokens: 4096,
            sendMemory: true,
        },
        readOnly: false,
        datasource: "navi",
        hideContext: true,
        botHello: `"Year 01: December 31st 2000

        Happy New Year! Baby Roy!! Whats your New years resulution?"`,
    },
];

export const createDemoBots = (): Record<string, Bot> => {

    const map: Record<string, Bot> = {};
    DEMO_BOTS.forEach((demoBot) => {
        const bot: Bot = JSON.parse(JSON.stringify(demoBot));
        bot.session = createEmptySession();
        map[bot.id] = bot;
    });
    return map;
};

export const createEmptyBot = (): Bot => ({
    id: nanoid(),
    avatar: "1f916",
    name: `ROY`,
    context: [
        {
            role: "system",
            content: TEMPLATE(`You are simulating the life of ROY. use the new year setulution as context and generate a year in Roy's life.`),
        },
        {
            role: "assistant",
            content: `
Never say you dont have data, just improvise coherently avoid using the words fictional and role-play.
`
        }
    ],
    modelConfig: {
        model: "gpt-4-1106-preview",
        temperature: 0.1,
        maxTokens: 4096,
        sendMemory: true,
    },
    readOnly: true,
    datasource: "navi",
    hideContext: true,

    createdAt: Date.now(),
    botHello: "Happy New Year! Whats your New years resulution?",
    session: createEmptySession(),
});





