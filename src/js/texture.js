const $imgTexture = d3.selectAll('.texture img');
const sz = $imgTexture.size();
let cur = -1;

function next() {
	let found = null;
	while (!found) {
		const v = Math.floor(Math.random() * sz);
		if (v !== cur) {
			cur = v;
			found = true;
		}
	}
}

function cycle() {
  $imgTexture
		.style('opacity', (d, i) => (i === cur ? 0.15 : 0))
		.transition()
		.delay(20)
		.on('end', (d, i) => {
			if (i === 0) {
				next();
				cycle();
			}
		});
}

function init() {
	next();
	cycle();
}

export default { init };
