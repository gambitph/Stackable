import advancedSpacing from './advanced-spacing'
import { applyFilters } from '@wordpress/hooks'
import customCSS from './custom-css'
import { registerModule } from './modules'
export { getModule, initBlockModule } from './modules'
export { default as advancedSpacing } from './advanced-spacing'
export { default as customCSS } from './custom-css'

const modules = [
	{ name: 'advanced-spacing', module: advancedSpacing },
	{ name: 'custom-css', module: customCSS },
]

applyFilters( 'stackable.modules.register', modules ).forEach( ( { name, module } ) => {
	registerModule( name, module )
} )
