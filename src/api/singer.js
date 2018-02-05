import jsonp from '../common/js/jsonp'
import {commonParams,options} from './config'

// 获取歌手信息的方法
export function getSingerList() {
  const url = `https://szc.y.qq.com/v8/fcg-bin/v8.fcg`;
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    pagenum: 1,
    pagesize: 100,
    hostUin: 0,
    key: 'all_all_all',
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 5381
  })
  return jsonp(url ,data, options);
}

// 获取歌手歌曲列表的方法 
export function getSong(sid){
  const url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg`;
  const data = Object.assign({}, commonParams, {
    hostUin:0,
    needNewCode:0,
    platform:'yqq',
    order: 'listen',
    begin:0,
    num:100 ,
    songstatus: 1,
    g_tk:5381,
    singermid: sid  
  });
  return jsonp(url, data, options);
}
