/**
 * @description 首页 Controller
 * @author Z
 */
const xss=require('xss');//防止xss攻击
const {
    createBlog,
    getFollowersBlogList
}=require('../services/blog');
const {
    getUserInfo
}=require('../services/user');
const {
    SuccessModel,
    ErrorModel
}=require('../model/ResModel');
const {
    createBlogFailInfo
}=require('../model/ErrorInfo');
const {
    PAGE_SIZE,
    REG_FOR_AT_WHO
}=require('../conf/constant');
const {
    createAtRelation
}=require('../services/at-relation');
 /**
  * 创建动态
  * @param {Object} param0 创建动态所需数据 {userId,content,image}
  */
 async function create({userId,content,image}){
     //分析并收集 content 中的@用户
     //content 格式
     const atUserNameList=[];
     content = content.replace(REG_FOR_AT_WHO,(matchStr,nickName,userName)=>{
         //目的不是replace 而是获取userName
         atUserNameList.push(userName);
         return matchStr;
     });
     //根据@用户名查询用户信息
     const atUserList=await Promise.all(
         atUserNameList.map(userName=>{
             return getUserInfo(userName);
         })
     );
     //根据用户信息，获取用户id
     const atUserIdList = atUserList.map(user=>user.id);
    //service
    try {
        let res=await createBlog({
            userId,
            content:xss(content),
            image
        });
        //创建@关系
        //service
        await Promise.all(atUserIdList.map(
            userId => {
                createAtRelation(res.id,userId);
            }
        ));
        //返回
        return new SuccessModel(res);
    } catch (error) {
        console.error(error.message,error.stack);
        return new ErrorModel(createBlogFailInfo);
    }
 }
 /*
  * 获取首页微博列表
  * @param {number} userId 用户id
  * @param {number} pageIndex 页码
  */
async function getIndexBlogList(userId,pageIndex=0){
    const res=await getFollowersBlogList({userId,pageIndex,pageSize:PAGE_SIZE});
    const {count,blogList}=res;
    return new SuccessModel({
        isEmpty:blogList.length===0,
        blogList,
        pageSize:PAGE_SIZE,
        pageIndex,
        count
    });
}
 module.exports={
     create,
     getIndexBlogList
 }