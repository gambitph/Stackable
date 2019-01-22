/**
 * A Control for selecting designs.
 */

import { DesignPanelItem } from '@stackable/components'
import { doAction } from '@wordpress/hooks'
import { isPro } from 'stackable'
import { RadioControl } from '@wordpress/components'

function DesignControl( props ) {
	const {
		selected, options, onChange,
	} = props

	// Convert the options.
	const fixedOptions = options.map( option => {
		return {
			label: <DesignPanelItem imageFile={ option.image } isPro={ option.isPro } label={ option.label } />,
			title: option.label,
			value: option.value,
		}
	} )

	const onChangeHandler = value => {
		const selectedOption = fixedOptions.find( opt => opt.value === value )
		if ( ! isPro ) {
			if ( selectedOption.isPro ) {
				doAction( 'stackable.get_pro' )
				return
			}
		}
		onChange( value )
	}

	return (
		<RadioControl
			{ ...props }
			className="ugb-design-control"
			selected={ selected }
			options={ fixedOptions }
			onChange={ onChangeHandler }
		/>
	)
}

export default DesignControl
