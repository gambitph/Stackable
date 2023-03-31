/**
 * External dependencies
 */
import { ProControl } from '~stackable/components'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element'

const ProControlButton = props => {
	const {
		initialOpen,
		...propsToPass
	} = props

	const [ isOpen, setIsOpen ] = useState( initialOpen )

	const wrapperClasses = classnames( [
		'ugb-pro-control-button__wrapper',
	], {
		'ugb-pro-control-button--hidden': ! isOpen,
	} )

	return (
		<div className="components-base-control">
			<button className="ugb-pro-control-more-dots" onClick={ () => setIsOpen( v => ! v ) }>
				<div className="ugb-pro-control-more-dots__dot stk-pulsating-circle"></div>
				<div className="ugb-pro-control-more-dots__dot stk-pulsating-circle"></div>
				<div className="ugb-pro-control-more-dots__dot stk-pulsating-circle"></div>
			</button>
			<div className={ wrapperClasses } >
				<ProControl { ...propsToPass } />
			</div>
		</div>
	)
}

ProControlButton.defaultProps = {
	initialOpen: false,
}

export default ProControlButton
