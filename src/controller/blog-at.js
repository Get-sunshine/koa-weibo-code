/**
 * @description 动态 @ 关系 controller
 * @author Z
 */
const {
    getAtRelationCount, 
    getAtUserBlogList,
    updateAtRelation
}=require('../services/at-relation');
const {
    SuccessModel,
    ErrorModel
}=require('../model/ResModel');
const { PAGE_SIZE } = require('../conf/constant');
/**
 * 获取@ 我的动态数量
 * @param {number} userId 用户ID
 */
async function getAtMeCount(userId){
    //service
    const count=await getAtRelationCount(userId);
    return new SuccessModel({
        count
    });
}
/**
 * 获取@ 了用户的动态
 * @param {number} userId id
 * @param {number} pageIndex index
 */
async function getAtMeBlogList(userId,pageIndex=0){
    //service
    const res=await getAtUserBlogList({
        userId,
        pageIndex,
        pageSize:PAGE_SIZE
    });
    const {count,blogList}=res;
    // 返回
    return new SuccessModel({
        isEmpty:blogList.length===0,
        blogList,
        pageSize:PAGE_SIZE,
        pageIndex,
        count
    });
}
/**
 * 标记为已读
 * @param {number} userId userId
 */
async function markAsRead(userId){
    //service
    try {
        await updateAtRelation(
            {newIsRead:true},//更新内容
            {userId,isRead:false}//更新条件
        );
    } catch (error) {
        console.error(error);
    }
    //不需要返回SuccessModel或者ErrorModel,所以使用try catch
}
module.exports={
    getAtMeCount,
    getAtMeBlogList,
    markAsRead
}