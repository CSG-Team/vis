function start() {
  waveAnimation();
  setTimeout(() => {
    start();
  }, CFG.animation.waveInterval)
}

// 启动
setTimeout(() => {
  start();
})
let flag = false;

function waveAnimation() {
  ['wavePath0', 'wavePath1', 'wavePath2'].forEach(id => {

    let {
      path_start_angle,
      path_end_angle,
      start_point_x,
      start_point_y,
      end_point_x,
      end_point_y,
      endCurve_up_x,
      endCurve_up_y,
      endCurve_down_x,
      endCurve_down_y,
      positionUp_x,
      positionUp_y,
      positionUpCurve_x,
      positionUpCurve_y,
      positionDown_x,
      positionDown_y,
      offset_x,
      offset_y,
      middle_points: prevMidPoints,
      base_points,
    } = idPathMap.get(id)

    // const offsets = base_points.map((base, index) => {
    //   return {
    //     offset_x:  base.x - prevMidPoints[index].x ,
    //     offset_y:  base.y - prevMidPoints[index].y ,
    //   }
    // })

    // offsets.shift();

    // 生成最新的
    // const waveLineRange = CFG.fans.lineMax - CFG.fans.lineMin;
    // let tempAngle = path_start_angle + preAngle / 5;
    // let randomLineLength = CFG.fans.lineMin + Math.random() * waveLineRange

    // // 中间点
    // const x = center.x + randomLineLength * Math.sin(tempAngle)
    // const y = center.y + randomLineLength * Math.cos(tempAngle)

    // offsets.push({
    //   offset_x: x - base_points[base_points.length - 1].x,
    //   offset_y: y - base_points[base_points.length - 1].y,
    // })

    // 重新组合

    // const factor = flag ? 1 : (-1)


    // console.log('>>>>', offsets)
    // console.log('>>>>', base_points)

    // // 生成几个中间点位置
    // let middle_points = base_points.map((base, index) => {
    //   console.log('+++', base[index])
    //   return {
    //     x: base.x + offsets[index].offset_x,
    //     y: base.y + offsets[index].offset_y
    //   }
    // });


    let middle_points = []
    const everyWaveAngle = Math.PI / 8
    const waveLineRange = CFG.fans.lineMax - CFG.fans.lineMin;
    let tempAngle = path_start_angle + preAngle / 5;
    while (tempAngle < path_end_angle - preAngle / 5) {

      let randomLineLength = CFG.fans.lineMin + Math.random() * waveLineRange

      // 中间点
      const x = center.x + randomLineLength * Math.sin(tempAngle)
      const y = center.y + randomLineLength * Math.cos(tempAngle)
      middle_points.push({
        x: x + offset_x,
        y: y + offset_y
      });
      tempAngle += everyWaveAngle;

    }

    if (middle_points.length % 2 !== 0) {
      middle_points.pop()
      if (middle_points.length < 4) { // 这种情况需要重新生成中间点（小于四个） 要不svg路径报错
        middle_points = [];
        const waveLineRange = CFG.fans.lineMax - CFG.fans.lineMin;
        let start = path_start_angle + preAngle / 6;
        let end = path_end_angle - preAngle / 6

        let perAngle = (end - start) / (flag ? 4 : 7)

        let angle = start;
        let count = 0
        while (count < 4) {
          const randomLineLength = CFG.fans.lineMin + Math.random() * waveLineRange 
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

    // idPathMap.get(id).middle_points = middle_points


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

    d3.select('#' + id)
      .transition()
      .duration(CFG.animation.waveInterval + 200)
      .attr('d', d_path)

    flag = !flag

  })
}