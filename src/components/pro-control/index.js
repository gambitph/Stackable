import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { pricingURL } from 'stackable'

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
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
				<path d="M64.08,136L23,176.66a4.75,4.75,0,0,0,3.53,8.15l86.91,0.14Z" />
				<path d="M177.91,128.39a17,17,0,0,0-5-12.07L71.39,14.72h0L26.61,59.5a17,17,0,0,0-5,12.05h0a17,17,0,0,0,5,12.05L128.16,185.2v-0.07l0,0,44.76-44.76a17,17,0,0,0,5-12h0Z" />
				<path d="M172.95,14.69l-86.83,0,49.42,49.62,40.92-41.16A5,5,0,0,0,172.95,14.69Z" />
			</svg>
			{ size !== 'small' && <h4>{ title }</h4> }
			<p>{ description }</p>
			<a href={ pricingURL } target="_blank" className="button button-secondary">{ button }</a>
		</div>
	)
}

export default ProControl
