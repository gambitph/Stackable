/**
 * External dependencies
 */
import { srcUrl } from 'stackable'

function DesignPanelItem( {
	imageFile,
	imageHoverFile,
	imageWidth = '',
	imageHeight = '',
	label,
} ) {
	const src = ! imageFile ? '' :
	            imageFile.match( /https?:/i ) ? imageFile :
	            srcUrl ? `${ srcUrl }/${ imageFile }` :
	            imageFile

	const srcHover = ! imageHoverFile ? null :
	                 imageHoverFile.match( /https?:/i ) ? imageHoverFile :
	                 srcUrl ? `${ srcUrl }/${ imageHoverFile }` :
	                 imageHoverFile

	return (
		<span className="ugb-design-panel-item">
			{ srcHover &&
				<img className="ugb-design-panel-item__hover-image" src={ srcHover } alt={ label } width={ imageWidth } height={ imageHeight } />
			}
			{ src &&
				<img className="ugb-design-panel-item__image" src={ src } alt={ label } width={ imageWidth } height={ imageHeight } />
			}
			<span className="design-label">
				{ label }
			</span>
		</span>
	)
}

export default DesignPanelItem
