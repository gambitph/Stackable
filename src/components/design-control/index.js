/**
 * A Control for selecting designs.
 */

import { DesignPanelItem } from '@stackable/components'
import { RadioControl } from '@wordpress/components'

function DesignControl( props ) {
	const {
		selected, options, onChange,
	} = props

	// Convert the options.
	const fixedOptions = options.map( option => {
		return {
			...option,
			label: <DesignPanelItem imageFile={ option.image } imageHoverFile={ option.hoverImage } isPro={ option.isPro } label={ option.label } />,
			title: option.label,
			value: option.value,
		}
	} )

	return (
		<RadioControl
			{ ...props }
			className="ugb-design-control"
			selected={ selected }
			options={ fixedOptions }
			onChange={ onChange }
		/>
	)
}

export default DesignControl
