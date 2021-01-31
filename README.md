## 基于node的一个blog论坛项目

  #### 依赖项（插件）：    
          "art-template": "^4.13.2",
          "blueimp-md5": "^2.18.0",
          "body-parser": "^1.19.0",
          "bootstrap": "^3.3.7",
          "bootstrapvalidator": "^0.5.4",
          "compression": "^1.7.4",
          "express": "^4.17.1",
          "express-art-template": "^1.0.1",
          "express-session": "^1.17.1",
          "highlight.js": "^10.5.0",
          "jquery": "^3.5.1",
          "jquery-base64": "^1.0.0",
          "jquery.cookie": "^1.4.1",
          "marked": "^1.2.7",
          "moment": "^2.29.1",
          "mongoose": "^5.11.12",
          "titatoggle": "^2.1.2"  
  #### 启动项  
  ~~~
        node app.js 
  ~~~
  #### 启动前请安装依赖包  
  ~~~
        node intall
  ~~~
   #### 路由设计

| 路径      | 方法 | get参数 | post参数                  | 是否需要登录 | 备注         |
| :-------- | :--- | ------- | ------------------------- | ------------ | ------------ |
| /         | GET  |         |                           |              | 渲染首页     |
| /register | GET  |         |                           |              | 渲染注册页面 |
| /register | POST |         | email、nickname、password |              | 处理注册请求 |
| /login    | GET  |         |                           |              | 渲染登录页面 |
| /login    | POST |         | email 、password          |              | 渲染登录请求 |
| /logout   | GET  |         |                           |              | 处理退出请求 |
|           |      |         |                           |              |              |



