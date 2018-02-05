// 封装的方法用来获取设置 data-* 自定义属性
export function getAttr(elem, dataName, val){
  // elem - DOM元素, dataName - 属性名  val - 属性值
  dataName = 'data-' + dataName;
  if(val){
    return elem.setAttribute(dataName,val);
  }else{
    return elem.getAttribute(dataName);
  }
}
