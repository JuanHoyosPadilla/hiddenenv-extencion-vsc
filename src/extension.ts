import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "hiddenenv" is now active!');

    let disposable = vscode.commands.registerCommand('extension.hiddenenv', () => {
        try {
            // Obtén la primera carpeta de trabajo si existe
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

            if (workspaceFolder) {
                // Ruta al archivo .env
                const envFilePath = vscode.Uri.joinPath(workspaceFolder.uri, '.env').fsPath;

                if (fs.existsSync(envFilePath)) {
                    // Lee el contenido del archivo .env
                    const envFileContent = fs.readFileSync(envFilePath, 'utf-8');

                    // Oculta las variables de entorno y sobrescribe el archivo
                    const hiddenEnvContent = hideEnvVariables(envFileContent);
                    fs.writeFileSync(envFilePath, hiddenEnvContent);

                    vscode.window.showInformationMessage('Variables de entorno ocultas en el archivo .env.');
                } else {
                    vscode.window.showInformationMessage('El archivo .env no se encuentra en el directorio del proyecto.');
                }
            } else {
                vscode.window.showInformationMessage('No se encontraron carpetas de trabajo.');
            }
        } catch (error) {
            
            vscode.window.showErrorMessage('Se produjo un error al ocultar las variables de entorno.');
        }
    });

    context.subscriptions.push(disposable);
}

function hideEnvVariables(content: string): string {
    // Divide el contenido en líneas
    const lines = content.split('\n');

    // Oculta los valores de las variables de entorno en cada línea 
    const hiddenLines = lines.map(line => {
        const equalsIndex = line.indexOf('=');
        if (equalsIndex !== -1) {
            const variableName = line.substring(0, equalsIndex + 1);
            const hiddenValue = '*'.repeat(line.length - equalsIndex - 1);
            return variableName + hiddenValue;
        }
        return line;
    });

    return hiddenLines.join('\n');
}

// This method is called when your extension is deactivated
export function deactivate() {}
