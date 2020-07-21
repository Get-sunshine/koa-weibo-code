/**
 * @description 用户关系 service
 * @author Z
 */
const {User,UserRelation}=require('../db/model/index');
const {formatUser}=require('./_format');
const Sequelize = require('Sequelize');
/**
 * 获取关注该用户的用户列表，即该用户的粉丝
 * @param {number} followerId 被关注人的id
 */
async function getUsersByFollower(followerId){
    const res=await User.findAndCountAll({
        attributes:['id','nickName','userName','picture'],
        order:[
            ['id','desc']
        ],
        include:[
            {
                model:UserRelation,
                where:{
                    followerId,
                    userId:{
                        [Sequelize.Op.ne]:followerId
                    }
                }
            }
        ]
    }); 
    //res.count 总数
    //res.rows 查询结果，数组
    // 格式化
    let userList=res.rows.map(row=>row.dataValues);
    userList=formatUser(userList);
    return{
        count:res.count,
        userList
    }
}
/**
 * 获取关注人列表
 * @param {number} userId 用户id
 */
async function getFollowersByUser(userId){
    const res=await UserRelation.findAndCountAll({
        order:[
            ['id','desc']
        ],
        include:[
            {
                model:User,
                attributes:['id','userName','nickName','picture']
            }
        ],
        where:{
            userId,
            followerId:{
                [Sequelize.Op.ne]:userId // 这句话的意思是followerId不等于userId
            }
        }
    });
    //res.count 查询出来的总数
    //res.rows 查询出的结果，数组
    let resList=res.rows.map(row=>row.dataValues);
    userList=resList.map(res =>{
        let userObj=res.user.dataValues;
        userObj=formatUser(userObj);
        return userObj;
    });
    return {
        count:res.count,
        userList
    }
}
/**
 * 添加关注
 * @param {number} userId 用户id
 * @param {number} followerId 被关注用户id
 */
async function addFollower(userId,followerId){
    const res=await UserRelation.create({
        userId,
        followerId
    });
    return res.dataValues;
}
/**
 * 取消关注
 * @param {number} userId 用户id
 * @param {number} folloerId 被取消关注的用户id
 */
async function deleteFollower(userId,followerId){
    const res=await UserRelation.destroy({
        where:{
            userId,
            followerId
        }
    });
    return res>0;
}
module.exports={
    getUsersByFollower,
    getFollowersByUser,
    addFollower,
    deleteFollower
}