/**
 * External dependencies
 */
import { BlockCss } from '~stackable/components'

import { memo } from '@wordpress/element'

const Styles = memo( props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selector = '',
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="marginBottom"
				attrName="blockMarginBottom"
				key="blockMarginBottom"
				responsive="all"
				format="%spx"
			/>
		</>
	)
} )

export const Style = props => {
	return <Styles { ...props } />
}

Style.Content = props => {
	return <Styles { ...props } />
}
