import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { isDirectory } from '../../utils/fs';

type TreeDataProvider = vscode.TreeDataProvider<vscode.TreeItem>;

class TreeDocsEmitter {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    vscode.TreeItem | undefined
  >();
  public onDidChangeTreeData = this._onDidChangeTreeData.event;
}

export class TreeDocs extends TreeDocsEmitter implements TreeDataProvider {
  static firstWorkspace() {
    return vscode.workspace.workspaceFolders?.at(0)?.uri.fsPath;
  }

  static getRelativePath(pathname: string) {
    const first = this.firstWorkspace();
    if (!first) return pathname;
    return path.relative(path.dirname(first), pathname);
  }

  static async setCollapsibleState(isDir: boolean, item: vscode.TreeItem) {
    if (!isDir) return;
    item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
  }

  static async fromDirectory(rootDir: string) {
    const currentDir = fs.readdirSync(rootDir);
    const folders: vscode.TreeItem[] = [];
    const filenames: vscode.TreeItem[] = [];

    for (const filename of currentDir) {
      const currentPath = path.join(rootDir, filename);
      const isDir = isDirectory(currentPath);
      const item = new vscode.TreeItem(filename);
      TreeDocs.setCollapsibleState(isDir, item);
      item.resourceUri = vscode.Uri.file(currentPath);
      item.iconPath = new vscode.ThemeIcon(isDir ? 'folder' : 'file');

      item.command = {
        title: 'Open File',
        command: 'code-docs.openDocs',
        arguments: [item],
        tooltip: 'File',
      };

      (isDir ? folders : filenames).push(item);
    }

    return [...folders, ...filenames];
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    const directory = TreeDocs.firstWorkspace();
    if (element?.collapsibleState !== 1 && directory) {
      return TreeDocs.fromDirectory(directory);
    }

    if (directory && element && element.resourceUri?.fsPath) {
      return TreeDocs.fromDirectory(element.resourceUri.fsPath);
    }

    return Promise.resolve([]);
  }
}
