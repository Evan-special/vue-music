<template>
  <div class='singer-detail'>
    <music-list :songs='songs' :title='singer.name' :bg-image='singer.headImage'></music-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSong } from "@/api/singer";
import { createSong } from "../../common/js/song";
import musicList from "../base/music-list";
export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters(["singer"])
  },
  created() {
    this._getSong();
  },
  methods: {
    _getSong() {
      //判断 没有没 singer.id  没有就返回
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSong(this.singer.id).then(res => {
        if (res.code === 0) {
          this.songs = this.sortSong(res.data.list);
        }
      });
    },
    sortSong(list) {
      let ret = [];
      list.forEach(item => {
        // 只需要 musicData 里的数据
        let { musicData } = item;
        // 判断 songid  和 albummid 必须有
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  components: {
    musicList
  }
};
</script>

<style scoped lang="stylus">
@import '../../common/styles/variable';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}
</style>