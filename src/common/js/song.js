import { getLyric } from '../../api/lyric'
import { Base64 } from 'js-base64';
// 封装的是获取歌曲信息的一个类
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id,
      this.mid = mid,
      this.singer = singer,
      this.name = name,
      this.album = album,
      this.duration = duration,
      this.image = image,
      this.url = url
  };
  _getLyric(){
    if(this.lyric){ // 如果有歌词
      return Promise.resolve(this.lyric);
    }
    // 返回 Promise 对象
    return new Promise((resolve,reject)=>{
      // 调用 getLyric 获取歌词 
      getLyric(this.mid).then((res)=>{
        if(res.code === 0){
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        }else{
          reject("lyric is not defined");
        }
      })
    })
  }
}
// 创建一个工厂方法 
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=38`
  })
}
// 对 singer 进行处理, 这个歌手名可能两个以上  

function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return '';
  }
  singer.forEach((item) => {
    ret.push(item.name);
  });
  return ret.join("/");
}
