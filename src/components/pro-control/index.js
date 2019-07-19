import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { i18n } from 'stackable'
import ProModal from '../pro-modal'
import SVGProIcon from './images/pro-icon.svg'

const ProControl = props => {
	const {
		title = __( 'Say Hello to More Layouts 👋', i18n ),
		description = __( 'Get more layouts for this block. This feature is only available on Stackable Premium.', i18n ),
		button = __( 'Learn More', i18n ),
	} = props

	const mainClasses = classnames( [
		'ugb-design-control-pro-note',
	] )

	return (
		<div className={ mainClasses }>
			<SVGProIcon />
			<h4>{ title }</h4>
			<p>{ description }</p>
			<ProModal button={ button } />
		</div>
	)
}

export default ProControl
