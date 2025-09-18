const fetchBlockStyleGenerators = r => {
	const blockStyleGenerators = {}
	r.keys().forEach( key => {
		const styleGenerator = r( key ).default

		// Get the folder name from the key (e.g., './feature/style.js' => 'feature')
		const match = key.match( /^\.\/([^/]+)\// )
		const blockName = match ? match[ 1 ] : null

		if ( blockName ) {
			blockStyleGenerators[ `stackable/${ blockName }` ] = styleGenerator
		}
	} )

	return blockStyleGenerators
}

export const blockStyleGenerators = fetchBlockStyleGenerators( require.context( '../../block', true, /style\.js$/ ) )
