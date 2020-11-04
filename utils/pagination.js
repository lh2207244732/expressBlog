/**
 * 
 * @param {} option 
 * page
 * limit
 * query
 * projection
 * sort
 * model
 */
//返回的是promise 所以可以直接用await
module.exports = async(options) => {
    let { page, limit: limit = 2, query: query = {}, projection: projection = "", sort: sort = { _id: -1 }, model } = options
    let list = []
    const userCount = await model.estimatedDocumentCount()

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
    // 获取数据库用户信息
    const docs = await model.find(query, projection).sort(sort).skip(skip).limit(limit)

    return {
        docs,
        list,
        totalpages,
        page
    }
}