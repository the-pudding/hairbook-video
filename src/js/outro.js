import pause from './pause';
import typer from './typer';
import slide from './slide';

const $sections = d3.selectAll('section')
const $outro1 = d3.selectAll('#outro1 p')
const $outro2 = d3.selectAll('#outro2 p')

// helper functions
function hideShowSection() {
	$sections.style('display', 'none')
	d3.selectAll('#outro').style('display', 'flex')
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

		setTimeout(resolve, 200)
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

async function run() {
	await hideShowSection()
	await typer.prepare($outro1)
  await typer.prepare($outro2)
	await pause(1)
	await typer.reveal($outro1)
	await drawInLines('.frame__lines__2')
	await pause(0.5)
	await fadeInColorBlocks('.frame2Color', 500)
	await pause(3.5)
	await drawOutLines('.frame__lines__2')
	await fadeOutColorBlocks('.frame2Color', 50)
	await slide({ sel: $outro1, state: 'exit', early: true })
	await pause(1)
	await typer.reveal($outro2)
	await drawInLines('.frame__lines__1')
	await pause(0.5)
	await fadeInColorBlocks('.frame1Color', 500)
	await pause(3.5)
	await drawOutLines('.frame__lines__1')
	await fadeOutColorBlocks('.frame1Color', 50)
	await slide({ sel: $outro2, state: 'exit', early: true })
}

function init() {
  typer.prepare($title);
  typer.prepare($byline);
}

export default { init, run };
