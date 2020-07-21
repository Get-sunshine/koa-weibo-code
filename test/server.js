/**
 * @author ZSY
 * @description 测试server
 */

 const request=require('supertest');
 const server=require('../src/app').callback();
 module.exports=request(server);