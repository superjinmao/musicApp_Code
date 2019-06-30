import { playMode } from '../common/js/aliasConfig';

const state = {
  fullScreen: false,
  // 点击播放某首歌曲，将其所属列表全部信息添加进来
  playList: [],
  // 该字段用来存放一开始排列好的列表数据
  sequencesList: [],
  currentIndex: 0,
  // 这样比起用数据 0 1 2 更加语义化
  mode: playMode.sequence,

  // 这里定义的本地存储字段可以理解成是数据中转站

  // 这两者都要进行本地存储，为了在刷新APP的时候数据不会重置, localStorage获取数据，getItem获取的是字符串，所以转为json数据对象
  historyList: JSON.parse(localStorage.getItem('HistoryList')) || [], // 这里相当于去本地存储仓库中去取值,一首歌曲就是一条数据对象
  loveList: JSON.parse(localStorage.getItem('LoveList')) || [],
  // 可以理解成本地存储就是一个仓库，在setItem时定义好了key值，localStorage.setItem(key，value)：将value存储到key字段，取的时候localStorage.getItem(key)通过key值获取
  searchText: JSON.parse(localStorage.getItem('SearchText')) || []
};
export default state;
