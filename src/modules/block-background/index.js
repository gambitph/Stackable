import { addFilter, doAction, removeFilter, withToolbarControls } from '@wordpress/hooks'
import { BlockAlignmentToolbar, BlockControls } from '@wordpress/editor'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { PanelBody, Toolbar } from '@wordpress/components'
import { ProControl, PanelAdvancedSettings } from '@stackable/components'
import { showProNotice } from 'stackable'
import { omit } from 'lodash'

const customCSSProPanel = ( output, props ) => {
	const { setAttributes } = props
	const {
		align = '',
		blockInnerWidth = '',
		showBlockBackground = false,
	} = props.attributes
	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Block Background' ) }
				checked={ showBlockBackground }
				onChange={ showBlockBackground => {
					setAttributes( {
						showBlockBackground,
						align: showBlockBackground ? 'full' : ( blockInnerWidth || 'center' ),
						blockInnerWidth: showBlockBackground ? align : '',
					} )
				} }
			>

				dslkldnsaldns
			</PanelAdvancedSettings>
		</Fragment>
	)
}

const addAlignmentToolbar = ( output, props ) => {
	const { setAttributes } = props
	const {
		showBlockBackground = false,
		align = '',
		blockInnerWidth = '',
	} = props.attributes

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
					<Toolbar
						label={ __( 'Change Alignment' ) }
						controls={
							[
								{
									icon: 'align-center',
									title: __( 'Align center' ),
									isActive: blockInnerWidth === '' || blockInnerWidth === 'center',
									onClick: () => {
										setAttributes( { blockInnerWidth: 'center' } )
									},
								},
								{
									icon: 'align-wide',
									title: __( 'Wide width' ),
									isActive: blockInnerWidth === 'wide',
									onClick: () => {
										setAttributes( { blockInnerWidth: 'wide' } )
									},
								},
								{
									icon: 'align-full-width',
									title: __( 'Full width' ),
									isActive: blockInnerWidth === 'full',
									onClick: () => {
										setAttributes( { blockInnerWidth: 'full' } )
									},
								},
							]
						}
					/>
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
	}
}

const blockBackground = blockName => {
	addFilter( `stackable.${ blockName }.edit.inspector.style.after`, `stackable/${ blockName }/block-background`, customCSSProPanel, 9 )
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/block-background`, addAttributes )
	addFilter( `stackable.${ blockName }.edit.inspector.before`, `stackable/${ blockName }/block-background`, addAlignmentToolbar )
	addFilter( `stackable.${ blockName }.settings`, `stackable/${ blockName }/block-background`, addAlignSupport )
	addFilter( `stackable.${ blockName }.main-block.classes`, `stackable/${ blockName }/block-background`, addBlockAlignClasses )
	doAction( `stackable.module.block-background`, blockName )
}

export default blockBackground
