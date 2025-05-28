/**
 * Internal dependencies
 */
import previewImage from './images/preview.jpg'
import {
	i18n,
	srcUrl,
	settings,
	cdnUrl,
} from 'stackable'
import {
	Button,
	ModalDesignLibrary,
} from '~stackable/components'
import { SVGStackableIcon } from '~stackable/icons'
import { substituteCoreIfDisabled, BLOCK_STATE } from '~stackable/util'
import { substitutionRules } from '../../blocks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { dispatch } from '@wordpress/data'
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
	}
	return value
}

// Replaces the current block with a block made out of attributes.
const createBlockWithAttributes = async ( blockName, attributes, innerBlocks, substituteBlocks ) => {
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

			const indexToDelete = customAttributes?.findIndex( attribute => attribute[ 0 ] === 'stk-design-library__bg-target' )
			if ( customAttributes && indexToDelete !== -1 ) {
				block.attributes.customAttributes.splice( indexToDelete, 1 )
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

	return createBlock( blockName, attributes, createBlocksFromInnerBlocksTemplate( innerBlocks ) )
}

const Edit = props => {
	const {
		clientId,
		attributes,
	} = props

	const [ isLibraryOpen, setIsLibraryOpen ] = useState( false )
	const [ isDialogOpen, setIsDialogOpen ] = useState( false )

	const designsRef = useRef( [] )
	const disabledBlocksRef = useRef( [] )
	const callbackRef = useRef( null )

	const blockProps = useBlockProps( {
		className: 'ugb-design-library-block',
	} )

	const addDesigns = async substituteBlocks => {
		if ( ! designsRef.current?.length ) {
			console.error( 'Design library selection failed: No designs found' ) // eslint-disable-line no-console
		}

		const designs = designsRef.current
		const blocks = []

		for ( const designData of designs ) {
			const {
				name, attributes, innerBlocks,
			} = designData
			if ( name && attributes ) {
				const block = await createBlockWithAttributes( name, applyFilters( 'stackable.design-library.attributes', attributes ), innerBlocks || [], substituteBlocks )
				blocks.push( block )
			} else {
				console.error( 'Design library selection failed: No block data found' ) // eslint-disable-line no-console
			}
		}

		if ( blocks.length ) {
			dispatch( 'core/block-editor' ).replaceBlocks( clientId, blocks )
			if ( callbackRef.current ) {
				callbackRef.current()
			}
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
					onSelect={ async ( _designs, callback ) => {
						const designs = []
						let disabledBlocks = new Set()

						_designs.forEach( design => {
							const { designData, blocksForSubstitution } = design

							if ( blocksForSubstitution.size ) {
								disabledBlocks = disabledBlocks.union( blocksForSubstitution )
							}

							designs.push( designData )
						} )

						designsRef.current = designs
						disabledBlocksRef.current = disabledBlocks
						callbackRef.current = callback

						if ( disabledBlocks.size ) {
							setIsDialogOpen( true )
							return
						}

						await addDesigns( false )
					} }
				/>
			}
			{ isDialogOpen &&
				<Modal
					className="ugb-design-library__confirm-dialog"
					__experimentalHideHeader
					onRequestClose={ () => setIsDialogOpen( false ) }
				>
					<VStack spacing={ 8 }>
						<div>
							<span>{ __( 'The designs you have selected contain the following disabled blocks:', i18n ) }</span>
							<ul>
								{ disabledBlocksRef.current && [ ...disabledBlocksRef.current ].map( ( block, i ) => <li key={ i }>{ block }</li> ) }
							</ul>
							<span> { __( 'These blocks can be enabled in the Stackable settings page. Do you want to keep the disabled blocks or substitute them with other Stackable or core blocks?', i18n ) }</span>
						</div>
						<Flex direction="column" align="flex-end">
							<Button
								__next40pxDefaultSize
								variant="tertiary"
								onClick={ () => onClickTertiary() }
							>
								{ __( 'Visit the settings page and enable the blocks', i18n ) }
							</Button>
							<Button
								__next40pxDefaultSize
								variant="primary"
								onClick={ () => onClickPrimary() }
							>
								{ __( 'Add patterns and substitute missing blocks', i18n ) }
							</Button>
							<Button
								__next40pxDefaultSize
								variant="secondary"
								onClick={ () => onClickSecondary() }
							>
								{ __( 'Add patterns without substituting missing blocks', i18n ) }
							</Button>
						</Flex>
					</VStack>

				</Modal>
			}
		</div>
	)
}

export default Edit
