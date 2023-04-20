"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSuggestionPanelContent = exports.getGPTSuggestions = void 0;
const openai_1 = require("openai");
// Load environment variables
require('dotenv').config();
// Initialize OpenAI API
const configuration = new openai_1.Configuration({
    organization: 'org-32gTiyL7rvG1bl5NIracwpJI',
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
// Define function to get GPT suggestions
async function getGPTSuggestions(text, guideline) {
    try {
        const prompt = `Please provide suggestions to improve the following code based on the guideline: ${guideline}\n\nCode:\n${text}\n\nSuggestions:`;
        const completions = await openai.createCompletion({
            model: 'text-davinci-002',
            prompt: prompt,
            max_tokens: 50,
            n: 1,
            stop: '\n',
        });
        const suggestions = completions.data.choices
            .map((c) => c.text?.trim())
            .filter((suggestion) => suggestion !== undefined);
        if (!suggestions || suggestions.length === 0) {
            throw new Error('No suggestions found!');
        }
        return suggestions;
    }
    catch (err) {
        console.error(err);
        return [];
    }
}
exports.getGPTSuggestions = getGPTSuggestions;
// Define function to generate HTML content for suggestion panel
function generateSuggestionPanelContent(suggestions, guideline) {
    // Generate list of suggestion items
    const suggestionList = suggestions
        .map((suggestion) => `<li>${suggestion}</li>`)
        .join('');
    // Generate HTML content for panel
    return `
    <h2>Code Optimo - ${guideline}</h2>
    <hr>
    <ul>${suggestionList}</ul>
  `;
}
exports.generateSuggestionPanelContent = generateSuggestionPanelContent;
//# sourceMappingURL=gptHelper.js.map