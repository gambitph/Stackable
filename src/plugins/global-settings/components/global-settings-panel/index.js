/**
 * External dependencies
 */
import { UncollapsiblePanelBody } from '~stackable/components'

/**
 * Wordpress dependencies
 */
import { Button } from '@wordpress/components'

const GlobalSettingsPanel = props => (
	<UncollapsiblePanelBody
		title={ props.title }
		sideRender={
			props.onClickAddStyle && ( <Button
				isDefault
				onClick={ props.onClickAddStyle }
			>
                Add style
			</Button> )
		}>
		{ props.children }
	</UncollapsiblePanelBody>
)

export default GlobalSettingsPanel

