/**
 * @description user view 路由
 * @author ZSY
 */
// 引入路由模块
const router=require('koa-router')();

const {loginRedirect}=require('../../middlewares/loginChecks');

function getLoginInfo(ctx) { 
    let data={
        isLogin:false // 默认是未登录
    }
    const userInfo=ctx.session.userInfo;
    if(userInfo){
        data={
            isLogin:true,
            userName:userInfo.userName
        }
    }
    return data;
}
//登录
router.get ('/login',async (ctx,next)=>{
    await ctx.render('login');
});
// 注册
router.get ('/register',async (ctx,next)=>{
    await ctx.render('register',getLoginInfo(ctx));
});
//设置
router.get('/setting',loginRedirect,async(ctx,next)=>{
    console.log(ctx.session.userInfo);
    
    await ctx.render('setting',ctx.session.userInfo);
});
// 导出
module.exports=router;
