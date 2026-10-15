import classnames from 'classnames'
import { Tooltip as _Tooltip } from '@wordpress/components'
import { getPropsWithDefaults } from '../../util/props'

const Tooltip = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, TOOLTIP_DEFAULT_PROPS )
	return (
		<_Tooltip
			{ ...props }
			className={ classnames( [ props.className, 'stk-tooltip' ] ) }
			text={
				<span className="stk-tooltip__text">
					{ props.text }
				</span>
			}
		/>
	)
}

const TOOLTIP_DEFAULT_PROPS = {
	className: '',
}

export default Tooltip
