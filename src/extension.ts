//'use strict';
import * as vscode from 'vscode';
import * as postCSS from 'postcss';
const postcssJS = require('postcss-js');
const normalizeWhitespace = require('postcss-normalize-whitespace');
const postcssPresetEnv = require('postcss-preset-env');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // This line of code will only be executed once when your extension is activated
  console.log('css-in-js-to-pcss" is now active');

  // The command has been defined in the package.json file
  vscode.commands.registerCommand('formatCSS', () => {
    // Chech that we have an editor
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      // No open text editor
      return;
    }

    // Get the selection
    const selection = editor.selection;
    let text = editor.document.getText(selection);

    // Check that we have a selection
    if (text.length === 0) {
      return vscode.window.showErrorMessage('No selection to format!');
    }

    text = text.replace(/Colors\.(.+),/g, '"$&",');
    text = text.replace(/Colors\./g, '$');
    text = text.replace(/,",/g, '",');
    text = text.replace(/;/g, '');

    let obj = '';
    try {
      eval(`obj = { '.__SCOPE': ${text} }`);
    } catch (error) {
      vscode.window.showErrorMessage(
        `Your object litteral is not properly formatted.`
      );
    }

    postCSS([
      normalizeWhitespace,
      postcssPresetEnv({
        stage: 4,
        features: ['css-nesting'],
        browsers: '> 50%'
      })
    ])
      .process(obj, {
        parser: postcssJS,
        from: undefined
      })
      .then(result => {
        vscode.window.showInformationMessage('Code is formated!');
        (editor as vscode.TextEditor).edit(editBuilder => {
          editBuilder.replace(selection, result.css);
        });
      })
      .catch(
        (error: {
          name: string;
          reason: string;
          line: string;
          column: string;
        }) => {
          console.error(error);
          // Format the error
          vscode.window.showErrorMessage(`Error when parsing your CSS:
Name: ${error.name}
Reason: ${error.reason}
Line: ${error.line}
Column: ${error.column}`);
        }
      );
  });
}

export function deactivate() {}
