import Top from '@/components/top.vue';
import songList from '@/components/songList.vue';
import Scroll from '@/components/scroll.vue';

export default {
  data() {
    return {
      formatData: []
    };
  },
  computed: {
    title() {
      if (this.formatData.length > 0) {
        return this.formatData[0].name;
      } else {
        return '暂无数据';
      }
    },
    img() {
      if (this.formatData.length > 0) {
        return this.formatData[0].al.picUrl;
      } else {
        return '';
      }
    }
  },
  components: {
    Top,
    songList,
    Scroll
  }
};
