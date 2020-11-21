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
import { doAction, hasAction } from '@wordpress/hooks'
import { Button } from '@wordpress/components'
import { useSelect } from '@wordpress/data'

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

// Create a custom description component.
const Description = ( { description } ) => {
	const selectedBlockId = useSelect( select => select( 'core/block-editor' ).getSelectedBlockClientId() )
	const block = useSelect( select => select( 'core/block-editor' ).getBlocksByClientId( selectedBlockId ) )

	return (
		<div>
			<div className="ugb-block-description">{ description }</div>
			{ !! block && hasAction( `stackable.design-layout-selector.${ selectedBlockId }` ) && (
				<div>
					<Button
						onClick={ () => {
							doAction( `stackable.design-layout-selector.${ selectedBlockId }`, ( { isOpen: true } ) )
						} }
						isSecondary
						isLarge
					>
						{ __( 'Switch design/layout', i18n ) }
					</Button>
				</div>
			) }
		</div>
	)
}

// Import all index.js and register all the blocks found (if name & settings are exported by the script)
const importAllAndRegister = r => {
	r.keys().forEach( key => {
		const { name, settings } = r( key )
		try {
			const description = name && settings && <Description description={ settings.description } />
			return name && settings && registerBlock( name, { ...settings, description } )
		} catch ( error ) {
			console.error( `Could not register ${ name } block` ) // eslint-disable-line
		}
	} )
}

importAllAndRegister( require.context( './block', true, /index\.js$/ ) )
