/**
 * Internal dependencies
 */
import { TextStyles } from './style'

/**
 * External dependencies
 */
import {
	BlockDiv,
	useGeneratedCss,
	CustomCSS,
	Responsive,
	Advanced,
	Typography,
	getTypographyClasses,
	getAlignmentClasses,
	Alignment,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
} from '~stackable/block-components'
import { i18n, version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	InspectorTabs,
	InspectorLayoutControls,
} from '~stackable/components'
import {
	withBlockAttributeContext,
	withBlockWrapper,
	withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	useRef, useCallback, createRef,
} from '@wordpress/element'
import { dispatch } from '@wordpress/data'
import { compose } from '@wordpress/compose'
import { BlockControls, RichText } from '@wordpress/block-editor'
import { useSetActiveTabContext } from '../tabs/with-active-tab'
import { Toolbar, ToolbarButton } from '@wordpress/components'
import { useBlockContext } from '~stackable/hooks'
import { getBlockFromExample } from '@wordpress/blocks'

const Edit = props => {
	const {
		className,
		clientId,
		isSelected,
		setAttributes,
	} = props

	useGeneratedCss( props.attributes )

	const [ activeTab, setActiveTab, , setTemplateLock ] = useSetActiveTabContext()
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { parentBlock } = useBlockContext()

	const getRef = useGetRef()

	const onClick = index => {
		setActiveTab( index )
		if ( ! isSelected ) {
			dispatch( 'core/block-editor' ).clearSelectedBlock()
		}
	}

	const updateTabLabel = ( content, index ) => {
		const updatedLabels = [ ...props.attributes.tabLabels ]
		updatedLabels[ index ].label = content
		setAttributes( { tabLabels: updatedLabels } )
	}

	const moveActiveTabRight = () => {
		// Move the tab label
		const index = activeTab - 1
		const updatedLabels = [ ...props.attributes.tabLabels ]
		const temp = updatedLabels[ index ]
		updatedLabels[ index ] = updatedLabels[ index + 1 ]
		updatedLabels[ index + 1 ] = temp
		setAttributes( { tabLabels: updatedLabels } )

		// Move the tab content
		const tabContentBlock = parentBlock.innerBlocks[ 0 ].name === 'stackable/tab-content' ? parentBlock.innerBlocks[ 0 ] : parentBlock.innerBlocks[ 1 ]
		dispatch( 'core/block-editor' ).moveBlocksDown( [ tabContentBlock.innerBlocks[ index ].clientId ], tabContentBlock.clientId )

		// Change the active tab
		setActiveTab( activeTab + 1 )
	}

	const moveActiveTabLeft = () => {
		// Move the tab label
		const index = activeTab - 1
		const updatedLabels = [ ...props.attributes.tabLabels ]
		const temp = updatedLabels[ index ]
		updatedLabels[ index ] = updatedLabels[ index - 1 ]
		updatedLabels[ index - 1 ] = temp
		setAttributes( { tabLabels: updatedLabels } )

		// Move the tab content
		const tabContentBlock = parentBlock.innerBlocks[ 0 ].name === 'stackable/tab-content' ? parentBlock.innerBlocks[ 0 ] : parentBlock.innerBlocks[ 1 ]
		dispatch( 'core/block-editor' ).moveBlocksUp( [ tabContentBlock.innerBlocks[ index ].clientId ], tabContentBlock.clientId )

		// Change the active tab
		setActiveTab( activeTab - 1 )
	}

	const addNewTab = index => {
		// Ada a new tab label
		const updatedLabels = [ ...props.attributes.tabLabels ]
		updatedLabels.splice( index, 0, { label: '', icon: '' } )
		setAttributes( { tabLabels: updatedLabels } )

		// Add a new tab content
		setTemplateLock( false )
		setTimeout( () => { // We need to wait a bit for the templateLock to get applied to the tabContent component.
			const tabContentBlock = parentBlock.innerBlocks[ 0 ].name === 'stackable/tab-content' ? parentBlock.innerBlocks[ 0 ] : parentBlock.innerBlocks[ 1 ]
			const block = getBlockFromExample( 'stackable/column', {} )

			dispatch( 'core/block-editor' ).insertBlock( block, index, tabContentBlock.clientId, false )
			setTemplateLock( true )
		}, 1 )

		// Focus on the new tab label
		setTimeout( () => {
			const range = document.createRange()
			range.selectNodeContents( getRef( index ).current )
			range.collapse( false )

			const selection = window.getSelection() // eslint-disable-line
			selection.removeAllRanges()
			selection.addRange( range )
		}, 1 )

		// Change the active tab
		setActiveTab( index + 1 )
	}

	const deleteActiveTab = () => {
		const index = activeTab - 1
		// Delete the tab label
		const updatedLabels = [ ...props.attributes.tabLabels ]
		updatedLabels.splice( index, 1 )
		setAttributes( { tabLabels: updatedLabels } )

		// Delete the tab content
		setTemplateLock( false )
		setTimeout( () => {
			const tabContentBlock = parentBlock.innerBlocks[ 0 ].name === 'stackable/tab-content' ? parentBlock.innerBlocks[ 0 ] : parentBlock.innerBlocks[ 1 ]
			dispatch( 'core/block-editor' ).removeBlocks( [ tabContentBlock.innerBlocks[ index ].clientId ], false )
			setTemplateLock( true )
		}, 1 )

		// The next index should be the same, unless we're deleting the last tab
		const newIndex = index === updatedLabels.length ? index - 1 : index

		// Focus on the new tab label index
		setTimeout( () => {
			const range = document.createRange()
			range.selectNodeContents( getRef( newIndex ).current )
			range.collapse( false )

			const selection = window.getSelection() // eslint-disable-line
			selection.removeAllRanges()
			selection.addRange( range )
		}, 200 )

		// Change the active tab
		setActiveTab( newIndex + 1 )
	}

	const blockClassNames = classnames( [
		className,
		'stk-block-tab-labels',
	] )

	const textClassNames = classnames( [
		'stk-block-tab-labels__text',
		textClasses,
		blockAlignmentClass,
	] )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />

					<BlockControls>
						<Toolbar>
							<ToolbarButton
								label={ __( 'Move left', i18n ) }
								icon="arrow-left-alt2"
								disabled={ activeTab === 1 }
								onClick={ moveActiveTabLeft }
							/>
							<ToolbarButton
								label={ __( 'Move right', i18n ) }
								icon="arrow-right-alt2"
								disabled={ activeTab === props.attributes.tabLabels.length }
								onClick={ moveActiveTabRight }
							/>
						</Toolbar>
					</BlockControls>

					<Typography.InspectorControls
						{ ...props }
						hasTextTag={ false }
						isMultiline={ true }
						initialOpen={ true }
						hasTextShadow={ true }
					/>
					<Alignment.InspectorControls />

					<BlockControls>
						<Toolbar>
							<ToolbarButton
								label={ __( 'Add tab', i18n ) }
								icon="plus-alt2"
								onClick={ () => addNewTab( activeTab ) }
							/>
							<ToolbarButton
								label={ __( 'Delete tab', i18n ) }
								icon="trash"
								disabled={ props.attributes.tabLabels.length === 1 }
								onClick={ () => {
									// Prompt first if the user really wants to delete the tab
									if ( confirm( __( 'Are you sure you want to delete this tab?', i18n ) ) ) { // eslint-disable-line no-alert
										deleteActiveTab()
									}
								} }
							/>
						</Toolbar>
					</BlockControls>

					<InspectorLayoutControls>
						{ /** Add Layout controls specific for this block here */ }
					</InspectorLayoutControls>

					<BlockDiv.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />

					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-tab-labels" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />
				</>
			) }

			<TextStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-tab-labels" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<div className="stk-block-tab-labels__wrapper">
					{ props.attributes.tabLabels.map( ( tab, index ) => {
						return (
							// eslint-disable-next-line jsx-a11y/role-supports-aria-props
							<button
								className="stk-block-tabs__tab"
								aria-selected={ activeTab === index + 1 ? 'true' : 'false' }
								key={ index }
								onClick={ () => onClick( index + 1 ) }
							>
								{ /* { props.attributes.iconPosition !== 'right' && <Icon /> } */ }
								<div className={ textClassNames }>
									<RichText
										key={ index }
										ref={ getRef( index ) }
										tagName="span"
										value={ tab.label }
										onChange={ content => {
											updateTabLabel( content, index )
										} }
										__unstableOnSplitAtEnd={ () => {
											addNewTab( index + 1 )
										} }
										onRemove={ () => {
											// Only do this when there is more than 1 tab
											if ( props.attributes.tabLabels.length > 1 ) {
												// Prompt first if the user really wants to delete the tab
												if ( confirm( __( 'Are you sure you want to delete this tab?', i18n ) ) ) { // eslint-disable-line no-alert
													deleteActiveTab()
												}
											}
										} }
										withoutInteractiveFormatting
										allowedFormats={ [] }
										placeholder={ __( 'Tab Label', i18n ) }
									/>
								</div>
							</button>
		 )
					} ) }
				</div>
			</BlockDiv>
		</>
	)
}

/**
 * Allows for multiple refs to be used in a loop.
 *
 * @see https://stackoverflow.com/a/70572294
 */
const useGetRef = () => {
	const refs = useRef( {} )
	return useCallback(
	  idx => ( refs.current[ idx ] ??= createRef() ),
	  [ refs ]
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
