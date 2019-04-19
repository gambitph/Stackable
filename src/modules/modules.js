const modules = {}

export const registerModule = ( moduleName, moduleFunction ) => {
	modules[ moduleName ] = moduleFunction
}

export const getModule = moduleName => modules[ moduleName ]

export const initBlockModule = ( blockName, moduleName, options = {} ) => {
	const module = getModule( moduleName )
	if ( module ) {
		module( blockName, options )
	}
}
