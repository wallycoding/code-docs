import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { TreeDocs } from './providers/TreeDataProvider/tree.docs';
import { TreeColor } from './providers/FileDecorationProvider/tree.color';
import { mkdirExistsOrCreate } from './utils/fs';
import { FOLDER_DOCS } from './constants/paths';
import { EXTENSION_FILE } from './constants/ext';

export function activate(context: vscode.ExtensionContext) {
  const subs = context.subscriptions;
  const treeDocs = new TreeDocs();
  const treeColor = new TreeColor(context);

  subs.push(vscode.window.registerTreeDataProvider('all-docs-id', treeDocs));

  const refreshTreeFiles = treeDocs.refresh.bind(treeDocs);
  subs.push(vscode.workspace.onDidCreateFiles(refreshTreeFiles));
  subs.push(vscode.workspace.onDidDeleteFiles(refreshTreeFiles));
  subs.push(vscode.workspace.onDidRenameFiles(refreshTreeFiles));

  subs.push(vscode.window.registerFileDecorationProvider(treeColor));

  subs.push(
    vscode.commands.registerCommand('code-docs.fromCurrentFile', () => {
      if (!vscode.window.activeTextEditor)
        return vscode.window.showInformationMessage(
          'You do not have a file open'
        );
      // TODO navigate to README file.
    })
  );

  subs.push(
    vscode.commands.registerCommand(
      'code-docs.openDocs',
      async (item: vscode.TreeItem) => {
        const itemURI = item.resourceUri!;
        const pathFile = TreeDocs.getRelativePath(itemURI.fsPath);
        const pathDoc = path.join(
          context.extensionPath,
          FOLDER_DOCS,
          `${pathFile}.${EXTENSION_FILE}`
        );

        const hasExists = mkdirExistsOrCreate(pathDoc);

        if (!hasExists)
          fs.writeFileSync(pathDoc, `# Docs \`${item.label}\``, {
            encoding: 'utf-8',
          });

        vscode.window.showTextDocument(vscode.Uri.file(pathDoc), {
          preview: true,
        });
        treeColor.updateFile(itemURI);
      }
    )
  );
}

export function deactivate() {}
