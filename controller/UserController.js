const mongoose = require("mongoose");
const moment = require("moment");
const UserModel = require("../model/user.model.js");
const createToken = require("../token/token.js");

// 登录
const Login = async (ctx, next) => {
  let reqInfo = ctx.request.query;
  let doc = await findUsernameDB(reqInfo.username);
  if (!doc) {
    ctx.status = 200;
    ctx.body = {
      code: "0",
      msg: "检查到用户名不存在"
    };
  } else if (doc.password == reqInfo.password) {
    let token = createToken(reqInfo.username);
    doc.token = token;
    await new Promise((resolve, reject) => {
      doc.save(err => {
        if (err) return reject(err);
        resolve();
      });
    });
    // 密码通过的情况
    ctx.status = 200;
    ctx.body = {
      code: "1",
      msg: "登录成功",
      data: {
        token,
        username: reqInfo.username
      }
    };
  } else {
    ctx.status = 200;
    ctx.body = {
      code: "0",
      msg: "密码错误"
    };
  }
};

// 添加用户
const AddUser = async (ctx, next) => {
  let reqInfo = ctx.request.query;
  let doc = await findUsernameDB(reqInfo.username);
  if (doc) {
    ctx.status = 200;
    ctx.body = {
      code: "0",
      msg: "用户已存在"
    };
  } else {
    let user = new UserModel({
      username: reqInfo.username,
      password: reqInfo.password,
      token: createToken(reqInfo.username),
      createTime: new Date().getTime()
    });
    await new Promise((reslove, reject) => {
      user.save(err => {
        if (err) {
          reject(err);
        }
        reslove();
      });
    });
    ctx.body = {
      code: "1",
      msg: "添加用户成功"
    };
  }
};

// 删除用户
const DelUser = async (ctx, next) => {
  let reqInfo = ctx.request.query;
  let doc = await findUsernameDB(reqInfo.username);
  if (!doc) {
    ctx.status = 200;
    ctx.body = {
      code: "0",
      msg: "检查到用户名不存在"
    };
  } else {
    await deleteUserDB(reqInfo.username);
    ctx.status = 200;
    ctx.body = {
      code: "1",
      msg: "删除用户成功"
    };
  }
};

/**
 *  根据【用户名】查询用户是否存在
 */
const findUsernameDB = username => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ username: username }, (err, doc) => {
      if (err) reject(err);
      resolve(doc);
    });
  });
};

/**
 *  根据【token】查询用户是否存在
 */
const findTokenDB = data => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ token: data }, (err, doc) => {
      if (err) reject(err);
      resolve(doc);
    });
  });
};

/**
 * 删除用户
 */
const deleteUserDB = username => {
  return new Promise((reslove, reject) => {
    UserModel.findOneAndRemove(username, (err, doc) => {
      if (err) reject(err);
      reslove(doc);
    });
  });
};

module.exports = {
  Login,
  AddUser,
  DelUser,
  findUsernameDB,
  findTokenDB
};
