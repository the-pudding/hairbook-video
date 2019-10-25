/* global d3 */
import './utils/render-d3-video'
import loadData from './load-data'
import './pudding-chart/stylelines'
import './pudding-chart/trendlines'
import './pudding-chart/yearbook_photos'
import './pudding-chart/hair_dimensions'
import './pudding-chart/stylelines'
import intro from './intro'
import outro from './outro'
import texture from './texture';


let chartStyles = null;
let styleData = null;
let chartTrends = null;
let femaleTrendData = null;
let maleTrendData = null;
let genderTrendData = null;
let discrimData = null;
let chartPhotos = null;
let photoData = null;
let chartDimensions = null;
let dimensionData = null;
let dimData = null;
let combinedStyleData = []
let combinedTrendData = []

/* dom */
const $trendLines = d3.select('#trendlines figure')
const $yearbookPhotos = d3.select('#yearbook_photos figure')
const $dimensionPhotos = d3.select('#hair_dimensions')

/* render dimensions */
function setupDimensionPhotos(data) {
  chartDimensions = $dimensionPhotos
    .datum(data)
    .puddingHairDimensions()
}

/* render stylelines chart */
function setupStyleLines(data, style) {
  const $styleContainer = d3.selectAll(`#${style}`)
  const $styleChart = $styleContainer.select('figure')
  chartStyles = $styleChart
    .datum(data)
    .puddingStyleLines(style)
}

/* render photo grid */
function setupYearbookPhotos(data) {
  chartPhotos = $yearbookPhotos
    .datum(data)
    .puddingYearbookPhotos()
}

/* render gender trends chart */
function setupTrendLines(data) {
  chartTrends = $trendLines
    .datum(data)
    .puddingTrendLines()
}

function fadeInPhotos() {
  const photoDivs = d3.selectAll('.yearDiv')

  photoDivs
    .transition()
		.delay((d, i) => i * 15)
		.ease(d3.easeLinear)
    .style('opacity', 1)
}

async function runAll() {
  const start = d3.now();
  await intro.run()
  await chartDimensions.run()
  await chartStyles.run()
  await chartPhotos.run()
  await chartTrends.run()
  await outro.run()
  const end = d3.now();
  const diff = end - start;
  const frames = Math.round(diff / 1000 * 60)
  console.log({ frames })
}


// create a global function for render-d3-video to kickoff OR manually below
window.renderD3Video =  function renderD3Video({ width, height }) {
  return new Promise(resolve => {
    d3.select('main')
      .style('width', `${width}px`)
      .style('height', `${height}px`);

    runAll()

  resolve();
 })
};

function resize() {}

function devStart() {
  if (window.currentTime === undefined) {
   window.renderD3Video({ width: 1920, height: 1080 });
  }
}

function init() {

  loadData().then(result => {
    // organize data
    femaleTrendData = result[0]
    maleTrendData = result[1]
    styleData = result[2]
    dimData = result[3]
    photoData = result[4]
    dimensionData = result[5]
    genderTrendData = femaleTrendData.concat(maleTrendData)
    combinedStyleData.push(styleData, dimData)

    texture.init();

    // build dimensions
    setupDimensionPhotos(dimensionData)

    //build style lines
    setupStyleLines(combinedStyleData, 'beehive')
    setupStyleLines(combinedStyleData, 'mullet')
    setupStyleLines(combinedStyleData, 'longstraight')

    // build photo grid
    setupYearbookPhotos(photoData)

    // build gender trend lines
    setupTrendLines(genderTrendData)

    // determine if we need to manually invoke rendering
    d3.timeout(devStart, 100);
  })
}

export default { init, resize };
