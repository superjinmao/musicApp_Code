const getters = {
  fullScreen(state) {
    return state.fullScreen;
  },
  playList(state) {
    return state.playList;
  },
  sequenceList(state) {
    return state.sequenceList;
  },
  currentIndex(state) {
    return state.currentIndex;
  },
  mode(state) {
    return state.mode;
  },
  // 当前播放歌曲的信息
  currentSong(state) {
    // 通过下标拿到当前播放歌曲的数据对象
    return state.playList[state.currentIndex];
  },
  // 通过vuex中的计算属性 getters 实时计算获取一个判断（状态）值，用于确定当前歌曲是否已经被收藏，进而确定样式是否变红，变红为收藏
  isLove(state) {
    let isLove = false; // 上来默认为false
    // 先获取到当前播放歌曲currentSong
    const currentSong = state.playList[state.currentIndex];
    // 遍历整个loveList收藏列表
    for (let i = 0; i < state.loveList.length; i += 1) {
      if (currentSong && state.loveList[i].id === currentSong.id) { // 如果当前播放歌曲的id 和 遍历收藏列表中的歌曲id相同，意味着已经被收藏过
        // 已经被收藏过，那么将标识收藏的字段值改为true并返回
        isLove = true;
      }
    }
    // 如果遍历
    return isLove;
  },
  searchText(state) {
    return state.searchText;
  },
  historyList(state) {
    // 将本地储存的播放历史通过计算属性的形式返回
    return state.historyList;
  },
  loveList(state) {
    // 将本地储存的收藏歌曲通过计算属性的形式返回
    return state.loveList;
  }
};
export default getters;
