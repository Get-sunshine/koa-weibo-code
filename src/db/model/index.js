/**
 * @description 数据模型入口文件
 * @author ZSY
 */
const User=require('./User');
const Blog = require('./Blog');
const UserRelation=require('./UserRelation');
const AtRelation=require('./AtRelation');
//创建外键
Blog.belongsTo(User,{
    foreignKey:'userId'
});
//外键
UserRelation.belongsTo(User,{
    foreignKey:'followerId'
});
User.hasMany(UserRelation,{
    foreignKey:'userId'
});
//但是这个操作在数据库中并没有成功，同样可以用。
Blog.belongsTo(UserRelation,{
    foreignKey:'userId',
    targetKey:'followerId'
});
//外键
Blog.hasMany(AtRelation,{
    foreignkey:'blogId'
})
module.exports={
    User,
    Blog,
    UserRelation,
    AtRelation
}