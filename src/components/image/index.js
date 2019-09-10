/**
 * External dependencies
 */
import classnames from 'classnames'

const Image = props => {
	const imageClasses = classnames( [
		props.className,
		'ugb-img',
	], {
		// Responsive.
		[ `wp-image-${ props.imageId }` ]: props.imageId,

		// Shape.
		'ugb-img--shape': props.shape,
	} )

	return (
		<img
			className={ imageClasses }
			src={ props.src || undefined }
			alt={ props.alt || undefined }
			width={ props.width || undefined }
			height={ props.height || undefined }
		/>
	)
}

Image.defaultProps = {
	imageId: '',

	alt: '',
	src: '',
	size: 'full',

	width: '',
	height: '',

	shape: '',
}

export default Image
