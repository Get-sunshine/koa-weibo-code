/**
 * @description user API 路由
 * @author ZSY
 */
const router=require('koa-router')();
const {
    isExist,
    register,
    login,
    deleteCurUser,
    changeInfo,
    changePassword,
    logout
}=require('../../controller/user');
const userValidate=require('../../validator/user');
const {genValidator}=require('../../middlewares/validator');
const {loginCheck}=require('../../middlewares/loginChecks');
const {isTest}=require('../../utils/env');
const {
    getFollowers
}=require('../../controller/user-relation');
router.prefix('/api/user'); // 添加前缀

// 注册路由 先校验 再操作数据
router.post('/register',genValidator(userValidate),async (ctx,next)=>{
    //得到数据
    const  {userName,password,gender}=ctx.request.body;
    //调用controller
    ctx.body=await register({
        userName,
        password,
        gender
    });
});

// 判断用户名是否存在   路由
router.post('/isExist',async (ctx,next)=>{
    const {userName}=ctx.request.body;
    ctx.body=await isExist(userName);
});
// 登录
router.post('/login',async (ctx,next)=>{
    const {userName,password}=ctx.request.body;
    //controller
    const res=await login(ctx,userName,password);
    ctx.body=res;

});
//删除
router.post('/delete',async (ctx,next)=>{
    if(isTest){
        const {userName}=ctx.session.userInfo;
        const res=await deleteCurUser(userName);
        ctx.body=res;
    }
});
//修改信息
router.patch('/changeInfo',loginCheck,genValidator(userValidate),async(ctx,next)=>{
    let {nickName,city,picture}=ctx.request.body;
    ctx.body=await changeInfo(ctx,{nickName,city,picture});
});
// 修改密码
router.patch('/changePassword',loginCheck,genValidator(userValidate),async(ctx,next)=>{
    let {password,newPassword}=ctx.request.body;
    let {userName}=ctx.session.userInfo;
    ctx.body=await changePassword({userName,password,newPassword});
});
// 退出
router.post('/logout',loginCheck,async ctx=>{
    ctx.body=await logout(ctx);
});
//获取at列表，即关注人列表
router.get('/getAtList',loginCheck,async (ctx,next)=>{
    const {id:userId}=ctx.session.userInfo;
    const res=await getFollowers(userId);
    const {followersList}=res.data;
    const list=followersList.map(user=>{
        return `${user.nickName}-${user.userName}`;
    });
    ctx.body=list;
});
// 导出
module.exports=router;