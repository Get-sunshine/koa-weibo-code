/**
 * @description 常量集合
 * @author  ZSY
 */
module.exports={
    DEFAULT_PICTURE:'https://file02.16sucai.com/d/file/2014/0829/372edfeb74c3119b666237bd4af92be5.jpg',
    PAGE_SIZE:5,
    //正则表达式，匹配‘@昵称-userName’
    // REG_FOR_AT_WHO: /@(.+?)\s-\s(\w+?)\b/g,
    REG_FOR_AT_WHO: /@(.+?)-(\w+?)\b/g //去掉匹配空白
}