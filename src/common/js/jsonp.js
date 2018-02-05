import jsonpCode from 'jsonp';

export default function jsonp(url, data, option){
  url+='?'+param(data);
  return new Promise((resolve,reject)=>{
    jsonpCode(url,option,(err,data)=>{
      if(!err){
        resolve(data)
      }else{
        reject(err)
      }
    })
  })
}
function param(data){
  let url = '';
  for(let key in data){
    let value = data[key]!=undefined ? data[key]:'';
    url += '&' + key + '=' + value;
  }
  return url ? url.substring(1) : ''
} 