const redis = require('redis')

let REDIS_CONF = {
  host:'127.0.0,1',
  port:'6379'
}

//创建客户端
const redisClient = redis.createClient(REDIS_CONF.port,REDIS_CONF.host)
redisClient.on('error',err=>{
    console.err(err)
})

function set(key,val){
    if(typeof val === 'object'){
        val = JSON.stringify(val)
    }
    redisClient.set(key,val,redis.print)
}

function get(key){
    //使用的是异步的形式所以要使用promsie进行代码的封装
    const promsie = new Promise((resolve,reject)=>{
        redisClient.get(key,(err,val)=>{
            if(err){
                reject(err)
                return
            }
            if(val == null){
                resolve(null)
                return
            }

            //是为了兼容json的转换形式
            try{
                resolve(
                    JSON.parse(val)
                )
            }catch(ex){
                resolve(val)
            }
        })
    })

    return promise
}

module.exports={
    get,
    set
}