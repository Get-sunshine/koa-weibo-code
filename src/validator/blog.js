/**
 * @description 动态 数据格式校验
 * @author Z
 */

const validate = require('./_validate')

// 校验规则
const SCHEMA = {
    type: 'object',
    properties: {
        content: {
            type: 'string'
        },
        image: {
            type: 'string',
            maxLength: 255
        }
    }
}

/**
 * 校验动态数据格式
 * @param {Object} data 动态的数据
 */
function blogValidate(data = {}) {
    return validate(SCHEMA, data);
}

module.exports = blogValidate;