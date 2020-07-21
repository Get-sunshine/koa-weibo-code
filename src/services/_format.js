/**
 * @description 数据格式化
 * @author ZSY
 */
const {
    DEFAULT_PICTURE,
    REG_FOR_AT_WHO
}=require('../conf/constant');
const {dateFormat} = require('../utils/dt');
/**
 * 设置用户默认头像
 * @param {Object} obj 用户对象 
 */
function _formatUserPicture(obj){
    if (obj.picture===null) {
        obj.picture=DEFAULT_PICTURE; //默认头像地址
    }
    return obj;
}
/**
 * 格式化动态内容
 * @param {Object} obj 动态数据对象
 */
function _formatContent(obj) {
    obj.contentFormat = obj.content

    // 格式化 @
    // from '哈喽 @张三 - zhangsan 你好'
    // to '哈喽 <a href="/profile/zhangsan">张三</a> 你好'
    obj.contentFormat = obj.contentFormat.replace( //这儿的正则有问题  还没解决
        REG_FOR_AT_WHO,
        (matchStr, nickName, userName) => {
            return `<a href="/profile/${userName}">@${nickName}</a>`
        }
    )
    return obj
}
/**
 * 格式化用户数据
 * @param {Aarray|Object} list  //用户列表或单个用户对象
 */
function formatUser(list){
    if(list===null){
        return list;
    }
    if (list instanceof Array) {
        //数组 用户列表
        return list.map(_formatUserPicture); // ??
    }

    //单个对象
    return _formatUserPicture(list);
}
/**
 * 格式化数据库时间
 * @param {Object} obj 数据
 */
function _formatDbDate(obj){
    obj.createdAtFormat=dateFormat(obj.createdAt);
    obj.updatedAtFormat=dateFormat(obj.updatedAt);
    return obj;
}
/**
 * 格式化动态数据
 * @param {Object|Array} list 动态列表或者单个动态
 */
function formatBlog(list) {
    if (list == null) {
        return list
    }

    if (list instanceof Array) {
        // 数组
        return list.map(_formatDbDate).map(_formatContent)
    }
    // 对象
    let result = list
    result = _formatDbDate(result)
    result = _formatContent(result)
    return result
}
module.exports={
    formatUser,
    formatBlog
}