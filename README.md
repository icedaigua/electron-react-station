react部分参考[Create React App](https://github.com/facebook/create-react-app).

# 1、步骤

## 1.1 安装react

安装create-react-app
    
    npm install --global create-react-app
创建react工程
    
    create-react-app prjname
进入prjname目录

    npm start
启动一个开发模式的服务器，同时也会让你的浏览器自动打开了一个网页，指向本机地址http://localhost:3000/

## 1.2 electron+react

### 1.2.1 安装electron
创建后，安装electron
    
    npm install electron --save-dev
安装过程中如果出错，可以清理缓存
    
    npm cache clean -f
安装完成后，在package.json中增加启动项
```json
  "scripts": {
    "electron-start": "electron ." 
  }
```

安装完成后，自己在React项目的根目录创建Electron的启动文件main.js和index.html两个文件。也可以直接从[模板工程](https://github.com/electron/electron-quick-start)下载

### 1.2.2 修改启动配置

在React项目中的package.json文件中增加main字段，值为"main.js"

```json
{
  "name": "electron-react-station",
  "version": "0.1.0",
  "private": true,
  "main":"main.js",
  "dependencies": {
```

修改main.js中的win.loadURL，改为
```js
mainWindow.loadURL(url.format({
pathname: path.join(__dirname, './build/index.html'), protocol: 'file:', slashes: true }))
```

    npm run build
    npm run electron-start
启动程序.

### 1.2.3 修改启动页面
上述启动后，是一个空页面，在文件package.json中添加字段 
```json
"homepage":"."
```

## 1.3 热调试

在main.js文件中将启动页修改为 http://localhost:3000/
```js
mainWindow.loadURL('http://localhost:3000/')
```
启动两个终端，一个终端启动
    
    npm start
另一个终端启动

    npm run electron-start
这样在electron中就可以热调试了。

在package.json中定义个DEV字段，设置为true/false，然后修改main.js
```js
const pkg = require('./package.json') // 引用package.json 
//判断是否是开发模式 
if(pkg.DEV) { 
  win.loadURL("http://localhost:3000/")
} else { 
  win.loadURL(url.format({
    pathname:path.join(__dirname, './build/index.html'), 
    protocol:'file:', 
    slashes:true 
  }))
}
```

## 1.4 建立python后台
### 1.4.1 安装zerorpc
    
    pip install zerorpc
或者
    
    conda install -c ampelproject zerorpc

创建py文件，内容如下
```python

import zerorpc
class HelloRPC(object):
    def hello(self, name):
        return "Hello, %s" % name

s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()
```
命令行里运行python api.py。另一个终端输入
    
    zerorpc tcp://localhost:4242 hello NXB,
如果得到Hello,NXB则没有问题

### 1.4.2 electron与python通信
在main.js中调用创建python进程
```js
let pyProc = null

const createPyProc = () => {
  let port = '4242'
  let script = path.join(__dirname, 'python', 'netrpc.py')
  pyProc = require('child_process').spawn('python', [script, port])
  if (pyProc != null) {
    console.log('python process success')
  }
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
  console.log('python process exit success')
}

app.on('will-quit', exitPyProc)
```

在ready任务中调用
```js
app.on('ready', function(){
  createWindow()
  createPyProc()
})
```
运行
     npm run electron-start
另一个终端输入
    
    zerorpc tcp://localhost:4242 hello NXB,
如果得到Hello,NXB则没有问题




# 2 单独安装electron

```json
在文件目录下，手动创建`package.json`
    
    {
        "name": "sample", 
        "version": "1.0.0", 
        "description": "", 
        "main": "main.js", 
        "scripts": {
            "start": "electron ."
        }, 
        "author": "", 
        "license": "UNLICENSED"
    }
```

创建后，安装electron
    
    npm install electron --save-dev

也可以直接从Github下载[模板工程](https://github.com/electron/electron-quick-start)
