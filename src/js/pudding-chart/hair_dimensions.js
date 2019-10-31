import pause from '../pause';
import typer from '../typer';
import slide from '../slide';
/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.puddingHairDimensions = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 20;
		const marginBottom = 20;
		const marginLeft = 20;
		const marginRight = 0;
		const dimensions = [1, 2, 3, 4];
		let timer = null;
		let counterCurr = 0;
		let counterNext = counterCurr + 1;

		// dom elements
		let $photoContainer = null;
		let $dimImg = null;
		const $hair_dimensions_section = d3.selectAll('#hair_dimensions')
		const $dimText1 = $hair_dimensions_section.select('#dimText1 p');
		const $dimText2 = $hair_dimensions_section.select('#dimText2 p');
		const $sections = d3.selectAll('section')

		// animation functions
		function hideShowSection() {
			$sections.style('display', 'none')
			d3.selectAll('#hair_dimensions').style('display', 'flex')
		}

		async function dimensionSequence(dimension) {
			await fadeInText(dimension)
			await drawInLines(dimension)
			await advanceDimPhoto(dimension)
		}
		async function removeDimensionSequence(dimension) {
			await removeBlocks(dimension)
		}

		function removeBlocks(dimension) {
			fadeOutLines(dimension)
			fadeOutPhoto(dimension)
			fadeOutText(dimension)
		}

		function fadeOutPhoto(dimension) {
			return new Promise((resolve) => {
				const dimImgs = d3.selectAll(`.dimImg_${dimension}`)

				dimImgs
					.transition()
					.duration(100)
					.style('opacity', 0)
					.on('end', resolve)
			})
		}

		function advanceDimPhoto(dimension) {
			return new Promise((resolve) => {
				const dimNumImgs = d3.selectAll(`.dimImg_${dimension}`)
				dimNumImgs
					.transition()
					.duration(100)
					.delay((d, i) => i * 10)
					.style('opacity', 1)
					.on('end', (d, i) => {
						if (i === 20) resolve()
					})
			})
		}

		function drawInLines(dimension) {
			return new Promise((resolve) => {
				const crossLines = d3.selectAll(`.dim${dimension}__lines`)

				const path1 = crossLines.select('.vertical')
				const path2 = crossLines.select('.horizontal')

				drawLine(path1)
				drawLine(path2)
				setTimeout(resolve, 500)
			})
		}

		function fadeOutLines(dimension) {
			return new Promise((resolve) => {
				const crossLines = d3.selectAll(`.dim${dimension}__lines`)

				crossLines
					.transition()
					.duration(100)
					.style('opacity', 0)
					.on('end', resolve)
			})
		}

		function fadeInText(dimension) {
			return new Promise((resolve) => {
				const colorBlock = d3.selectAll(`.dim${dimension}__color`)
				const name = d3.selectAll(`.dim${dimension}__name`)

				colorBlock
					.transition()
					.duration(100)
					.style('opacity', 1)

				name
					.transition()
					.duration(100)
					.delay(500)
					.style('opacity', 1)
					.on('end', resolve)
			})
		}

		function fadeOutText(dimension) {
			return new Promise((resolve) => {
				const colorBlock = d3.selectAll(`.dim${dimension}__color`)
				const name = d3.selectAll(`.dim${dimension}__name`)

				colorBlock
					.transition()
					.duration(100)
					.style('opacity', 0)

				name
					.transition()
					.duration(100)
					.style('opacity', 0)
					.on('end', resolve)
			})
		}

		// helper functions
		function drawLine(path) {
			path
				.transition()
				.duration(500)
				.ease(d3.easeLinear)
				.style('opacity', 1)
				.attrTween('stroke-dasharray', tweenDashIn)
		}

		function removeLine(path) {
			path
				.transition()
				.duration(500)
				.ease(d3.easeLinear)
				.style('opacity', 1)
				.attrTween('stroke-dasharray', tweenDashOut)
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

		function buildDimensionChart(dimension) {

			$photoContainer = d3.selectAll(`.dim${dimension}__img`)

			$dimImg = $photoContainer
				.selectAll('.dimImg')
				.data(data)
				.enter()
				.append('img')
				.attr('src', d => `assets/images/hairspace/tan/dim_${dimension}/dim_${dimension}_${d.file}.png`)
				.attr('class', d => `dim_${dimension}_${d.file} dimImg_${dimension}`)
		}

		function drawInFrameLines(lineClass) {
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

		function drawOutFrameLines(lineClass) {
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

		const Chart = {
			// called once at start
			init() {

				buildDimensionChart(1)
				buildDimensionChart(2)
				buildDimensionChart(3)
				buildDimensionChart(4)
				typer.prepare($dimText1);
				typer.prepare($dimText2);

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = $sel.node().offsetHeight - marginTop - marginBottom;

				return Chart;
			},
			// update scales and render chart
			render() {

				return Chart;
			},
			run: async function(){
				await hideShowSection()
				await pause(1)
				await typer.reveal($dimText1)
				await dimensionSequence(1)
				await pause(0.5)
				await dimensionSequence(2)
				await pause(0.5)
				await dimensionSequence(3)
				await pause(0.5)
				await dimensionSequence(4)
				await pause(0.5)
				await slide({ sel: $dimText1, state: 'exit', early: true })
				await removeDimensionSequence(1)
				await pause(0.25)
				await removeDimensionSequence(2)
				await pause(0.25)
				await removeDimensionSequence(3)
				await pause(0.25)
				await removeDimensionSequence(4)
				await pause(1)
				await typer.reveal($dimText2)
				await drawInFrameLines('.frame__lines__3')
				await pause(0.5)
				await fadeInColorBlocks('.frame3Color', 500)
				await pause(3.5)
				await drawOutFrameLines('.frame__lines__3')
				await fadeOutColorBlocks('.frame3Color', 50)
				await slide({ sel: $dimText2, state: 'exit', early: true })
			},
			// get / set data
			data(val) {
				if (!arguments.length) return data;
				data = val;
				$sel.datum(data);
				Chart.render();
				return Chart;
			}
		};
		Chart.init();

		return Chart;
	}

	// create charts
	const charts = this.nodes().map(createChart);
	return charts.length > 1 ? charts : charts.pop();
};
