/**
 * External dependencies
 */
import { BlockCss } from '~stackable/components'

const Styles = props => {
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

export const FlexGapStyles = props => {
	return <Styles { ...props } />
}

FlexGapStyles.Content = props => {
	return <Styles { ...props } />
}

FlexGapStyles.addStyles = ( blockStyleGenerator, props = {} ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		flexGapOptionsEdit = null,
		flexGapOptionsSave = null,
		selector,
		enableColumnGap = true,
	} = props

	if ( ! flexGapOptionsEdit && ! flexGapOptionsSave ) {
		blockStyleGenerator.addBlockStyles( 'columnGap', [ {
			...propsToPass,
			selector,
			styleRule: 'columnGap',
			attrName: 'columnGap',
			key: 'columnGap',
			format: '%spx',
			responsive: 'all',
			enabledCallback: () => enableColumnGap,
		} ] )

		blockStyleGenerator.addBlockStyles( 'rowGap', [ {
			...propsToPass,
			selector,
			styleRule: 'rowGap',
			attrName: 'rowGap',
			key: 'rowGap',
			format: '%spx',
			responsive: 'all',
		} ] )
	}

	if ( flexGapOptionsEdit ) {
		blockStyleGenerator.addBlockStyles( 'columnGap', [ {
			...propsToPass,
			renderIn: 'edit',
			selector,
			styleRule: 'columnGap',
			attrName: 'columnGap',
			key: 'columnGap',
			format: '%spx',
			responsive: 'all',
			enabledCallback: () => enableColumnGap,
		} ] )

		blockStyleGenerator.addBlockStyles( 'rowGap', [ {
			...propsToPass,
			renderIn: 'edit',
			selector,
			styleRule: 'rowGap',
			attrName: 'rowGap',
			key: 'rowGap',
			format: '%spx',
			responsive: 'all',
		} ] )
	}

	if ( flexGapOptionsSave ) {
		blockStyleGenerator.addBlockStyles( 'columnGap', [ {
			...propsToPass,
			renderIn: 'save',
			selector,
			styleRule: 'columnGap',
			attrName: 'columnGap',
			key: 'columnGap',
			format: '%spx',
			responsive: 'all',
			enabledCallback: () => enableColumnGap,
		} ] )

		blockStyleGenerator.addBlockStyles( 'rowGap', [ {
			...propsToPass,
			renderIn: 'save',
			selector,
			styleRule: 'rowGap',
			attrName: 'rowGap',
			key: 'rowGap',
			format: '%spx',
			responsive: 'all',
		} ] )
	}
}
