
/**
 * Internal dependencies.
 */
import DEFAULT from './default.json'
import mapsGraphic from './images/maps.png'
import {
	addBackgroundScheme, addContainerScheme,
	addPlaceholderForPostsBlock, cleanParse,
	parseDisabledBlocks, adjustPatternSpacing,
	replacePlaceholders,
} from './util'

/**
 * External dependencies.
 */
import {
	isPro, devMode, srcUrl,
} from 'stackable'
import { fetchDesign } from '~stackable/design-library'
import { cloneDeep } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	useState, useRef, useEffect,
} from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { serialize } from '@wordpress/blocks'

const DEFAULT_CONTENT = { ...DEFAULT }

export const usePreviewRenderer = (
	props, previewSize, plan, spacingSize,
	selectedTab, selectedNum, selectedData,
	ref, shadowRoot, setIsLoading
) => {
	const {
		designId,
		template,
		category,
		containerScheme,
		backgroundScheme,
		enableBackground,
		onClick,
		cardHeight,
		setCardHeight,
		setPreviewSize,
	} = props

	const [ blocks, setBlocks ] = useState( { parsed: null, serialized: '' } )
	const [ content, setContent ] = useState( '' )
	const [ contentForInsertion, setContentForInsertion ] = useState( null )

	const categoriesRef = useRef( [] )
	const blocksForSubstitutionRef = useRef( false )
	const hasBackgroundTargetRef = useRef( false )
	const initialRenderRef = useRef( null )
	const shadowBodySizeRef = useRef( null )
	const prevEnableBackgroundRef = useRef( false )

	const siteTitle = useSelect( select => select( 'core' ).getEntityRecord( 'root', 'site' )?.title || 'InnovateCo', [] )
	const isDesignLibraryDevMode = devMode && localStorage.getItem( 'stk__design_library__dev_mode' ) === '1'

	const addHasBackground = selectedTab === 'patterns'

	const adjustScale = () => {
		if ( ref.current && shadowRoot && ! selectedNum ) {
			const newPreviewSize = { ...previewSize }
			const newCardHeight = { ...cardHeight }
			const cardRect = ref.current.getBoundingClientRect()

			const shadowBody = shadowRoot.querySelector( 'body' )
			if ( shadowBody ) {
				const cardWidth = cardRect.width // Get width of the card
				const scaleFactor = cardWidth > 0 ? cardWidth / 1300 : 1 	// Divide by 1200, which is the width of preview in the shadow DOM
				newPreviewSize.scale = scaleFactor

				let _bodyHeight = 1200
				if ( selectedTab === 'patterns' ) {
					_bodyHeight = shadowBody.offsetHeight
				}

				const _height = parseFloat( _bodyHeight ) * scaleFactor	// Also adjust the height

				if ( Object.keys( newPreviewSize ).length === 1 ) {
					newPreviewSize.heightBackground = _height
					newPreviewSize.heightNoBackground = _height
				} else {
					const heightKey = enableBackground ? 'heightBackground' : 'heightNoBackground'
					newPreviewSize[ heightKey ] = _height
				}

				setPreviewSize( newPreviewSize )

				shadowBodySizeRef.current = {
					clientHeight: shadowBody.clientHeight,
					scrollHeight: shadowBody.scrollHeight,
					maxScrollTop: shadowBody.scrollHeight - shadowBody.clientHeight,
				}
			}

			if ( ! Object.keys( newCardHeight ).length ) {
				newCardHeight.background = cardRect.height
				newCardHeight.noBackground = cardRect.height
			} else {
				const CardHeightKey = enableBackground ? 'background' : 'noBackground'
				newCardHeight[ CardHeightKey ] = cardRect.height
			}

			setTimeout( () => setCardHeight( newCardHeight ), 500 )
		}
	}

	const renderPreview = ( blockContent = content ) => {
		let parsedBlocks = cloneDeep( selectedData?.designData || blockContent )

		if ( ! parsedBlocks ) {
			return
		}

		// No need to add the color scheme attribute if the selected scheme is the default
		if ( containerScheme !== '' && ! selectedNum ) {
			parsedBlocks = addContainerScheme( parsedBlocks, containerScheme )
		}

		// Only add a background scheme if it is enabled
		if ( enableBackground && ! selectedNum ) {
			parsedBlocks = addBackgroundScheme( parsedBlocks, enableBackground, backgroundScheme, addHasBackground )
		}

		if ( selectedTab === 'patterns' ) {
			adjustPatternSpacing( parsedBlocks[ 0 ].attributes, category, spacingSize, false )
		}

		let preview = serialize( parsedBlocks )

		// The block `wp/site-title` is a dynamic block, so we need to manually replace it for the preview
		if ( categoriesRef.current.includes( 'Header' ) ) {
			preview = preview.replace( /<!--\s*wp:site-title(?:\s+[^\/]*?)?\/-->/g, siteTitle )
		}
		if ( categoriesRef.current.includes( 'Tabs' ) ) {
		// Add a class for the first tab to be the active tab in the preview
			preview = preview.replace( '"stk-block-tabs__tab"', '"stk-block-tabs__tab stk-block-tabs__tab--active"' )
		}
		if ( categoriesRef.current.includes( 'Post Loop' ) ) {
			const defaultValues = DEFAULT_CONTENT[ 'Post Loop' ]
			preview = addPlaceholderForPostsBlock( preview, defaultValues.posts_placeholder, defaultValues )
		}

		// For designs with maps block, replace the iframe with an img of the maps
		if ( preview.includes( 'stk-block-map' ) ) {
			// Regex to match <div ... class="...stk-block-map...">...</div>
			preview = preview.replace(
				/(<div[^>]*class="[^"]*stk-block-map[^"]*"[^>]*>)([\s\S]*?)(<\/div>)/g,
				( match, divStart, divContent, divEnd ) => {
					// Replace <iframe ...></iframe> or <iframe .../> with <img ... />
					const replacedContent = divContent.replace(
						/<iframe[\s\S]*?<\/iframe>|<iframe[\s\S]*?\/>/g,
						'<img src="' + srcUrl + '/' + mapsGraphic + '" />'
					)
					return divStart + replacedContent + divEnd
				}
			)
		}

		const cleanedBlock = preview.replace( /<!--[\s\S]*?-->/g, '' ) // removes comment

		setBlocks( {
			parsed: parsedBlocks,
			serialized: cleanedBlock,
		} )
	}

	// Replace the placeholders with the default content
	useEffect( () => {
		let _parsedBlocks = []
		let _parsedBlocksForInsertion = null
		const initialize = async () => {
			const _content = template
			if ( selectedTab === 'patterns' ) {
				// For preview: always replace placeholders (ignore dev mode)
				const _contentForPreview = replacePlaceholders( _content, category, false )
				// For insertion: only create separate content if dev mode is enabled
				const _contentForInsertion = isDesignLibraryDevMode ? replacePlaceholders( _content, category, true ) : _contentForPreview

				categoriesRef.current.push( category )

				if ( _contentForPreview.includes( 'stk-design-library__bg-target="true"' ) ) {
					hasBackgroundTargetRef.current = true
				}

				_parsedBlocks = cleanParse( _contentForPreview )
				_parsedBlocksForInsertion = isDesignLibraryDevMode ? cleanParse( _contentForInsertion ) : null
			} else {
				for ( let i = 0; i < _content.length; i++ ) {
					const section = _content[ i ]
					const design = await fetchDesign( section.id )
					// For preview: always replace placeholders (ignore dev mode)
					const designContentForPreview = replacePlaceholders( design.template || design.content, design.category, false )
					// For insertion: only create separate content if dev mode is enabled
					const designContentForInsertion = isDesignLibraryDevMode ? replacePlaceholders( design.template || design.content, design.category, true ) : designContentForPreview

					categoriesRef.current.push( design.category )

					let _block = cleanParse( designContentForPreview )[ 0 ]
					let _blockForInsertion = isDesignLibraryDevMode ? cleanParse( designContentForInsertion )[ 0 ] : null

					if ( section.bg ) {
						_block = addBackgroundScheme( [ _block ], true, '' )[ 0 ]
						if ( _blockForInsertion ) {
							_blockForInsertion = addBackgroundScheme( [ _blockForInsertion ], true, '' )[ 0 ]
						}
					}

					adjustPatternSpacing( _block.attributes, design.category, spacingSize, false )
					if ( _blockForInsertion ) {
						adjustPatternSpacing( _blockForInsertion.attributes, design.category, spacingSize, true )
					}
					_parsedBlocks.push( _block )
					if ( _blockForInsertion ) {
						_parsedBlocksForInsertion = _parsedBlocksForInsertion || []
						_parsedBlocksForInsertion.push( _blockForInsertion )
					}
				}
			}
		}

		initialize().then( () => {
		    // We need to parse the content because this is what we use to insert the blocks in the Editor
		    const [ parsedBlocks, blocksForSubstitution ] = parseDisabledBlocks( _parsedBlocks )
		    const parsedBlocksForInsertion = _parsedBlocksForInsertion ? parseDisabledBlocks( _parsedBlocksForInsertion )[ 0 ] : null
		    blocksForSubstitutionRef.current = blocksForSubstitution

		    setContent( parsedBlocks )
		    setContentForInsertion( parsedBlocksForInsertion )
			setIsLoading( false )
		} )
	}, [ template ] )

	useEffect( () => {
		if ( ! initialRenderRef.current ) {
			initialRenderRef.current = true
			return
		}

		if ( ! content ||
			! shadowRoot ||
			selectedNum
		) {
			return
		}

		renderPreview()
	}, [ content, containerScheme, backgroundScheme, enableBackground ] )

	// Re-render and adjust scale if design was unselected.
	useEffect( () => {
		if ( selectedNum === 0 && content && shadowRoot ) {
			renderPreview()
			adjustScale()
		}
	}, [ selectedNum ] )

	useEffect( () => {
		if ( ! blocks.parsed || ! blocks.serialized ) {
			return
		}

		if ( prevEnableBackgroundRef.current !== enableBackground ) {
			prevEnableBackgroundRef.current = enableBackground
			adjustScale()
		}
	}, [ blocks ] )

	// If categories change, adjust preview sizes
	useEffect( () => {
		if ( ! content || ! blocks.parsed || ! blocks.serialized ) {
			return
		}
		setTimeout( adjustScale, 100 )
	}, [ content ] )

	const onClickDesign = () => {
		if ( ! isPro && plan !== 'free' ) {
			return
		}
		const cardRect = ref.current.getBoundingClientRect()

		const selectedPreviewSize = {
			preview: enableBackground ? previewSize.heightBackground : previewSize.heightNoBackground,
			card: cardRect.height,
			scale: previewSize.scale,
		}

		// Use contentForInsertion if dev mode is enabled, otherwise use regular content
		onClick( designId, category, contentForInsertion || blocks.parsed, blocksForSubstitutionRef.current, selectedPreviewSize )
	}

	return {
		blocks: blocks.serialized, enableBackground,
		shadowBodySizeRef, blocksForSubstitutionRef,
		adjustScale, onClickDesign,
	}
}
