/**
 * Internal dependencies
 */
import { separators } from './designs'

/**
 * External dependencies
 */
import classnames from 'classnames'

const Separator = props => {
	const {
		design,
		className,
		children,
		inverted,
	} = props

	const { shape: SeparatorComp } = separators[ design || 'wave-1' ][ ! inverted ? 'default' : 'inverted' ]

	const classNames = classnames( [
		className,
		'stk-separator__wrapper',
	] )

	return (
		<div className={ classNames }>
			<SeparatorComp
				className="stk-separator__layer-1"
				preserveAspectRatio="none"
				aria-hidden={ true }
			/>
			{ children }
		</div>
	)
}

Separator.defaultProps = {
	className: '',
	design: 'wave-1',
	inverted: false,
}

Separator.Save = props => <Separator { ...props } />

export default Separator
