import * as vscode from 'vscode';

export const decoration = {
  documented: {
    badge: 'D',
    color: new vscode.ThemeColor('codeDocsDocumentedFile'),
    tooltip: 'Documented',
  },
  undocumented: {
    badge: 'U',
    color: new vscode.ThemeColor('codeDocsUndocumentedFile'),
    tooltip: 'Undocumented',
  },
};
