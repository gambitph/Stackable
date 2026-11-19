/**
 * Internal dependencies
 */
import { separators } from './separators'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { getPropsWithDefaults } from '../../util/props'

const Separator = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, SEPARATOR_DEFAULT_PROPS )
	const { shape: SeparatorComp, shadow: ShadowComp } = separators[ props.design || 'wave-1' ][ ! props.inverted ? 'default' : 'inverted' ]

	const mainClasses = classnames( [
		props.className,
		'ugb-separator-wrapper',
	] )

	return (
		<div className={ mainClasses }>
			{ props.shadow && (
				<ShadowComp
					className="ugb-separator__shadow"
					preserveAspectRatio="none"
					aria-hidden="true"
				/>
			) }
			<SeparatorComp
				className="ugb-separator__layer-1"
				preserveAspectRatio="none"
				aria-hidden="true"
			/>
			{ props.children }
		</div>
	)
}

const SEPARATOR_DEFAULT_PROPS = {
	className: '',
	design: 'wave-1',
	shadow: false,
	inverted: false,
}

Separator.Save = props => <Separator { ...props } />

export default Separator
