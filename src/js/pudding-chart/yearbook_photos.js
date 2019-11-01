// Import common js files
import pause from '../pause';
import typer from '../typer';
import slide from '../slide';

d3.selection.prototype.puddingYearbookPhotos = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		// data
		let data = $sel.datum();
		let dataByYear = null;
		let flatData = null;
		const photo_steps = d3.range(1, 11)
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 20;
		const marginBottom = 20;
		const marginLeft = 20;
		const marginRight = 0;

		// dom elements
		let $photoContainer = null;
		let $vis = null;
		let $decadeDiv = null;
		let $femalePhotoDiv = null;
		let $malePhotoDiv = null;
		let $photoContainerFemale = null;
		let $photoContainerMale = null;
		let $photoDivFemale = null;
		let $photoDivMale = null;
		let $femalePhoto = null;
		let $malePhoto = null;
		let $decadeLabelDiv = null;
		let $decadeLabel = null;
		let $malePhotos = null;
		let $femalePhotos = null;

		const $yearbook_photos_section = d3.selectAll('#yearbook_photos')
		const $sections = d3.selectAll('section')
		const $avgGridText1 = $yearbook_photos_section.select('#avgGridText1 p');
		const $avgGridText2 = $yearbook_photos_section.select('#avgGridText2 p');
		const $topLabelFemale = d3.selectAll('.top-label-female')
		const $topLabelMale = d3.selectAll('.top-label-male')
		const $bottomLabelFemale = d3.selectAll('.bottom-label-female')
		const $bottomLabelMale = d3.selectAll('.bottom-label-male')
		const lenCalc = 3/100
		const $avgGridText1_len = $avgGridText1.text().length * lenCalc
		const $avgGridText2_len = $avgGridText2.text().length * lenCalc

		// ANIMATION FUNCTIONS
		// in place for each large scene change to show relevant scenes
		function hideShowSection() {
			$sections.style('display', 'none')
			d3.selectAll('#yearbook_photos').style('display', 'flex')
		}

		// fades in yearbook photos
		function fadeInPhotos() {
			return new Promise((resolve) => {

				// transition in photo divs
				const $photoDivsFemale = d3.selectAll('.photoDiv-female')
				const $photoDivsMale = d3.selectAll('.photoDiv-male')
				$photoDivsFemale.transition()
					.duration(1500)
					.delay((d, i) => i * 20)
					.ease(d3.easeLinear)
					.style('opacity', 1)

				$photoDivsMale.transition()
					.duration(1500)
					.delay((d, i) => i * 20)
					.ease(d3.easeLinear)
					.style('opacity', 1)
					.on('end', resolve)

				// $decadeLabelDiv.transition()
				// 	.duration(500)
				// 	.delay(2500)
				// 	.ease(d3.easeLinear)
				// 	.style('opacity', 1)
				// 	.on('end', resolve)
			})
		}

		// fades in and out BG for text overlay
		function fadeBG(direction) {
			return new Promise((resolve) => {
				// const $chartLabels = d3.selectAll('.chart-label')
				// $chartLabels.transition()
				// 	.duration(250)
				// 	.ease(d3.easeLinear)
				// 	.style('opacity', function() {
				// 		if (direction == 'in') { return 0.1 }
				// 		else { return 1 }
				// 	})

				$yearbook_photos_section.selectAll('figure').transition()
					.duration(250)
					.ease(d3.easeLinear)
					.style('opacity', function() {
						if (direction == 'in') { return 0.1 }
						else { return 1 }
					})
					.on('end', resolve)
			})
		}

		// splits photos by gender, shrinks and repositions
		function genderSplit() {
			return new Promise((resolve) => {
				$malePhotos.transition()
					.duration(0)
					.ease(d3.easeLinear)
					.style('opacity', 1)

				$femalePhotos.transition()
					.duration(0)
					.ease(d3.easeLinear)
					.style('opacity', 1)

				$decadeLabelDiv.transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('opacity', 0)

				$photoContainerFemale.transition()
				 	.duration(500)
					.ease(d3.easeLinear)
					.style('padding', '0')
					.style('top', '35px')
					.style('height', '320px')

				$photoContainerMale.transition()
				 	.duration(500)
					.ease(d3.easeLinear)
					.style('padding', '0')
					.style('bottom', '35px')
					.style('height', '320px')

				d3.selectAll('.photoDiv,.female-photo,.male-photo').transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('width', '79px')
					.style('height', '79px')
					.style('left', d => `${d.leftEnd}px`)
					.style('top', d => `${d.topEnd}px`)

				d3.selectAll('.female-photo img,.male-photo img').transition()
					.duration(500)
					.ease(d3.easeLinear)
					.style('width', '74px')
					.style('height', '74px')
					.on('end', resolve)
				})
		}

		// opacity out for some of the male photos
		function selectRandomPhotos() {
			$malePhotos = d3.selectAll('.male-photo')
			$femalePhotos = d3.selectAll('.female-photo')
			const elements = $malePhotos.size()
			const ran = d3.range(0, elements).map(d => Math.random() < 0.5)
			$malePhotos.style('opacity', (d, i) => ran[i] ? 1 : 0)
			$femalePhotos.style('opacity', (d, i) => ran[i] ? 0 : 1)
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

		// BUILDS PHOTO GRID CHART
		const Chart = {
			// called once at start
			init() {
				$photoContainerFemale = $sel.append('div').attr('class', 'photo-wrapper photo-wrapper-female')
				$photoContainerMale = $sel.append('div').attr('class', 'photo-wrapper photo-wrapper-male')

				const len = data.length
				const w = 120
				const col = Math.floor($photoContainerFemale.node().offsetWidth/w)
				const wEnd = 79
				const colEnd = Math.floor($photoContainerFemale.node().offsetWidth/wEnd)
				const withPos = data.map((d, i) => ({
					...d,
					left: (i%col)*w,
					top: Math.floor(i/col)*w + 130,
					leftEnd: (i%colEnd)*wEnd,
					topEnd: Math.floor(i/colEnd)*wEnd
				}))

				//female
				$photoDivFemale = $photoContainerFemale
					.selectAll('.photoDiv')
					.data(withPos)
					.enter()
					.append('div')
					.attr('class', d => `photoDiv photoDiv-female photoDiv-female-${d.ID}`)
					.style('left', d => `${d.left}px`)
					.style('top', d => `${d.top}px`)

				$femalePhotoDiv = $photoDivFemale.append('div').attr('class', 'yearbook-photo female-photo')
				$femalePhoto = $femalePhotoDiv.append('img').attr('src', d => `assets/images/avgs_decade/${d.femalePhoto}.png`)

				//male
				$photoDivMale = $photoContainerMale
					.selectAll('.photoDiv')
					.data(withPos)
					.enter()
					.append('div')
					.attr('class', d => `photoDiv photoDiv-male photoDiv-male-${d.ID}`)
					.style('left', d => `${d.left}px`)
					.style('top', d => `${d.top}px`)

				$malePhotoDiv = $photoDivMale.append('div').attr('class', 'yearbook-photo male-photo')
				$malePhoto = $malePhotoDiv.append('img').attr('src', d => `assets/images/avgs_decade/${d.malePhoto}.png`)

				//decades
				$decadeLabelDiv = d3.selectAll('.photoDiv').append('div').attr('class', d => `decadeLabel decadeLabel-${d.ID}`)
				d3.selectAll('.decadeLabel-1930_1,.decadeLabel-1940_1,.decadeLabel-1950_1,.decadeLabel-1960_1,.decadeLabel-1970_1,.decadeLabel-1980_1,.decadeLabel-1990_1,.decadeLabel-2000_1,.decadeLabel-2010_1').classed('visible-decade', true)
				$decadeLabel = $decadeLabelDiv.append('p').text(d => `${d.decade}s`)

				//random opacity on photos
				selectRandomPhotos()

				//prepare spans for text
				typer.prepare($avgGridText1);
				typer.prepare($avgGridText2);
			},
			run: async function(){
				await hideShowSection()
				await pause(1)
				await typer.reveal($avgGridText1)
				await drawInLines('.frame__lines__4')
				await pause(0.5)
				await fadeInColorBlocks('.frame4Color', 500)
				await pause($avgGridText1_len)
				await drawOutLines('.frame__lines__4')
				await fadeOutColorBlocks('.frame4Color', 50)
				await slide({ sel: $avgGridText1, state: 'exit', early: true })
				await fadeInPhotos()
				await pause(4)
				await fadeBG('in')
				await pause(0.25)
				await typer.reveal($avgGridText2)
				await pause($avgGridText2_len)
				await slide({ sel: $avgGridText2, state: 'exit', early: true })
				await fadeBG('out')
				await pause(2)
				await genderSplit()
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
