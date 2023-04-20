import { Configuration, OpenAIApi } from 'openai';
import * as vscode from 'vscode';

// Load environment variables
require('dotenv').config();

// Initialize OpenAI API
const configuration = new Configuration({
  organization: 'org-32gTiyL7rvG1bl5NIracwpJI',
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Define function to get GPT suggestions
export async function getGPTSuggestions(
  text: string,
  guideline: string
): Promise<string[]> {
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
      .filter((suggestion): suggestion is string => suggestion !== undefined);

    if (!suggestions || suggestions.length === 0) {
      throw new Error('No suggestions found!');
    }

    return suggestions;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Define function to generate HTML content for suggestion panel
export function generateSuggestionPanelContent(
  suggestions: string[],
  guideline: string
): string {
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
