/**
 * @description blog-at 页面
 * @author Z
 */
const router=require('koa-router')();
const { loginCheck }=require('../../middlewares/loginChecks');
const {
    getAtMeBlogList
}=require('../../controller/blog-at');
const {
    getBlogListStr
}=require('../../utils/blog');
router.prefix('/api/atMe');
//加载更多
router.get('/loadMore/:pageIndex',loginCheck,async (ctx,next)=>{
    //页码
    let {pageIndex}=ctx.params;
    pageIndex=parseInt(pageIndex);
    const {id:userId}=ctx.session.userInfo;
    const res=await getAtMeBlogList(userId,pageIndex);
    //渲染
    res.data.blogListTpl=getBlogListStr(res.data.blogList);
    ctx.body=res;
});
module.exports=router;