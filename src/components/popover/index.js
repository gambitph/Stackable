import { Popover as Popover_ } from '@wordpress/components'
import classNames from 'classnames'

const Popover = props => {
	return <Popover_
		{ ...props }
		className={ classNames( 'stk-popover', props.className ) }
	/>
}

Popover.defaultProps = {
	className: '',
}

export default Popover
