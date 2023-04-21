import { Configuration, OpenAIApi } from 'openai';
import * as vscode from 'vscode';

// Load environment variables
require('dotenv').config();

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Define function to get GPT suggestions
export async function getGPTSuggestions(
  text: string,
  guideline: string
): Promise<{ suggestion: string; improvedCodeSnippet: string }[]> {
  try {
    const prompt = `
    Please provide suggestions to improve the following code based on the provided guideline or any potential errors, as well as adhering to Clean Code principles. Present your suggestions in an HTML-formatted list. Rewrite the code and wrap it within a <code> HTML tag, but right before that include a unique identifier '[[IMPROVED_CODE_SNIPPET]]'. Additionally, suggest any possible edge cases and include test cases with sample test code, also wrapped in <code> tags. Format the <code> contents to make it more readable (e.g. use line breaks, indentation, etc.).\n\n
    Guideline: ${guideline}\n\n
    Code:\n${text}\n\n`;
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
      } else {
        const suggestion = choice['message'].content.trim();
        const codeSnippetIdentifier = '[[IMPROVED_CODE_SNIPPET]]';
        const codeSnippetStart = suggestion.indexOf(codeSnippetIdentifier);
        const codeSnippetEnd = suggestion.indexOf('</code>');

        if (codeSnippetStart === -1 || codeSnippetEnd === -1) {
          throw new Error('Code snippet not found!');
        }

        const improvedCodeSnippet = suggestion
          .slice(
            codeSnippetStart + codeSnippetIdentifier.length,
            codeSnippetEnd
          )
          .trim();
        return { suggestion, improvedCodeSnippet };
      }
    });

    if (!suggestions) {
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
  suggestions: { suggestion: string; improvedCodeSnippet: string }[],
  guidelineTag: string
): string {
  const improvedCodeSnippet = suggestions
    .map((s) => s.improvedCodeSnippet)
    .join('\n');

  // Generate HTML content for panel, the rest of the code remains unchanged
  return `
    <h2>Code Optimo - ${guidelineTag}</h2>
    <hr>
    <pre>${suggestions[0].suggestion}</pre>
    <button id="applySuggestionBtn">Apply Suggestion</button>
    <script>
        document.getElementById('applySuggestionBtn').addEventListener('click', () => {
            console.log('Apply Suggestion Button Clicked');
            const vscode = acquireVsCodeApi();
            vscode.postMessage({ command: 'applySuggestion', suggestion: \`${improvedCodeSnippet}\` });
        });
    </script>
  `;
}

// Write a function to apply the suggestion
export function applySuggestion(
  suggestion: string,
  editor: vscode.TextEditor,
  selection: vscode.Selection
): void {
  // Replace the selected code block with the suggestion
  editor.edit((editBuilder) => {
    editBuilder.replace(selection, suggestion);
  });
}
