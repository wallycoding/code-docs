import * as vscode from 'vscode';
import { TreeDocs } from './providers/TreeDataProvider/tree.docs';
import { TreeColor } from './providers/FileDecorationProvider/tree.color';
import Commands from './commands';

export function activate(context: vscode.ExtensionContext) {
  const subs = context.subscriptions;
  const treeDocs = new TreeDocs();
  const treeColor = new TreeColor(context);
  const commands = new Commands({ treeDocs, treeColor, context });

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
      commands.get('openDocs')
    )
  );
}

export function deactivate() {}
