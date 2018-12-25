const Koa = require("koa");
const json = require("koa-json");
const KoaRouter = require("koa-router");
const mongoose = require("mongoose");
const http = require("http");
const https = require("https");
const fs = require("fs");

const app = new Koa();
const router = KoaRouter();

const Config = require("./config");

// connect mongoDB
mongoose.connect(Config.mongoDbUrl).then(
  () => {},
  err => {
    console.log("连接mongodb失败");
  }
);

// json pertty
app.use(json());

// router配置
app.use(require("./router/index.js").routes()).use(router.allowedMethods());

// SSL options
// const options = {
//   key: fs.readFileSync("/cert/1540481862542.key"),
//   cert: fs.readFileSync("/cert/1540481862542.crt")
// };

// https 服务器启动
// https.createServer(options, app.callback()).listen(443);
http.createServer(app.callback()).listen(3000);