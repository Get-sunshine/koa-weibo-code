/**
 * @description blog view 路由
 * @author Z
 */
const router=require('koa-router')();
const {getProfileBlogList}=require('../../controller/blog-profile');
const {getSquareBlogList}=require('../../controller/blog-square');
const {loginRedirect}=require('../../middlewares/loginChecks');
const {isExist}=require('../../controller/user');
const {
    getFans,
    getFollowers
}=require('../../controller/user-relation');
const {
    getIndexBlogList
}=require('../../controller/blog-index');
const {
    getAtMeCount,
    getAtMeBlogList,
    markAsRead
}=require('../../controller/blog-at');
//首页
router.get('/',loginRedirect,async (ctx,next)=>{
    const userInfo=ctx.session.userInfo;
    const {id:userId}=userInfo;
    //获取第一页数据
    //controller
    const res=await getIndexBlogList(userId);
    const {isEmpty,blogList,pageSize,pageIndex,count}=res.data;
    //获取粉丝
    const fansRes=await getFans(userId);
    const {count:fansCount,userList:fansList}=fansRes.data;
    //获取关注人
    const followersRes=await getFollowers(userId);
    const {count:followersCount,followersList}=followersRes.data;
    //获取@数量
    const atCount=await getAtMeCount(userId);
    await ctx.render('index',{
        userData:{
            userInfo,
            fansData:{
                count:fansCount,
                list:fansList
            },
            followersData:{
                count:followersCount,
                list:followersList
            },
            atCount:atCount.data.count
        },
        blogData:{
            isEmpty,
            blogList,
            pageSize,
            pageIndex,
            count
        }
    });
});
//个人主页
router.get('/profile',loginRedirect,async (ctx,next)=>{
    const {userName}=ctx.session.userInfo;
    // console.log(userName);
    ctx.redirect(`/profile/${userName}`);
});
router.get('/profile/:userName',loginRedirect,async (ctx,next)=>{
    //获取个人动态数据的第一页
    // 自己的信息
    // console.log(ctx.session.userInfo);
    
    const myUserInfo=ctx.session.userInfo;
    const myUserName=myUserInfo.userName;
    // 传过来的用户的信息
    const {userName: curUserName}=ctx.params;
    let curUserInfo
    const isMe=(myUserName===curUserName);
    if(isMe){
        curUserInfo=myUserInfo
    }else{
        const  existRes=await isExist(curUserName);
        if(existRes.errno!==0){
            //如果不存在
            return;
        }
        //如果存在
        curUserInfo=existRes.data;
    }
    //controller
    const res=await getProfileBlogList(curUserName,0);
    const {isEmpty,blogList,pageSize,pageIndex,count}=res.data;
    //获取粉丝 controller
    const fansRes=await getFans(curUserInfo.id);
    const {count:fansCout,userList:fansList}=fansRes.data;
    //获取关注人列表 调用controller
    const followersRes=await getFollowers(curUserInfo.id);
    const {count:followersCount,followersList}=followersRes.data;
    //是否是他的粉丝？？即是否关注此人？？
    const amIFollowed=fansList.some((item) => {
        //粉丝列表中是否有登录人的名字
        return item.userName===myUserName;
    })
    //获取@ 动态数量
    const atCount=await getAtMeCount(myUserInfo.id);
    await ctx.render('profile',{
        blogData:{
            isEmpty,
            blogList,
            pageSize,
            pageIndex,
            count
        },
        userData:{
            userInfo:curUserInfo,
            isMe,
            fansData:{
                count:fansCout,
                list:fansList
            },
            followersData:{
                count:followersCount,
                list:followersList
            },
            amIFollowed,
            atCount:atCount.data.count
        }
    });
});
//讨论广场
router.get('/square', loginRedirect, async (ctx, next) => {
    // 获取微博数据，第一页
    const result = await getSquareBlogList(0);
    const { isEmpty, blogList, pageSize, pageIndex, count } = result.data || {};
    await ctx.render('square', {
        blogData: {
            isEmpty,
            blogList,
            pageSize,
            pageIndex,
            count
        }
    })
});
//atMe
router.get('/at-me',loginRedirect,async (ctx,next)=>{
    const {id:userId}=ctx.session.userInfo;
    //获取 @ 数量
    const res=await getAtMeCount(userId);
    const {count:atCount}=res.data;
    //获取第一页列表
    // controller
    const blogRes=await getAtMeBlogList(userId);
    const {
        isEmpty,
        blogList,
        pageSize,
        pageIndex,
        count
    }=blogRes.data;
    //渲染页面
    await ctx.render('atMe',{
        atCount,
        blogData:{
            isEmpty,
            blogList,
            pageSize,
            pageIndex,
            count
        }
    });
    //标记为已读
    if (atCount>0){
        //controller
        await markAsRead(userId);
    }
});
module.exports=router;