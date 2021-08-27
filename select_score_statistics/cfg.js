const R = 140
const CFG = {
  animation:{
    waveInterval: 2500, // 动画循环的时间
  },

  container: {
    width: window.innerWidth,
    height: window.innerHeight,
    background: 'black',
    font: '12px sans-serif'
  },

  // fans扇形分布情况
  fans: {
    centerInner: R * 0.06, // 绘制圆心弧度的参数
    centerOuter: R * 0.25,
    straightLineLength: R * 2, // 直线部分的长度
    everyWaveAngle: Math.PI / 8, // 每30度一个波动
    lineMax: R * 2.22, // 最远距离
    lineMin: R * 1.89, // 最近距离
    offset: R * 0.028, // 向外偏移
  },

  // 内部圆形环
  innerCircle: {
    r: R,
    strokeColor: '#ffffff',
    opacity: 0.6,
  },

  outerCircle: {
    r: R * 1.785,
    strokeColor: '#ffffff',
    opacity: 0.6,
  },

  // 起始角度
  startAngle: -(15 / 360) * Math.PI * 2,

  // 指示器
  indicator: {
    r: R / 38,
    fill: '#ffffff',
    opacity: 0.9,
    blur: R / 168 //模糊半径
  },

  // 数据的文字label
  dataText: {
    offsetX: 2,
    offsetY: 8,
    fill: '#ffffff',
    fontSize: R / 30,
    opacity: 0.8,
    biggerSize: 1.5, // 放大size
  },

  ball: {
    size_min: R / 333,
    size_max: R / 83,
    rate: 3, // 真实数据 与 一列圆点个数的比例 
    offset_betweenStartPosition: R / 15, // 小圆点开始画和起始点的偏移
    offset_everyTwoBalls: R / 28, // 每一个列中小圆点的间距
    offset_betweenBars: R / 40, // 每一组圆点，两列小圆点的对称的距离
  },
  // 数值
  value: {
    fontSize: R / 18.2,
    fill: '#ffffff'
  },
  // 分类内圈文字
  typeCircle: {
    r: R / 1.8,
    outTextSize: R / 10, //外圈文字大小
    outTextL: R / 32,//外圈文字离基准线距离
    innerTextSize: R / 15, //内圈文字大小
    innerTextL: R / 12,//内圈文字离基准线距离
  },
  legend: {
    width: 8.2 * R
  },
  title: {
    fontSize: R / 2.9,
    top: R / 2,
    content: '实践教学学分占比&选修课学分占比'
  }



}