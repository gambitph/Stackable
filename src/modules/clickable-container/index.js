import './output'

/**
 * External dependencies
 */
import {
	PanelAdvancedSettings,
	ControlSeparator,
	URLInputControl,
} from '~stackable/components'
import {
	createAllCombinationAttributes,
} from '~stackable/util'
import {
	omit, range, camelCase,
} from 'lodash'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	addFilter,
} from '@wordpress/hooks'
import { __, sprintf } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import {
	ToggleControl, TextControl,
} from '@wordpress/components'

const createClickableContainerAttributes = ( attrNameTemplate, options = {} ) => {
	const {
		selector = '.ugb-button',
	} = options
	return {
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				source: 'attribute',
				selector,
				attribute: 'target',
				default: '',
			},
			[
				'NewTab',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				source: 'attribute',
				selector,
				attribute: 'href',
				default: '',
			},
			[
				'Url',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				source: 'attribute',
				selector,
				attribute: 'title',
				default: '',
			},
			[
				'Title',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'boolean',
				default: '',
			},
			[
				'NoFollow',
			]
		),
	}
}
const addAttributes = attributes => ( {
	...attributes,
	showClickableContainer: {
		type: 'boolean',
		default: false,
	},
	...createClickableContainerAttributes( 'container1%s', {
		selector: '.ugb-clickable-container:nth-child(1) > a',
	} ),
	...createClickableContainerAttributes( 'container2%s', {
		selector: '.ugb-clickable-container:nth-child(2) > a',
	} ),
	...createClickableContainerAttributes( 'container3%s', {
		selector: '.ugb-clickable-container:nth-child(3) > a',
	} ),
	...createClickableContainerAttributes( 'container4%s', {
		selector: '.ugb-clickable-container:nth-child(4) > a',
	} ),
} )

const addInspectorPanel = ( output, props ) => {
	const { setAttributes } = props
	const {
		columns = 1,
		showClickableContainer = false,
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Clickable Containers', i18n ) }
				id="clickable-container"
				checked={ showClickableContainer }
				onChange={ showClickableContainer => setAttributes( {
					showClickableContainer,
				} ) }
				toggleAttributeName="showClickableContainer"
			>
				{ range( 1, columns + 1 ).map( column => {
					const getAttrName = attrName => camelCase( sprintf( `container%d%s`, column, attrName ) )
					const getAttrValue = ( attrName, defaultValue = '' ) => {
						const value = props.attributes[ getAttrName( attrName ) ]
						return value === '' ? value : ( value || defaultValue )
					}
					return (
						<Fragment key={ column }>
							<URLInputControl
								label={ sprintf( __( 'Link / URL #%d', i18n ), column ) }
								value={ getAttrValue( 'Url' ) }
								onChange={ url => setAttributes( {
									[ getAttrName( 'Url' ) ]: url,
								} ) }
								placeholder="http://"
							/>
							<TextControl
								label={ sprintf( __( 'Link %d Title', i18n ), column ) }
								value={ getAttrValue( 'Title' ) }
								onChange={ title => setAttributes( {
									[ getAttrName( 'Title' ) ]: title,
								} ) }
							/>
							<ToggleControl
								label={ __( 'Open link in new tab', i18n ) }
								checked={ getAttrValue( 'NewTab' ) }
								onChange={ newTab => setAttributes( {
									[ getAttrName( 'NewTab' ) ]: newTab,
								} ) }
							/>
							<ToggleControl
								label={ __( 'Nofollow link', i18n ) }
								checked={ getAttrValue( 'NoFollow' ) }
								onChange={ noFollow => setAttributes( {
									[ getAttrName( 'NoFollow' ) ]: noFollow,
								} ) }
							/>
							{ column !== columns && <ControlSeparator /> }
						</Fragment>
					)
				} ) }
			</PanelAdvancedSettings>
		</Fragment>
	)
}

const addItemClasses = ( classes, props ) => {
	const {
		showClickableContainer = false,
	} = props.attributes

	return {
		...classes,
		'ugb-clickable-container': showClickableContainer,
	}
}

const addBoxClasses = ( classes, design, props ) => {
	const {
		showClickableContainer = false,
	} = props.attributes

	return {
		...classes,
		'ugb-clickable-container': showClickableContainer,
	}
}

// Remove the content from exports for designs.
const removeAttributesFromDesignAttributeExport = attributes => {
	return omit( attributes, [
		'container1Url',
		'container1Newtab',
		'container1NoFollow',
		'container2Url',
		'container2Newtab',
		'container2NoFollow',
		'container3Url',
		'container3Newtab',
		'container3NoFollow',
		'container4Url',
		'container4Newtab',
		'container4NoFollow',
	] )
}

const clickableContainer = ( blockName, options = {} ) => {
	const {
		classFilter = null,
	} = options
	addFilter( `stackable.${ blockName }.edit.inspector.style.block`, `stackable/${ blockName }/clickable-container`, addInspectorPanel, 18 )
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/clickable-container`, addAttributes )
	addFilter( `stackable.${ blockName }.design.filtered-block-attributes`, `stackable/${ blockName }/clickable-container`, removeAttributesFromDesignAttributeExport )
	if ( classFilter ) {
		addFilter( `stackable.${ blockName }.${ classFilter }`, `stackable/${ blockName }/clickable-container`, addItemClasses )
	} else {
		addFilter( `stackable.${ blockName }.itemclasses`, `stackable/${ blockName }/clickable-container`, addItemClasses )
		addFilter( `stackable.${ blockName }.boxclasses`, `stackable/${ blockName }/clickable-container`, addBoxClasses )
	}
}

export default clickableContainer
