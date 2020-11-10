/**
 * 
 * @param {} option 
 * page
 * limit
 * query
 * projection
 * sort
 * model
 * populates
 */
//返回的是promise 所以可以直接用await
module.exports = async (options) => {
    let { page, limit: limit = 2, query: query = {}, projection: projection = "", sort: sort = { _id: -1 }, model, populates } = options
    let list = []
    // const Article = require('../models/article')
    // const author = await Article.findArticles({ _id: req.userInfo._id })
    // console.log(req.userInfo._id)
    // console.log(author)

    const userCount = await model.countDocuments(query)
    //获取并计算总页数
    const totalpages = Math.ceil(userCount / limit)
    //当没有内容时
    if (totalpages == 0) {
        return {
            docs: [],
            list: [],
            totalpages: 0,
            page: 0
        }
    }
    // 获取当前点击页码
    page = parseInt(page)

    //处理页码
    if (isNaN(page)) {
        page = 1
    }
    if (page < 1) {
        page = 1
    }
    if (page > totalpages) {
        page = totalpages
    }

    //计算需要跳过的数据数
    const skip = limit * (page - 1)
    for (var i = 1; i <= totalpages; i++) {
        list.push(i)
    }
    //关联查询处理
    const result = model.find(query, projection)

    if (populates) {
        populates.forEach(populate => {
            result.populate(populate)
        })
    }
    // 获取数据库用户信息
    const docs = await result.sort(sort).skip(skip).limit(limit)
    return {
        docs,
        list,
        totalpages,
        page
    }
}