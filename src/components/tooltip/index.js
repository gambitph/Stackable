import classnames from 'classnames'
import { Tooltip as _Tooltip } from '@wordpress/components'

const Tooltip = props => {
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

Tooltip.defaultProps = {
	className: '',
}

export default Tooltip
