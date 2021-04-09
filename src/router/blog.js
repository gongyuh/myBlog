const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

//统一的登陆验证函数
const loginCheck = (req)=>{
    if(!req.session.username){
        return Promise.resolve(
            new ErrorModel('尚未登陆')
        )
    }
}

const handleBlogRouter = (req, res) => {
    //获取方法
    const method = req.method;
    const id = req.query.id;
    //获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    //获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }
    //新建博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        //登陆验证
        let loginCheckResult = login(req)
        if(loginCheckResult){
            //未登陆
            return loginCheck
        }

        req.body.author = req.session.username  
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }
    //更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        //登陆验证
        let loginCheckResult = login(req)
        if(loginCheckResult){
            //未登陆
            return loginCheck
        }

        const result = updateBlog(id, req.body)
        //result是promise的文件形式
        return result.then(val=>{
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel('更新博客失败')
            }
        })
    }
    //删除博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        //登陆验证
        let loginCheckResult = login(req)
        if(loginCheckResult){
            //未登陆
            return loginCheck
        }

        const author = req.session.username 
        const result = delBlog(id, author)
        return result.then(val => {
          if(val) {
            return new SuccessModel()
          } else {
            return new ErrorModel('删除失败')
          }
        })
    }
}

module.exports = handleBlogRouter