import request from '@/util/request'

export function list () {
  return request({
    url: '/mock/student',
    method: 'get'
  })
}

export function create (data) {
  return request({
    url: '/mock/student/create',
    method: 'post',
    data
  })
}
