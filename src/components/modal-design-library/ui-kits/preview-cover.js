/**
 * External dependencies
 */
import { srcUrl } from 'stackable'

/**
 * External dependencies
 */
import SampleImage from '../images/Group 103.png'

const PreviewCover = ( { image } ) => {
	return (
		<div className="ugb-modal-design-library__preview-cover">
			<img src={ `${ srcUrl }/${ SampleImage }` } alt={ image } />
		</div>
	)
}

PreviewCover.defaultProps = {
	image: '',
}

export default PreviewCover
