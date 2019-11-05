import pause from './pause';
import typer from './typer';
import slide from './slide';

const $title = d3.selectAll('.intro__hed')
const $byline = d3.selectAll('.intro__byline p')
const lenCalc = 4/100
const $method1 = d3.selectAll('#method1 p')
const $method1_len = $method1.text().length * lenCalc
const $method2 = d3.selectAll('#method2 p')
const $method2_len = $method2.text().length * lenCalc
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

function drawInLines(lineClass) {
	return new Promise((resolve) => {
		const introLineContainer = d3.selectAll(`${lineClass}`)
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

		setTimeout(resolve, 500)
	})
}

function drawOutLines(lineClass) {
	return new Promise((resolve) => {
		const introLineContainer = d3.selectAll(`${lineClass}`)
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

function fadeInColorBlocks(blockClass, del) {
  return new Promise((resolve) => {
    const colorBlocks = d3.selectAll(`${blockClass}`)

    colorBlocks
      .transition()
      .delay((d, i) => i * del)
      .style('opacity', 1)
      .on('end', resolve)
  })
}

function fadeOutColorBlocks(blockClass, del) {
  return new Promise((resolve) => {
    const colorBlocks = d3.selectAll(`${blockClass}`)

    colorBlocks
      .transition()
      .delay((d, i) => i * del)
      .style('opacity', 0)
      .on('end', resolve)
  })
}

function fadeInPhotos() {
  return new Promise((resolve) => {
    const photoImg = d3.selectAll('.photoImg')

    photoImg
      .transition()
      .delay((d, i) => i * 250)
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
	await drawInLines('.intro__lines')
  await fadeInPhotos()
	await pause(0.5)
  await fadeInColorBlocks('.photoColor', 500)
	//await pause(1)
  await typer.reveal($title)
  await typer.reveal($byline)
	await pause(3)
	await fadeOutColorBlocks('.photoColor', 50)
	await fadeOutPhotos()
	await drawOutLines('.intro__lines')
	await pause(0.5)
	await slide({ sel: $title, state: 'exit', early: true })
	await slide({ sel: $byline, state: 'exit', early: true })
	await pause(1)
	await typer.reveal($method1)
	await drawInLines('.frame__lines__1')
	await pause(0.25)
	await fadeInColorBlocks('.frame1Color', 500)
	await pause($method1_len)
	await fadeOutColorBlocks('.frame1Color', 250)
	await drawOutLines('.frame__lines__1')
	await slide({ sel: $method1, state: 'exit', early: true })
	await pause(0.25)
	await typer.reveal($method2)
	await drawInLines('.frame__lines__2')
	await pause(0.25)
	await fadeInColorBlocks('.frame2Color', 500)
	await pause($method2_len)
	await fadeOutColorBlocks('.frame2Color', 250)
	await drawOutLines('.frame__lines__2')
	await slide({ sel: $method2, state: 'exit', early: true })

}

function init() {
  typer.prepare($title);
  typer.prepare($byline);
}

export default { init, run };
