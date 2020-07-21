/**
 * @description 首页 api 路由
 * @author Z
 */
const router = require('koa-router')();
const blogValidate=require('../../validator/blog');
const {genValidator}=require('../../middlewares/validator');
const {loginCheck}=require('../../middlewares/loginChecks');
const {
    create
}=require('../../controller/blog-index');
const {getIndexBlogList}=require('../../controller/blog-index');
const {getBlogListStr}=require('../../utils/blog');
router.prefix('/api/blog');
//创建动态
router.post('/create',loginCheck,genValidator(blogValidate),async (ctx,next)=>{
    const {content,image}=ctx.request.body;
    const {id:userId}=ctx.session.userInfo;
    //controller
    ctx.body=await create({userId,content,image});
});
// 加载更多
router.get('/loadMore/:pageIndex', loginCheck, async (ctx, next) => {
    let { pageIndex } = ctx.params;
    pageIndex = parseInt(pageIndex);  // 转换 number 类型
    const { id: userId } = ctx.session.userInfo;
    const result = await getIndexBlogList(userId, pageIndex);
    // 渲染模板
    result.data.blogListTpl = getBlogListStr(result.data.blogList);

    ctx.body = result;
});
module.exports=router;