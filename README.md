# Code Optimo

Code Optimo is a Visual Studio Code extension that leverages the power of AI to suggest improvements and optimizations to your code. It uses OpenAI's GPT model to generate suggestions based on your selected code block and the programming language you are working with.

## Features

- AI-powered code suggestions: Get relevant suggestions on how to improve your code based on the context and the programming language.
- Easy integration with Visual Studio Code: Right-click on the selected code block to get suggestions in a new webview panel.

![Code Optimo in action](./images/code-optimo.png)

## Requirements

Before using this extension, make sure you have the following:

- Visual Studio Code installed on your machine.
- An active internet connection, as the extension connects to OpenAI's GPT API for code suggestions.

## Setup
- `git clone` + set up OpenAI API key
- Run `npm install`
- Run `npm run build`
- Run `vsce package` (this will generate a .vsix file)
- Go to root directory in the editor file explorer view and right click on `.vsix` file
- Select `Install Extension VSIX`
- Go to `Run and Debug` and click the *green play icon* (this should open up another VSCode editor instance; you can choose a repo that you want to test this extension with)
- Go to a file and highlight a code block
- `cmd + shift + P` to open Command Palette
- Type and select`View: Show Code Improvements`
- Observe Code Optimo panel display on the right

## How to use
- Install/run Code Optimo extension locally
- Optional: add additional guidelines in guidelines.json
- Highlight a code block
- Use command palette to trigger “show code improvements”
- Observe panel appear on the right with the guideline it addresses along with the code improvement suggestions

## Extension Settings

There are no specific settings for this extension.

## Known Issues/Limitations

Currently, this extension can only read 1 guideline provided in `guidelines.json`. If you encounter any issues, please report them in the GitHub repository.

## Release Notes

### 1.0.0

Initial release of Code Optimo.

---

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
