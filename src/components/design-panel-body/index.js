/**
 * A Panel for selecting designs
 */

import { DesignControl } from '@stackable/components'
import { PanelBody } from '@wordpress/components'

function DesignPanelBody( props ) {
	const {
		options, selected, title = 'Design',
	} = props
	const selectedOption = options.find( opt => opt.value === selected )
	const panelTitle = selectedOption ? `${ title } – ${ selectedOption.label }` : title

	return (
		<PanelBody
			title={ <span>{ panelTitle }</span> }
			className="ugb-design-panel-body"
			{ ...props }
		>
			{ options &&
				<DesignControl { ...props } title={ null } />
			}
			{ props.children }
		</PanelBody>
	)
}

export default DesignPanelBody
