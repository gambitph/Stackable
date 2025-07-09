/**
 * Internal dependencies.
 */
import ProControl from '../pro-control'
import DEFAULT from './default.json'
import {
	addBackgroundScheme, addContainerScheme,
	addPlaceholderForPostsBlock, cleanParse,
	getAdditionalStylesForPreview,
	parseDisabledBlocks,
} from './util'

/**
 * External dependencies.
 */
import { createRoot } from '~stackable/util'
import {
	isPro, i18n, wpGlobalStylesInlineCss,
} from 'stackable'
import classnames from 'classnames'
import { Tooltip } from '~stackable/components'

/**
 * WordPress dependencies.
 */
import {
	forwardRef, useEffect, useRef, useState,
} from '@wordpress/element'
import { select, useSelect } from '@wordpress/data'
import { Dashicon } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { serialize } from '@wordpress/blocks'
import { applyFilters } from '@wordpress/hooks'
import { cloneDeep } from 'lodash'

const DEFAULT_CONTENT = { ...DEFAULT }

const DesignLibraryListItem = forwardRef( ( props, ref ) => {
	const {
		designId,
		label,
		onClick,
		template = '',
		category = '',
		plan,
		selectedNum = false,
		selectedData = null,
		containerScheme,
		backgroundScheme,
		enableBackground,
		cardHeight,
		setCardHeight,
		previewSize,
		setPreviewSize,
	} = props

	const [ parsedBlocks, setParsedBlocks ] = useState( null )
	const [ content, setContent ] = useState( '' )

	const hostRef = useRef( null )
	const previewRef = useRef( null )
	const blocksForSubstitutionRef = useRef( false )
	const hasBackgroundTargetRef = useRef( false )
	const initialRenderRef = useRef( null )

	const { getEditorDom } = useSelect( 'stackable/editor-dom' )
	const editorDom = getEditorDom()

	const siteTitle = useSelect( select => select( 'core' ).getEntityRecord( 'root', 'site' )?.title || 'InnovateCo', [] )

	const mainClasses = classnames( [
		'ugb-design-library-item',
		'ugb-design-library-item--toggle',
	], {
		[ `ugb--is-${ plan }` ]: ! isPro && plan !== 'free',
		'ugb--is-toggled': selectedNum,
	} )

	const STYLE_IDS = applyFilters( 'stackable.global-styles.ids', [
		'ugb-dep-native-global-style-css-nodep-inline-css',
		'ugb-style-css-css',
		'ugb-style-css-responsive-css',
		'ugb-block-style-inheritance-nodep-inline-css',
		'ugb-style-css-premium-css',
	] )

	const adjustScale = () => {
		if ( ref.current && hostRef.current?.shadowRoot && ! selectedNum ) {
			const newPreviewSize = { ...previewSize }
			const newCardHeight = { ...cardHeight }
			const cardRect = ref.current.getBoundingClientRect()

			const shadowBody = hostRef.current.shadowRoot.querySelector( 'body' )
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
		let blocks = cloneDeep( selectedData?.designData || blockContent )

		// No need to add the color scheme attribute if the selected scheme is the default
		if ( containerScheme !== '' && ! selectedNum ) {
			blocks = addContainerScheme( blocks, containerScheme )
		}

		// Only add a background scheme if it is enabled
		if ( enableBackground && ! selectedNum ) {
			blocks = addBackgroundScheme( blocks, enableBackground, backgroundScheme )
		}

		setParsedBlocks( blocks )

		let preview = serialize( blocks )

		// The block `wp/site-title` is a dynamic block, so we need to manually replace it for the preview
		if ( category === 'Header' ) {
			preview = preview.replace( /<!--\s*wp:site-title(?:\s+[^\/]*?)?\/-->/g, siteTitle )
		} else if ( category === 'Tabs' ) {
		// Add a class for the first tab to be the active tab in the preview
			preview = preview.replace( '"stk-block-tabs__tab"', '"stk-block-tabs__tab stk-block-tabs__tab--active"' )
		} else if ( category === 'Post Loop' ) {
			const defaultValues = DEFAULT_CONTENT[ category ]
			preview = addPlaceholderForPostsBlock( preview, defaultValues[ 'posts_placeholder' ], defaultValues )
		}

		const cleanedBlock = preview.replace( /<!--[\s\S]*?-->/g, '' ) // removes comment

		previewRef.current.render( <DesignPreview
			blocks={ cleanedBlock }
			adjustScale={ adjustScale }
			enableBackground={ enableBackground }
		/> )
	}

	// Replace the placeholders with the default content
	useEffect( () => {
		const defaultValues = DEFAULT_CONTENT[ category ]
		let _content = template
		if ( defaultValues ) {
			Object.keys( defaultValues ).forEach( key => {
				_content = _content.replaceAll( key, defaultValues[ key ] )
			} )
		}

		if ( _content.includes( 'stk-design-library__bg-target="true"' ) ) {
			hasBackgroundTargetRef.current = true
		}

		// We need to parse the content because this is what we use to insert the blocks in the Editor
		const _block = cleanParse( _content )[ 0 ]
		const { block, blocksForSubstitution } = parseDisabledBlocks( _block )
		blocksForSubstitutionRef.current = blocksForSubstitution

		const shadowRoot = hostRef.current.shadowRoot || hostRef.current.attachShadow( { mode: 'open' } )

		// Initialize the shadow DOM for the first time
		if ( ! previewRef.current ) {
			// Get all styles needed and make a copy for the shadow DOM
			const styleNodes = STYLE_IDS.map( id => {
				let style = null
				let node = document?.head?.querySelector( `#${ id }` )
				if ( ! node && editorDom ) {
					const editorBody = editorDom?.closest( 'body' )
					const editorHead = editorBody?.ownerDocument?.head
					node = editorHead.querySelector( `#${ id }` )
				}

				if ( node ) {
					style = node.cloneNode( true )
				}

				return style
			} ).filter( node => node !== null )

			// Add global and theme styles
			const globalStylesNode = document.createElement( 'style' )
			globalStylesNode.setAttribute( 'id', 'global-styles-inline-css' )
			globalStylesNode.innerHTML = wpGlobalStylesInlineCss
			styleNodes.push( globalStylesNode )

			const hostStyles = document.createElement( 'style' )
			hostStyles.setAttribute( 'id', 'stk-design-library-styles' )

			const blockLayouts = select( 'stackable/global-spacing-and-borders' ).getBlockLayouts()
			hostStyles.innerHTML = ! hasBackgroundTargetRef.current ? 'body > .stk-block-columns { padding: 75px; }' : '[stk-design-library__bg-target="true"] { padding: 50px; }'

			if ( ( Array.isArray( blockLayouts ) && ! blockLayouts.length ) ||
					( typeof blockLayouts === 'object' && ! blockLayouts[ 'block-background-padding' ] )
			) {
				hostStyles.innerHTML += ! hasBackgroundTargetRef.current
					? ` body > .stk-block-background:not(.stk--no-padding) { padding: calc(75px + var(--stk-block-background-padding)); }`
					: ` [stk-design-library__bg-target="true"].stk-block-background:not(.stk--no-padding) { padding: calc(26px + var(--stk-block-background-padding)); }`
			}

			// Additional styles for blocks to render properly in the preview
			hostStyles.innerHTML += getAdditionalStylesForPreview()

			styleNodes.push( hostStyles )

			styleNodes.forEach( node => {
				if ( node.textContent ) {
					// we use :host in the shadow DOM to target the root
					node.textContent = node.textContent.replace( /:root/g, ':host' )
				}
				shadowRoot.appendChild( node )
			} )

			previewRef.current = createRoot( shadowRoot )
		}

		renderPreview( block )
		setContent( block )
	}, [ template ] )

	useEffect( () => {
		if ( ! initialRenderRef.current ) {
			initialRenderRef.current = true
			return
		}

		if ( ! content ||
			! previewRef.current ||
			selectedNum
		) {
			return
		}

		renderPreview()
	}, [ content, containerScheme, backgroundScheme, enableBackground ] )

	useEffect( () => {
		if ( selectedNum === 0 && content && previewRef.current ) {
			renderPreview()
			adjustScale()
		}
	}, [ selectedNum ] )

	const getDesignPreviewSize = () => {
		return selectedNum && selectedData ? selectedData.selectedPreviewSize.preview
			: ( enableBackground ? previewSize.heightBackground : previewSize.heightNoBackground )
	}

	return (
		<button
			className={ mainClasses }
			ref={ ref }
			data-stk-design-id={ props.designId }
			onClick={ () => {
				if ( ! isPro && plan !== 'free' ) {
					return
				}
				const cardRect = ref.current.getBoundingClientRect()

				const selectedPreviewSize = {
					preview: enableBackground ? previewSize.heightBackground : previewSize.heightNoBackground,
					card: cardRect.height,
					scale: previewSize.scale,
				}

				onClick( designId, category, parsedBlocks, blocksForSubstitutionRef.current, selectedPreviewSize )
			} }
		>
			{ ! isPro && plan !== 'free' && <span className="stk-pulsating-circle" role="presentation" /> }
			<div style={ { position: 'relative' } } className={ `${ getDesignPreviewSize() > 100 ? 'stk--design-preview-large' : 'stk--design-preview-small' }` }>
				{ ! isPro && plan !== 'free' && (
					<ProControl
						type="design-library"
						showImage={ false }
						showHideNote={ false }
					/>
				) }
				<div
					className="stk-block-design__host-container"
					style={ {
						transform: `scale(${ selectedNum && selectedData ? selectedData.selectedPreviewSize.scale : previewSize?.scale })`,
						transformOrigin: 'top left',
						height: selectedNum && selectedData ? selectedData.selectedPreviewSize.preview
							: ( enableBackground ? previewSize.heightBackground : previewSize.heightNoBackground ),
					} }
				>

					<div className="stk-block-design__host" ref={ hostRef } />
				</div>
			</div>

			<footer
				// Add the number if isToggle is a number, signifying an order instead of just an on/off.
				data-selected-num={ selectedNum }
			>
				<div>
					<h4> { label } </h4>
					{ blocksForSubstitutionRef.current !== false && blocksForSubstitutionRef.current.size !== 0 &&
						<Tooltip text={ __( 'This design contains disabled blocks. You can still insert this design with blocks substituted with other enabled blocks.', i18n ) }>
							<Dashicon icon="warning" size={ 16 } />
						</Tooltip>
					}
				</div>
				<div>
					{ selectedNum !== 0 &&
						<Tooltip text={ __( 'Style options are locked for this design because it is selected.', i18n ) }>
							<Dashicon icon="lock" size={ 16 } />
						</Tooltip>
					}
					<span className="stk-block-design__selected-num">{ selectedNum === 0 ? '' : selectedNum }</span>
				</div>
			</footer>
		</button>
	)
} )

DesignLibraryListItem.defaultProps = {
	designId: '',
	image: '',
	label: '',
	onClick: () => {},
	plan: 'free',
	premiumLabel: __( 'Go Premium', i18n ),
}

export default DesignLibraryListItem

const DesignPreview = ( {
	blocks, adjustScale, enableBackground,
} ) => {
	useEffect( () => {
		// Adjust scale if the background was toggled
		adjustScale()
		setTimeout( adjustScale, 50 )
	}, [ blocks, enableBackground ] )

	const shadowBodyClasses = classnames( applyFilters( 'stackable.global-styles.classnames', [ 'entry-content' ] ) )

	return (
		<body
			dangerouslySetInnerHTML={ { __html: blocks } }
			className={ shadowBodyClasses }
			style={ { pointerEvents: 'none' } }	// prevent blocks from being clicked
		/>
	)
}
