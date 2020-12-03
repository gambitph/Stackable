/**
 * External dependencies
 */
import {
	BackgroundControlsHelper,
	PanelAdvancedSettings,
	ControlSeparator,
} from '~stackable/components'
import {
	createBackgroundAttributeNames,
	createBackgroundAttributes,
	createBackgroundOverlayStyles,
	createBackgroundStyles,
	createVideoBackground,
	hasBackgroundOverlay,
	__getValue,
} from '~stackable/util'
import { omit } from 'lodash'

/**
 * Internal dependencies
 */
import { addNewAlignFunctionality } from './align'

/**
 * WordPress dependencies
 */
import {
	addFilter, doAction, removeFilter,
} from '@wordpress/hooks'
import { BlockAlignmentToolbar, BlockControls } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import deepmerge from 'deepmerge'
import { Fragment } from '@wordpress/element'
import { i18n } from 'stackable'
import {
	ToolbarButton, ToggleControl, ToolbarGroup,
} from '@wordpress/components'

// When block background is turned on, change the ailgnment and block inner width also.
removeFilter( 'stackable.setAttributes', 'stackable/module/block-background/show' )
addFilter( 'stackable.setAttributes', 'stackable/module/block-background/show', ( attributes, blockProps ) => {
	if ( typeof attributes.showBlockBackground === 'undefined' ) {
		return attributes
	}

	const {
		align = '',
		blockInnerWidth = '',
	} = blockProps.attributes
	attributes.align = attributes.showBlockBackground ? 'full' : ( blockInnerWidth || 'center' )
	attributes.blockInnerWidth = attributes.showBlockBackground ? ( ! align ? 'center' : align ) : ''

	return attributes
} )

const addInspectorPanel = ( output, props ) => {
	const { setAttributes } = props
	const {
		showBlockBackground = false,
		noPaddings = '',
	} = props.attributes
	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Block Background', i18n ) }
				id="block-background"
				checked={ showBlockBackground }
				onChange={ showBlockBackground => setAttributes( { showBlockBackground } ) }
				toggleOnSetAttributes={ [
					...createBackgroundAttributeNames( 'blockBackground%s' ),
					'noPaddings',
				] }
				toggleAttributeName="showBlockBackground"
				className="ugb--help-tip-background-on-off"
			>
				<ToggleControl
					label={ __( 'No Paddings', i18n ) }
					checked={ noPaddings }
					onChange={ noPaddings => setAttributes( { noPaddings } ) }
					className="ugb--help-tip-no-padding"
				/>
				<ControlSeparator />
				<BackgroundControlsHelper
					attrNameTemplate="blockBackground%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>
		</Fragment>
	)
}

/**
 * Adds our custom Alignment toolbar (This adds another one)
 *
 * @param {Object} output Rendered Object
 * @param {Object} props block props
 *
 * @return {Object} Rendered object
 */
const addAlignmentToolbar = ( output, props ) => {
	const { setAttributes } = props
	const {
		showBlockBackground = false,
		align = '',
		blockInnerWidth = '',
	} = props.attributes

	const toolbarOptions = [
		{
			icon: 'align-center',
			label: __( 'Align center', i18n ),
			isActive: blockInnerWidth === '' || blockInnerWidth === 'center',
			onClick: () => {
				setAttributes( { blockInnerWidth: 'center' } )
			},
		},
		{
			icon: 'align-wide',
			label: __( 'Wide width', i18n ),
			isActive: blockInnerWidth === 'wide',
			onClick: () => {
				setAttributes( { blockInnerWidth: 'wide' } )
			},
		},
		{
			icon: 'align-full-width',
			label: __( 'Full width', i18n ),
			isActive: blockInnerWidth === 'full',
			onClick: () => {
				setAttributes( { blockInnerWidth: 'full' } )
			},
		},
	]

	return (
		<Fragment>
			{ output }
			<BlockControls>
				{ ! showBlockBackground && (
					<BlockAlignmentToolbar
						value={ align }
						onChange={ value => {
							// Clicking on the current alignment gives us an undefined value.
							const nextAlign = showBlockBackground && ! value ? 'full' : value
							if ( ! showBlockBackground ) {
								setAttributes( { align: nextAlign } )
							} else {
								setAttributes( {
									align: 'full',
									blockInnerWidth: nextAlign === 'center' ? '' : nextAlign,
								} )
							}
						} }
						controls={ [ 'center', 'wide', 'full' ] }
					/>
				) }
				{ showBlockBackground && (
					<ToolbarGroup
						label={ __( 'Change Alignment', i18n ) }
					>
						{ toolbarOptions.map( option => <ToolbarButton key={ option.label } { ...option } /> ) }
					</ToolbarGroup>
				) }
			</BlockControls>
		</Fragment>
	)
}

const addAlignSupport = settings => {
	return {
		...settings,
		supports: {
			...settings.supports,
			align: [ 'center', 'wide', 'full' ],
		},
	}
}

