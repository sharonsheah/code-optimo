"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const guidelines_json_1 = __importDefault(require("./guidelines.json"));
const gptHelper_1 = require("./gptHelper");
function activate(context) {
    // Register the right-click context menu command
    const disposable = vscode.commands.registerCommand('code-optimo.showCodeOptimoPanel', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }
        // Get the currently selected code block
        const selection = editor.selection;
        const text = editor.document.getText(selection);
        // If there is no selection, display an error message
        if (text === '') {
            vscode.window.showErrorMessage('No code selected!');
            return;
        }
        // Get the guideline from guidelines.json that matches the currently active editor language
        const guidelineObject = guidelines_json_1.default.find((g) => g.tag === editor.document.languageId);
        if (!guidelineObject) {
            vscode.window.showErrorMessage('No matching guideline found for the current language!');
            return;
        }
        const guideline = guidelineObject.description;
        try {
            // Get the GPT suggestions for the selected code block
            const suggestions = await (0, gptHelper_1.getGPTSuggestions)(text, guideline);
            // Create a new webview panel and set its content
            const panel = vscode.window.createWebviewPanel('codeOptimoPanel', 'Code Optimo', vscode.ViewColumn.Two, {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, 'media')),
                ],
            });
            panel.webview.html = (0, gptHelper_1.generateSuggestionPanelContent)(suggestions, guideline);
        }
        catch (error) {
            vscode.window.showErrorMessage('Error getting GPT suggestions!');
            console.log(error);
        }
    });
    // Register the command
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map