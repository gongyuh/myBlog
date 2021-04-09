const {loginCheck} = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

//获取cookie的过期时间
const getCookieExpires = ()=>{
    const d = new Date()
    d.setTime(d.getTime() + (24*60*60*1000))
    console.log(d.toGMTString())
    return d.toGMTString()
}

const handleUserRouter = (req,res)=>{
    const method = req.method

    //登陆
    if(method === 'POST' && req.path === '/api/user/login'){
        //get暂时用的是query的方式进行解析参数
        const { username,password} = req.body
        const result = loginCheck(username,password)
        return result.then(data=>{
            if(data.username){
                // 设置 session
                req.session.username = data.username
                req.session.realname = data.realname
                console.log('session:'.req.session)
                //操作cookie
                res.setHeader('Set-Cookie',`username=${data.username};path=/;httpOnly;expires=${getCookieExpires}`)

                return new SuccessModel()
            }
            return new ErrorModel('登陆失败')
        })
    }

    //登陆验证的测试
    // if(method === 'GET' && req.path === '/api/user/login-test'){
    //     console.log(req)
    //     if(req.session.username){
    //         //因为app.js里面的userResult后面跟了个.then所以这里要返回一个promise的对象
    //         return Promise.resolve(new SuccessModel({
    //             session:req.session
    //         }))
    //     }
    //     return Promise.resolve(new ErrorModel('尚未登陆'))
    // }
}
module.exports = handleUserRouter;