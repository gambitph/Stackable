/**
 * Internal dependencies
 */
import { separators } from './designs'
import { getPropsWithDefaults } from '../../util/props'

const Separator = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, SEPARATOR_DEFAULT_PROPS )
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

const SEPARATOR_DEFAULT_PROPS = {
	className: '',
	design: 'wave-1',
	inverted: false,
	layer: 1,
}

Separator.Content = props => <Separator { ...props } />

export default Separator
