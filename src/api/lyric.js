import {
  commonParams,
  options
} from './config'
import axios from 'axios';
export function getLyric(mid) {
  const url = '/api/lyric';
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: 1515552002212,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 5381,
    format: 'json'
  });
  // 返回一个 promise 对象 
  return axios.get(url,{
    params: data
  }).then((res)=>{
     return Promise.resolve(res.data);
  })
}
