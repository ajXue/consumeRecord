const jwt = require("jsonwebtoken");

module.exports = checkToken = async(ctx, next) => {
    const authorization = ctx.get('Authorization');
    if(!authorization){
        ctx.throw(401, "not token");
    }
    const token =authorization.split(' ')[1]; 
    try{
        await jwt.verify(token, 'xue')
    } catch(err) {
        ctx.throw(401, "not token");
    }
    await next();
}