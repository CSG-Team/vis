const container = CFG.container;

const center = {
  x: container.width / 2,
  y: container.height / 2,
}


/** 数据计算下启动位置 */
const preAngle = Math.PI * 2 / data.length;
const startAngle = CFG.startAngle;

const artData = data.filter(item => item.type === '美术学科');
const designData = data.filter(item => item.type === '设计学科');
const humanityData = data.filter(item => item.type === '人文学科');

// 排序
const newData = [
  ...artData,
  ...designData,
  ...humanityData
]

let designCount = designData.length; // 设计统计
let humanityCount = humanityData.length; // 人文统计
let artCount = artData.length; // 美术统计

newData.forEach((d, i) => {
  const sAngle = preAngle * i + startAngle;
  d.startAngle = sAngle;
  const selectDatas = []; // 选修的映射数据
  for (let i = 0; i < Math.floor(d.select / CFG.ball.rate); i += 1) {
    selectDatas.push(0);
  }

  const practiceDatas = []; // 实践的映射数据
  for (let i = 0; i < Math.floor(d.practice / CFG.ball.rate); i += 1) {
    practiceDatas.push(0);
  }

  d.startPosition = {
    x: CFG.innerCircle.r * Math.sin(sAngle) + center.x,
    y: CFG.innerCircle.r * Math.cos(sAngle) + center.y,

  };

  d.textStartPos = {
    x: (CFG.innerCircle.r - CFG.indicator.r - CFG.dataText.offsetX) * Math.sin(sAngle) + center.x,
    y: (CFG.innerCircle.r - CFG.indicator.r - CFG.dataText.offsetY) * Math.cos(sAngle) + center.y,
  }

  d.selectDatas = selectDatas
  d.practiceDatas = practiceDatas
  d.sAngle = sAngle

})


d3.select('body').append('h2')
  .attr('style', `font-size:${CFG.title.fontSize}px;color:#ffffff;text-align:center;padding-top:${CFG.title.top}px;font-family:source-bold`)
  .text('实践教学学分占比&选修课学分占比')

const svg = d3.select('body')
  .append('svg');


// 绘制百分比区域 ===================
// 绘画区域
const tyepData = [{
    zh: '美术学科',
    en: 'ART',
    count: artCount,
    pathId: 'art',
  },
  {
    zh: '设计学科',
    en: 'DESIGN',
    count: designCount,
    pathId: 'design',
  },
  {
    zh: '人文学科',
    en: 'HUMANITY DISCIPLINES',
    count: humanityCount,
    pathId: 'humanity',
  },
]

