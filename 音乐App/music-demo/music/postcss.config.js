module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      // 这里就是页面根节点html的font-size值，我们这里以iPhone6为例，我们的UI设计图也是以iPhone6的750px....
      rootValue: 75,
      // 匹配哪些属性将其 px 值转换成 rem, 匹配所有都转换成rem
      propList: ['*']
    }
  }
};