const addAttributes = attributes => {
	return {
		...attributes,
		showBlockBackground: {
			type: 'boolean',
			default: false,
		},
		blockInnerWidth: {
			type: 'string',
			default: '',
		},
		align: {
			type: 'string',
		},
		noPaddings: {
			type: 'boolean',
			default: '',
		},
		...createBackgroundAttributes( 'blockBackground%s' ),
	}
}

const addBlockAlignClasses = ( classes, props ) => {
	const {
		showBlockBackground = false,
		blockInnerWidth = '',
	} = props.attributes

	if ( ! showBlockBackground ) {
		return classes
	}

	return {
		...classes,
		[ `ugb-main-block--inner-${ blockInnerWidth }` ]: blockInnerWidth,
		'ugb--has-block-background': showBlockBackground,
		// Class copied from DivBackground component.
		'ugb--has-background-overlay': hasBackgroundOverlay( 'blockBackground%s', props.attributes ),
	}
}

const addBlockAlignInnerClasses = ( classes, props ) => {
	const {
		showBlockBackground = false,
		blockInnerWidth = '',
	} = props.attributes

	if ( ! showBlockBackground ) {
		return classes
	}

	return {
		...classes,
		[ `ugb-inner-block--${ blockInnerWidth || 'center' }` ]: true,
	}
}

const addVideoBackgroundOutput = ( output, design, blockProps ) => {
	if ( ! blockProps.attributes.showBlockBackground ) {
		return output
	}

	// Copied how DivBackground component works.
	return (
		<Fragment>
			{ output }
			{ createVideoBackground( 'blockBackground%s', blockProps ) }
		</Fragment>
	)
}

const addStyles = ( styleObject, props ) => {
	const getValue = __getValue( props.attributes )

	if ( ! props.attributes.showBlockBackground ) {
		return styleObject
	}

	const styles = {
		[ `.${ props.mainClassName }` ]: {
			...createBackgroundStyles( 'blockBackground%s', 'desktop', props.attributes ),
		},
		'': { // We use the blank selector so that other styling (such as the block paddings) can still override the paddings.
			padding: getValue( 'noPaddings' ) ? '0 !important' : undefined,
		},
		[ `.${ props.mainClassName }:before` ]: {
			...createBackgroundOverlayStyles( 'blockBackground%s', 'desktop', props.attributes ),
		},
		tablet: {
			[ `.${ props.mainClassName }` ]: {
				...createBackgroundStyles( 'blockBackground%s', 'tablet', props.attributes ),
			},
			[ `.${ props.mainClassName }:before` ]: {
				...createBackgroundOverlayStyles( 'blockBackground%s', 'tablet', props.attributes ),
			},
		},
		mobile: {
			[ `.${ props.mainClassName }` ]: {
				...createBackgroundStyles( 'blockBackground%s', 'mobile', props.attributes ),
			},
			[ `.${ props.mainClassName }:before` ]: {
				...createBackgroundOverlayStyles( 'blockBackground%s', 'mobile', props.attributes ),
			},
		},
	}

	return deepmerge( styleObject, styles )
}

// Remove the content from exports for designs.
const removeAttributesFromDesignAttributeExport = attributes => {
	return omit( attributes, [ 'blockBackgroundBackgroundMediaId' ] )
}

const blockBackground = blockName => {
	addFilter( `stackable.${ blockName }.edit.inspector.style.block`, `stackable/${ blockName }/block-background`, addInspectorPanel, 18 )
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/block-background`, addAttributes )
	addFilter( `stackable.${ blockName }.edit.inspector.before`, `stackable/${ blockName }/block-background`, addAlignmentToolbar )
	addFilter( `stackable.${ blockName }.settings`, `stackable/${ blockName }/block-background`, addAlignSupport )
	addFilter( `stackable.${ blockName }.main-block.classes`, `stackable/${ blockName }/block-background`, addBlockAlignClasses )
	addFilter( `stackable.${ blockName }.main-block.inner-classes`, `stackable/${ blockName }/block-background`, addBlockAlignInnerClasses )
	addFilter( `stackable.${ blockName }.styles`, `stackable/${ blockName }/block-background`, addStyles )
	addFilter( `stackable.${ blockName }.edit.output.outer`, `stackable/${ blockName }/block-separators`, addVideoBackgroundOutput )
	addFilter( `stackable.${ blockName }.save.output.outer`, `stackable/${ blockName }/block-separators`, addVideoBackgroundOutput )
	addFilter( `stackable.${ blockName }.design.filtered-block-attributes`, `stackable/${ blockName }/block-separators`, removeAttributesFromDesignAttributeExport )
	doAction( `stackable.module.block-background`, blockName )

	// Mimic align functionality.
	addNewAlignFunctionality( blockName )
}

export default blockBackground

