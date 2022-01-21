const Mock = require('mockjs')

const data = Mock.mock({
  'items|2': [
    {
      id: '@id',
      name: '@name',
      age: '@natural(18, 25)',
      gender: '@natural(0, 1)'
    }
  ]
})

Mock.mock(/mock\/student/, 'get', (request) => {
  console.debug(data)
  return {
    code: 20000,
    message: '操作成功',
    data: data
  }
})

Mock.mock(/mock\/student\/create/, 'post', (request) => {
  console.debug(request.body)
  data.items.push(JSON.parse(request.body))
  return {
    code: 20100,
    message: '添加成功'
  }
})
