/**
 * Internal dependencies
 */
import previewImage from './images/preview.jpg'
import {
	i18n,
	srcUrl,
	settings,
	cdnUrl,
	devMode,
} from 'stackable'
import {
	Button,
	ModalDesignLibrary,
} from '~stackable/components'
import { SVGStackableIcon } from '~stackable/icons'
import { substituteCoreIfDisabled, BLOCK_STATE } from '~stackable/util'
import { usePresetControls } from '~stackable/hooks'
import { substitutionRules } from '../../blocks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { dispatch, select } from '@wordpress/data'
import {
	createBlock, createBlocksFromInnerBlocksTemplate, getBlockVariations, getBlockType,
} from '@wordpress/blocks'
import { useRef, useState } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	Placeholder, Modal, __experimentalVStack as VStack, Flex,
} from '@wordpress/components'
import { useBlockProps } from '@wordpress/block-editor'
import apiFetch from '@wordpress/api-fetch'

const convertBlocksToArray = block => {
	const innerBlocks = block.innerBlocks.map( innerBlock => convertBlocksToArray( innerBlock ) )
	return [ block.name, block.attributes, innerBlocks ]
}

const checkIfImageUrl = async value => {
	if ( typeof value !== 'string' ) {
		return value
	}

	let attributeUrl, libraryUrl

	try {
		attributeUrl = new URL( value )
		libraryUrl = new URL( cdnUrl )
	} catch ( error ) {
		return value
	}

	if ( attributeUrl.origin !== libraryUrl.origin || ! attributeUrl.pathname.startsWith( libraryUrl.pathname ) ) {
		return value
	}

	const matches = attributeUrl.pathname.match( /\/([^/]+\.(jpe?g|gif|png|mp4|webp))$/i )

	if ( matches ) {
		try {
			const result = await apiFetch( {
				path: '/stackable/v3/design_library_image',
				method: 'POST',
				// eslint-disable-next-line camelcase
				data: { image_url: attributeUrl.href },
			} )
			if ( result.success ) {
				return result.new_url
			}
			console.error( 'Stackable Design Library:', result.message ) // eslint-disable-line no-console
			return value
		} catch ( error ) {
			console.error( 'Stackable Design Library:', error.message ) // eslint-disable-line no-console
			return value
		}
	}
	return value
}

const DIALOG_OPTIONS = {
	CLOSE: 0,
	REMOVE_BLOCKS: 1,
	DISABLED_BLOCKS: 2,
}

