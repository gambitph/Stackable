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
	omit, range, camelCase, isPlainObject,
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

const createContainerLinkAttributes = ( attrNameTemplate, options = {} ) => {
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
				'Sponsored',
				'Ugc',
			]
		),
	}
}
const addAttributes = attributes => ( {
	...attributes,
	showContainerLink: {
		type: 'boolean',
		default: false,
	},
	...createContainerLinkAttributes( 'container1%s', {
		selector: '.ugb-container-link:nth-child(1) > a',
	} ),
	...createContainerLinkAttributes( 'container2%s', {
		selector: '.ugb-container-link:nth-child(2) > a',
	} ),
	...createContainerLinkAttributes( 'container3%s', {
		selector: '.ugb-container-link:nth-child(3) > a',
	} ),
	...createContainerLinkAttributes( 'container4%s', {
		selector: '.ugb-container-link:nth-child(4) > a',
	} ),
} )

const addInspectorPanel = ( output, props ) => {
	const { setAttributes } = props
	const {
		columns = 1,
		showContainerLink = false,
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Container Link', i18n ) }
				id="container-link"
				checked={ showContainerLink }
				onChange={ showContainerLink => setAttributes( {
					showContainerLink,
				} ) }
				toggleAttributeName="showContainerLink"
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
								label={ columns === 1 ? __( 'Link / URL', i18n ) : sprintf( __( 'Link / URL #%d', i18n ), column ) }
								value={ getAttrValue( 'Url' ) }
								onChange={ url => setAttributes( {
									[ getAttrName( 'Url' ) ]: url,
								} ) }
								placeholder="http://"
							/>
							<TextControl
								label={ columns === 1 ? __( 'Link Title', i18n ) : sprintf( __( 'Link %d Title', i18n ), column ) }
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
							<ToggleControl
								label={ __( 'Sponsored', i18n ) }
								checked={ getAttrValue( 'Sponsored' ) }
								onChange={ sponsored => setAttributes( {
									[ getAttrName( 'Sponsored' ) ]: sponsored,
								} ) }
							/>
							<ToggleControl
								label={ __( 'UGC', i18n ) }
								checked={ getAttrValue( 'Ugc' ) }
								onChange={ ugc => setAttributes( {
									[ getAttrName( 'Ugc' ) ]: ugc,
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
		showContainerLink = false,
	} = props.attributes

	return {
		...classes,
		'ugb-container-link': showContainerLink,
	}
}

const addBoxClasses = ( classes, props1, props2 ) => {
	const showContainerLink = isPlainObject( props1 )
		? props1.attributes.showContainerLink : isPlainObject( props2 )
			? props2.attributes.showContainerLink
			: false

	return {
		...classes,
		'ugb-container-link': showContainerLink || false,
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

const containerLink = ( blockName, options = {} ) => {
	const {
		classFilter = null,
		customFilters = false,
	} = options
	addFilter( `stackable.${ blockName }.edit.inspector.style.block`, `stackable/${ blockName }/container-link`, addInspectorPanel, 18 )
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/container-link`, addAttributes )
	addFilter( `stackable.${ blockName }.design.filtered-block-attributes`, `stackable/${ blockName }/container-link`, removeAttributesFromDesignAttributeExport )

	if ( customFilters ) {
		return
	}

	if ( classFilter ) {
		addFilter( `stackable.${ blockName }.${ classFilter }`, `stackable/${ blockName }/container-link`, addItemClasses )
	} else {
		addFilter( `stackable.${ blockName }.itemclasses`, `stackable/${ blockName }/container-link`, addItemClasses )
		addFilter( `stackable.${ blockName }.boxclasses`, `stackable/${ blockName }/container-link`, addBoxClasses )
	}
}

export default containerLink
