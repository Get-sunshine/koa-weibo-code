/**
 * @description 时间相关的工具函数
 * @author Z
 */
const {format}=require('date-fns');
/**
 * 时间格式化函数
 * @param {string} str 时间字符串
 */
function dateFormat(str){
    return format(new Date(str),'yyyy-MM-dd HH:mm' );
}
module.exports={
    dateFormat
}