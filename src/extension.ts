import * as vscode from 'vscode';
import * as path from 'path';
import guidelines from './guidelines.json';
import {
  getGPTSuggestions,
  generateSuggestionPanelContent,
  applySuggestion,
} from './gptHelper';

interface Guideline {
  tag: string;
  description: string;
}

type Guidelines = Guideline[];

export function activate(context: vscode.ExtensionContext) {
  // Register the right-click context menu command
  const disposable = vscode.commands.registerCommand(
    'code-optimo.showCodeOptimoPanel',
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage('No active editor found!');
        return;
      }

      // Get the currently selected code block
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      console.log('Code selected and extension activated!');

      // If there is no selection, display an error message
      if (text === '') {
        vscode.window.showErrorMessage('No code selected!');
        return;
      }

      // Get the guideline from guidelines.json that matches the currently active editor language
      const guidelineObject = guidelines.find(
        (g) => g.languageId === editor.document.languageId
      );

      if (!guidelineObject) {
        vscode.window.showErrorMessage(
          'No matching guideline found for the current language!'
        );
        return;
      }

      const guideline = guidelineObject.guideline;
      const guidelineTag = guidelineObject.tag;

      try {
        // Get the GPT suggestions for the selected code block
        const suggestions = await getGPTSuggestions(text, guideline);
        console.log(suggestions);
        // Create a new webview panel and set its content
        const panel = vscode.window.createWebviewPanel(
          'codeOptimoPanel',
          'Code Optimo',
          vscode.ViewColumn.Two,
          {
            enableScripts: true,
            localResourceRoots: [
              vscode.Uri.file(path.join(context.extensionPath, 'media')),
            ],
          }
        );
        panel.webview.html = generateSuggestionPanelContent(
          suggestions,
          guidelineTag
        );

        // Add a message listener for the WebView
        panel.webview.onDidReceiveMessage(
          (message) => handleMessage(message, panel, editor, selection),
          null,
          context.subscriptions
        );
      } catch (error) {
        vscode.window.showErrorMessage('Error getting GPT suggestions!');
        console.log(error);
      }
    }
  );

  // Register the command
  context.subscriptions.push(disposable);
}

async function handleMessage(
  message: any,
  panel: vscode.WebviewPanel,
  editor: vscode.TextEditor,
  selection: vscode.Selection
) {
  switch (message.command) {
    case 'applySuggestion':
      applySuggestion(message.suggestion, editor, selection);
      panel.dispose(); // Close the WebView panel after applying the suggestion
      break;
  }
}
