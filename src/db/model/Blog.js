/**
 * @description Blog数据模型
 * @author Z
 */
const seq = require('../seq');
const {STRING,
    DECIMAL,
    TEXT,
    INTEGER,
    BOOLEAN}=require('../types');
const Blog=seq.define('blog',{
    userId:{
        type:INTEGER,
        allowNull:false,
        comment:'用户ID'
    },
    content:{
        type:TEXT,
        allowNull:false,
        comment:'动态内容'
    },
    image:{
        type:STRING,
        allowNull:true,
        comment:'配图'
    }
});

module.exports=Blog;