// 起始角度
let path_start_angle = CFG.startAngle - preAngle / 2 + preAngle / 4;
let arc_start_angle = CFG.startAngle - preAngle / 2
// 弧形路径文字
tyepData.forEach((item, index) => {

  const path_end_angle = path_start_angle + preAngle * item.count - preAngle / 2;
  const arc_end_angle = arc_start_angle + preAngle * item.count;


  // 起始点
  const start_point_x = center.x + CFG.fans.centerOuter * Math.sin(path_start_angle);
  const start_point_y = center.y + CFG.fans.centerOuter * Math.cos(path_start_angle);

  // 对应的结束点
  const end_point_x = center.x + CFG.fans.centerOuter * Math.sin(path_end_angle);
  const end_point_y = center.y + CFG.fans.centerOuter * Math.cos(path_end_angle);

  const endCurve_up_x = center.x + CFG.fans.centerInner * Math.sin(path_start_angle);
  const endCurve_up_y = center.y + CFG.fans.centerInner * Math.cos(path_start_angle);

  const endCurve_down_x = center.x + CFG.fans.centerInner * Math.sin(path_end_angle);
  const endCurve_down_y = center.y + CFG.fans.centerInner * Math.cos(path_end_angle);

  // 边界点 上边界
  const positionUp_x = center.x + CFG.fans.lineMin * Math.sin(path_start_angle)
  const positionUp_y = center.y + CFG.fans.lineMin * Math.cos(path_start_angle)

  const positionUpCurve_x = center.x + CFG.fans.straightLineLength * Math.sin(path_start_angle)
  const positionUpCurve_y = center.y + CFG.fans.straightLineLength * Math.cos(path_start_angle)


  // 下边界
  const positionDown_x = center.x + CFG.fans.lineMin * Math.sin(path_end_angle)
  const positionDown_y = center.y + CFG.fans.lineMin * Math.cos(path_end_angle)

  // const positionDownCurve_x = center.x + CFG.fans.straightLineLength * Math.sin(path_end_angle)
  // const positionDownCurve_y = center.y + CFG.fans.straightLineLength * Math.cos(path_end_angle)

  // 生成几个中间点位置
  let middle_points = [];
  const waveLineRange = CFG.fans.lineMax - CFG.fans.lineMin;
  let tempAngle = path_start_angle + preAngle / 5;

  while (tempAngle < path_end_angle - preAngle / 5) {

    const randomLineLength = CFG.fans.lineMin + Math.random() * waveLineRange;
    // 中间点
    const x = center.x + randomLineLength * Math.sin(tempAngle)
    const y = center.y + randomLineLength * Math.cos(tempAngle)
    middle_points.push({
      x,
      y
    });
    tempAngle += CFG.fans.everyWaveAngle;

  }

  if (middle_points.length % 2 !== 0) {
    middle_points.pop()
    if (middle_points.length < 4) { // 这种情况需要重新生成中间点（小于四个） 要不svg路径报错
      middle_points = [];
      const waveLineRange = CFG.fans.lineMax - CFG.fans.lineMin;
      let start = path_start_angle + preAngle / 6;
      let end = path_end_angle - preAngle / 6

      let perAngle = (end - start) / 4

      let angle = start;
      let count = 0
      while (count < 4) {
        const randomLineLength = CFG.fans.lineMin + Math.random() * waveLineRange;
        // 中间点
        const x = center.x + randomLineLength * Math.sin(angle)
        const y = center.y + randomLineLength * Math.cos(angle)
        middle_points.push({
          x,
          y
        });
        angle += perAngle;
        count += 1
      }
    }
  }


  // 生成波浪控制点
  const points_c = middle_points.slice(0, 2);
  const points_s = middle_points.slice(2, -1);
  const cmd_c = '' + points_c.map(item => ` ${item.x} ${item.y}`).join(',')
  const cmd_s = 'S ' + points_s.map(item => ` ${item.x} ${item.y}`).join(',')
  const waveLine = `${cmd_c} ${cmd_s}`;
  const d_path = `
    M${start_point_x} ${start_point_y} 
    L${positionUp_x} ${positionUp_y} 
    C${positionUpCurve_x} ${positionUpCurve_y} 
    ${waveLine},
    ${positionDown_x} ${positionDown_y}, 
    L${positionDown_x} ${positionDown_y} 
    L${end_point_x} ${end_point_y}
    M${end_point_x} ${end_point_y}
    C${endCurve_down_x} ${endCurve_down_y} ${endCurve_up_x} ${endCurve_up_y} ${start_point_x} ${start_point_y}
    `;

  // 计算偏移
  const middle_angle = (path_end_angle + path_start_angle) / 2;
  const offset_x = CFG.fans.offset * Math.sin(middle_angle);
  const offset_y = CFG.fans.offset * Math.cos(middle_angle);



  svg.append('path')
    .attr('d', d_path)
    .attr('class', 'path_art_' + index)
    .attr('style', `fill:url(#${item.pathId}Grad)`)
    .style('transform', `translate(${offset_x}px, ${offset_y}px)`)




  // arcAngle = arcAngle + ((item.count - 1) / newData.length) * Math.PI * 2
  arcEndX = CFG.typeCircle.r * Math.sin(arc_start_angle) + center.x;
  arcEndY = CFG.typeCircle.r * Math.cos(arc_start_angle) + center.y;
  arcStartX = CFG.typeCircle.r * Math.sin(arc_end_angle) + center.x;
  arcStartY = CFG.typeCircle.r * Math.cos(arc_end_angle) + center.y

  svg.append('path')
    .attr('d', `m${arcStartX} ${arcStartY} A${CFG.typeCircle.r},${CFG.typeCircle.r} 0 0,1 ${arcEndX},${arcEndY}`)
    .attr('id', item.pathId)
    .attr('stroke', '#ffffff')
    .attr('stroke-opacity', '0.6')
    .attr('fill-opacity', 0)

  svg.append('text').append('textPath')
    .attr('xlink:href', `#${item.pathId}`)
    .attr('text-anchor', 'middle')
    .attr('startOffset', '50%')
    .attr('fill', '#ffffff')
    .append('tspan')
    .attr('dy', -CFG.typeCircle.outTextL)
    .attr('font-size', CFG.typeCircle.outTextSize)
    .attr('font-family', 'source-bold')
    .text(item.zh)

  svg.append('text').append('textPath')
    .attr('xlink:href', `#${item.pathId}`)
    .attr('text-anchor', 'middle')
    .attr('startOffset', '50%')
    .attr('fill', '#ffffff')
    .append('tspan')
    .attr('dy', CFG.typeCircle.innerTextL)
    .attr('font-size', CFG.typeCircle.innerTextSize)
    .attr('font-family', 'source-regular')
    .text(item.en)

  path_start_angle = path_end_angle + preAngle / 2
  arc_start_angle = arc_end_angle

});

