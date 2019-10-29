import pause from '../pause';
import typer from '../typer';
import slide from '../slide';
import { interpolatePath } from 'd3-interpolate-path';

// dom selections
const $yearbook_photos_section = d3.selectAll('#yearbook_photos')
const $trendlines_section = d3.selectAll('#trendlines')
const $trendText1 = $trendlines_section.select('#trendText1 p');
const $trendText2 = $trendlines_section.select('#trendText2 p');
const $trendNote1 = $trendlines_section.select('#trendNote1');
const $trendNote2 = $trendlines_section.select('#trendNote2');
const $trendNote3 = $trendlines_section.select('#trendNote3');
const $discrimNote1 = $trendlines_section.select('#discrimNote1');
const $discrimNote2 = $trendlines_section.select('#discrimNote2');
const $discrimNote3 = $trendlines_section.select('#discrimNote3');
const $topLabelFemale = d3.selectAll('.top-label-female')
const $topLabelMale = d3.selectAll('.top-label-male')
const $bottomLabelFemale = d3.selectAll('.bottom-label-female')
const $bottomLabelMale = d3.selectAll('.bottom-label-male')
const $sections = d3.selectAll('section')

d3.selection.prototype.puddingTrendLines = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
		let dataByGender = null;
		let femaleData = null;
		let maleData = null;
		let dataByYear = null;
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 100;
		const marginBottom = 100;
		const marginLeft = 0;
		const marginRight = 0;
		const axisPadding = 0;

		// scales
		const scaleX = null;
		const scaleY = null;

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;
		let xScale = d3.scaleLinear()
		let xAxis = null;
		let xAxisGroup = null;
		let yScale = d3.scaleLinear()
		let yAxis = null;
		let yAxisGroup = null;
		let genderLines = null;
		let genderArea = null;
		let femaleLine = null;
		let maleLine = null;
		let lineGroup = null;
		let drawArea = null;
		let minY = null;
		let maxY = null;
		let minX = null;
		let maxX = null;
		let minYdiscrim = null;
		let maxYdiscrim = null;
		let noteLine = null;

		// DATA FUNCTIONS
		function structureData() {
			data = data.map(d => ({
				...d,
				med: +d.med,
				smoothed: +d.smoothed,
				flat: +d.flat,
				discrim: +d.discrim,
				discrimSmoothA: +d.discrimSmoothA,
				discrimSmoothB: +d.discrimSmoothB,
				year: +d.year
			}))
			maxY = d3.max(data, d => d.smoothed)
			minY = d3.min(data, d => d.smoothed)
			maxX = d3.max(data, d => d.year)
			minX = d3.min(data, d => d.year)
			maxYdiscrim = d3.max(data, d => d.discrimSmoothA)
			minYdiscrim = d3.min(data, d => d.discrimSmoothA)

			dataByGender = d3.nest()
				.key(d => d.gender)
				.entries(data)

			femaleData = data.filter(d => d.gender == 'Female')
			maleData = data.filter(d => d.gender == 'Male')

			dataByYear = d3.nest()
				.key(d => d.year)
				.rollup(values => ({
					male: values.find(v => v.gender == "Male").smoothed,
					female: values.find(v => v.gender == "Female").smoothed
				}))
				.entries(data)
		}

		// HELPER FUNCTIONS
		function tweenDashIn() {
			const l = this.getTotalLength()
			const i = d3.interpolateString('0,' + l, l + ',' + l);
			return function(t) { return i(t); };
		}

		function tweenDashOut() {
			const l = this.getTotalLength()*2
			const i = d3.interpolateString('0,' + l, l + ',' + l);
			return function(t) { return i(t); };
		}

		// ANIMATION FUNCTIONS
		function hideShowSection() {
			$sections.style('display', 'none')
			d3.selectAll('#yearbook_photos').style('display', 'flex')
			d3.selectAll('#trendlines').style('display', 'flex')
		}

		function revealGenderLabels() {
			return new Promise((resolve) => {
				const genderLabels = d3.selectAll('.line-label')

				genderLabels.transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.on('end', resolve)
			})
		}

		function fadeInArea() {
			return new Promise((resolve) => {
				const $area = d3.selectAll('.area')
				$area.transition()
					.duration(500)
					.delay(250)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.on('end', resolve)
			})
		}

		function discrimLineTransition() {
			return new Promise((resolve) => {
				$topLabelFemale.select('p').text(`Less similar women & men's styles`)
				$bottomLabelMale.select('p').text(`More similar women & men's styles`)

				const $area = d3.selectAll('.area')
				$area.transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', 0)

				yScale.domain([minYdiscrim, maxYdiscrim])

				d3.select('#trendlines .g-axis').select('.y').transition().call(yAxis)
				d3.select('#trendlines .g-axis').select('.x').transition().call(xAxis)

				const genderLabels = d3.selectAll('.line-label')

				genderLabels.transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('display', 'none')

				const femalePath = d3.selectAll(`.Female`)
				const malePath = d3.selectAll(`.Male`)

				genderLines = d3.line()
					.x(d => xScale(d.year))
					.y(d => yScale(d.discrimSmoothA))

				femalePath
					.attr('stroke-dasharray', 0)
					.transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('stroke', '#6642B0')
					.attr('d', genderLines)

				malePath
					.attr('stroke-dasharray', 0)
					.transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('stroke', '#6642B0')
					.attr('d', genderLines)
					.on('end', resolve)
			})
		}

		function fadeToOutro() {
			return new Promise((resolve) => {
				d3.selectAll('#yearbook_photos, #trendlines').transition()
					.duration(750)
					.ease(d3.easeLinear)
					.style('opacity', 0)
					.on('end', resolve)
			})
		}

		function transitionLines() {
			return new Promise((resolve) => {
				$topLabelMale.transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('display', 'none')
				$bottomLabelFemale.transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('display', 'none')

				const femalePath = d3.selectAll(`.Female`)
				const malePath = d3.selectAll(`.Male`)

				genderLines = d3.line()
					.x(d => xScale(d.year))
					.y(d => yScale(d.smoothed))

				femalePath
					.attr('stroke-dasharray', 0)
					.transition()
					.duration(500)
					.ease(d3.easeLinear)
					.attr('d', genderLines)

				malePath
					.attr('stroke-dasharray', 0)
					.transition()
					.duration(500)
					.ease(d3.easeLinear)
					.attr('d', genderLines)

				d3.selectAll('.line-label-female').transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('top', '120px')

				d3.selectAll('.line-label-male').transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('top', '580px')
					.on('end', resolve)
			})
		}

		function transitionLabels() {
			return new Promise((resolve) => {
				$topLabelFemale.select('p').text('Bigger median hair')
				$bottomLabelMale.select('p').text('Smaller median hair')
				$topLabelFemale.select('svg').transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('transform', 'rotate(90deg)')
				$bottomLabelMale.select('svg').transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('transform', 'rotate(90deg)')
					.on('end', resolve)
			})
		}

		function fadeBG(direction) {
			return new Promise((resolve) => {
				d3.selectAll('.bottom-label-female, .top-label-male').transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', function() {
						if (direction == 'in') { return 0.1 }
						else { return 0 }
					})

				d3.selectAll('.top-label-female, .bottom-label-male').transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', function() {
						if (direction == 'in') { return 0.1 }
						else { return 1 }
					})

				$yearbook_photos_section.selectAll('figure').transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', function() {
						if (direction == 'in') { return 0.1 }
						else { return 0.1 }
					})

				$trendlines_section.selectAll('figure').transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', function() {
						if (direction == 'in') { return 0.1 }
						else { return 1 }
					})

				d3.selectAll('.line-label').transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', function() {
						if (direction == 'in') { return 0.1 }
						else { return 1 }
					})
					.on('end', resolve)
			})
		}

		function drawInTrendLine() {
			return new Promise((resolve) => {
				const femalePath = d3.selectAll(`.Female`)
				const malePath = d3.selectAll(`.Male`)

				femalePath.transition()
					.duration(700)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.attrTween('stroke-dasharray', tweenDashIn)

				malePath.transition()
					.duration(700)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.attrTween('stroke-dasharray', tweenDashIn)
					.on('end', resolve)
			})
		}

		function fadeInTicks() {
			return new Promise((resolve) => {
				const xTicks = d3.selectAll('.x.axis text').transition()
					.duration(500)
					.delay((d, i) => i * 20)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.on('end', resolve)
			})
		}

		function fadeOutTicks() {
			return new Promise((resolve) => {
				// d3.selectAll('.chart-label').transition()
				// 	.duration(500)
				// 	.ease(d3.easeLinear)
				// 	.style('opacity', 0.1)

				const xTicks = d3.selectAll('.x.axis text').transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('opacity', 0.1)
					.on('end', resolve)
			})
		}

		function fadeLine(gender, direction) {
			const lowercaseGender = gender.toLowerCase()
			const line = d3.selectAll(`.${gender}`)
			const label = d3.selectAll(`.line-label-${lowercaseGender}`)
			const $area = d3.selectAll('.area')
			return new Promise((resolve) => {
				line.transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('opacity', function() {
						if (direction == 'in') { return 0.1 }
						else { return 1 }
					})

				label.transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('opacity', function() {
						if (direction == 'in') { return 0.1 }
						else { return 1 }
					})

				$area.transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('opacity', function() {
						if (direction == 'in') { return 0 }
						else { return 1 }
					})
					.on('end', resolve)
			})
		}

		function fadeInNoteImgs(sel) {
			return new Promise((resolve) => {
				const imgs = d3.selectAll(`${sel} img`)

				imgs.transition()
					.duration(500)
					.delay((d, i) => i * 500)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.on('end', resolve)
			})
		}

		const Chart = {
			// called once at start
			init() {
				structureData()
				typer.prepare($trendText1);
				typer.prepare($trendText2);

				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = $sel.node().offsetHeight - marginTop - marginBottom;

				$svg = $sel.append('svg')
					.attr('class', 'pudding-chart')
					.attr('width', width + marginLeft + marginRight)
					.attr('height', height + marginTop + marginBottom);

				const $g = $svg.append('g');

				// offset chart for margins
				$g.attr('transform', `translate(${marginLeft}, ${marginTop})`);

				// create axis
				$axis = $svg.append('g').attr('class', 'g-axis');

				xAxisGroup = $axis.append('g')
					.attr('class', 'x axis')
					.attr('transform', `translate(${marginLeft},${height})`)

				yAxisGroup = $axis.append('g')
					.attr('class', 'y axis')

				xScale
					.domain([minX, maxX])
					.range([0, width])

				yScale
					.domain([0, maxY])
					.range([height, 0])

				xAxis = d3
					.axisBottom(xScale)
					.tickPadding(8)
					.ticks(10)
					.tickFormat(d3.format('d'))

				yAxis = d3
					.axisLeft(yScale)
					.tickPadding(8)
					.tickSize(-width)
					.ticks(8)

				$axis.select('.x')
					.attr('transform', `translate(${marginLeft},510)`)
					.call(xAxis);

				$axis.select('.y')
					.attr('transform', `translate(${marginLeft + 20},0)`)
					.call(yAxis);

				// setup viz group
				$vis = $g.append('g').attr('class', 'g-vis');

				genderLines = d3.line()
					.x(d => xScale(d.year))
					.y(d => yScale(d.flat))

				genderArea = d3.area()
					.x(d => xScale(d.key))
					.y0(d => yScale(d.value.female))
					.y1(d => yScale(d.value.male))

				drawArea = $vis.append('path')
					.datum(dataByYear)
					.attr('class', 'area')
					.attr('d', genderArea)

				lineGroup = $svg.select('.g-vis')

				femaleLine = lineGroup.append('path')
					.datum(femaleData)
					.attr('class', 'Female')
					.attr('d', genderLines)

				maleLine = lineGroup.append('path')
					.datum(maleData)
					.attr('class', 'Male')
					.attr('d', genderLines)

				const xTicks = d3.selectAll('.x.axis text')

				xTicks.attr('transform', `translate(32,0)`)

			},
			run: async function(){
				await hideShowSection()
				await pause(1)
				await drawInTrendLine()
				await revealGenderLabels()
				await pause(2)
				await fadeBG('in')
				await pause(0.25)
				await typer.reveal($trendText1)
				await pause(2)
				await slide({ sel: $trendText1, state: 'exit', early: true })
				await fadeBG('out')
				await fadeInTicks()
				await pause(0.5)
				await transitionLabels()
				await pause(0.5)
				await transitionLines()
				await fadeInArea()
				await pause(2)
				await fadeOutTicks()
				await fadeLine('Male', 'in')
				await slide({ sel: $trendNote1, state: 'enter', xInput: 30 })
				await fadeInNoteImgs('#imgNote1')
				await pause(4)
				await slide({ sel: $trendNote1, state: 'enter', early: true, xInput: 2000 })
				await fadeLine('Male', 'out')
				await pause(1)
				await fadeLine('Female', 'in')
				await slide({ sel: $trendNote2, state: 'enter', xInput: 290 })
				await fadeInNoteImgs('#imgNote2')
				await pause(4)
				await slide({ sel: $trendNote2, state: 'enter', early: true, xInput: 2000 })
				await fadeLine('Female', 'out')
				await pause(1)
				await slide({ sel: $trendNote3, state: 'enter', xInput: 1200 })
				await fadeInNoteImgs('#imgNote3')
				await pause(4)
				await slide({ sel: $trendNote3, state: 'enter', early: true, xInput: 2000 })
				await pause(2)
				await fadeBG('in')
				await pause(0.25)
				await typer.reveal($trendText2)
				await pause(2)
				await slide({ sel: $trendText2, state: 'exit', early: true })
				await fadeBG('out')
				await fadeInTicks()
				await pause(1)
				await discrimLineTransition()
				await pause(2)
				await fadeOutTicks()
				await slide({ sel: $discrimNote1, state: 'enter', xInput: 360 })
				await fadeInNoteImgs('#imgNote4')
				await pause(4)
				await slide({ sel: $discrimNote1, state: 'enter', early: true, xInput: 2000 })
				await pause(2)
				await slide({ sel: $discrimNote2, state: 'enter', xInput: 1160 })
				await fadeInNoteImgs('#imgNote5')
				await pause(4)
				await slide({ sel: $discrimNote2, state: 'enter', early: true, xInput: 2025 })
				await pause(2)
				await slide({ sel: $discrimNote3, state: 'enter', xInput: 1460 })
				await fadeInNoteImgs('#imgNote6')
				await pause(4)
				await slide({ sel: $discrimNote3, state: 'enter', early: true, xInput: 2000 })
				await pause(2)
				await fadeBG('out')
				await fadeInTicks()
				await pause(1)
				await fadeToOutro()
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
