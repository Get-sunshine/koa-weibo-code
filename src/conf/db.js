/**
 * @description 存储配置
 * @author ZSY
 */
let REDIS_CONF={
    port:6379,
    host:'127.0.0.1'
}
let MYSQL_CONF={
    host:'localhost',
    user:'root',
    password:'123456',
    port:'3306',
    database:'koa2_weibo_db'
}
module.exports={
    REDIS_CONF,
    MYSQL_CONF
}