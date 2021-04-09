const queryString = require('querystring')
const {access} = require('./src/utils/log')
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

//session数据
const SESSION_DATA = {}

//用于处理post data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({});
      return;
    }

    if (req.headers['content-type'] !== 'application/json') {
      resolve({});
      return;
    }

    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(
        JSON.parse(postData)
      )
    })
  })
  return promise
}

//获取cookie的过期时间
const getCookieExpires = ()=>{
  const d = new Date()
  d.setTime(d.getTime() + (24*60*60*1000))
  console.log(d.toGMTString())
  return d.toGMTString()
}

const serverHandle = (req, res) => {
  //记录access log
  access(`
  ${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}
  `)

  //设置返回格式JSON
  res.setHeader('Content-type', 'application/json')
  //获取path
  let url = req.url
  req.path = url.split('?')[0]
  //解析query
  req.query = queryString.parse(url.split('?')[1])

  //解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0]
    const val = arr[1]
    req.cookie[key] = val
  })

  //解析session
  let needSetCookie = false
  let userId = req.cookie.userid
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {}
    }
  } else {
    needSetCookie = true
    userId = Date.now() + '_' + Math.random()
    SESSION_DATA[userId] = {}
  }
  req.session = SESSION_DATA[userId]

  //处理post Data
  getPostData(req).then(postData => {
    req.body = postData
    //处理Blog路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        //需要设置cookie的情况
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }

        res.end(
          JSON.stringify(blogData)
        )
      })
      return
    }

    //处理User路由
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        //需要设置cookie的情况
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }

        res.end(
          JSON.stringify(userData)
        )
      })
      return
    }

    //未命中路由返回404
    res.writeHead(404, { 'Content-type': 'text/plain' })
    res.write('404 not Found!')
    res.end()
  })


};

module.exports = serverHandle