// 这里存放一些播放歌曲的公共的方法
import { mapMutations } from 'vuex';

export default {
  methods: {
    ...mapMutations([
      'SET_PLAY_LIST',
      'SET_FULLSCREEN',
      'SET_SEQUENCE_LIST',
      'SET_CURRENT_INDEX',
      'SET_MODE'
    ]),
    addToPlay(item, index) {
      // 首先，点击播放歌曲，会展示全屏播放器，将fullScreen值设置为true
      this.SET_FULLSCREEN(true);
      // 然后将当前歌曲所属的歌单信息全部传递过去，注意是格式化后的数据
      this.SET_PLAY_LIST(this.formatData);
      // 存一份初始排序数据
      this.SET_SEQUENCE_LIST(this.formatData);
      this.SET_CURRENT_INDEX(index); // 传递当前这首歌曲所在歌单的id值
      // 这样当我们点击列表当中的某首歌曲时就会去修改vuex的值，改变后在player.vue中就可以去直接使用这些状态值了
    }
  }
};
