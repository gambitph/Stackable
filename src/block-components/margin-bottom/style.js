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
		selector = '',
	} = props

	return (
		<>
			{ attributeHasValue( 'blockMarginBottom', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="marginBottom"
					attrName="blockMarginBottom"
					responsive="all"
					format="%spx"
				/>
			}

		</>
	)
}

export const Style = props => {
	return <Styles { ...props } />
}

Style.Content = props => {
	return <Styles { ...props } />
}
