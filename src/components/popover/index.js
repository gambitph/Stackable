import { Popover as Popover_ } from '@wordpress/components'
import classNames from 'classnames'

const NOOP = () => {}

const Popover = props => {
	return <Popover_
		{ ...props }
		className={ classNames( 'stk-popover', props.className ) }
		onKeyDown={ ev => {
			// Hitting escape blurs the block, so we need to prevent that.
			if ( ev.keyCode === 27 ) {
				ev.preventDefault()
				ev.stopPropagation()
				props.onEscape()
				return
			}

			if ( props.onKeyDown ) {
				props.onKeyDown( ev )
			}
		} }
	/>
}

Popover.defaultProps = {
	className: '',
	onEscape: NOOP,
}

export default Popover
