// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const pkg = require('./package.json') // 引用package.json 

const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })

  //判断是否是开发模式 
  // and load the index.html of the app.
  if(pkg.devOpt) { 
    mainWindow.loadURL("http://localhost:3000/")
  } else { 
    mainWindow.loadURL(url.format({
      pathname:path.join(__dirname, './public/index.html'), 
      protocol:'file:', 
      slashes:true 
    }))
  }
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
  createWindow()
  createPyProc()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})



let pyProc = null

const createPyProc = () => {
  let port = '4242'
  let script = path.join(__dirname, 'python', 'netrpc.py')
  pyProc = require('child_process').spawn('python', [script, port])
  if (pyProc != null) {
    console.log('python process success')
  } else{  
      dialog.showErrorBox('python进程启动错误', '错误')
  }
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
  console.log('python process exit success')
}

// app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)
