import { pricingURL, showSmallProNotices } from 'stackable'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import SVGProIcon from './images/pro-icon.svg'

const ProControl = props => {
	const { size = 'normal' } = props
	const {
		title = __( 'Say Hello to Designs 👋' ),
		description = size === 'normal' ? __( 'Get more designs for this block. This feature is only available on Stackable Premium.' ) : __( 'Get more designs on Stackable Premium' ),
		button = __( 'Go Premium' ),
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
			<a href={ pricingURL } target="_blank" className="button button-secondary">{ button }</a>
		</div>
	)
}

export default ProControl
