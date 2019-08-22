/**
 * External dependencies
 */
import { srcUrl } from 'stackable'

function DesignPanelItem( {
	imageFile, imageHoverFile, label,
} ) {
	const src = imageFile.match( /https?:/i ) ? imageFile :
	            srcUrl ? `${ srcUrl }/${ imageFile }` :
	            imageFile

	const srcHover = ! imageHoverFile ? null :
	                 imageHoverFile.match( /https?:/i ) ? imageHoverFile :
	                 srcUrl ? `${ srcUrl }/${ imageHoverFile }` :
	                 imageHoverFile

	return (
		<span className="ugb-design-panel-item">
			{ srcHover &&
				<img className="ugb-design-panel-item__hover-image" src={ srcHover } alt={ label } />
			}
			<img className="ugb-design-panel-item__image" src={ src } alt={ label } />
			<span className="design-label">
				{ label }
			</span>
		</span>
	)
}

export default DesignPanelItem
