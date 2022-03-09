/**
 * External dependencies
 */
import { isEmpty } from 'lodash'
import {
	Typography, MarginBottom, BlockDiv, Advanced, EffectsAnimations, Alignment, Transform,
} from '~stackable/block-components'
import { useBlockAttributes, useDeviceType } from '~stackable/hooks'
import {
	clampInheritedStyle,
	getStyles,
	getUniqueBlockClass,
	useStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { Fragment, renderToString } from '@wordpress/element'

const typographyOptions = {
	selector: [
		'ul li a',
		'ol li a',
	],
	hoverSelector: [
		'.%s:hover ul li a',
		'.%s:hover ol li a',
	],
}

const getStyleParams = ( options = {} ) => {
	const {
		inherit = true,
		inheritMin,
		inheritMax = 50,
		dependencies = [],
	 } = options
	return [
		{
			selector: 'li',
			styleRule: 'paddingInlineStart',
			attrName: 'iconGap',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: 'ul',
			styleRule: 'listStyleType',
			attrName: 'listType',
			valueCallback: value => ( value === 'none' ? 'none' : undefined ),
		},
		{
			selector: 'ol',
			styleRule: 'listStyleType',
			attrName: 'listType',
			valueCallback: value =>
				isEmpty( value ) || value === 'none' || value === 'unordererd'
					? undefined
					: value,
		},
		{
			selector: '.stk-table-of-contents__table',
			styleRule: 'columnCount',
			attrName: 'columns',
			responsive: 'all',
		},
		{
			selector: '.stk-table-of-contents__table',
			styleRule: 'columnGap',
			attrName: 'columnGap',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: 'li',
			styleRule: 'marginBottom',
			attrName: 'rowGap',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: '.stk-table-of-contents__table ul',
			styleRule: 'marginTop',
			attrName: 'rowGap',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: [ 'ul', 'ol' ],
			styleRule: 'paddingLeft',
			attrName: 'indentation',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: 'li a',
			hover: 'all',
			styleRule: 'color',
			attrName: 'color',
		},
		{
			selector: [ 'li' ],
			styleRule: 'marginInline',
			attrName: 'listAlignment',
			responsive: 'all',
			valueCallback: value =>
				value === 'center'
					? 'auto'
					: value === 'right'
						? 'auto 0'
						: value === 'left'
							? '0 auto'
							: '',
		},
		{
			selector: 'html',
			styleRule: 'scroll-behavior',
			attrName: 'isSmoothScroll',
			valueCallback: value => ( value ? 'smooth' : undefined ),
		},
		{
			selector: 'html',
			styleRule: 'scroll-padding-top',
			attrName: 'scrollTopOffset',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: '.stk-block-table-of-contents__list-item',
			styleRule: 'fontSize',
			attrName: 'fontSize',
			hasUnits: 'px',
			responsive: 'all',
			clampCallback: ( _value, getAttribute, device, state ) => {
				const currentValue = getAttribute( 'fontSize', device, state )
				const isMobile = device === 'mobile'

				let value = _value
				const clampedValue = inherit && clampInheritedStyle(
					_value,
					{
						min: inheritMin, max: inheritMax,
					}
				)

				/**
				 * When clamping values in mobile, make sure to get the
				 * clamped desktop value first before checking the clamped
				 * tablet value.
				 *
				 * When the tablet is already clamped, the fallback value should
				 * be undefined already to avoid generating 2 identical styles.
				 */
				if ( isMobile ) {
					const clampedDesktopValue = inherit && clampInheritedStyle(
						getAttribute( 'fontSize', 'desktop', state ),
						{
							min: inheritMin, max: inheritMax,
						}
					)
					value = clampedDesktopValue ? clampedDesktopValue : value
				}

				value = clampedValue ? clampedValue : value
				value = typeof currentValue !== 'undefined' && currentValue !== ''
					? currentValue
					: isMobile ? undefined : value
				return value
			},
			dependencies: [ 'fontSizeUnit', 'fontSize', ...dependencies ],
		},
	]
}

export const TableOfContentsStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = {
		...attributes, clientId,
	}
	const options = { attributes: propsToPass.attributes }

	const iconStyles = useStyles( attributes, getStyleParams( options ) )

	return (
		<Fragment>
			<Alignment.Style { ...propsToPass } />
			<Typography.Style { ...propsToPass } options={ typographyOptions } />
			<MarginBottom.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<StyleComponent
				styles={ iconStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

TableOfContentsStyles.defaultProps = {
	attributes: {},
	options: {},
}

TableOfContentsStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const options = { attributes: propsToPass.attributes }
	const iconStyles = getStyles( propsToPass.attributes, getStyleParams( options ) )

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...propsToPass } options={ typographyOptions } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ iconStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

TableOfContentsStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