const Edit = props => {
	const {
		clientId,
		attributes,
	} = props

	const [ isLibraryOpen, setIsLibraryOpen ] = useState( false )
	const [ isDialogOpen, setIsDialogOpen ] = useState( DIALOG_OPTIONS.CLOSE )

	const designsRef = useRef( [] )
	const disabledBlocksRef = useRef( [] )
	const callbackRef = useRef( null )
	const blocksToRemoveRef = useRef( [] )
	const insertIndexRef = useRef( -1 )

	const blockProps = useBlockProps( {
		className: 'ugb-design-library-block',
	} )

	const presetMarks = usePresetControls( 'spacingSizes' )
		?.getPresetMarks() || null

	const spacingSize = ! presetMarks || ! Array.isArray( presetMarks ) ? 120 : presetMarks[ presetMarks.length - 2 ].value

	// Replaces the current block with a block made out of attributes.
	const createBlockWithAttributes = async ( category, blockName, attributes, innerBlocks, substituteBlocks, parentClientId ) => {
		const disabledBlocks = settings.stackable_block_states || {} // eslint-disable-line camelcase

		// Recursively substitute core blocks to disabled Stackable blocks
		const traverseBlocksAndSubstitute = blocks => {
			return blocks.map( block => {
				let isDisabled = true
				// Maximum attempt to error if no substitution rule for the block
				let attempts = 10

				// Check if the new substituted block is still disabled
				while ( isDisabled && attempts > 0 ) {
					const _blockName = block[ 1 ].originalName || block[ 0 ]
					block = substituteCoreIfDisabled( _blockName, block[ 1 ], block[ 2 ], substitutionRules )
					isDisabled = block[ 0 ] in disabledBlocks && disabledBlocks[ block[ 0 ] ] === BLOCK_STATE.DISABLED
					attempts--
				}

				// Do a preorder traversal by subsituting first before traversing
				if ( block[ 2 ] && block[ 2 ].length > 0 ) {
					block[ 2 ] = traverseBlocksAndSubstitute( block[ 2 ] )
				}

				if ( ! Array.isArray( block[ 2 ] ) ) {
					block[ 2 ] = []
				}

				const _block = {
					name: block[ 0 ],
					attributes: block[ 1 ],
					innerBlocks: block[ 2 ],
					isValid: true,
				}
				return _block
			} )
		}

		if ( ! Array.isArray( disabledBlocks ) && substituteBlocks ) {
			let block = convertBlocksToArray( {
				name: blockName, attributes, innerBlocks,
			} )

			block = traverseBlocksAndSubstitute( [ block ] )[ 0 ]
			blockName = block.name
			attributes = block.attributes
			innerBlocks = block.innerBlocks
		}

		const cleanBlockAttributes = async blocks => {
			for ( const block of blocks ) {
				const blockName = block.name

				// For blocks with variations, do not remove the uniqueId
				// since that will prompt the layout picker to show.
				const hasVariations = !! getBlockType( blockName ) && getBlockVariations( blockName ).length > 0
				if ( ! hasVariations && block.attributes.uniqueId ) {
					delete block.attributes.uniqueId
				}

				const customAttributes = block.attributes.customAttributes

				const isDesignLibraryDevMode = devMode && localStorage.getItem( 'stk__design_library__dev_mode' ) === '1'
				if ( ! isDesignLibraryDevMode ) {
					const indexToDelete = customAttributes?.findIndex( attribute => attribute[ 0 ] === 'stk-design-library__bg-target' )
					if ( customAttributes && indexToDelete !== -1 ) {
						block.attributes.customAttributes.splice( indexToDelete, 1 )
					}
				}

				for ( const attributeName in block.attributes ) {
					if ( typeof block.attributes[ attributeName ] === 'string' ) {
						const value = String( block.attributes[ attributeName ] )
						block.attributes[ attributeName ] = await checkIfImageUrl( value )
					}
				}

				block.innerBlocks = await cleanBlockAttributes( block.innerBlocks )
			}

			return blocks
		}

		const block = await cleanBlockAttributes( [ {
			name: blockName, attributes, innerBlocks,
		} ] )

		blockName = block[ 0 ].name
		attributes = block[ 0 ].attributes
		innerBlocks = block[ 0 ].innerBlocks

		const isDesignLibraryDevMode = devMode && localStorage.getItem( 'stk__design_library__dev_mode' ) === '1'
		if ( ! isDesignLibraryDevMode ) {
			if ( category !== 'Header' ) {
				if ( ! parentClientId && attributes.hasBackground ) {
					attributes.blockMargin = {
						top: '',
						right: '',
						bottom: '0',
						left: '',
					}
				} else if ( ! parentClientId ) {
					attributes.blockMargin = {
						top: spacingSize,
						right: '',
						bottom: spacingSize,
						left: '',
					}
				}

				const blockLayouts = select( 'stackable/global-spacing-and-borders' ).getBlockLayouts()
				if ( attributes.hasBackground && typeof blockLayouts === 'object' && ! blockLayouts[ 'block-background-padding' ] ) {
					attributes.blockPadding = {
						top: spacingSize,
						right: spacingSize,
						bottom: spacingSize,
						left: spacingSize,
					}
				}
			}
		}

		return createBlock( blockName, attributes, createBlocksFromInnerBlocksTemplate( innerBlocks ) )
	}

	const addDesigns = async substituteBlocks => {
		const { getBlockRootClientId } = select( 'core/block-editor' )
		const parentClientId = getBlockRootClientId( clientId )

		if ( ! designsRef.current?.length ) {
			console.error( 'Design library selection failed: No designs found' ) // eslint-disable-line no-console
		}

		const designs = designsRef.current
		const blocks = []

		for ( const blockDesign of designs ) {
			const { designData, category } = blockDesign

			for ( const patterns of designData ) {
				const {
					name, attributes, innerBlocks,
				} = patterns
				if ( name && attributes ) {
					const block = await createBlockWithAttributes( category, name, applyFilters( 'stackable.design-library.attributes', attributes ), innerBlocks || [], substituteBlocks, parentClientId )
					blocks.push( block )
				} else {
					console.error( 'Design library selection failed: No block data found' ) // eslint-disable-line no-console
				}
			}
		}

		if ( ! blocks.length ) {
			return
		}

		if ( insertIndexRef.current !== -1 ) {
			dispatch( 'core/block-editor' ).insertBlocks( blocks, insertIndexRef.current )
		} else {
			dispatch( 'core/block-editor' ).replaceBlocks( clientId, blocks )
		}

		if ( blocksToRemoveRef.current.length ) {
			dispatch( 'core/block-editor' ).removeBlocks( blocksToRemoveRef.current )
			blocksToRemoveRef.current = []
		}

		if ( callbackRef.current ) {
			callbackRef.current()
		}
	}

	const onClickTertiary = () => {
		const disabledBlocks = disabledBlocksRef.current

		const settingsPageUrl = `/wp-admin/options-general.php?page=stackable`
		const newWindow = window.open( settingsPageUrl, '_blank' )

		if ( newWindow ) {
			newWindow.onload = () => { // Wait for the new page to fully load
				setTimeout( () => {
					try {
						const blocksTab = newWindow.document.getElementById( 'stk-tab__blocks' )
						if ( blocksTab ) {
							blocksTab.click()

							newWindow.postMessage( {
								type: 'STK_ENABLE_BLOCKS', blocks: disabledBlocks, source: 'STK_DESIGN_LIBRARY',
							}, window.location.origin )
						}
					} catch ( error ) {}
				}, 5 )
			}
			newWindow.focus()
		}
	}

	const onClickSecondary = async () => {
		await addDesigns( false )
	}
	const onClickPrimary = async () => {
		await addDesigns( true )
	}

	if ( attributes.previewMode ) {
		const src = previewImage.match( /https?:/i ) ? previewImage
			: srcUrl ? `${ srcUrl }/${ previewImage }`
				: previewImage

		return (
			<div className="ugb-design-library-block">
				<img src={ src } alt="design-library" />
			</div>
		)
	}

	return (
		<div { ...blockProps }>
			<Placeholder
				icon={ <SVGStackableIcon /> }
				label={ __( 'Stackable Design Library', i18n ) }
				instructions={ __( 'Open the Design Library and select a pre-designed block or layout.', i18n ) }
			>
				<Button
					isSecondary
					className="ugb-design-library-block__button"
					onClick={ () => {
						setIsLibraryOpen( true )
					} }
				>{ __( 'Open Design Library', i18n ) }</Button>
			</Placeholder>

			{ isLibraryOpen &&
				<ModalDesignLibrary
					onClose={ () => {
						setIsLibraryOpen( false )
					} }
					onSelect={ async ( _designs, callback, type ) => {
						const designs = []
						let disabledBlocks = new Set()

						_designs.forEach( design => {
							const {
								designData, blocksForSubstitution, category,
							} = design

							if ( blocksForSubstitution.size ) {
								disabledBlocks = disabledBlocks.union( blocksForSubstitution )
							}

							designs.push( { designData, category } )
						} )

						designsRef.current = designs
						disabledBlocksRef.current = disabledBlocks
						callbackRef.current = callback

						if ( type === 'pages' ) {
							const allBlocks = select( 'core/block-editor' ).getBlockOrder()
							const blocksToRemove = allBlocks.filter( id => id !== clientId )

							if ( blocksToRemove.length ) {
								blocksToRemoveRef.current = allBlocks
								setIsDialogOpen( DIALOG_OPTIONS.REMOVE_BLOCKS )
								return
							}
						}

						if ( disabledBlocks.size ) {
							setIsDialogOpen( DIALOG_OPTIONS.DISABLED_BLOCKS )
							return
						}

						await addDesigns( false )
					} }
				/>
			}
			{ isDialogOpen !== DIALOG_OPTIONS.CLOSE &&
				<Modal
					className="ugb-design-library__confirm-dialog"
					title={ __( 'Stackable Design Library', i18n ) }
					onRequestClose={ () => setIsDialogOpen( DIALOG_OPTIONS.CLOSE ) }
				>
					<VStack spacing={ 8 }>
						{ isDialogOpen === DIALOG_OPTIONS.REMOVE_BLOCKS && <>
							<div>
								<p>
									{ __( 'Adding this page design will replace all existing blocks in the editor. Are you sure you want to continue?', i18n ) }
								</p>
							</div>
							<Flex direction="column" align="stretch">
								<Button
									__next40pxDefaultSize
									variant="primary"
									onClick={ () => {
										insertIndexRef.current = 0
										if ( disabledBlocksRef.current.size ) {
											// Close this dialog and reopen after a while to show the notice for disabled blocks
											// The existing blocks will be removed later
											setIsDialogOpen( DIALOG_OPTIONS.CLOSE )
											setTimeout( () => setIsDialogOpen( DIALOG_OPTIONS.DISABLED_BLOCKS ), 500 )
											return
										}

										addDesigns( false )
									} }
								>
									{ __( 'Replace existing content with page design', i18n ) }
								</Button>
								<Button
									__next40pxDefaultSize
									variant="secondary"
									onClick={ () => {
										insertIndexRef.current = blocksToRemoveRef.current.length
										// When appending the page design, only remove the design library block
										blocksToRemoveRef.current = [ clientId ]

										if ( disabledBlocksRef.current.size ) {
											setIsDialogOpen( DIALOG_OPTIONS.CLOSE )
											setTimeout( () => setIsDialogOpen( DIALOG_OPTIONS.DISABLED_BLOCKS ), 500 )

											return
										}
										addDesigns( false )
									} }
								>
									{ __( 'Append page design only', i18n ) }
								</Button>
								<Button
									__next40pxDefaultSize
									variant="tertiary"
									onClick={ () => {
										blocksToRemoveRef.current = []
										setIsDialogOpen( DIALOG_OPTIONS.CLOSE )
									 } }
								>
									{ __( 'Cancel', i18n ) }
								</Button>
							</Flex>
						</> }
						{ isDialogOpen === DIALOG_OPTIONS.DISABLED_BLOCKS && <>
							<div>
								<p>{ __( 'The designs you have selected contain the following disabled blocks:', i18n ) }</p>
								<ul>
									{ disabledBlocksRef.current && [ ...disabledBlocksRef.current ].map( ( block, i ) => <li key={ i }>{ block }</li> ) }
								</ul>
								<p> { __( 'These blocks can be enabled in the Stackable settings page. Do you want to keep the disabled blocks or substitute them with other Stackable or core blocks?', i18n ) }</p>
							</div>
							<Flex direction="column" align="stretch">
								<Button
									__next40pxDefaultSize
									style={ { textAlign: 'center' } }
									variant="primary"
									onClick={ () => onClickPrimary() }
								>
									{ __( 'Add patterns and substitute blocks', i18n ) }
								</Button>
								<Button
									__next40pxDefaultSize
									style={ { textAlign: 'center', marginBottom: '16px' } }
									variant="secondary"
									onClick={ () => onClickSecondary() }
								>
									{ __( 'Add patterns only (no substitutes)', i18n ) }
								</Button>
								<Button
									__next40pxDefaultSize
									style={ { textAlign: 'center', marginBottom: '16px' } }
									variant="tertiary"
									onClick={ () => onClickTertiary() }
								>
									{ __( 'Enable blocks in settings', i18n ) }
								</Button>
							</Flex>
						</> }
					</VStack>

				</Modal>
			}
		</div>
	)
}

export default Edit
