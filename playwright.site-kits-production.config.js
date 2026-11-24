const fs = require( 'fs' )
const os = require( 'os' )
const path = require( 'path' )

process.env.WP_PORT = process.env.WP_PORT || '9422'

const config = require( './playwright.config' )

const developmentBlueprint = path.join( __dirname, 'e2e/playground-blueprint.json' )
const productionBlueprint = path.join( os.tmpdir(), `stackable-site-kits-production-${ process.pid }.json` )
const productionStorageState = path.join( __dirname, 'e2e/.auth/admin-site-kits-production.json' )
const blueprint = JSON.parse( fs.readFileSync( developmentBlueprint, 'utf8' ) )
blueprint.steps = blueprint.steps.map( step => {
	if ( step.step !== 'defineWpConfigConsts' ) {
		return step
	}

	const consts = { ...step.consts }
	delete consts.WP_ENV
	return Object.keys( consts ).length ? { ...step, consts } : null
} ).filter( Boolean )
fs.writeFileSync( productionBlueprint, JSON.stringify( blueprint ) )
process.once( 'exit', () => fs.rmSync( productionBlueprint, { force: true } ) )
process.env.STORAGE_STATE_PATH = productionStorageState

module.exports = {
	...config,
	testDir: './e2e/production-tests',
	webServer: {
		...config.webServer,
		command: config.webServer.command.replace( developmentBlueprint, productionBlueprint ),
	},
	use: {
		...config.use,
		storageState: productionStorageState,
	},
	reporter: process.env.CI
		? config.reporter
		: [ [ 'list' ], [ 'html', { outputFolder: 'playwright-report-site-kits-production', open: 'never' } ] ],
}
