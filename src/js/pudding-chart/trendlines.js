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
const $topLabelDiff = d3.selectAll('.top-label-diff')
const $bottomLabelDiff = d3.selectAll('.bottom-label-diff')
const $bottomLabelMale = d3.selectAll('.bottom-label-male')
const $sections = d3.selectAll('section')
const lenCalc = 4/100
const $trendText1_len = $trendText1.text().length * lenCalc
const $trendText2_len = $trendText2.text().length * lenCalc
const $trendNote1_len = $trendNote1.select('p').text().length * lenCalc
const $trendNote2_len = $trendNote2.select('p').text().length * lenCalc
const $trendNote3_len = $trendNote3.select('p').text().length * lenCalc
const $discrimNote1_len = $discrimNote1.select('p').text().length * lenCalc
const $discrimNote2_len = $discrimNote2.select('p').text().length * lenCalc
const $discrimNote3_len = $discrimNote3.select('p').text().length * lenCalc
const $outro1 = d3.selectAll('#outro1 p')
const $outro1_len = $outro1.text().length * lenCalc

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

		function swapLabels() {
			return new Promise((resolve) => {
				$topLabelFemale.transition()
					.duration(100)
					.ease(d3.easeLinear)
					.style('left', '-500px')

				$bottomLabelMale.transition()
					.duration(100)
					.ease(d3.easeLinear)
					.style('right', '-500px')

				$topLabelDiff.transition()
					.duration(100)
					.delay(500)
					.ease(d3.easeLinear)
					.style('left', '0px')

				$bottomLabelDiff.transition()
					.duration(100)
					.delay(500)
					.ease(d3.easeLinear)
					.style('right', '0px')
					.on('end', resolve)
			})
		}

		function discrimLineTransition() {
			return new Promise((resolve) => {

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
				d3.selectAll('#trendlines, .chart-label').transition()
					.duration(750)
					.ease(d3.easeLinear)
					.style('opacity', 0)

				d3.selectAll('.photoDiv').transition()
					.duration(1500)
					.delay((d, i) => i * 20)
					.ease(d3.easeLinear)
					.style('left', d => `-3000px`)
					.on('end', resolve)
			})
		}

		function transitionLines() {
			return new Promise((resolve) => {

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

				$topLabelFemale.transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.style('top', '0px')

				$bottomLabelMale.transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.style('top', '940px')

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

		function fadeLabels() {
			return new Promise((resolve) => {
				d3.selectAll('.chart-label').transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('opacity', '0.1')
					.on('end', resolve)
			})
		}

		function fadeBG(direction) {
			return new Promise((resolve) => {

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
					.delay((d, i) => i * 50)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.on('end', resolve)
			})
		}

		function fadeOutTicks() {
			return new Promise((resolve) => {

				const xTicks = d3.selectAll('.x.axis text').transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('opacity', 0.3)
					.on('end', resolve)
			})
		}

		function fadeLine(gender, direction) {
			const maleLabel = d3.selectAll(`.line-label-male`)
			const femaleLabel = d3.selectAll(`.line-label-female`)
			const $area = d3.selectAll('.area')
			const femalePath = d3.selectAll(`.Female`)
			const malePath = d3.selectAll(`.Male`)
			return new Promise((resolve) => {

				if (gender == "Male") {
					malePath.transition()
						.duration(500)
						.ease(d3.easeLinear)
						.style('opacity', '0.1')

					maleLabel.transition()
						.duration(500)
						.ease(d3.easeLinear)
						.style('opacity', '0.1')

					$area.transition()
						.duration(500)
						.ease(d3.easeLinear)
						.style('opacity', '0')
						.on('end', resolve)
				}

				else if (gender == 'Female') {
					femalePath.transition()
						.duration(500)
						.ease(d3.easeLinear)
						.style('opacity', '0.1')

					malePath.transition()
						.duration(500)
						.ease(d3.easeLinear)
						.style('opacity', '1')

					femaleLabel.transition()
						.duration(500)
						.ease(d3.easeLinear)
						.style('opacity', '0.1')

					maleLabel.transition()
						.duration(500)
						.ease(d3.easeLinear)
						.style('opacity', '1')

					$area.transition()
						.duration(500)
						.ease(d3.easeLinear)
						.style('opacity', '0')
						.on('end', resolve)
				}

				else {
					femalePath.transition()
						.duration(500)
						.ease(d3.easeLinear)
						.style('opacity', '1')

					malePath.transition()
						.duration(500)
						.ease(d3.easeLinear)
						.style('opacity', '1')

					femaleLabel.transition()
						.duration(500)
						.ease(d3.easeLinear)
						.style('opacity', '1')

					maleLabel.transition()
						.duration(500)
						.ease(d3.easeLinear)
						.style('opacity', '1')

					$area.transition()
						.duration(500)
						.ease(d3.easeLinear)
						.style('opacity', '1')
						.on('end', resolve)
				}
			})
		}

		function fadeNoteText(sel) {
			return new Promise((resolve) => {
				const text = d3.selectAll(`${sel} p`)

				text.transition()
					.duration(100)
					.ease(d3.easeLinear)
					.style('opacity', 1)
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
				typer.prepare($outro1);

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
				await pause(0.25)
				await drawInTrendLine()
				await revealGenderLabels()
				await pause(3)
				await fadeBG('in')
				await pause(0.25)
				await typer.reveal($trendText1)
				await pause($trendText1_len)
				await slide({ sel: $trendText1, state: 'exit', early: true })
				await fadeBG('out')
				await pause(1)
				await transitionLines()
				await fadeInArea()
				await fadeInTicks()
				await pause(3)
				await fadeOutTicks()
				await fadeLine('Male')
				await slide({ sel: $trendNote1, state: 'enter', xInput: 30 })
				await fadeNoteText('#trendNote1')
				await fadeInNoteImgs('#imgNote1')
				await pause($trendNote1_len)
				await slide({ sel: $trendNote1, state: 'enter', early: true, xInput: 2000 })
				await fadeLine('Female')
				await slide({ sel: $trendNote2, state: 'enter', xInput: 290 })
				await fadeNoteText('#trendNote2')
				await fadeInNoteImgs('#imgNote2')
				await pause($trendNote2_len)
				await slide({ sel: $trendNote2, state: 'enter', early: true, xInput: 2000 })
				await fadeLine('Both')
				await slide({ sel: $trendNote3, state: 'enter', xInput: 1200 })
				await fadeNoteText('#trendNote3')
				await fadeInNoteImgs('#imgNote3')
				await pause($trendNote3_len)
				await slide({ sel: $trendNote3, state: 'enter', early: true, xInput: 2000 })
				await pause(2)
				await fadeBG('in')
				await pause(0.25)
				await typer.reveal($trendText2)
				await pause($trendText2_len)
				await slide({ sel: $trendText2, state: 'exit', early: true })
				await fadeBG('out')
				await fadeInTicks()
				await pause(1)
				await discrimLineTransition()
				await pause(1)
				await swapLabels()
				await pause(2)
				await fadeOutTicks()
				await slide({ sel: $discrimNote1, state: 'enter', xInput: 360 })
				await fadeNoteText('#discrimNote1')
				await fadeInNoteImgs('#imgNote4')
				await pause($discrimNote1_len)
				await slide({ sel: $discrimNote1, state: 'enter', early: true, xInput: 2000 })
				await slide({ sel: $discrimNote2, state: 'enter', xInput: 1160 })
				await fadeNoteText('#discrimNote2')
				await fadeInNoteImgs('#imgNote5')
				await pause($discrimNote2_len)
				await slide({ sel: $discrimNote2, state: 'enter', early: true, xInput: 2025 })
				await slide({ sel: $discrimNote3, state: 'enter', xInput: 1485 })
				await fadeNoteText('#discrimNote3')
				await fadeInNoteImgs('#imgNote6')
				await pause($discrimNote3_len)
				await slide({ sel: $discrimNote3, state: 'enter', early: true, xInput: 2000 })
				// await fadeBG('out')
				// await fadeInTicks()
				// await pause(2)
				//await fadeLabels()
				await fadeBG('in')
				await pause(0.5)
				await typer.reveal($outro1)
				await pause($outro1_len)
				await slide({ sel: $outro1, state: 'exit', early: true })
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