// 添加渐变
const artGrad = svg.append('defs')
  .append('linearGradient')
  .attr('x1', '0%').attr('y1', '100%').attr('x2', '0%').attr('y2', '0%')
  .attr('id', 'artGrad')
artGrad.append('stop')
  .attr('offset', '0%')
  .attr('style', 'stop-color:#085158;stop-opacity:50%')
artGrad.append('stop')
  .attr('offset', '100%')
  .attr('style', 'stop-color:#ffffff;stop-opacity:5%')

const designGrad = svg.append('defs').append('linearGradient')
  .attr('id', 'designGrad')
  .attr('x1', '100%').attr('y1', '0%').attr('x2', '0%').attr('y2', '0%')
designGrad.append('stop')
  .attr('offset', '0%')
  .attr('style', 'stop-color:#00A93A;stop-opacity:50%')
designGrad.append('stop')
  .attr('offset', '100%')
  .attr('style', 'stop-color:#ffffff;stop-opacity:5%')

const humanityGrad = svg.append('defs').append('linearGradient')
  .attr('id', 'humanityGrad')
  .attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%')
humanityGrad.append('stop')
  .attr('offset', '0%')
  .attr('style', 'stop-color:#085158;stop-opacity:50%')
humanityGrad.append('stop')
  .attr('offset', '100%')
  .attr('style', 'stop-color:#ffffff;stop-opacity:5%')



// ===================





svg
  .attr('width', `${container.width}px`)
  .attr('height', `${container.height}px`)
  .style('max-width', `${container.width}px`)
  .style('background-color', CFG.container.background)
  .style('font', CFG.container.font);


// 辅助圆形
svg.append('circle')
  .attr('r', CFG.outerCircle.r)
  .attr('stroke', CFG.outerCircle.strokeColor)
  .attr('stroke-opacity', CFG.outerCircle.opacity)
  .attr('fill-opacity', 0)
  .attr('cx', center.x)
  .attr('cy', center.y)

svg.append('circle')
  .attr('r', CFG.innerCircle.r)
  .attr('stroke', CFG.innerCircle.strokeColor)
  .attr('stroke-opacity', CFG.outerCircle.opacity)
  .attr('fill-opacity', 0)
  .attr('cx', center.x)
  .attr('cy', center.y)



//添加分组 
const groups = svg.selectAll('.indicator_circle')
  .data(newData)
  .enter().append('g')

// 绘制指示器
groups.append('circle')
  .attr('class', 'indicator_circle')
  .attr('r', CFG.indicator.r)
  .attr('cx', d => {
    return d.startPosition.x
  })
  .attr('cy', d => {
    return d.startPosition.y
  })
  .attr('fill', CFG.indicator.fill)
  .attr('fill-opacity', CFG.indicator.opacity)
  .attr('style', `-webkit-filter:blur(${CFG.indicator.blur}px);filter: blur(${CFG.indicator.blur}px)`)

// 隐藏的辅助矩形
// 用来hover
const rect_height = 20
groups.append('rect')
  .attr('x', d => {
    return d.startPosition.x
  })
  .attr('y', d => {
    return d.startPosition.y - rect_height / 2
  })
  .attr('width', d => {

    const length = Math.max(d.practiceDatas.length, d.selectDatas.length)
    return length * (CFG.ball.size_min + CFG.ball.offset_everyTwoBalls);
  })
  .attr('height', d => {
    return rect_height;
  })
  .attr('fill', 'white')
  .attr('opacity', 0)
  .style('transform', d => {
    return `rotate(${-d.sAngle + Math.PI / 2}rad)`
  })
  .style('transform-origin', d => {
    return `${d.startPosition.x}px ${d.startPosition.y}px`
  })



// 绘制label文字路径（文字向圆心需要）
groups.append('path')
  .attr('d', d => {
    const cr = CFG.innerCircle.r - (CFG.indicator.r + 2 * CFG.indicator.blur)
    const startX = cr * Math.sin(d.sAngle) + center.x
    const startY = cr * Math.cos(d.sAngle) + center.y
    if (d.sAngle >= 0 && d.sAngle <= Math.PI) {
      return `M ${center.x} ${center.y} L ${startX} ${startY}`
    }
    return `M ${startX} ${startY} L ${center.x} ${center.y}`
  })
  .attr('id', (d, i) => `lable${i}`)

