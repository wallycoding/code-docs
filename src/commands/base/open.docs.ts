import path from 'node:path';
import fs from 'node:fs';
import * as vscode from 'vscode';

import { FOLDER_DOCS } from '../../constants/paths';
import { EXTENSION_FILE } from '../../constants/ext';
import { mkdirExistsOrCreate } from '../../utils/fs';
import { TreeDocs } from '../../providers/TreeDataProvider/tree.docs';
import { BaseContext } from '..';

class OpenDocs {
  constructor(private baseContext: BaseContext) {}

  async run(item: vscode.TreeItem) {
    const itemURI = item.resourceUri!;
    const relativeFilename = TreeDocs.getWorkspaceRelativePath(itemURI.fsPath);
    const pathDoc = this.mountDocumentPath(relativeFilename);

    const hasExists = mkdirExistsOrCreate(pathDoc);
    if (!hasExists) {
      vscode.window.showInformationMessage('Auto documentation...');
      await this.autoDocumentation(item, pathDoc);
    }
    this.openDocument(pathDoc);
    this.baseContext.treeColor.updateFile(itemURI);
  }

  private mountDocumentPath(pathname: string) {
    return path.join(
      this.baseContext.context.extensionPath,
      FOLDER_DOCS,
      `${pathname}.${EXTENSION_FILE}`
    );
  }

  private async autoDocumentation(item: vscode.TreeItem, pathname: string) {
    return fs.writeFileSync(pathname, `# Docs \`${item.label}\``, {
      encoding: 'utf-8',
    });
  }

  private openDocument(pathname: string) {
    return vscode.window.showTextDocument(vscode.Uri.file(pathname), {
      preview: true,
    });
  }
}

export default OpenDocs;
