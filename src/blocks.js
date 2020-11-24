/**
 * This is the file that Webpack is compiling into editor_blocks.js
 */

/**
 * Internal dependencies
 */
import './format-types'
import './plugins'
import './help'
import './compatibility'
import { SVGStackableCategoryIcon } from './icons'
import { supportsBlockCollections } from './util'

/**
 * External dependencies
 */
import registerBlock from '~stackable/register-block'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	getCategories,
	setCategories,
	registerBlockCollection,
} from '@wordpress/blocks'
import { __ } from '@wordpress/i18n'

window.stkDebug = {
	start( name ) {
		if ( this[ name ] ) {
			this[ name ] = {
				callCount: ( this[ name ].callCount || 0 ) + 1,
				runTime: this[ name ].runTime - Date.now(),
			}
		} else {
			this[ name ] = {
				callCount: 1,
				runTime: -Date.now(),
			}
		}
	},

	end( name ) {
		if ( this[ name ] ) {
			this[ name ] = {
				...this[ name ],
				runTime: this[ name ].runTime + Date.now(),
			}
		} else {
			this[ name ] = {
				runTime: Date.now(),
			}
		}
	},

	get( name ) {
		return this[ name ]
	},

	getAll() {
		return window.lodash.omit( this, 'start', 'end', 'get', 'getAll' )
	},
}

window.wp.domReady( () => {
	console.log( window.stkDebug.getAll() ) // eslint-disable-line no-console
} )

// Register our block collection or category (WP <= 5.3).
if ( supportsBlockCollections() ) {
	registerBlockCollection( 'ugb', {
		title: __( 'Stackable', i18n ),
		icon: SVGStackableCategoryIcon,
	} )
} else {
	setCategories( [
		...getCategories(),
		{
			slug: 'stackable',
			title: __( 'Stackable', i18n ),
			icon: SVGStackableCategoryIcon,
		},
	] )
}

// Import all index.js and register all the blocks found (if name & settings are exported by the script)
const importAllAndRegister = r => {
	r.keys().forEach( key => {
		const { name, settings } = r( key )
		try {
			return name && settings && registerBlock( name, settings )
		} catch ( error ) {
			console.error( `Could not register ${ name } block` ) // eslint-disable-line
		}
	} )
}

importAllAndRegister( require.context( './block', true, /index\.js$/ ) )
