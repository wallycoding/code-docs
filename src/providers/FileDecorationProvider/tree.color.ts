import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { decoration } from '../../constants/decoration';
import { TreeDocs } from '../TreeDataProvider/tree.docs';
import { FOLDER_DOCS } from '../../constants/paths';
import { EXTENSION_FILE } from '../../constants/ext';

class BaseEventEmitter {
  private _onDidChangeFileDecorations = new vscode.EventEmitter<vscode.Uri>();
  public onDidChangeFileDecorations = this._onDidChangeFileDecorations.event;

  updateFile(uri: vscode.Uri) {
    this._onDidChangeFileDecorations.fire(uri);
  }
}

export class TreeColor
  extends BaseEventEmitter
  implements vscode.FileDecorationProvider
{
  constructor(private context: vscode.ExtensionContext) {
    super();
  }

  provideFileDecoration(
    uri: vscode.Uri,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.FileDecoration> {
    if (!uri.fsPath) return;
    const pathFile = TreeDocs.getRelativePath(uri.fsPath);
    const pathDoc = path.join(
      this.context.extensionPath,
      FOLDER_DOCS,
      `${pathFile}.${EXTENSION_FILE}`
    );

    const hasDocumented = fs.existsSync(pathDoc);
    return decoration[hasDocumented ? 'documented' : 'undocumented'];
  }
}
