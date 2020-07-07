/**
 * A Control for selecting designs.
 */
/**
 * External dependencies
 */
import { DesignPanelItem } from '~stackable/components'
import { omit } from 'lodash'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { RadioControl } from '@wordpress/components'

const DesignControl = props => {
	// Convert the options.
	const fixedOptions = props.options.map( option => {
		return {
			...option,
			label: (
				<DesignPanelItem
					imageFile={ option.image }
					imageHoverFile={ option.hoverImage }
					imageWidth={ option.imageWidth }
					imageHeight={ option.imageHeight }
					isPro={ option.isPro }
					label={ option.label }
				/>
			),
			title: option.label,
			value: option.value,
		}
	} )

	const mainClasses = classnames( [
		props.className,
		'ugb-design-control-wrapper',
		'components-base-control',
		`ugb-design-control--columns-${ props.columns }`,
	] )

	return (
		<div className={ mainClasses }>
			{ props.label && <div className="components-base-control__label">{ props.label }</div> }
			<RadioControl
				{ ...omit( props, [ 'label' ] ) }
				className="ugb-design-control"
				selected={ props.selected }
				options={ fixedOptions }
				onChange={ props.onChange }
			/>
		</div>
	)
}

DesignControl.defaultProps = {
	className: '',
	columns: 2,
	selected: '',
	options: [],
	onChange: () => {},
}

export default DesignControl
