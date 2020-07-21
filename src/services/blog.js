/**
 * @description 动态 service
 * @author Z
 */
const {Blog,User,UserRelation}=require('../db/model/index');
const {formatBlog,formatUser}=require('./_format');
/**
 * 创建动态
 * @param {Object} param0 创建动态所需数据 {userId,content,image}
 */
async function createBlog({userId,content,image}){
    let res=await Blog.create({
        userId,
        content,
        image
    });
    return res.dataValues;
}
/**
 * 根据用户获取动态列表
 * @param {Object} param0  {userName,pageIndex=0,pageSize=10}
 */
async function getBlogListByUser(
    {
        userName,
        pageIndex=0,
        pageSize=10
    }
){
    //查询条件
    let userOp={};
    if(userName){
        userOp.userName=userName;
    }
    //查询
    let res=await Blog.findAndCountAll({
        limit:pageSize,//每页显示条数
        offset:pageSize*pageIndex,//跳过几页
        order:[
            ['id','desc']//按id降序
        ],
        include:[
            {
                model:User,
                attributes:['userName','nickName','picture'],
                where:userOp
            }
        ]
    });
    // res.count 总数
    // res.rows 查询结果 数组
    // 得到rows中的dataValues
    let blogList=res.rows.map(blog=>blog.dataValues); //得到一个数组
    //格式化
    blogList=formatBlog(blogList);
    blogList=blogList.map(blogItem=>{
        let user=blogItem.user.dataValues;
        blogItem.user=formatUser(user);
        return blogItem
    });
    return {
        count:res.count,
        blogList
    }
}
/**
 * 获取关注者的微博列表
 * @param {Object} 查询条件 {userId,pageIndex=0,pageSize=10}
 */
async function getFollowersBlogList({userId,pageIndex=0,pageSize=10}){
    const res=await Blog.findAndCountAll({
        limit:pageSize,//每页多少条
        offset:pageSize*pageIndex,//跳过多少条
        order:[
            ['id','desc']
        ],
        include:[
            {
                model:User,
                attributes:['userName','nickName','picture']
            },
            {
                model:UserRelation,
                attributes:['userId','followerid'],
                where:{userId}
            }
        ]
    });
    //格式化数据
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
module.exports={
    createBlog,
    getBlogListByUser,
    getFollowersBlogList
}