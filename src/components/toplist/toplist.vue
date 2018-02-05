<template>
  <transition name="slide">
    <music-list :title='title' :bgImage='bgImage' :songs='songs'></music-list>
  </transition>
</template>
                           
<script type="text/ecmascript-6">
 import musicList from '../base/music-list'
 import { mapGetters } from 'vuex'
 import { createSong } from '@/common/js/song'
 import { getMusicList } from '@/api/rank'
 export default {
   data(){
     return {
       songs:[]
     }
   },
   components:{
     musicList
   },
   methods:{
     _getMusicList(){
       getMusicList(this.toplist.id).then((res)=>{
         if(res.code === 0){
           this.songs = this.sortTopList(res.songlist);
         }
       })
     },
     sortTopList(list){
       let ret = [];
       list.forEach((item)=>{
         if(item.data.songid && item.data.albummid){
           ret.push(createSong(item.data))
         }
       })
       return ret;
     }
   },
   computed:{
     ...mapGetters([
       'toplist'
     ]),
     title(){
       return this.toplist.topTitle
     },
     bgImage(){
       return this.toplist.picUrl
     }
   },
   created(){
     this._getMusicList();
   }
 }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>