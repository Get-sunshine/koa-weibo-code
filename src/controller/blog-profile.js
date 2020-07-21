/**
 * @description 个人主页 controller
 * @author Z
 */
const {getBlogListByUser}=require('../services/blog');
const {PAGE_SIZE}=require('../conf/constant');
const {SuccessModel}=require('../model/ResModel');
/**
 * 获取个人主页微博列表
 * @param {string } userName 用户名
 * @param {number} pageIndex 页数
 */
async function getProfileBlogList(userName,pageIndex=0){
    let res=await getBlogListByUser({
        userName,
        pageIndex,
        pageSize:PAGE_SIZE
    });
    let blogList=res.blogList;
    //
    let data={
        isEmpty:blogList.length===0,
        blogList,
        pageSize:PAGE_SIZE,
        pageIndex,
        count:res.count
    }
    return  new SuccessModel(data);
}
module.exports={
    getProfileBlogList
}