/**
 * External dependencies
 */
import { BlockCss } from '~stackable/components'
import { attributeHasValue } from '~stackable/util'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		attributes,
		selector,
		enableColumnGap = true,
	} = props

	return (
		<>
			{ attributeHasValue( 'columnGap', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="columnGap"
					attrName="columnGap"
					format="%spx"
					responsive="all"
					enabledCallback={ () => enableColumnGap }
				/>
			}
			{ attributeHasValue( 'rowGap', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="rowGap"
					attrName="rowGap"
					format="%spx"
					responsive="all"
				/>
			}
		</>
	)
}

export const FlexGapStyles = props => {
	return <Styles { ...props } />
}

FlexGapStyles.Content = props => {
	return <Styles { ...props } />
}
