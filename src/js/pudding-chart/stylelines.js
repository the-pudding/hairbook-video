import pause from '../pause';
import typer from '../typer';
import slide from '../slide';
import { interpolatePath } from 'd3-interpolate-path';
/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.puddingStyleLines = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
		let dataSTYLE = data[0]
		let dataDIMS = data[1]
		let dataByGender = null;
		let dataByYear = null;
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 5;
		const marginBottom = 60;
		const marginLeft = 30;
		const marginRight = 20;
		const axisPadding = 0;

		// scales
		const scaleX = null;
		const scaleY = null;

		// dom elements
		let $svg = null;
		let $axis = null;
		let $visLine = null;
		let $visCircle = null;
		let xScale = d3.scaleLinear()
		let xAxis = null;
		let xAxisGroup = null;
		let yScale = d3.scaleLinear()
		let yAxis = null;
		let yAxisGroup = null;
		let dimLine = null;
		let styleLine = null;
		let drawDimLine = null;
		let drawStyleLine = null;
		let lineGroup = null;
		let drawCircles = null;
		let circleGroup = null;
		let minY_style = null;
		let maxY_style = null;
		let minX_style = null;
		let maxX_style = null;
		let minY_dims = null;
		let maxY_dims = null;
		let minX_dims = null;
		let maxX_dims = null;
		let xTicksText = null;
		let xTicks = null;

		const $style_section = d3.selectAll('#stylelines')
		const $styleText1 = $style_section.select('#styleText1 p');
		const $styleText2 = $style_section.select('#styleText2 p');
		const $sections = d3.selectAll('section')

		// helper functions
		function hideShowSection() {
			$sections.style('display', 'none')
			d3.selectAll('#stylelines').style('display', 'flex')
		}

		function structureData() {

			dataSTYLE = dataSTYLE.map(d => ({
				...d,
				beehive_density: +d.beehive_density,
				mullet_density: +d.mullet_density,
				str_density: +d.str_density,
				year: +d.year
			}))

			dataDIMS = dataDIMS.map(d => ({
				...d,
				beehive_dim: +d.beehive_dim,
				mullet_dim: +d.mullet_dim,
				str_dim: +d.str_dim,
				dimNum: +d.dimNum
			}))

			maxX_style = d3.max(dataSTYLE, d => d.year)
			minX_style = d3.min(dataSTYLE, d => d.year)
		}

		function transitionTicks() {
			return new Promise((resolve) => {
				xTicks = d3.selectAll('.x.axis text')
					.transition()
					.duration(200)
					.delay((d, i) => i * 50)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.on('end', resolve)
			})
		}

		function tweenDash() {
			const l = this.getTotalLength()
			const i = d3.interpolateString('0,' + l, l + ',' + l);
			return function(t) { return i(t); };
		}

		async function animateStyle() {
			await fadeInStyleName()
			await fadeInStylePhoto()
			await drawInAxis()
		}

		function fadeInStyleName() {
			return new Promise((resolve) => {
				const name = d3.selectAll(`.style-name`)

				name
					.transition()
					.duration(100)
					.delay(500)
					.style('opacity', 1)
					.on('end', resolve)
			})
		}

		function fadeInStylePhoto() {
			return new Promise((resolve) => {
				const img = d3.selectAll(`img`)

				img
					.transition()
					.duration(100)
					.delay(500)
					.style('opacity', 1)
					.on('end', resolve)
			})
		}

		function drawInAxis() {
			return new Promise((resolve) => {
				const axis0 = d3.selectAll(`.x.axis .class-0 line`)
				const axis1 = d3.selectAll(`.x.axis .class-1 line`)
				const axis2 = d3.selectAll(`.x.axis .class-2 line`)
				const axis3 = d3.selectAll(`.x.axis .class-3 line`)

				axis0.transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.attrTween('stroke-dasharray', tweenDash)

				axis1.transition()
					.duration(250)
					.delay(500)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.attrTween('stroke-dasharray', tweenDash)

				axis2.transition()
					.duration(250)
					.delay(1000)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.attrTween('stroke-dasharray', tweenDash)

				axis3.transition()
					.duration(250)
					.delay(1500)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.attrTween('stroke-dasharray', tweenDash)
					.on('end', resolve)

			})
		}

		function fadeInDimensions() {
			return new Promise((resolve) => {
				const dim1label = d3.selectAll('.dim1')
				const dim2label = d3.selectAll('.dim2')
				const dim3label = d3.selectAll('.dim3')
				const dim4label = d3.selectAll('.dim4')

				const circle1 = d3.selectAll('.circle-0')
				const circle2 = d3.selectAll('.circle-1')
				const circle3 = d3.selectAll('.circle-2')
				const circle4 = d3.selectAll('.circle-3')

				dim1label.transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', 1)

				circle1.transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', 1)

				dim2label.transition()
					.duration(250)
					.delay(500)
					.ease(d3.easeLinear)
					.style('opacity', 1)

				circle2.transition()
					.duration(250)
					.delay(500)
					.ease(d3.easeLinear)
					.style('opacity', 1)

				dim3label.transition()
					.duration(250)
					.delay(1000)
					.ease(d3.easeLinear)
					.style('opacity', 1)

				circle3.transition()
					.duration(250)
					.delay(1000)
					.ease(d3.easeLinear)
					.style('opacity', 1)

				dim4label.transition()
					.duration(250)
					.delay(1500)
					.ease(d3.easeLinear)
					.style('opacity', 1)

				circle4.transition()
					.duration(250)
					.delay(1500)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.on('end', resolve)
			})
		}

		function fadeOutDimensions() {
			return new Promise((resolve) => {
				const circles = d3.selectAll('.circle')
				const labels = d3.selectAll('.dim-labels p')
				const lines = d3.selectAll('.dimLine')

				circles.transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', 0)

				labels.transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', 0)

				lines.transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', 0)
					.on('end', resolve)
			})
		}

		function drawInDimLine(lineType) {
			return new Promise((resolve) => {
				const path = d3.selectAll(`.${lineType}`)

				path.transition()
					.duration(700)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.attrTween('stroke-dasharray', tweenDash)
					.on('end', resolve)
			})
		}

		function scaleTransitions() {
			return new Promise((resolve) => {
				xScale
					.domain([minX_style, maxX_style])

				yScale
					.domain([0, 0.4])

				xAxis.ticks(8)

				d3.select('#beehive .g-axis').select('.x').transition().call(xAxis)
				d3.select('#mullet .g-axis').select('.x').transition().call(xAxis)
				d3.select('#longstraight .g-axis').select('.x').transition().call(xAxis)

				d3.selectAll('.x.axis .tick line')
					.transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.on('end', resolve)
			})
		}

		function fadeOutStyleBlocks(id) {
			return new Promise((resolve) => {
				const block = d3.selectAll(`#${id}`)
				const text = d3.selectAll(`#${id}Text`)

				block.transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', 0)

				text.transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', 0)
					.on('end', resolve)
			})
		}

		function drawInStyleLine(id) {
			return new Promise((resolve) => {
				const path = d3.selectAll(`#${id} .styleLine`)
				if (id == 'beehive') {
					styleLine = d3.line()
						.x(d => xScale(d.year))
						.y(d => yScale(d.beehive_density))
					path
						.attr('d', styleLine)

					path.transition()
						.duration(700)
						.ease(d3.easeLinear)
						.style('opacity', 1)
						.attrTween('stroke-dasharray', tweenDash)

					d3.selectAll('#beehiveText').transition()
						.duration(250)
						.delay(200)
						.ease(d3.easeLinear)
						.style('opacity', 1)
						.on('end', resolve)

				} else if (id == 'mullet') {
					styleLine = d3.line()
						.x(d => xScale(d.year))
						.y(d => yScale(d.mullet_density))
					path
						.attr('d', styleLine)

					path.transition()
						.duration(700)
						.ease(d3.easeLinear)
						.style('opacity', 1)
						.attrTween('stroke-dasharray', tweenDash)

					d3.selectAll('#mulletText').transition()
						.duration(250)
						.delay(200)
						.ease(d3.easeLinear)
						.style('opacity', 1)
						.on('end', resolve)

				} else {
					styleLine = d3.line()
						.x(d => xScale(d.year))
						.y(d => yScale(d.str_density))
					path
						.attr('d', styleLine)

					path.transition()
						.duration(700)
						.ease(d3.easeLinear)
						.style('opacity', 1)
						.attrTween('stroke-dasharray', tweenDash)

					d3.selectAll('#longstraightText').transition()
						.duration(250)
						.delay(200)
						.ease(d3.easeLinear)
						.style('opacity', 1)
						.on('end', resolve)
				}
			})
		}

		function fadeBG(direction) {
			return new Promise((resolve) => {
				d3.selectAll('.dim-labels')
					.transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', function() {
						if (direction == 'in') { return 0.1 }
						else { return 1 }
					})

				d3.selectAll('.block-container')
					.transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', function() {
						if (direction == 'in') { return 0.1 }
						else { return 1 }
					})
					.on('end', resolve)
			})
		}
		const Chart = {
			// called once at start
			init() {
				structureData()
				typer.prepare($styleText1);
				typer.prepare($styleText2);

				$svg = $sel.append('svg').attr('class', 'pudding-chart');

				// create axis
				$axis = $svg.append('g').attr('class', 'g-axis');

				//d3.select('.g-axis').attr('transform', `translate(${marginLeft}, ${marginTop})`);

				xAxisGroup = $axis.append('g')
					.attr('class', 'x axis')

				yAxisGroup = $axis.append('g')
					.attr('class', 'y axis')

				// setup viz group
				const $g = $svg.append('g');

				// offset chart for margins
				$g.attr('transform', `translate(${marginLeft}, ${marginTop})`);

				$visLine = $g.append('g').attr('class', 'g-vis-line');
				$visCircle = $g.append('g').attr('class', 'g-vis-circle');
				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = 1420-100-40-100
				height = 230

				$svg
					.attr('width', width + marginLeft + marginRight)
					.attr('height', height + marginTop + marginBottom);

				xAxisGroup
					.attr('transform', `translate(${marginLeft},0)`)

				xScale
					.domain([0, 3])
					.range([0, width])

				yScale
					.domain([-4, 3])
					.range([height, 0])

				xAxis = d3
					.axisBottom(xScale)
					.tickPadding(40)
					.tickSize(height)
					.ticks(4)
					.tickFormat(d3.format('d'))

				yAxis = d3
					.axisLeft(yScale)
					.tickPadding(8)
					.tickSize(-width)
					.ticks(8)

				$axis.select('.x')
					//.attr('transform', `translate(${marginLeft},0)`)
					.call(xAxis);

				xTicks = d3.selectAll('.x.axis .tick')
					.attr('class', d => `tick class-${d}`)

				$axis.select('.y')
					.attr('transform', `translate(${marginLeft},0)`)
					.call(yAxis);

				drawCircles = $visCircle.selectAll('circle')
					.data(dataDIMS)
					.enter()
					.append('circle')
					.attr('r', 15)
					.attr('class', d => `circle circle-${d.dimNum}`)

				if (options == 'beehive') {
					dimLine = d3.line()
						.x(d => xScale(d.dimNum))
						.y(d => yScale(d.beehive_dim))
					drawCircles
						.attr('cx', d => xScale(d.dimNum))
						.attr('cy', d => yScale(d.beehive_dim))
					styleLine = d3.line()
						.x(d => xScale(d.year))
						.y(d => yScale(d.beehive_density))
				} else if (options == 'mullet') {
					dimLine = d3.line()
						.x(d => xScale(d.dimNum))
						.y(d => yScale(d.mullet_dim))
					drawCircles
						.attr('cx', d => xScale(d.dimNum))
						.attr('cy', d => yScale(d.mullet_dim))
					styleLine = d3.line()
						.x(d => xScale(d.year))
						.y(d => yScale(d.mullet_density))
				} else {
					dimLine = d3.line()
						.x(d => xScale(d.dimNum))
						.y(d => yScale(d.str_dim))
					drawCircles
						.attr('cx', d => xScale(d.dimNum))
						.attr('cy', d => yScale(d.str_dim))
					styleLine = d3.line()
						.x(d => xScale(d.year))
						.y(d => yScale(d.str_density))
				}

				return Chart;
			},
			// update scales and render chart
			render() {
				lineGroup = $svg.select('.g-vis')

				drawDimLine = $visLine.append('path')
					.datum(d => dataDIMS)
					.attr('class', 'dimLine')
					.attr('d', dimLine)

				drawStyleLine = $visLine.append('path')
					.datum(d => dataSTYLE)
					.attr('class', 'styleLine')

				return Chart;
			},
			run: async function(){
				await hideShowSection()
				await animateStyle()
				await fadeInDimensions()
				await pause(1)
				await drawInDimLine('dimLine')
				await pause(2)
				await fadeBG('in')
				await pause(0.25)
				await typer.reveal($styleText1)
				await pause(3)
				await slide({ sel: $styleText1, state: 'exit', early: true })
				await fadeBG('out')
				await pause(1)
				await fadeOutDimensions()
				await pause(0.5)
				await scaleTransitions()
				await pause(0.5)
				await transitionTicks()
				await pause(0.5)
				await drawInStyleLine('beehive')
				await pause(1)
				await drawInStyleLine('mullet')
				await pause(1)
				await drawInStyleLine('longstraight')
				await pause(4)
				await fadeOutStyleBlocks('beehive')
				await pause(0.5)
				await fadeOutStyleBlocks('mullet')
				await pause(0.5)
				await fadeOutStyleBlocks('longstraight')
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
