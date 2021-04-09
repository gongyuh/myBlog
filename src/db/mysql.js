const mysql = require('mysql')
// const {MYSQL_CONF} = require('../conf/db')


let MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'GONGyu==666',
    port: '3306',
    database: 'myblog'
  }

//创建连接对象
const con = mysql.createConnection(MYSQL_CONF)

//开始连接
con.connect()

//统一执行sql的函数
function exec(sql){
    const promise = new Promise((resolve,reject)=>{
        con.query(sql,(err,result)=>{
            if(err){
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}

module.exports={
    exec,
    escape:mysql.escape
}