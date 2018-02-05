<template>
  <transition name="slide">
    <music-list :title='title' :bgImage='bgImage' :songs='songs'></music-list>
  </transition>
</template>
                           
<script type="text/ecmascript-6">
 import musicList from '../base/music-list'
 import { mapGetters } from 'vuex'
 import { createSong } from '@/common/js/song'
 import { getDiscList } from '@/api/recommend'
 export default {
    data(){
      return {
        songs:[]
      }
    },
    components:{
      musicList,
    },
    computed:{
      ...mapGetters([
        'discItem'
      ]),
      title(){
        return this.discItem.dissname;
      },
      bgImage(){
        return this.discItem.imgurl;
      }
    },
    methods:{
      _getDiscList(){
        if(!this.discItem.dissid){
          this.$router.push('/recommend')
        }
        getDiscList(this.discItem.dissid).then((res)=>{
          if(res.code === 0){
            this.songs = this.sortDisc(res.cdlist[0].songlist);
          }
        })
      },
      sortDisc(list){
        let ret = [];
        list.forEach((item)=>{
          if(item.songid && item.albummid){
            ret.push(createSong(item));
          }
        })
        return ret;
      }
    },
    created(){
      this._getDiscList();
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>