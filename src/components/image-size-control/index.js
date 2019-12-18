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

const ImageSizeControl = props => {
	const imageSizeOptions = getImageSizeOptions( props.imageSizes )

	if ( isEmpty( imageSizeOptions ) ) {
		return null
	}

	return <SelectControl
		{ ...props }
		options={ imageSizeOptions }
		className={ classnames( props.className, [ 'ugb--help-tip-image-size' ] ) }
	/>
}

ImageSizeControl.defaultProps = {
	className: '',
	label: __( 'Image Size' ),
	value: 'large',
	onChange: () => {},
}

export default compose( [
	withSelect( select => {
		return {
			imageSizes: select( 'core/block-editor' ).getSettings().imageSizes,
		}
	} ),
] )( ImageSizeControl )
