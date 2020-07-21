/**
 * @description 动态缓存层
 * @author Z
 */
const {get,set}=require('./_redis');
const {getBlogListByUser}=require('../services/blog');
// redis key 前缀
const KEY_PREFIX='weibo:square';
/**
 * 获取广场列表缓存
 * @param {number} pageIndex pageIndex
 * @param {number} pageSize pageSize
 */
async function getSquareCacheList(pageIndex,pageSize){
    // const key=`${KEY_PREFIX}${pageIndex}_${pageSize}`;
    // //尝试获取缓存
    // const cacheRes=await get(key);
    // if(cacheRes!=null){
    //     //获取缓存成功
    //     return cacheRes;
    // }
    //没有缓存,从数据库取
    const res=await getBlogListByUser({pageIndex,pageSize});
    //设置缓存，过期时间，1min
    // set(key,res,60);
    return res;
}
module.exports={
    getSquareCacheList
}