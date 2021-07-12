/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Typography,
	Alignment,
	MarginBottom,
} from '~stackable/block-components'
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import { useDeviceType, useBlockAttributes } from '~stackable/hooks'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Fragment, renderToString } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const getStyleParams = () => {
	return [
		{
			selector: '.stk--top-line',
			styleRule: 'height',
			attrName: 'topLineHeight',
			format: '%spx',
		},
		{
			selector: '.stk--top-line',
			styleRule: 'width',
			attrName: 'topLineWidth',
			hasUnits: 'px',
			hover: 'all',
		},
		{
			selector: '.stk--top-line',
			styleRule: 'backgroundColor',
			attrName: 'topLineColor',
			hover: 'all',
		},
		{
			selector: '.stk--top-line',
			styleRule: 'backgroundColor',
			attrName: 'topLineColor',
			hover: 'all',
		},
		{
			selector: '.stk--top-line',
			styleRule: 'marginBottom',
			attrName: 'topLineMargin',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: '.stk--top-line',
			styleRule: 'marginLeft',
			attrName: 'topLineAlign',
			responsive: 'all',
			valueCallback: () => 'auto',
		},
		{
			selector: '.stk--top-line',
			styleRule: 'marginRight',
			attrName: 'topLineAlign',
			responsive: 'all',
			valueCallback: value => value === 'center' ? 'auto' : undefined,
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'height',
			attrName: 'bottomLineHeight',
			format: '%spx',
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'width',
			attrName: 'bottomLineWidth',
			hasUnits: 'px',
			hover: 'all',
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'backgroundColor',
			attrName: 'bottomLineColor',
			hover: 'all',
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'backgroundColor',
			attrName: 'bottomLineColor',
			hover: 'all',
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'marginTop',
			attrName: 'bottomLineMargin',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'marginLeft',
			attrName: 'bottomLineAlign',
			responsive: 'all',
			valueCallback: () => 'auto',
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'marginRight',
			attrName: 'bottomLineAlign',
			responsive: 'all',
			valueCallback: value => value === 'center' ? 'auto' : undefined,
		},
	]
}

export const HeadingStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }

	const topBottomLineStyles = useStyles( attributes, getStyleParams() )

	return (
		<Fragment>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Typography.Style { ...{
				...propsToPass,
				options: {
					...propsToPass.options,
					selector: '.stk-heading__text',
				},
			} } />
			<StyleComponent
				styles={ topBottomLineStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

HeadingStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

HeadingStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const topBottomLineStyles = getStyles( props.attributes, getStyleParams() )

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...{
				...propsToPass,
				options: {
					...propsToPass.options,
					selector: '.stk-heading__text',
				},
			} } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ topBottomLineStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

HeadingStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
