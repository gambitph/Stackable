import { srcUrl } from 'stackable'

function DesignPanelItem( {
	imageFile, label,
} ) {
	const src = imageFile.match( /https?:/i ) ? imageFile :
		srcUrl ? `${ srcUrl }/${ imageFile }` :
			imageFile

	return (
		<span>
			<img src={ src } alt={ label } />
			<span className="design-label">
				{ label }
			</span>
		</span>
	)
}

export default DesignPanelItem
