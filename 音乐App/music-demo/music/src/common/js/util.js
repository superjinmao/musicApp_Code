export function formatSongDetail(val) {
  const newVal = [];
  val.forEach((item) => {
    // 注意这里每次遍历都会生成一条数据对象，然后添加到newVal里面
    const detail = {};
    detail.id = item.id;
    // album 专辑的意思
    detail.al = Object.assign({}, item.al || item.album || item.song.album);
    detail.ar = [].concat(item.ar || item.artists || item.song.artists);
    detail.name = item.name;
    newVal.push(detail);
  });
  return newVal;
}
