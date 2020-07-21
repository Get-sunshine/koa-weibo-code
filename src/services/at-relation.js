/**
 * @description 微博 @ 用户关系 service
 * @author Z
 */
const {
    AtRelation,
    Blog,
    User
}=require('../db/model/index');
const {
    formatBlog,
    formatUser
}=require('./_format');
/**
 * 创建微博 @ 用户的关系
 * @param {number} blogId 微博 id
 * @param {number} userId 用户 id
 */
async function createAtRelation(blogId,userId){
    const res = await AtRelation.create({
        blogId,
        userId
    });
}
/**
 * 获取@ 用户的动态数量（未读）
 * @param {number} userId 用户ID
 */
async function getAtRelationCount(userId){
    const res=await AtRelation.findAndCountAll({
        where:{
            userId,
            isRead:false
        }
    });
    //返回数量
    return res.count;
}
/**
 * 获取@ 用户的动态列表
 * @param {Object} param0 查询条件 {userId,pageIndex,pageSize}
 */
async function getAtUserBlogList({userId,pageIndex,pageSize=10}){
    const res=await Blog.findAndCountAll({
        limit:pageSize,
        offset:pageSize*pageIndex,
        order:[
            ['id','desc']
        ],
        include:[
            //@ 关系表
            {
                model:AtRelation,
                attributes:['userId','blogId'],
                where:{userId}
            },
            //User 表
            {
                model:User,
                attributes:['userName','nickName','picture']
            }
        ]
    });
    //格式化
    let blogList=res.rows.map(blog=>blog.dataValues);
    blogList=formatBlog(blogList);
    blogList=blogList.map(item=>{
        item.user=formatUser(item.user.dataValues);
        return item;
    });
    return {
        count:res.count,
        blogList
    }
}
/**
 * 更新 AtRelation
 * @param {Object} param0  更新内容
 * @param {Object} param1 查询条件
 */
async function updateAtRelation (
    { newIsRead },//要更新的内容
    { userId,isRead } //条件
) {
    //拼接更新内容
    const updateData={};
    if(newIsRead){
        updateData.isRead=newIsRead;
    }
    //拼接查询条件
    const whereData={};
    if(userId){
        whereData.userId=userId;
    }
    if(isRead){
        whereData.isRead=isRead;
    }
    //执行更新
    const res=await AtRelation.update(updateData,{
        where:whereData
    });
    return res[0]>0;
}
module.exports={
    createAtRelation,
    getAtRelationCount,
    getAtUserBlogList,
    updateAtRelation
}