/* eslint-env node */

const path = require( 'path' )
const glob = require( 'glob' )
const minimatch = require( 'minimatch' )

const { buildInclude } = require( '../../../../gulpfile' )

describe( 'Site Kit runtime package', () => {
	test( 'includes the schema required by the PHP validator', () => {
		const schemaPath = path.resolve( __dirname, '../site-kit-v1.schema.json' )
		const includes = buildInclude.filter( pattern => ! pattern.startsWith( '!' ) )
		const excludes = buildInclude.filter( pattern => pattern.startsWith( '!' ) ).map( pattern => pattern.slice( 1 ) )
		const packagedFiles = new Set( includes
			.flatMap( pattern => glob.sync( pattern, { nodir: true } ) )
			.filter( file => ! excludes.some( pattern => minimatch( file, pattern ) ) )
			.map( file => path.resolve( file ) ) )

		expect( packagedFiles ).toContain( schemaPath )
	} )
} )
