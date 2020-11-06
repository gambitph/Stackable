/**
 * External dependencies
 */
import {
	isEmpty,
	map,
} from 'lodash'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { SelectControl } from '@wordpress/components'
import { withSelect } from '@wordpress/data'
import { compose } from '@wordpress/compose'

const getImageSizeOptions = imageSizes => {
	return map( imageSizes, ( { name, slug } ) => ( { value: slug, label: name } ) )
}

const ImageSizeControl = ( {
	imageSizes,
	value,
	className,
	...propsToPass
} ) => {
	const imageSizeOptions = getImageSizeOptions( imageSizes )

	if ( isEmpty( imageSizeOptions ) ) {
		return null
	}

	return <SelectControl
		{ ...propsToPass }
		value={ value || 'large' }
		options={ imageSizeOptions }
		className={ classnames( className, [ 'ugb--help-tip-image-size' ] ) }
	/>
}

ImageSizeControl.defaultProps = {
	className: '',
	label: __( 'Image Size' ),
	value: 'large',
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
