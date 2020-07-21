/**
 * @description 用户关系 controller
 * @author Z
 */
const {
    getUsersByFollower,
    addFollower,
    deleteFollower,
    getFollowersByUser
}=require('../services/user-relation');
const {SuccessModel}=require('../model/ResModel');
const {addFollowerFailInfo,deleteFollowerFailInfo}=require('../model/ErrorInfo');
/**
 * 根据userid获取粉丝列表
 * @param {number} userId 用户id
 */
async function getFans(userId){
    //service
    const {count,userList}=await getUsersByFollower(userId);
    return new SuccessModel({
        count,
        userList
    });
}
/**
 * 获取关注人列表
 * @param {number} userId 用户id
 */
async function getFollowers(userId){
    //service
    const {count,userList}=await getFollowersByUser(userId);
    return new SuccessModel({
        count,
        followersList:userList
    });
}
/**
 * 关注
 * @param {number} myUserId 当前登录的用户的id
 * @param {number} curUserId 被关注的用户的id
 */
async function follow(myUserId,curUserId){
    //service
    //因为是创建 错误不好发现，所以用try
    try {
        const res=await addFollower(myUserId,curUserId);
        return new SuccessModel();
    } catch (error) {
        console.log(error);
        return new ErrorModel(addFollowerFailInfo);
    }    
}
//取消关注
/**
 * 取消关注
 * @param {number} myUserId 当前登录用户id
 * @param {number} curUserId 被取消关注用户id
 */
async function unFollow(myUserId,curUserId){
    const res=await deleteFollower(myUserId,curUserId);
    if(res) {
        return new SuccessModel();
    }
    return new ErrorModel(deleteFollowerFailInfo);
    
}
module.exports={
    getFans,
    getFollowers,
    follow,
    unFollow
}