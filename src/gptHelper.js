"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSuggestionPanelContent = exports.getGPTSuggestions = void 0;
const openai_1 = require("openai");
// Load environment variables
require('dotenv').config();
// Initialize OpenAI API
const configuration = new openai_1.Configuration({
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: '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',
});
const openai = new openai_1.OpenAIApi(configuration);
// Define function to get GPT suggestions
async function getGPTSuggestions(text, guideline) {
    try {
        const prompt = `Please provide suggestions to improve the following code based on the guideline: ${guideline}\n\nCode:\n${text}\n\nSuggestions:`;
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        });
        if (!completion.data.choices || completion.data.choices.length === 0) {
            throw new Error('No completions found!');
        }
        const suggestions = completion.data.choices.map((choice) => {
            if (!choice['message']) {
                throw new Error('No message found!');
            }
            else {
                return choice['message'].content.trim();
            }
        });
        if (!suggestions) {
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
function generateSuggestionPanelContent(suggestions, guidelineTag) {
    // Generate list of suggestion items
    const suggestionList = suggestions
        .map((suggestion) => `<li>${suggestion}</li>`)
        .join('');
    // Generate HTML content for panel
    return `
    <h2>Code Optimo - ${guidelineTag}</h2>
    <hr>
    <ul>${suggestionList}</ul>
  `;
}
exports.generateSuggestionPanelContent = generateSuggestionPanelContent;
//# sourceMappingURL=gptHelper.js.map