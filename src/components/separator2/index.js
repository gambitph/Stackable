/**
 * Internal dependencies
 */
import { separators } from './designs'

const Separator = props => {
	const {
		design,
		inverted,
		layer,
	} = props

	const { shape: SeparatorComp } = separators[ design || 'wave-1' ][ ! inverted ? 'default' : 'inverted' ]

	return (
		<SeparatorComp
			className={ `stk-separator__layer-${ layer }` }
			preserveAspectRatio="none"
			aria-hidden={ true }
		/>
	)
}

Separator.defaultProps = {
	className: '',
	design: 'wave-1',
	inverted: false,
	layer: 1,
}

Separator.Content = props => <Separator { ...props } />

export default Separator
