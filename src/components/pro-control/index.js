import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import ProModal from '../pro-modal'
import { showSmallProNotices } from 'stackable'
import SVGProIcon from './images/pro-icon.svg'

const ProControl = props => {
	const { size = 'normal' } = props
	const {
		title = __( 'Say Hello to Designs 👋' ),
		description = size === 'normal' ? __( 'Get more designs for this block. This feature is only available on Stackable Premium.' ) : __( 'Get more designs on Stackable Premium' ),
		button = __( 'Learn More' ),
	} = props

	const mainClasses = classnames( [
		'ugb-design-control-pro-note',
		`ugb-pro-note__${ size }`,
	], {
		'ugb-pro-note--fade': size === 'small' && showSmallProNotices === 'fade',
	} )

	// Don't show small pro notices at all.
	if ( size === 'small' && ! showSmallProNotices ) {
		return null
	}

	return (
		<div className={ mainClasses }>
			<SVGProIcon />
			{ size !== 'small' && <h4>{ title }</h4> }
			<p>{ description }</p>
			<ProModal button={ button } />
		</div>
	)
}

export default ProControl
