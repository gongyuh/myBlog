const { exec } = require('../db/mysql')

//获取表的数据
const getList = (author, keyword) => {
    //先返回假数据（格式是正确的）
    // return [
    //     {
    //         id: 1,
    //         title: '标题A',
    //         content: '内容A',
    //         createTime: 1617154813603,
    //         author: 'zhangsan'
    //     },
    //     {
    //         id: 2,
    //         title: '标题B',
    //         content: '内容B',
    //         createTime: 1617154840538,
    //         author: 'lisi'
    //     }
    // ]
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author = '${author}'`
    }
    if (keyword) {
        sql += `and title like '%&{keyword}%'`
    }
    sql += `order by createtime desc;`

    //返回promise对象
    return exec(sql)
}

const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}'`

    //就算是查询一个元素最后来说也是返回一个数组的形式，让他返回为一个对象的形式
    return exec(sql).then(rows => {
        return rows[0]
    })
}

//如果没有的话，就取一个空对象
const newBlog = (blogData = {}) => {
    //blogData是一个博客对象，包含title content属性
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author
    const createTime = Date.now()

    const sql = `
    insert into blogs (title, content, author, createtime)
    values ('${title}', '${content}', '${author}', ${createTime});
    `

    return exec(sql).then(insertData => {
        console.log('insert', insertData)
        return {
            id: insertData.insertId
        }
    })
}

//更新博客
const updateBlog = (id, blogData = {}) => {
    //id是要更新博客的id
    //blogData是一个博客的对象，包含title content属性
    const title = blogData.title
    const content = blogData.content
    //这这里的id不需要单引号，因为id是Int类型的，需要加上where防止全部更新
    const sql = `
    update blogs set title='${title}', content='${content}' where id='${id}'
    `
    return exec(sql).then(updateData => {
        console.log(updateData)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

//删除博客
const delBlog = (id,author) => {
    //id就是要删除的博客id,在删除的时候需要传入两个参数
    const sql = `
    delete from blogs where id='${id}' and author='${author}';
  `
  return exec(sql).then(delData => {
    if(delData.affectedRows > 0) {
      return true
    } else {
      return false
    }
  })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}
