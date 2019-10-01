/**
 * id存储到本地
 * @param id
 * @param key 关键字
 * @param value
 */
export function saveToLocal (id,key,value) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    seller = {}
    seller[id] = {}
  }else {
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  // 将seller数据保存到localStorage
  window.localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal (id,key,def) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    return ref
  }
  seller = JSON.parse(seller)[id]
  if (!seller) {
    return def
  }
  let ret = seller[key]
  return ret || def
}