groups.append('text').append('textPath')
  .attr('xlink:href', (d, i) => `#lable${i}`)
  .attr('fill', CFG.dataText.fill)
  .attr('startOffset', d => {
    if (d.sAngle >= 0 && d.sAngle <= Math.PI) {
      return '100%'
    }
    return '0%'
  })
  .attr('text-anchor', d => {
    if (d.sAngle >= 0 && d.sAngle <= Math.PI) {
      return 'end'
    }
    return 'start'
  })
  .attr('fill-opacity', CFG.dataText.opacity)
  .append('tspan')
  .attr('dy', CFG.dataText.fontSize / 2)
  .attr('font-size', CFG.dataText.fontSize)
  .attr('font-family', 'source-regular')
  .attr('stroke-width', 0.2)
  .attr('stroke-opacity', 0)
  .text(d => d.name)
  .attr('class', 'text_label')



groups.on('mouseenter', e => {
  const {
    target
  } = e;
  if (!target) return;
  const elem = d3.select(target)
  d3.selectAll('.text_label')
    .attr('font-size', CFG.dataText.fontSize)
    .attr('stroke-opacity', 0)
    .attr('fill-opacity', CFG.dataText.opacity)


  d3.selectAll('.text_value')
    .attr('opacity', 0)
  elem.select('.text_label')
    .transition()
    .duration(200)
    .attr('font-size', CFG.dataText.fontSize + CFG.dataText.biggerSize)
    // .attr('font-weight', 900)
    .attr('stroke-opacity', 1)
    .attr('fill-opacity', 1)


  elem.selectAll('.text_value')
    .transition()
    .duration(200)
    .attr('opacity', 1)
})
groups.on('mouseleave', e => {
  const {
    target
  } = e;
  if (!target) return;
  const elem = d3.select(target)

  elem.select('.text_label')
    .attr('font-size', CFG.dataText.fontSize)
    .attr('stroke-opacity', 0)
    .attr('fill-opacity', CFG.dataText.opacity)

  elem.selectAll('.text_value')
    .attr('opacity', 0)
})



const offsetStart = CFG.ball.offset_betweenStartPosition;
const offsetEvery = CFG.ball.offset_everyTwoBalls;
const betweenBarsOffset = CFG.ball.offset_betweenBars;

newData.forEach((d, i) => {
  const {
    startPosition,
    sAngle,
    selectDatas,
    practiceDatas,

  } = d;

  const ball_size_max = CFG.ball.size_max;
  const ball_size_min = CFG.ball.size_min;

  // 定义一个衰减尺度
  const scale_select = d3.scaleSqrt()
    .domain([0, selectDatas.length])
    .range([ball_size_min, ball_size_max]);



  const offsetStartX = offsetStart * Math.sin(sAngle)
  const offsetStartY = offsetStart * Math.cos(sAngle)

  const offsetEveryX = offsetEvery * Math.sin(sAngle)
  const offsetEveryY = offsetEvery * Math.cos(sAngle)




  // 选修相关
  const select_off_angle = Math.PI / 2 + sAngle;
  const select_start_x = startPosition.x + Math.sin(select_off_angle) * betweenBarsOffset;
  const select_start_y = startPosition.y + Math.cos(select_off_angle) * betweenBarsOffset;

  const gradient_select = new gradientColor('#f6a9af', '#ff879d', selectDatas.length)

  const gSelect = svg
    .selectAll(`.select_${i}`)
    .data(selectDatas)
    .enter().append('g')

  gSelect
    .append('circle')
    // .attr('class', `.select_${i}`)
    .attr('r', (d, i) => {
      return scale_select(selectDatas.length - i)
    })
    .attr('cx', (d, i) => {

      return select_start_x + offsetStartX + offsetEveryX * i
    })
    .attr('cy', (d, i) => {
      return select_start_y + offsetStartY + offsetEveryY * i
    })
    .attr('fill', (d, i) => {
      return gradient_select[i]
    })

  // 实践相关
  const practice_off_angle = Math.PI + select_off_angle;
  const practice_start_x = startPosition.x + Math.sin(practice_off_angle) * betweenBarsOffset;
  const practice_start_y = startPosition.y + Math.cos(practice_off_angle) * betweenBarsOffset;


  const gradient_practice = new gradientColor('#d0fefb', '#00de27', practiceDatas.length)

  // 定义一个衰减尺度
  const scale_practice = d3.scaleSqrt()
    .domain([0, practiceDatas.length])
    .range([ball_size_min, ball_size_max]);

  const gPractice = svg
    .selectAll(`.practice_${i}`)
    .data(practiceDatas)
    .enter().append('g')

  gPractice
    .append('circle')
    // .attr('class', 'indicator_circle')
    .attr('r', (d, i) => {
      return scale_practice(practiceDatas.length - i)
    })
    .attr('cx', (d, i) => {

      return practice_start_x + offsetStartX + offsetEveryX * i
    })
    .attr('cy', (d, i) => {
      return practice_start_y + offsetStartY + offsetEveryY * i
    })
    .attr('fill', (d, i) => {
      return gradient_practice[i]
    })

});


