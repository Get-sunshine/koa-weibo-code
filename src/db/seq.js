/**
 *  @description sequelize实例
 *  @author ZSY
 */
const {MYSQL_CONF}=require('../conf/db');
const {host,user,password,database}=MYSQL_CONF;
const {isProd,isTest}=require('../utils/env'); // 判断环境的
const Sequelize=require('sequelize');
const conf={
    host:host,
    dialect:'mysql'
};
//线上环境，使用连接池
if(isProd){
    conf.pool={
        max:5,// 连接池中最大的连接数量
        min:0,// 连接池中最小的连接数量
        idle:10000 //如果一个连接池10s之内没有被使用，则释放
    }
}

// 希望在单元测试时  关闭在控制台打印的日志，如SQL语句等。
if(isTest){
    conf.logging=()=>{};
}
const seq=new Sequelize(database,user,password,conf);
// 测试连接
// seq.authenticate().then(()=>{
//     console.log('ok');
// }).catch(()=>{
//     console.log('err');
// });

module.exports=seq;