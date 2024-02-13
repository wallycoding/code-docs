import * as vscode from 'vscode';
import { TreeDocs } from '../providers/TreeDataProvider/tree.docs';
import { TreeColor } from '../providers/FileDecorationProvider/tree.color';
import OpenDocs from './base/open.docs';

export interface BaseContext {
  treeDocs: TreeDocs;
  treeColor: TreeColor;
  context: vscode.ExtensionContext;
}

const commands = ['openDocs'] as const;

class Commands {
  private openDocs: OpenDocs;
  constructor(baseContext: BaseContext) {
    this.openDocs = new OpenDocs(baseContext);
  }
  get = (name: (typeof commands)[number]) => {
    const command = this[name];
    return command.run.bind(command);
  };
}

export default Commands;
