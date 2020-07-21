/**
 * @description 用户数据模型
 * @author ZSY
 */
const seq=require('../seq');
//数据类型
const {STRING,
    DECIMAL,
    TEXT,
    INTEGER,
    BOOLEAN}=require('../types');


//user模型
const User=seq.define('user',{
    userName:{
        type:STRING,
        allowNull:false,
        unique:true,
        comment:'用户名，唯一'
    },
    password:{
        type:STRING,
        allowNull:false,
        comment:'密码'
    },
    nickName:{
        type:STRING,
        allowNull:false,
        comment:'昵称'
    },
    gender:{
        type:DECIMAL,
        allowNull:false,
        defalut:3,
        comment:'性别（1 男 2女 3保密）'
    },
    picture:{
        type:STRING,
        comment:"头像 保存的是地址"
    },
    city:{
        type:STRING,
        comment:'城市'
    }
});

module.exports=User;
