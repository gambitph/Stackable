/**
 * Wordpress dependencies
 */
import { useState } from '@wordpress/element'
import { PanelAdvancedSettings } from '~stackable/components'

const GlobalSettingsPanel = props => {
	const {
		title,
	} = props
	const [ isPanelOpen, setIsPanelOpen ] = useState( false )

	const handleToggle = () => {
		setIsPanelOpen( toggle => ! toggle )
	}

	return (
		<PanelAdvancedSettings
			title={ title }
			initialOpen={ false }
			opened={ isPanelOpen }
			onToggle={ handleToggle }>
			{ props.children && <div>{ props.children }</div> }
		 </PanelAdvancedSettings>
	)
}

GlobalSettingsPanel.defaultProps = {
	title: '',
}

export default GlobalSettingsPanel

