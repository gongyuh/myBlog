const { exec,escape } = require('./../db/mysql')
const {genPassword} = require('../utils/cryp')

const loginCheck = (username,password) => {
    //防止sql注入
    username = escape(username)

    //生成加密的密码
    password = genPassword(password)
    password = escape(password)

    const sql = `
    select * from users where username='${username}' and password='${password}';
    `
    
    return exec(sql).then(rows => {
        console.log(rows)
        return rows[0] || {} 
      })
}

module.exports = {
    loginCheck
}

