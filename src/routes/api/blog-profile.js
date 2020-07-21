/**
 * @description 个人主页 API 路由
 * @author Z
 */
const router=require('koa-router')();
const {loginCheck}=require('../../middlewares/loginChecks');
const {getProfileBlogList}=require('../../controller/blog-profile');
const {getBlogListStr}=require('../../utils/blog');
const {follow,unFollow}=require('../../controller/user-relation');
router.prefix('/api/profile');
//加载更多
router.get('/loadMore/:userName/:pageIndex',loginCheck,async (ctx,next)=>{
    let {userName,pageIndex}=ctx.params;
    pageIndex=parseInt(pageIndex);
    const res=await getProfileBlogList(userName,pageIndex);
    //渲染为HTML字符串
    res.data.blogListTpl=getBlogListStr(res.data.blogList);
    ctx.body=res;
});
//关注
router.post('/follow',loginCheck,async (ctx,next)=>{
    const {id:myUserId}=ctx.session.userInfo;
    const {userId:curUserId}=ctx.request.body;
    //controller
    ctx.body=await follow(myUserId,curUserId);
});
//取消关注
router.post('/unfollow',loginCheck,async(ctx,next)=>{
    const {id:myUserId}=ctx.session.userInfo;
    const {userId:curUserId}=ctx.request.body;
    ctx.body=await unFollow(myUserId,curUserId);
});
module.exports=router;