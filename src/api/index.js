// 将四个模块的请求接口函数统一暴露
import * as trademark from './product/tradeMark'
import * as attr from './product/attr'
import * as spu from './product/spu'
import * as sku from './product/sku'
import * as role from './admin/role'
import * as permission from './admin/permission'
import * as user from './admin/user'

export default {
  trademark,
  attr,
  spu,
  sku,
  user,
  role,
  permission
}
