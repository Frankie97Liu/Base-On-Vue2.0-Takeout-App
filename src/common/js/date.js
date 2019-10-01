export function formatDate(date,fmt) {
  if (/(y+)/.test(fmt)) {
    //匹配yyyy
    fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substring(4-RegExp.$1.length))
  }
  let o = {
    'M+':date.getMonth() + 1,
    'D+':date.getDay(),
    'd+':date.getDay(),
    'h+':date.getHours(),
    'm+':date.getMinutes(),
    's+':date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str))
    }
  }
  return fmt
}

//在str前面补零
function padLeftZero (str) {
  return ('00'+ str).substring(str.length)
}
