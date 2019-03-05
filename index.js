const electron = require('electron');

console.log(process.platform);

const isMac = () => process.platform === "darwin";

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
    if(addWindow !== null && addWindow !== undefined) { return; }
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Todo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todo:add', (e, todo) => {
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
});

const menuTemplate = [
    {
        label: "File",
        submenu: [
            { label: 'New Todo', click() { createAddWindow() } },
            {
                label: 'Clear Todos',
                click() {
                    mainWindow.webContents.send('todo:clear', true);
                }
            },
            {
                accelerator: (isMac() ? "Command+Q" : "Ctrl+Q"),
                label: 'Quit',
                click() {app.quit();}
            }
        ]
    }
];

if(process.platform === 'darwin') {
    menuTemplate.unshift({label: ""});
}

if(process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Developer',
        submenu: [
            { role: 'reload' },
            {
                label: "Toggle DevTools",
                accelerator: (isMac() ? "Command+Alt+I" : "Control+Shift:J"),
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}