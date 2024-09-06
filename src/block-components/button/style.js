/**
 * Internal dependencies
 */
import { addBorderStyles } from '../helpers/borders'
import { Icon } from '../icon'

export const addStyles = ( blockStyleGenerator, props = {} ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	const {
		selector = '',
		attrNameTemplate = 'button%s',
		borderSelector = `${ selector }:before`,
		borderHoverSelector = `${ selector }:hover:before`,
		backgroundSelector = `${ selector }:after`,
		hoverSelector,
		dependencies = [],
	} = props

	blockStyleGenerator.addBlockStyles( 'fullWidth', [ {
		...propsToPass,
		selector: [ '', '.stk-button' ],
		styleRule: 'width',
		attrName: 'fullWidth',
		attrNameTemplate,
		key: 'buttonFullWidth',
		valueCallback: () => '100%',
		format: '%spx',
		enabledCallback: getAttribute => getAttribute( 'fullWidth' ),
	} ] )

	{
	// This makes the full-width button occupy the available space, but make
	// others wrap when it's too small.
	}

	blockStyleGenerator.addBlockStyles( 'fullWidth', [ {
		...propsToPass,
		renderIn: 'save',
		selector: '',
		styleRule: 'flex',
		attrName: 'fullWidth',
		attrNameTemplate,
		key: 'buttonFullWidth-save',
		valueCallback: () => '1 0 var(--stk-button-group-flex-wrap, 0)',
		enabledCallback: getAttribute => getAttribute( 'fullWidth' ),
	} ] )

	blockStyleGenerator.addBlockStyles( 'fullWidth', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]`,
		styleRule: 'flex',
		attrName: 'fullWidth',
		attrNameTemplate,
		key: 'buttonFullWidth-flex',
		valueCallback: () => '1 0 var(--stk-button-group-flex-wrap, 0)',
		enabledCallback: getAttribute => getAttribute( 'fullWidth' ),
	} ] )

	blockStyleGenerator.addBlockStyles( 'minHeight', [ {
		...propsToPass,
		selector,
		responsive: 'all',
		styleRule: 'minHeight',
		attrName: 'minHeight',
		attrNameTemplate,
		key: 'buttonMinHeight',
		format: '%spx',
	} ] )

	blockStyleGenerator.addBlockStyles( 'width', [ {
		...propsToPass,
		selector,
		responsive: 'all',
		styleRule: 'width',
		attrName: 'width',
		attrNameTemplate,
		key: 'buttonWidth',
		format: '%spx',
		enabledCallback: getAttribute => ! getAttribute( 'fullWidth' ),
		dependencies: [
			'fullWidth',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'padding', [ {
		...propsToPass,
		selector,
		responsive: 'all',
		styleRule: 'paddingTop',
		attrName: 'padding',
		attrNameTemplate,
		key: 'buttonPadding-top',
		hasUnits: 'px',
		valuePreCallback: value => value?.top,
	} ] )

	blockStyleGenerator.addBlockStyles( 'padding', [ {
		...propsToPass,
		selector,
		responsive: 'all',
		styleRule: 'paddingRight',
		attrName: 'padding',
		attrNameTemplate,
		key: 'buttonPadding-right',
		hasUnits: 'px',
		valuePreCallback: value => value?.right,
	} ] )

	blockStyleGenerator.addBlockStyles( 'padding', [ {
		...propsToPass,
		selector,
		responsive: 'all',
		styleRule: 'paddingBottom',
		attrName: 'padding',
		attrNameTemplate,
		key: 'buttonPadding-bottom',
		hasUnits: 'px',
		valuePreCallback: value => value?.bottom,

	} ] )

	blockStyleGenerator.addBlockStyles( 'padding', [ {
		...propsToPass,
		selector,
		responsive: 'all',
		styleRule: 'paddingLeft',
		attrName: 'padding',
		attrNameTemplate,
		key: 'buttonPadding-left',
		hasUnits: 'px',
		valuePreCallback: value => value?.left,
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundColor', [ {
		...propsToPass,
		selector,
		styleRule: 'background',
		attrName: 'backgroundColor',
		attrNameTemplate,
		key: 'buttonBackgroundColor',
		dependencies: [
			'backgroundColorType',
			...dependencies,
		 ],
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundColor', [ {
		...propsToPass,
		selector: backgroundSelector || `${ selector }:after`,
		styleRule: 'background',
		attrName: 'backgroundColor',
		attrNameTemplate,
		key: 'buttonBackgroundColor-after',
		hover: 'all',
		hoverSelector: hoverSelector ? hoverSelector : `${ selector }:hover:after`,
		valuePreCallback: ( value, getAttribute, device, state ) => {
			if ( state === 'normal' ) {
				return undefined
			}
			return value
		},
		dependencies: [
			'backgroundColorType',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'backgroundColor', [ {
		...propsToPass,
		selector: backgroundSelector || `${ selector }:after`,
		styleRule: 'opacity',
		attrName: 'backgroundColor',
		attrNameTemplate,
		key: 'buttonBackgroundColor-opacity',
		hover: 'all',
		hoverSelector: hoverSelector ? hoverSelector : `${ selector }:hover:after`,
		valuePreCallback: ( value, getAttribute, device, state ) => {
			if ( state === 'normal' ) {
				return undefined
			}

			const buttonBackgroundColor = getAttribute( 'backgroundColor', 'desktop', state )

			if (
				typeof buttonBackgroundColor !== 'undefined' &&
			buttonBackgroundColor !== ''
			) {
				return 1
			}

			return undefined
		},
	} ] )

	addBorderStyles( blockStyleGenerator, {
		...propsToPass,
		selector: borderSelector,
		// Adding border radius clips button's shadow.
		// This prevents this from happening.
		// @see src/block-components/borders/style.js,
		addBorderRadiusOverflow: false,
		hoverSelector: borderHoverSelector,
		borderRadiusSelector: selector,
		attrNameTemplate,
	} )

	Icon.addStyles( blockStyleGenerator, {
		...propsToPass,
	} )
}

