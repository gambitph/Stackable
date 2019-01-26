import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { pricingURL } from 'stackable'
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
	] )

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