//绘制实践分数数值
// 绘制实践垂直放射线的路径
groups.append('path')
  .attr('d', d => {
    const sAngle = d.sAngle
    const practice_off_angle = Math.PI + Math.PI / 2 + sAngle;
    const practice_start_x = d.startPosition.x + Math.sin(practice_off_angle) * betweenBarsOffset;
    const offsetStartX = offsetStart * Math.sin(sAngle)
    const offsetEveryX = offsetEvery * Math.sin(sAngle)
    const practice_start_y = d.startPosition.y + Math.cos(practice_off_angle) * betweenBarsOffset;
    const offsetStartY = offsetStart * Math.cos(sAngle)
    const offsetEveryY = offsetEvery * Math.cos(sAngle)
    const x = practice_start_x + offsetStartX + offsetEveryX * (d.practiceDatas.length + 1)
    const y = practice_start_y + offsetStartY + offsetEveryY * (d.practiceDatas.length + 1)
    const cl = 8 * CFG.indicator.r
    const cx1 = x - cl * Math.cos(sAngle);
    const cy1 = y + cl * Math.sin(sAngle);
    const cx2 = x + cl * Math.cos(sAngle);
    const cy2 = y - cl * Math.sin(sAngle);
    if (d.sAngle >= Math.PI / 2 && d.sAngle <= Math.PI * 3 / 2) {
      return `M ${cx2} ${cy2} L ${cx1} ${cy1}`
    }
    return `M ${cx1} ${cy1} L ${cx2} ${cy2}`
  })
  .attr('id', (d, i) => `practice${i}`)

groups.append('text').append('textPath')
  .attr('xlink:href', (d, i) => `#practice${i}`)
  .attr('text-anchor', 'middle')
  .attr('startOffset', '50%')
  .attr('fill', CFG.value.fill)
  .attr('font-size', CFG.value.fontSize)
  .attr('font-family', 'source-bold')
  .text(d => d.practice)
  .attr('class', 'text_value')
  .attr('opacity', 0)



//绘制选修分数数值
groups.append('path')
  .attr('d', d => {
    const sAngle = d.sAngle
    const select_off_angle = Math.PI / 2 + sAngle;
    const select_start_x = d.startPosition.x + Math.sin(select_off_angle) * betweenBarsOffset;
    const offsetStartX = offsetStart * Math.sin(sAngle)
    const offsetEveryX = offsetEvery * Math.sin(sAngle)
    const select_start_y = d.startPosition.y + Math.cos(select_off_angle) * betweenBarsOffset;
    const offsetStartY = offsetStart * Math.cos(sAngle)
    const offsetEveryY = offsetEvery * Math.cos(sAngle)
    const x = select_start_x + offsetStartX + offsetEveryX * (d.selectDatas.length + 1)
    const y = select_start_y + offsetStartY + offsetEveryY * (d.selectDatas.length + 1)
    const cl = 8 * CFG.indicator.r
    const cx1 = x - cl * Math.cos(sAngle);
    const cy1 = y + cl * Math.sin(sAngle);
    const cx2 = x + cl * Math.cos(sAngle);
    const cy2 = y - cl * Math.sin(sAngle);
    if (d.sAngle >= Math.PI / 2 && d.sAngle <= Math.PI * 3 / 2) {
      return `M ${cx2} ${cy2} L ${cx1} ${cy1}`
    }
    return `M ${cx1} ${cy1} L ${cx2} ${cy2}`
  })
  .attr('id', (d, i) => `elect${i}`)

groups.append('text').append('textPath')
  .attr('xlink:href', (d, i) => `#elect${i}`)
  .attr('text-anchor', 'middle')
  .attr('startOffset', '50%')
  .attr('fill', CFG.value.fill)
  .attr('font-size', CFG.value.fontSize)
  .attr('font-family', 'source-bold')
  .text(d => d.select)
  .attr('class', 'text_value')
  .attr('opacity', 0)


d3.select('body')
  .append('div')
  .attr('style', `width:${CFG.legend.width}px;margin:0 auto`)
  .append('img')
  .attr('src', './asserts/legend.png')
  .attr('width', '100%')