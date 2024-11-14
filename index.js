import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory
} from "@google/generative-ai"; // Certifique-se de que o pacote está correto
 
import chalk from 'chalk';
import ora from 'ora';
import prompt from 'prompt-sync';
 
const promptSync = prompt();
 
const MODEL_NAME = "gemini-1.0-pro";
 
const API_KEY = "AIzaSyCdUao1tfMxvhoN10g-JWnAo6haxVUkg8s"; // <--- Chave de API direta
 
const GENERATION_CONFIG = {
    temperature: 0.9,
    maxOutputTokens: 2048
};
 
const SAFETY_SETTINGS = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    }
];
 
async function runChat() {
    const spinner = ora('Inicializando chat...').start();
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
 
        const model = await genAI.getGenerativeModel({
            model: MODEL_NAME,
        });
 
        // Inicia o chat
        const chat = await model.startChat({
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTINGS,
            history: [],
        });
 
        spinner.stop();
 
        while (true) {
            const userInput = promptSync(chalk.green("Você: "));
 
            if (userInput.toLowerCase() === 'exit') {
                console.log(chalk.yellow('Até breve!'));
                process.exit(0);
            }
 
            // Envia a mensagem ao modelo e aguarda a resposta
            const result = await chat.sendMessage(userInput);
 
            // Acessa o texto diretamente da estrutura correta
            if (result && result.response && result.response.candidates && result.response.candidates[0]) {
                const candidate = result.response.candidates[0];
 
                // Acessando a estrutura correta: candidates[0].content.parts[0].text
                if (candidate.content && candidate.content.parts && candidate.content.parts[0].text) {
                    const response = candidate.content.parts[0].text;
                    console.log(chalk.blue("AI:"), response); // Exibe apenas o texto da resposta
                } else {
                    console.error(chalk.red('Texto não encontrado na estrutura correta.'));
                }
            } else if (result && result.error) {
                console.error(chalk.red('Erro da AI:'), result.error.message);
            } else {
                console.error(chalk.red('Erro inesperado na resposta.'));
            }
        }
    } catch (error) {
        spinner.stop();
        console.error(chalk.red('Erro encontrado:'), error.message);
        process.exit(1);
    }
}
 
runChat();