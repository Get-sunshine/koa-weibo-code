/**
 * @description utils controller
 * @author Z
 */
const path = require('path');
const fse=require('fs-extra');
const {ErrorModel,SuccessModel}=require('../model/ResModel');
const {uploadFileSizeFaiInfo}=require('../model/ErrorInfo');
 //存储目录
 const DIST_FOLDER_PATH=path.join(__dirname,'../','../','uploadFiles');
 // 文件大小
 const MAX_SIZE=1024*1024*1024;
 // 是否创建目录
 fse.pathExists(DIST_FOLDER_PATH)
 .then(exist=>{
     //不存在
     if(!exist){
         //创建
         fse.ensureDir(DIST_FOLDER_PATH);
     }
 });


/**
 * 
 * @param {string,string,number,string}
 *   name 文件名
 *   type 文件类型
 *   size 文件大小
 *  filePath 文件路径
 */
 async function saveFile({name,type,size,filePath}){
    if(size>MAX_SIZE){
        //移除
        await fse.remove(filePath);
        return new ErrorModel(uploadFileSizeFaiInfo);
    }
    //移动文件到指定目录
    const fileName=Date.now()+'.'+name;
    const disFilePath=path.join(DIST_FOLDER_PATH,fileName); // 拼接
    await fse.move(filePath,disFilePath);
    //返回信息
    return new SuccessModel({
        url:'/'+fileName
    });
 }
 module.exports={
     saveFile
 }