/**
 * Internal dependencies
 */
import { AdvancedSelectControl } from '..'
import { i18n } from 'stackable'

/**
 * External dependencies
 */
import {
	isEmpty,
	map,
} from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { withSelect } from '@wordpress/data'
import { compose } from '@wordpress/compose'

const getImageSizeOptions = imageSizes => {
	return map( imageSizes, ( { name, slug } ) => ( { value: slug, label: name } ) )
}

const ImageSizeControl = ( {
	imageSizes,
	value,
	className,
	defaultValue,
	...propsToPass
} ) => {
	const imageSizeOptions = getImageSizeOptions( imageSizes )

	if ( isEmpty( imageSizeOptions ) ) {
		return null
	}

	return <AdvancedSelectControl
		{ ...propsToPass }
		value={ value || 'large' }
		options={ imageSizeOptions }
		className={ className }
		defaultValue={ defaultValue || 'large' }
		default={ defaultValue || 'large' }
	/>
}

ImageSizeControl.defaultProps = {
	className: '',
	label: __( 'Image Size', i18n ),
	value: 'large',
	defaultValue: '',
	imageSizes: [],
	onChange: () => {},
}

export default compose( [
	withSelect( select => {
		return {
			imageSizes: select( 'core/block-editor' ).getSettings().imageSizes,
		}
	} ),
] )( ImageSizeControl )
