/**
 * External dependencies
 */
import {
	__getValue, useStyles, getStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

const getStyleParams = ( options = {} ) => {
	const {
		selector = '',
	} = options

	return [
		{
			renderIn: 'edit',
			selectorCallback: getAttribute => `[data-block="${ getAttribute( 'clientId' ) }"]`,
			styleRule: 'flex',
			attrName: 'columnWidth',
			responsive: [ 'desktopTablet', 'tabletOnly', 'mobile' ],
			// format: '0 1 calc(%s% - var(--stk-column-gap, 0px))',
			format: '0 1 %s%',
			dependencies: [ 'columnAdjacentCount' ],
			valueCallback: ( value, getAttribute, device ) => {
				if ( device === 'desktop' ) {
					return value
				}
				const adjacentCount = getAttribute( 'columnAdjacentCount', device )
				if ( adjacentCount ) {
					return value.replace( /([\d\.]+%)$/, `calc($1 - var(--stk-column-gap, 0px) * ${ adjacentCount - 1 } / ${ adjacentCount } )` )
				}
				return value
			},
		},
		// We need to add a maxWidth in the editor since the re-resizable box
		// can mess up the snapping if the column width is too small, then
		// resizes to a larger size.
		{
			renderIn: 'edit',
			selectorCallback: getAttribute => `[data-block="${ getAttribute( 'clientId' ) }"]`,
			styleRule: 'maxWidth',
			attrName: 'columnWidth',
			responsive: [ 'desktopTablet', 'tabletOnly', 'mobile' ],
			format: '%s%',
			dependencies: [ 'columnAdjacentCount' ],
			valueCallback: ( value, getAttribute, device ) => {
				if ( device === 'desktop' ) {
					return value
				}
				const adjacentCount = getAttribute( 'columnAdjacentCount', device )
				if ( adjacentCount ) {
					return value.replace( /([\d\.]+%)$/, `calc($1 - var(--stk-column-gap, 0px) * ${ adjacentCount - 1 } / ${ adjacentCount } )` )
				}
				return value
			},
		},
		{
			renderIn: 'save',
			selector,
			styleRule: 'flex',
			attrName: 'columnWidth',
			responsive: [ 'desktopTablet', 'tabletOnly', 'mobile' ],
			format: '0 1 %s%',
			dependencies: [ 'columnAdjacentCount' ],
			valueCallback: ( value, getAttribute, device ) => {
				if ( device === 'desktop' ) {
					return value
				}

				const adjacentCount = getAttribute( 'columnAdjacentCount', device )
				if ( adjacentCount ) {
					return value.replace( /([\d\.]+%)$/, `calc($1 - var(--stk-column-gap, 0px) * ${ adjacentCount - 1 } / ${ adjacentCount } )` )
				}
				return value
			},
		},
	]
}

const _getStyles = ( attributes, options = {} ) => {
	const {
		selector = '',
	} = options
	const getValue = __getValue( attributes )

	return {
		editor: {
			custom: {
				[ `.stk-preview-device-desktop :where(.block-editor-block-list__layout) [data-block="${ attributes.clientId }"],
				.stk-preview-device-tablet :where(.block-editor-block-list__layout) [data-block="${ attributes.clientId }"]` ]: {
					flex: getValue( 'columnWidth', '0 1 calc(%s% - var(--stk-column-gap, 0px))' ),
					// maxWidth: getValue( 'columnWidth', '%s%' ),
				},
				[ `.stk-preview-device-tablet :where(.block-editor-block-list__layout) [data-block="${ attributes.clientId }"]` ]: {
					flex: getValue( 'columnWidthTablet', '0 1 calc(%s% - var(--stk-column-gap, 0px))' ),
					// maxWidth: getValue( 'columnWidthTablet', '%s%' ),
				},
				[ `.stk-preview-device-mobile :where(.block-editor-block-list__layout) [data-block="${ attributes.clientId }"]` ]: {
					flex: getValue( 'columnWidthMobile', '0 1 calc(%s% - var(--stk-column-gap, 0px))' ),
					// maxWidth: getValue( 'columnWidthMobile', '%s%' ),
				},
			},
		},
		saveOnly: {
			desktopTablet: {
				[ selector ]: {
					flex: getValue( 'columnWidth', '0 1 calc(%s% - var(--stk-column-gap, 0px))' ),
					// maxWidth: getValue( 'columnWidth', '%s%' ),
				},
			},
			tabletOnly: {
				[ selector ]: {
					flex: getValue( 'columnWidthTablet', '0 1 calc(%s% - var(--stk-column-gap, 0px))' ),
					// maxWidth: getValue( 'columnWidthTablet', '%s%' ),
				},
			},
			mobile: {
				[ selector ]: {
					flex: getValue( 'columnWidthMobile', '0 1 calc(%s% - var(--stk-column-gap, 0px))' ),
					// maxWidth: getValue( 'columnWidthMobile', '%s%' ),
				},
			},
		},
	}
}

export const Style = props => {
	const {
		attributes,
		...propsToPass
	} = props

	const styles = useStyles( attributes, getStyleParams() )

	return (
		<StyleComponent
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}

Style.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	const styles = getStyles( propsToPass.attributes, getStyleParams() )

	return (
		<StyleComponent.Content
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}
