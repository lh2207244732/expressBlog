//utils/hmac.js     这是一个加密工具
const crypto = require('crypto')
module.exports = (arr) => {
    const hmac = crypto.createHmac('sha512', 'liuhao154sdd4')
    hmac.update(arr)
    return hmac.digest('hex')
}