const mongoose = require("mongoose");
const moment = require("moment");

const consumeModel = require("../model/consume.model");
const { findTokenDB } = require("./UserController.js");

// 新增记录
const AddConsume = async (ctx, next) => {
  let token = ctx.get("Authorization").split(" ")[1];
  let reqInfo = ctx.request.query;
  let { textName, type, price, desc, createTime } = reqInfo;
  let consume = new consumeModel({
    textName,
    type,
    price,
    createTime,
    desc
  });
  let saveData = await new Promise((resolve, reject) => {
    consume.save((err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
  let doc = await findTokenDB(token);
  console.log("doc", doc);
  doc.consumeInfo.push(saveData["_id"]);

  await new Promise((resolve, reject) => {
    doc.save(err => {
      if (err) reject(err);
      resolve();
    });
  });

  ctx.status = 200;
  ctx.body = {
    code: "1",
    msg: "新增成功"
  };
};

// 修改记录
const EditConsume = async(ctx, next) => {
  let token = ctx.get("Authorization").split(" ")[1];
  let reqInfo = ctx.request.query;
  let { textName, type, price, desc, id} = reqInfo;
  let doc = await findTokenDB(token);
  if(!doc) {
    ctx.status = 401;
    ctx.body = {
      code: '0',
      msg: "no token"
    }
  }
  let consumeDoc = await findOneConsume(id);
  if(!consumeDoc) {
    ctx.body = {
      code: '0',
      msg: "未查询到数据"
    }
  }
  consumeDoc.textName = textName;
  consumeDoc.type = type;
  consumeDoc.price = price;
  consumeDoc.desc = desc;
  await new Promise((resolve, reject) => {
    consumeDoc.save(err=> {
      if(err) reject(err);
      resolve()
    })
  })
  ctx.status = 200;
  ctx.body = {
    code: "1",
    
  }
}

// 删除记录
const DeleteConsume = async(ctx, next) => {
  let token = ctx.get("Authorization").split(" ")[1];
  let reqInfo = ctx.request.query;
  let { id } = reqInfo;
  let doc = await findTokenDB(token);
  
  if(doc.consumeInfo && doc.consumeInfo.length) {
    if(doc.consumeInfo.includes('id')) {
      let idIndex = doc.consumeInfo.findIndex((value) => {
        return value == id
      });
      doc.consumeInfo.splice(idIndex, 1);
      await new Promise((resolve, reject) => {
        doc.save(err => {
          if(err) {
            reject(err)
          }
          resolve();
        })
      })

      await deleteConsume("_id", id);
      ctx.body = {
        code: "1",
        msg: "删除成功"
      }
    } else {
      ctx.body = {
        code: '0',
        msg: '当前记录不存在'
      }
    }
  } else {
    ctx.body = {
      code: '0',
      msg: '暂无记录'
    }
  }
}

// 查看某月记录
const GetMonData = async (ctx, next) => {
  let resData = {};
  // 如果token有效查看当前用户添加商品的id
  let token = ctx.get("Authorization").split(" ")[1];
  let { startTime, endTime } = ctx.request.query;

  let doc = await findTokenDB(token);
  let findMonDoc = await findMonData(doc.consumeInfo, startTime, endTime);
  if (findMonDoc) {
    for (let dayItem of findMonDoc) {
      let pertyTime = moment(dayItem.createTime).format("YYYY-MM-DD");
      if (!resData.hasOwnProperty(pertyTime)) {
        resData[pertyTime] = [];
      }
      resData[pertyTime].push(dayItem);
    }
    ctx.body = {
      code: "1",
      msg: "查询成功",
      data: {
        resData
      }
    };
  } else {
    ctx.body = {
      code: "0",
      msg: "查询错误"
    };
  }
};

// 操作数据库
// 查询当前用户每月数据
/**
 *  当前用户的范围消费记录
 *  @param consumeInfo 当前用户所创建的消息记录的 _id
 *  @param startTime  开始时间  格式如：YYYY-MM-DD HH:mm:ss
 *  @param endTime  开始时间  格式如：YYYY-MM-DD HH:mm:ss
 */
const findMonData = (consumeInfo, startTime, endTime) => {
  return new Promise((resolve, reject) => {
    consumeModel
      .find({
        createTime: {
          $gte: moment(startTime),
          $lte: moment(endTime)
        },
        _id: { $in: consumeInfo }
      })
      .exec((err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
  });
};

/**
 * 根据信息删除消费记录
 * @param key   删除条件的key值
 * @param value 删除条件的value值 
 */
const deleteConsume = (k,v) => {
  return new Promise((resolve, reject) => {
    consumeModel.remove({k: v}, (err, doc) => {
      if(err) reject(err);
      resolve(doc);
    })
  })
}

/**
 * 根据id查询 
 */
const findOneConsume = (id) => {
  return new Promise((resolve, reject) => {
    consumeModel.findOne({_id, id}, (err, doc)=> {
      if (err) reject(err);
      resolve(doc);
    })
  })
}

module.exports = {
  AddConsume,
  GetMonData,
  DeleteConsume
};
