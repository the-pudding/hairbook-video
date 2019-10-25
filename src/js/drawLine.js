function tweenDashIn() {
  const l = this.getTotalLength()
  const i = d3.interpolateString('0,' + l, l + ',' + l);
  return function(t) { return i(t); };
}

function tweenDashOut() {
  const l = this.getTotalLength()
  const i = d3.interpolateString('0,' + l, l + ',' + l);
  return function(t) { return i(1-t); };
}

function draw(sel) {
  return new Promise((resolve, reject) => {
    console.log(sel)
    resolve()
    // const dirOpacity = (dir == 'in') ? 1 : 0
    // const dirTween = (dir == 'in') ? tweenDashIn : tweenDashOut
    //
    // console.log(dirOpacity, dirTween)
    //
    // sel.transition()
    //   .duration(700)
    //   .ease(d3.easeLinear)
    //   .style('opacity', dirOpacity)
    //   .attrTween('stroke-dasharray', dirTween)
    //   .on('end', resolve)
  });
}

export default { draw };
