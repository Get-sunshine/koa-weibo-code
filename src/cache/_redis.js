/**
 * @author ZSY
 * @description 连接Redis的方法 get和set
 */
const {REDIS_CONF}=require('../conf/db');
const redis=require('redis');

//创建客户端
const redisClient=redis.createClient(REDIS_CONF.port,REDIS_CONF.host);
redisClient.on('error',err=>{
    console.log('redis error',err);
});

//set
/**
 * key set
 * @param {string} key key
 * @param {string} val value
 * @param {number} timeout 过期时间，单位：s
 */
function set(key,val,timeout=60*60){
    if(typeof val==='object'){
        val=JSON.stringify(val);
    }
    redisClient.set(key,val);
    redisClient.expire(key,timeout); //设置过期时间
}

//get
function get(key){
    return new Promise((resolve,reject)=>{
        redisClient.get(key,(err,val)=>{
            if(err){
                reject(err);
                return;
            }
            if(val===null){
                resolve(val);
                return;
            }
            try {
                resolve(JSON.parse(val));
            }catch(err){
                resolve(val);
            }
        });
    });
}
module.exports={
    set,
    get
}