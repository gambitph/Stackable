/**
 * External dependencies
 */
import classnames from 'classnames'
import striptags from 'striptags'
import { getPropsWithDefaults } from '../../../../util/props'

const Image = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, IMAGE_DEFAULT_PROPS )
	const imageClasses = classnames( [
		props.className,
		'ugb-img',
	], {
		// Responsive.
		[ `wp-image-${ props.imageId }` ]: props.imageId,

		// Shape.
		'ugb-img--shape': props.shape,

		// Firefox doesn't do stretching via SVG attribute and needs to be done via CSS.
		'ugb-image--shape-stretch': props.shapeStretch,

		// Shadow is only available when there is no shape.
		[ `ugb--shadow-${ props.shadow }` ]: ! props.shape && props.shadow,
	} )

	return (
		<img
			className={ imageClasses }
			src={ props.src || undefined }
			alt={ striptags( props.alt || undefined ) }
			title={ striptags( props.title || undefined ) }
			width={ props.width || undefined }
			height={ props.height || undefined }
		/>
	)
}

const IMAGE_DEFAULT_PROPS = {
	imageId: '',

	alt: '',
	title: '',
	src: '',
	size: 'full',

	width: '',
	height: '',

	shape: '',
	shapeStretch: false,
	shadow: '',
}

export default Image
