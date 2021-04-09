const { exec,escape } = require('./../db/mysql') 

const loginCheck = (username,password) => {
    //防止sql注入
    username = escape(username)
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

