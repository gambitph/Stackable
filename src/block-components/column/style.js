/**
 * External dependencies
 */
import { __getValue } from '~stackable/util'
import { BlockCss } from '~stackable/components'

const ColumnStyles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selector = '',
		dependencies = [],
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]` }
				styleRule="flex"
				attrName="columnWidth"
				key="columnWidth-flex"
				responsive={ [ 'desktopTablet', 'tabletOnly', 'mobile' ] }
				format="1 1 %s%"
				dependencies={ [
					'columnAdjacentCount',
					...dependencies,
				] }
				valueCallback={ ( value, getAttribute, device ) => {
					if ( device === 'desktop' ) {
						return value
					}
					const adjacentCount = getAttribute( 'columnAdjacentCount', device )
					if ( adjacentCount ) {
						return value.replace( /([\d\.]+%)$/, `calc($1 - var(--stk-column-gap, 0px) * ${ adjacentCount - 1 } / ${ adjacentCount } )` )
					}
					return value
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				// We need to add a maxWidth in the editor since the re-resizable box
				// can mess up the snapping if the column width is too small, then
				// resizes to a larger size.
				renderIn="edit"
				selectorCallback={ ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]` }
				styleRule="maxWidth"
				attrName="columnWidth"
				key="columnWidth-maxwidth"
				responsive={ [ 'desktopTablet', 'tabletOnly', 'mobile' ] }
				format="%s%"
				dependencies={ [
					'columnAdjacentCount',
					...dependencies,
				] }
				valueCallback={ ( value, getAttribute, device ) => {
					const adjacentCount = getAttribute( 'columnAdjacentCount', device )
					if ( adjacentCount ) {
						return value.replace( /([\d\.]+%)$/, `calc($1 - var(--stk-column-gap, 0px) * ${ adjacentCount - 1 } / ${ adjacentCount } )` )
					}
					return value
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector={ selector }
				styleRule="flex"
				attrName="columnWidth"
				key="columnWidth-save-flex"
				responsive={ [ 'desktopTablet', 'tabletOnly', 'mobile' ] }
				format="var(--stk-flex-grow, 1) 1 %s%"
				dependencies={ [
					'columnAdjacentCount',
					...dependencies,
				 ] }
				valueCallback={ ( _value, getAttribute, device ) => {
					// Flex grow should be turned on in desktop, so negative margins
					// can make the columns expand. (e.g. 50% 50% then -200px margin
					// left on 2nd column).
					//
					// In tablet/mobile, don't allow expanding since columns would
					// always expand to the available space (so you can't do a 30%
					// 30% columns in tablet/mobile, they will expand to 50% 50%)
					//
					// No need to do this in the editor since it already does this.
					const value = device === 'desktop' && ! getAttribute( 'columnWrapDesktop' ) ? _value : _value.replace( /^var(--stk-flex-grow, 1) 1/, '0 1' )

					const adjacentCount = getAttribute( 'columnAdjacentCount', device )
					if ( adjacentCount ) {
						return value.replace( /([\d\.]+%)$/, `calc($1 - var(--stk-column-gap, 0px) * ${ adjacentCount - 1 } / ${ adjacentCount } )` )
					}
					return value
				} }
			/>
		</>
	)
}

export const Style = props => {
	return <ColumnStyles { ...props } />
}

Style.Content = props => {
	return <ColumnStyles { ...props } />
}
