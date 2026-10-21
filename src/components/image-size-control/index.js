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
import { getPropsWithDefaults } from '../../util/props'

const getImageSizeOptions = imageSizes => {
	return map( imageSizes, ( { name, slug } ) => ( { value: slug, label: name } ) )
}

const ImageSizeControl = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, IMAGE_SIZE_CONTROL_DEFAULT_PROPS )
	const {
		imageSizes,
		value,
		className,
		defaultValue,
		...propsToPass
	} = props
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

const IMAGE_SIZE_CONTROL_DEFAULT_PROPS = {
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
