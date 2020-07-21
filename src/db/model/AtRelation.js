/**
 * @description 动态 @ 用户的关系，数据模型
 * @author Z
 */
const seq = require('../seq');
const {INTEGER,BOOLEAN} = require('../types');
const AtRelation=seq.define('atRelation',{
    userId:{
        type:INTEGER,
        allowNull:false,
        comment:'用户 id'
    },
    blogId:{
        type:INTEGER,
        allowNull:false,
        comment:'动态 id'
    },
    isRead:{
        type:BOOLEAN,
        allowNull:false,
        defaultValue:false,//默认未读
        comment:'是否已读'
    }

});
module.exports=AtRelation;