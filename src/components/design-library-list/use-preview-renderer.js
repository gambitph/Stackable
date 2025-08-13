
/**
 * Internal dependencies.
 */
import DEFAULT from './default.json'
import {
	addBackgroundScheme, addContainerScheme,
	addPlaceholderForPostsBlock, cleanParse,
	parseDisabledBlocks, adjustPatternSpacing,
	replacePlaceholders,
} from './util'

/**
 * External dependencies.
 */
import { isPro, devMode } from 'stackable'
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
				const scaleFactor = cardWidth > 0 ? cardWidth / shadowBody.offsetWidth : 1 	// Divide by 1200, which is the width of preview in the shadow DOM
				newPreviewSize.scale = scaleFactor

				const _height = parseFloat( shadowBody.offsetHeight ) * scaleFactor	// Also adjust the height

				if ( Object.keys( newPreviewSize ).length === 1 ) {
					newPreviewSize.heightBackground = _height
					newPreviewSize.heightNoBackground = _height
				} else {
					const heightKey = enableBackground ? 'heightBackground' : 'heightNoBackground'
					newPreviewSize[ heightKey ] = _height
				}

				setPreviewSize( newPreviewSize )

				if ( shadowBodySizeRef.current === null ) {
					shadowBodySizeRef.current = {
						clientHeight: shadowBody.clientHeight,
						scrollHeight: shadowBody.scrollHeight,
						maxScrollTop: shadowBody.scrollHeight - shadowBody.clientHeight,
					}
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
			adjustPatternSpacing( parsedBlocks[ 0 ].attributes, category, spacingSize, isDesignLibraryDevMode )
		}

		let preview = serialize( parsedBlocks )

		// The block `wp/site-title` is a dynamic block, so we need to manually replace it for the preview
		if ( categoriesRef.current.includes( 'Header' ) ) {
			preview = preview.replace( /<!--\s*wp:site-title(?:\s+[^\/]*?)?\/-->/g, siteTitle )
		} else if ( categoriesRef.current.includes( 'Tabs' ) ) {
		// Add a class for the first tab to be the active tab in the preview
			preview = preview.replace( '"stk-block-tabs__tab"', '"stk-block-tabs__tab stk-block-tabs__tab--active"' )
		} else if ( categoriesRef.current.includes( 'Post Loop' ) ) {
			const defaultValues = DEFAULT_CONTENT[ 'Post Loop' ]
			preview = addPlaceholderForPostsBlock( preview, defaultValues.posts_placeholder, defaultValues )
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
		const initialize = async () => {
			let _content = template
			if ( selectedTab === 'patterns' ) {
				_content = replacePlaceholders( _content, category, isDesignLibraryDevMode )

				categoriesRef.current.push( category )

				if ( _content.includes( 'stk-design-library__bg-target="true"' ) ) {
					hasBackgroundTargetRef.current = true
				}

				_parsedBlocks = cleanParse( _content )
			} else {
				for ( let i = 0; i < _content.length; i++ ) {
					const section = _content[ i ]
					const design = await fetchDesign( section.id )
					const designContent = replacePlaceholders( design.template, design.category )

					categoriesRef.current.push( design.category )

					let _block = cleanParse( designContent )[ 0 ]

					if ( section.bg ) {
						_block = addBackgroundScheme( [ _block ], true, '' )[ 0 ]
					}

					adjustPatternSpacing( _block.attributes, design.category, spacingSize, isDesignLibraryDevMode )
					_parsedBlocks.push( _block )
				}
			}
		}

		initialize().then( () => {
		    // We need to parse the content because this is what we use to insert the blocks in the Editor
		    const [ parsedBlocks, blocksForSubstitution ] = parseDisabledBlocks( _parsedBlocks )
		    blocksForSubstitutionRef.current = blocksForSubstitution

		    setContent( parsedBlocks )
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

		onClick( designId, category, blocks.parsed, blocksForSubstitutionRef.current, selectedPreviewSize )
	}

	return {
		blocks: blocks.serialized, enableBackground,
		shadowBodySizeRef, blocksForSubstitutionRef,
		adjustScale, onClickDesign,
	}
}
