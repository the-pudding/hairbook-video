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

async function run() {
	await hideShowSection()
	await typer.prepare($outro1)
  await typer.prepare($outro2)
	await pause(1)
	await typer.reveal($outro1)
	await pause(3.5)
	await slide({ sel: $outro1, state: 'exit', early: true })
	await pause(1)
	await typer.reveal($outro2)
	await pause(3.5)
	await slide({ sel: $outro2, state: 'exit', early: true })

}

function init() {
  typer.prepare($title);
  typer.prepare($byline);
}

export default { init, run };
