/**
 * @description user service
 * @author ZSY
 */
const {User}=require('../db/model/index');
const {formatUser}=require('./_format');
const {
    addFollower
}=require('./user-relation');
/**
 * 获取用户信息
 * @param {string} userName 用户名
 * @param {string} password 密码
 */
async function getUserInfo(userName,password){
    //定义查询条件
    const whereOpt={
        userName
    }
    //如果传入了密码 则添加到条件中
    if(password){
        Object.assign(whereOpt,{password});
    }
    //按条件查询
    const data=await User.findOne({
        attributes:['id','userName','nickName','picture','city'],
        where:whereOpt
    });
    //未找到
    if (data===null) {
        return data;
    }
    // 格式化
    const result=formatUser(data.dataValues);
    return result; // 返回格式化后的对象
}
/**
 * 创建用户
 * @param {string,string,number,string} 用户名，密码，性别，昵称 
 */
async function createrUser({userName,password,gender=3,nickName}){
    //操作数据库
    const res=await User.create({
        userName,
        password,
        nickName:nickName?nickName:userName, //有则用 无则等于nickName
        gender
    });
    let data=res.dataValues;
    //自己关注自己（为了方便首页获取数据）
    await addFollower(data.id,data.id);
    return data;
}
/**
 * 删除用户
 * @param {string} userName 用户名 
 */
async function deleteUser(userName){
    const res=await User.destory({
        where:{
            userName
        }
    });
    //res:受影响的行数
    return res>0;
}
/**
 * 更新信息
 * @param {Object} 要修改的内容 {newPassword,newNickname,newPicture,newCity} 
 * @param {Object} 查询条件 {userName,password}
 */
async function updateUser(
    {newPassword,newNickName,newPicture,newCity},
    {userName,password}
){
    //拼接修改内容
    let updateData={};
    if(newPassword){
        updateData.password=newPassword;
    }
    if(newNickName){
        updateData.nickName=newNickName;
    }
    if(newPicture){
        updateData.picture=newPicture;
    }
    if(newCity){
        updateData.city=newCity;
    }
    //拼接查询条件
    let whereData={
        userName
    };
    if(password){
        whereData.password=password
    };
    //执行
    let res=await User.update(updateData,{
        where:whereData
    });
    //res 受影响行数
    return res[0]>0;
}
module.exports={
    getUserInfo,
    createrUser,
    deleteUser,
    updateUser
}