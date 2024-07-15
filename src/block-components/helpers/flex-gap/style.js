/**
 * External dependencies
 */
import { BlockCss } from '~stackable/components'

import { memo } from '@wordpress/element'

const _Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selector,
		enableColumnGap = true,
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="columnGap"
				attrName="columnGap"
				key="columnGap"
				format="%spx"
				responsive="all"
				enabledCallback={ () => enableColumnGap }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="rowGap"
				attrName="rowGap"
				key="rowGap"
				format="%spx"
				responsive="all"
			/>
		</>
	)
}

const Styles = memo( _Styles )
Styles.Content = _Styles

export const FlexGapStyles = props => {
	return <Styles { ...props } />
}

FlexGapStyles.Content = props => {
	return <Styles.Content { ...props } />
}
