/* eslint-disable no-console */
const chalk = require( 'chalk' )

console.warn( chalk.bgRed( 'Use this build to debug using the React profiler. For profiling to work, ensure some things are in place:' ) )
console.warn( chalk.redBright( '' ) )
console.warn( chalk.redBright( '1. Ensure that the React DevTools extension is installed in your browser' ) )
console.warn( chalk.redBright( '' ) )
console.warn( chalk.redBright( '2. wp-config.php in your WordPress root should contain:' ) )
console.warn( chalk.redBright( 'define( \'SCRIPT_DEBUG\', true );' ) )

// Wait a bit.
;( async () => {
	await new Promise( resolve => setTimeout( resolve, 3000 ) )
} )()
