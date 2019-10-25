import pause from './pause';
import typer from './typer';
import slide from './slide';

const $title = d3.selectAll('.intro__hed')
const $byline = d3.selectAll('.intro__byline p')
const $method1 = d3.selectAll('#method1 p')
const $method2 = d3.selectAll('#method2 p')
const $sections = d3.selectAll('section')

// helper functions
function hideShowSection() {
	$sections.style('display', 'none')
	d3.selectAll('#intro').style('display', 'flex')
}

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

function drawInLines() {
	return new Promise((resolve) => {
		const introLineContainer = d3.selectAll(`.intro__lines`)
    const introLines = introLineContainer.selectAll('.st0')
    const lineNodes = introLines._groups[0]

    lineNodes.forEach.call(lineNodes, function(path) {
      introLines
        .transition()
        .delay((d) => Math.random() * Math.random(500))
        .duration(1000)
        .ease(d3.easeLinear)
				.style('opacity', 1)
        .attrTween('stroke-dasharray', tweenDashIn)
    })

		setTimeout(resolve, 200)
	})
}

function drawOutLines() {
	return new Promise((resolve) => {
		const introLineContainer = d3.selectAll(`.intro__lines`)
    const introLines = introLineContainer.selectAll('.st0')
    const lineNodes = introLines._groups[0]

    lineNodes.forEach.call(lineNodes, function(path) {
      introLines
        .transition()
        .delay((d) => Math.random() * Math.random(500))
        .duration(500)
        .ease(d3.easeLinear)
				.style('opacity', 1)
        .attrTween('stroke-dasharray', tweenDashOut)
    })

		setTimeout(resolve, 200)
	})
}

function fadeInColorBlocks() {
  return new Promise((resolve) => {
    const colorBlocks = d3.selectAll('.photoColor')

    colorBlocks
      .transition()
      .delay((d, i) => i * 150)
      .style('opacity', 1)
      .on('end', resolve)
  })
}

function fadeOutColorBlocks() {
  return new Promise((resolve) => {
    const colorBlocks = d3.selectAll('.photoColor')

    colorBlocks
      .transition()
      .delay((d, i) => i * 50)
      .style('opacity', 0)
      .on('end', resolve)
  })
}

function fadeInPhotos() {
  return new Promise((resolve) => {
    const photoImg = d3.selectAll('.photoImg')

    photoImg
      .transition()
      .delay((d, i) => i * 150)
      .style('opacity', 1)
      .on('end', resolve)
  })
}

function fadeOutPhotos() {
  return new Promise((resolve) => {
    const photoImg = d3.selectAll('.photoImg')

    photoImg
      .transition()
      .delay((d, i) => i * 50)
      .style('opacity', 0)
      .on('end', resolve)
  })
}

async function run() {
	await hideShowSection()
	await typer.prepare($title)
  await typer.prepare($byline)
	await typer.prepare($method1)
  await typer.prepare($method2)
	await pause(3)
	await drawInLines()
  await fadeInPhotos()
	await pause(0.5)
  await fadeInColorBlocks()
	await pause(1)
  await typer.reveal($title)
  await typer.reveal($byline)
	await pause(3)
	await fadeOutColorBlocks()
	await fadeOutPhotos()
	await drawOutLines()
	await pause(0.5)
	await slide({ sel: $title, state: 'exit', early: true })
	await slide({ sel: $byline, state: 'exit', early: true })
	await pause(1)
	await typer.reveal($method1)
	await pause(3.5)
	await slide({ sel: $method1, state: 'exit', early: true })
	await typer.reveal($method2)
	await pause(3.5)
	await slide({ sel: $method2, state: 'exit', early: true })

}

function init() {
  typer.prepare($title);
  typer.prepare($byline);
}

export default { init, run };
