/**
 * External dependencies
 */
import { ProControl } from '~stackable/components'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element'
import { getPropsWithDefaults } from '../../util/props'

const ProControlButton = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, PRO_CONTROL_BUTTON_DEFAULT_PROPS )
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
		<div className="components-base-control ugb-pro-control-button">
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

const PRO_CONTROL_BUTTON_DEFAULT_PROPS = {
	initialOpen: false,
}

export default ProControlButton
