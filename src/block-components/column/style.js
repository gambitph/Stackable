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
			selectorCallback: getAttribute => `.wp-block[data-block="${ getAttribute( 'clientId' ) }"]`,
			styleRule: 'flex',
			attrName: 'columnWidth',
			responsive: [ 'desktopTablet', 'tabletOnly', 'mobile' ],
			format: '1 1 %s%',
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
			selectorCallback: getAttribute => `.wp-block[data-block="${ getAttribute( 'clientId' ) }"]`,
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
			format: '1 1 %s%',
			dependencies: [ 'columnAdjacentCount' ],
			valueCallback: ( _value, getAttribute, device ) => {
				// Flex grow should be turned on in desktop, so negative margins
				// can make the columns expand. (e.g. 50% 50% then -200px margin
				// left on 2nd column).
				//
				// In tablet/mobile, don't allow expanding since columns would
				// always expand to the available space (so you can't do a 30%
				// 30% columns in tablet/mobile, they will expand to 50% 50%)
				//
				// No need to do this in the editor since it already does this.
				const value = device === 'desktop' ? _value : _value.replace( /^1 1/, '0 1' )

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
