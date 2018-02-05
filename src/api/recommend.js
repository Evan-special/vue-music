import jsonp from '../common/js/jsonp'
import axios from 'axios'
import {
  commonParams,
  options
} from './config'
export function getRecommend() {
  // 配置 url 
  const url = `https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg`;
  // 配置 data 公共参数 , 自有参数
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  });
  return jsonp(url, data, options);
}

export function getPlaylist() {
  const url = '/api/playlist'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {
    params: data,
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}

export function getDiscList(dissid) {
  const url = '/api/discList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    disstid: dissid,
    needNewCode: 0,
    format: 'json',
    g_tk: 5381,
    json: 1,
    type: 1,
    utf8: 1,
    onlysong: 0
  })
  return axios.get(url, {
    params: data,
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}
