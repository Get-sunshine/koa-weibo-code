/**
 * @description user controller
 * @author ZSY
 */
const {doCrypto}=require('../utils/cryp');
const {
    getUserInfo,
    createrUser,
    deleteUser,
    updateUser
} = require('../services/user');
const { SuccessModel, ErrorModel } = require('../model/ResModel');
const { 
    registerUserNameNotExistInfo,
    registerUserNameExistInfo,
    registerFailInfo,
    loginFailInfo,
    deleteUserFailInfo
} = require('../model/ErrorInfo');
/**
 * 判断用户是否存在
 * @param {string} userName 用户名
 */
async function isExist(userName) {
    // 业务逻辑处理
    // 调用service 获取数据
    const userInfo = await getUserInfo(userName);
    // 统一返回格式
    if (userInfo) {
        // userInfo不为空 用户存在
        return new SuccessModel(userInfo);
    } else {
        // 用户不存在  即可以注册
        return new ErrorModel(registerUserNameNotExistInfo);
    }

}
/**
 * 注册
 * @param {string} userName 
 * @param {string} password
 * @param {number} gender (1男，2女，3保密)
 */
async function register({ userName, password, gender }) {
    const userInfo = await getUserInfo(userName);
    if (userInfo) {
        //用户名已存在
        return new ErrorModel(registerUserNameExistInfo);
    }
    //实现注册
    // 调用services
    // 想一下 上面已经用了判断了 这里为什么还要判断？
    try {
        await createrUser({
            userName,
            password:doCrypto(password),  // 给密码加密
            gender
        })
        return new SuccessModel();
    } catch (error) {
        console.log(error);
        return new ErrorModel(registerFailInfo);
    }
}

/**
 * 登录
 * @param {Object} ctx  
 * @param {string} userName  用户名
 * @param {string} password 密码
 */
async function login(ctx,userName,password){
    // 获取信息
    const userInfo=await getUserInfo(userName,doCrypto(password));
    if(!userInfo){
        //失败，即没有此用户
        return new ErrorModel(loginFailInfo);
    }
    //成功  不能用全等？？
    if(ctx.session.userInfo==null){
        //如果没有 则设置
        ctx.session.userInfo=userInfo;
    }
    return new SuccessModel();
}
/**
 * 删除当前用户
 * @param {string} userName 
 */
async function deleteCurUser(userName){
    const res=await deleteUser(userName);
    if(res){
        return new SuccessModel();
    }
    return  new ErrorModel(deleteUserFailInfo);
}
/**
 * 修改信息
 * @param {Object} ctx  条件
 * @param {Object} param1 被修改的内容
 */
async function changeInfo(ctx,{nickName,city,picture}){
    let {userName}=ctx.session.userInfo;
    if(!nickName){
        nickName=userName; // 如果不传昵称，则默认是userName
    }
    let res=await updateUser(
        {
            newNickName:nickName,
            newPicture:picture,
            newCity:city
        },
        {userName}
    )
    if(res){
        //如果成功,更改session中存储的值
        Object.assign(ctx.session.userInfo,{
            nickName,
            city,
            picture
        });
        return new SuccessModel();
    }
    return new ErrorModel(changeInfoFailInfo);
}
/**
 * 修改密码
 * @param {Object} param0 
 */
async function changePassword(
    {userName,password,newPassword}
){
    let res=await updateUser({
        newPassword:doCrypto(newPassword)
    },
    {
        userName,
        password:doCrypto(password)
    }
    );
    if(res){
        return new SuccessModel();
    }
    return new ErrorModel(changePasswordFailInfo);
}
/**
 * 退出
 * @param {Objext} ctx ctx
 */
async function logout(ctx){
    delete ctx.session.userInfo;
    return new SuccessModel();
}
module.exports = {
    isExist,
    register,
    login,
    deleteCurUser,
    changeInfo,
    changePassword,
    logout
}