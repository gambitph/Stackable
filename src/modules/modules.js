/**
 * Internal dependencies
 */
import { modules as modulesToRegister } from './'

const modules = {}

export const registerModule = ( moduleName, moduleFunction ) => {
	modules[ moduleName ] = moduleFunction
}

export const getModule = moduleName => modules[ moduleName ]

export const initBlockModule = ( blockName, moduleName, options = {} ) => {
	if ( ! getModule( moduleName ) ) {
		const moduleFound = modulesToRegister.reduce( ( moduleFound, { name, module } ) => {
			return moduleName === name ? module : moduleFound
		}, null )
		if ( moduleFound ) {
			registerModule( moduleName, moduleFound )
		}
	}
	const module = getModule( moduleName )
	if ( module ) {
		module( blockName, options )
	}
}
