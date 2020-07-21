/**
 * @description 数据库表的同步
 * @author ZSY
 */

const seq = require('./seq');
require('./model/index');
//测试连接
// seq.authenticate().then(()=>{
//     console.log("ok");
    
// }).catch(()=>{
//     console.log("err");
// });

//执行创建 force 代表每次强制执行 数据库中有表则会擦除 重新创建
seq.sync({force:true}).then(()=>{
    console.log("sync ok");
    process.exit(); // 退出
});