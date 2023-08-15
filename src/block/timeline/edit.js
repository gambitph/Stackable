/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import { i18n, version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	AdvancedRangeControl,
	AdvancedToolbarControl,
	ColorPaletteControl,
	ControlSeparator,
	InspectorLayoutControls,
	InspectorStyleControls,
	InspectorTabs,
	PanelAdvancedSettings,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	MarginBottom,
	getRowClasses,
	getTypographyClasses,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	ConditionalDisplay,
	getSeparatorClasses,
	ContentAlign,
	getContentAlignmentClasses,
	Typography,
} from '~stackable/block-components'
import { useBlockContext, useDeviceType } from '~stackable/hooks'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { InnerBlocks } from '@wordpress/block-editor'
import { addFilter } from '@wordpress/hooks'
import { dispatch } from '@wordpress/data'
import {
	useEffect, useRef, useState,
} from '@wordpress/element'

const ALLOWED_INNER_BLOCKS = [ 'stackable/column' ]

const TEMPLATE = [
	[ 'stackable/column', {
		columnSpacing: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		},
	}, [
		[ 'stackable/text', {
			text: _x( 'Description for this block. Use this space for describing your block. Any text will do.', 'Content placeholder', i18n ),
			blockMargin: {
				bottom: 0,
			},
		} ],
	] ],
]

const COLOR_TYPE_CONTROLS = [
	{
		value: '',
		title: __( 'Single', i18n ),
	},
	{
		value: 'gradient',
		title: __( 'Gradient', i18n ),
	},
]

const Edit = props => {
	const {
		className,
		clientId,
		isSelected,
		setAttributes,
	} = props

	useGeneratedCss( props.attributes )

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const typographyClass = getTypographyClasses( props.attributes )
	const {
		hasInnerBlocks, nextBlock, previousBlock,
	} = useBlockContext()
	const deviceType = useDeviceType()

	const middleRef = useRef()
	const branchRef = useRef()
	const blockRef = useRef()
	const [ middleTopPosition, setMiddleTopPosition ] = useState( { dot: 0, branch: 0 } )
	const [ fillHeight, setFillHeight ] = useState( { verticalLine: 0, middle: 0 } )
	const [ verticalLineMaxHeight, setVerticalLineMaxHeight ] = useState( 0 )
	const [ verticalLineTopPosition, setVerticalLineTopPosition ] = useState( 0 )
	const [ backgroundPosition, setBackgroundPosition ] = useState( { verticalLine: 0, middle: 0 } )

	const dateClassNames = classnames( [
		typographyClass,
		'stk-block-timeline__date',
	] )

	const blockClassNames = classnames( [
		className,
		'stk-block-timeline',
		rowClass,
		separatorClass,
		{
			'stk-block-timeline--left': props.attributes.timelinePosition !== 'right',
			'stk-block-timeline--right': props.attributes.timelinePosition === 'right',
			'stk-block-timeline--last': props.attributes.timelineIsLast,
		},
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], getContentAlignmentClasses( props.attributes ) )

	// check if timeline block is single, is first block, or is last block
	const getTimelinePosition = () => {
		return {
			isFirst: ! previousBlock || previousBlock.name !== 'stackable/timeline',
			isLast: ! nextBlock || nextBlock.name !== 'stackable/timeline',
		}
	}

	// gets anchor and paddings
	const getSelectAttributes = () => {
		const { isFirst } = getTimelinePosition()

		// Get Anchor
		let anchor = props.attributes.timelineAnchor === '' ? 0.5 : ( props.attributes.timelineAnchor / 100 )

		const iframe = document.querySelector( '[name=editor-canvas]' )
		const doc = iframe ? ( iframe.contentDocument || iframe.contentWindow.document ) : document

		const block = doc.getElementById( `block-${ clientId }` )

		if ( ! isFirst && block.hasAttribute( 'data-anchor' ) && block.getAttribute( 'data-anchor' ) !== '' ) {
			anchor = block.getAttribute( 'data-anchor' ) / 100
		} else if ( ! isFirst && block.hasAttribute( 'data-anchor' ) ) {
			anchor = 0.5
		}

		// Get Paddings
		let topPadding = props.attributes.blockPadding && props.attributes.blockPadding.top !== '' ? props.attributes.blockPadding.top : 16
		let bottomPadding = props.attributes.blockPadding && props.attributes.blockPadding.bottom !== '' ? props.attributes.blockPadding.bottom : 16
		let backgroundPadding = props.attributes.hasBackground && props.attributes.blockPadding?.top === '' && props.attributes.blockPadding?.bottom === '' ? 8 : 0

		if ( deviceType === 'Tablet' ) {
			topPadding = props.attributes.blockPaddingTablet && props.attributes.blockPaddingTablet.top !== '' ? props.attributes.blockPaddingTablet.top : 16
			bottomPadding = props.attributes.blockPaddingTablet && props.attributes.blockPaddingTablet.bottom !== '' ? props.attributes.blockPaddingTablet.bottom : 16
			backgroundPadding = props.attributes.hasBackground && props.attributes.blockPaddingTablet?.top === '' && props.attributes.blockPaddingTablet?.bottom === '' ? 8 : 0
		} else if ( deviceType === 'Mobile' ) {
			topPadding = props.attributes.blockPaddingMobile && props.attributes.blockPaddingMobile.top !== '' ? props.attributes.blockPaddingMobile.top : 0
			bottomPadding = props.attributes.blockPaddingMobile && props.attributes.blockPaddingMobile.bottom !== '' ? props.attributes.blockPaddingMobile.bottom : 0
			backgroundPadding = props.attributes.hasBackground && props.attributes.blockPaddingMobile?.top === '' && props.attributes.blockPaddingMobile?.bottom === '' ? 8 : 0
		}

		return {
			timelineAnchor: anchor,
			topPadding,
			bottomPadding,
			backgroundPadding,
		}
	}

	const handleScroll = () => {
		const {
			timelineAnchor, topPadding, bottomPadding, backgroundPadding,
		} = getSelectAttributes()

		const lineHeight = ( document.body.clientHeight * timelineAnchor ) - ( blockRef.current.getBoundingClientRect().top ) + topPadding + backgroundPadding
		const fillPercent = ( lineHeight / ( blockRef.current.getBoundingClientRect().height + topPadding + bottomPadding + ( backgroundPadding * 2 ) ) ) * 100

		// gets equivalent px of 1%
		const fillPxPercent = ( blockRef.current.getBoundingClientRect().height + topPadding + bottomPadding + ( backgroundPadding * 2 ) ) / 100
		// converts percent to px
		const fillPx = fillPercent * fillPxPercent

		let fill = { verticalLine: fillPx, middle: fillPx }

		const dot = ( middleRef.current.getBoundingClientRect().top - blockRef.current.getBoundingClientRect().top ) + topPadding + backgroundPadding
		const branch = ( branchRef.current.getBoundingClientRect().top - blockRef.current.getBoundingClientRect().top ) + topPadding + backgroundPadding

		// corrects the position of the fill for the first timeline block since the line starts at the middle
		if ( ! previousBlock || previousBlock.name !== 'stackable/timeline' ) {
			fill = {
				verticalLine: fillPx - dot,
				middle: fillPx,
			}
		}

		setMiddleTopPosition( { dot, branch } )
		setFillHeight( fill )
	}

	const updateMaxHeight = () => {
		const {
			isFirst, isLast,
		} = getTimelinePosition()

		const {
			topPadding, bottomPadding,
		} = getSelectAttributes()

		let lineMaxHeight = '100%'
		let top = ''
		if ( isFirst && isLast ) {
			lineMaxHeight = '0'
		} else if ( deviceType === 'Mobile' && isFirst ) {
			lineMaxHeight = `calc(100% - ${ topPadding }px - 16px)`
			const dotSize = props.attributes.timelineDotSize || 11
			top = `${ topPadding + 16 + ( dotSize / 2 ) }px`
		} else if ( deviceType === 'Mobile' && isLast ) {
			lineMaxHeight = `${ topPadding + 16 }px`
		} else if ( deviceType === 'Mobile' ) {
			lineMaxHeight = '100%'
		} else if ( isFirst ) {
			lineMaxHeight = `calc(50% + ${ bottomPadding / 2 }px - ${ topPadding / 2 }px)`
		} else if ( isLast ) {
			lineMaxHeight = `calc(50% + ${ topPadding / 2 }px - ${ bottomPadding / 2 }px)`
		}

		setVerticalLineMaxHeight( lineMaxHeight )
		setVerticalLineTopPosition( top )
		handleScroll()
	}

	const updateBackgroundPosition = () => {
		const { isFirst } = getTimelinePosition()
		const {
			topPadding, bottomPadding, backgroundPadding,
		} = getSelectAttributes()

		const iframe = document.querySelector( '[name=editor-canvas]' )
		const doc = iframe ? ( iframe.contentDocument || iframe.contentWindow.document ) : document
		let size

		if ( isFirst ) {
			const middlePosition = ( middleRef.current.getBoundingClientRect().top - blockRef.current.getBoundingClientRect().top ) + topPadding + backgroundPadding
			setBackgroundPosition( { verticalLine: middlePosition, middle: 0 } )
			size = ( blockRef.current.getBoundingClientRect().height + topPadding + bottomPadding + ( backgroundPadding * 2 ) )
		} else {
			// console.log ( previousBlock.clientId )
			const prevTimelineBlock = doc.getElementById( `block-${ previousBlock.clientId }` )
			const prevBlockSize = prevTimelineBlock.getAttribute( 'data-size' )
			size = parseFloat( prevBlockSize ) + ( blockRef.current.getBoundingClientRect().height + topPadding + bottomPadding + ( backgroundPadding * 2 ) )
			setBackgroundPosition( { verticalLine: prevBlockSize, middle: prevBlockSize } )
		}

		const timelineBlock = doc.getElementById( `block-${ clientId }` )
		timelineBlock.setAttribute( 'data-size', size )
	}

	// update max height when device type & padding changes
	useEffect( () => {
		updateMaxHeight()
	}, [ deviceType,
		props.attributes.timelineDotSize,
		props.attributes.blockPadding,
		props.attributes.blockPaddingTablet,
		props.attributes.blockPaddingMobile ] )

	// update accent fill
	useEffect( () => {
		const iframe = document.querySelector( '[name=editor-canvas]' )
		let doc = document.querySelector( '.interface-interface-skeleton__content' )
		if ( iframe ) {
			doc = iframe.contentDocument || iframe.contentWindow.document
		}
		doc?.addEventListener( 'scroll', handleScroll )

		// clears fill
		const fills = doc.querySelectorAll( '.stk-block-timeline__vertical-line__fill, .stk-block-timeline__middle__branch__fill, .stk-block-timeline__middle__fill' )
		fills.forEach( fill => {
			fill.style.height = 0
		} )
		setFillHeight( { verticalLine: 0, middle: 0 } )
		return () => {
			doc.removeEventListener( 'scroll', handleScroll )
		}
	}, [
		nextBlock,
		previousBlock,
		props.attributes,
	] )

	// match timeline anchor with first block
	useEffect( () => {
		const iframe = document.querySelector( '[name=editor-canvas]' )
		const doc = iframe ? ( iframe.contentDocument || iframe.contentWindow.document ) : document

		const { isFirst } = getTimelinePosition()
		const timelineBlock = doc.getElementById( `block-${ clientId }` )
		let anchor = ''
		if ( isFirst ) {
			anchor = props.attributes.timelineAnchor
			timelineBlock.setAttribute( 'data-anchor', anchor )
		} else if ( timelineBlock.hasAttribute( 'data-anchor' ) && timelineBlock.getAttribute( 'data-anchor' ) !== '' ) {
			anchor = timelineBlock.getAttribute( 'data-anchor' )
		}

		// get all preceding timeline blocks
		const timelineBlocks = doc.querySelectorAll( `#block-${ clientId } ~ [data-type='stackable/timeline']:is([data-type='stackable/timeline'] + [data-type='stackable/timeline'])` )

		// sets anchor for the consecutive preceding timeline blocks only
		for ( const block of timelineBlocks ) {
			block.setAttribute( 'data-anchor', anchor )
			if ( block.querySelector( '.stk-block-timeline--last' ) ) {
				break
			}
		}
	}, [ props.attributes.timelineAnchor, nextBlock, previousBlock ] )

	// update background position for gradient fills
	useEffect( () => {
		const timeout = setInterval( updateBackgroundPosition, 100 )
		return () => clearInterval( timeout )
	}, [ props.attributes ] )

	// update blocks if position changes
	useEffect( () => {
		// set attribute for frontend
		if ( nextBlock && nextBlock.name === 'stackable/timeline' && props.attributes.timelineIsLast ) {
			dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
			setAttributes( { timelineIsLast: false } )
		} else if ( ! nextBlock || nextBlock.name !== 'stackable/timeline' ) {
			dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
			setAttributes( { timelineIsLast: true } )
		}

		updateMaxHeight()
	}, [ nextBlock ] )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />

					<InspectorLayoutControls>
						<AdvancedToolbarControl
							label={ __( 'Content Position', i18n ) }
							attribute="timelinePosition"
							controls={ [
								{ value: '', title: __( 'Left', i18n ) },
								{ value: 'right', title: __( 'Right', i18n ) },
							] }
						/>
						<AdvancedRangeControl
							label={ sprintf( __( '%s Gap', i18n ), __( 'Timeline', i18n ) ) }
							attribute="timelineGap"
							sliderMax={ 100 }
							min={ 0 }
							responsive="all"
							placeholder="16"
						/>
					</InspectorLayoutControls>

					<InspectorStyleControls>
						<PanelAdvancedSettings
							title={ __( 'Timeline', i18n ) }
							initialOpen={ true }
							id="timeline"
						>
							<AdvancedRangeControl
								label={ __( 'Accent Anchor Position', i18n ) }
								attribute="timelineAnchor"
								sliderMax={ 100 }
								min={ 0 }
								placeholder="50"
								responsive="all"
								help={ __( 'Succeeding timeline blocks will also use this value.', i18n ) }
							/>

							<ControlSeparator />

							<AdvancedRangeControl
								label={ sprintf( __( '%s Size', i18n ), __( 'Dot', i18n ) ) }
								attribute="timelineDotSize"
								sliderMax={ 100 }
								sliderMin={ props.attributes.timelineThickness || 3 }
								min={ 1 }
								placeholder="11"
							/>
							<AdvancedRangeControl
								label={ sprintf( __( '%s Border Radius', i18n ), __( 'Dot', i18n ) ) }
								attribute="timelineDotBorderRadius"
								sliderMax={ ( props.attributes.timelineDotSize || 11 ) / 2 }
								min={ 0 }
								placeholder=""
							/>
							<AdvancedRangeControl
								label={ __( 'Line Thickness', i18n ) }
								attribute="timelineThickness"
								sliderMax={ 20 }
								min={ 1 }
								placeholder="3"
							/>
							<AdvancedRangeControl
								label={ __( 'Horizontal Offset', i18n ) }
								attribute="timelineOffset"
								sliderMax={ 100 }
								min={ 0 }
								placeholder="40"
							/>

							<ControlSeparator />

							<AdvancedToolbarControl
								controls={ COLOR_TYPE_CONTROLS }
								attribute="timelineAccentColorType"
								fullwidth={ false }
								isSmall={ true }
							/>
							<ColorPaletteControl
								label={
									props.attributes.timelineAccentColorType === 'gradient'
										? sprintf( _x( '%s #%d', 'option title', i18n ), __( 'Timeline Accent Color', i18n ), 1 )
										: __( 'Timeline Accent Color', i18n )
								}
								attribute="timelineAccentColor"
							/>
							{ props.attributes.timelineAccentColorType === 'gradient' &&
								<ColorPaletteControl
									label={ sprintf( _x( '%s #%d', 'option title', i18n ), __( 'Timeline Accent Color', i18n ), 2 ) }
									attribute="timelineAccentColor2"
								/>
							}
							<ColorPaletteControl
								label={ __( 'Timeline Background Color', i18n ) }
								attribute="timelineBackgroundColor"
							/>
						</PanelAdvancedSettings>
					</InspectorStyleControls>

					<Typography.InspectorControls
						{ ...props }
						hasTextTag={ false }
						isMultiline={ true }
						initialOpen={ false }
						hasTextShadow={ true }
					/>
					<InspectorLayoutControls>
						<ControlSeparator />
					</InspectorLayoutControls>
					<ContentAlign.InspectorControls />
					<BlockDiv.InspectorControls hasContentVerticalAlign={ false } hasMinHeight={ false } />
					<Advanced.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-timeline" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />
				</>
			) }

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<BlockStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-timeline" />

				<div
					ref={ blockRef }
					className={ contentClassNames }
					data-align={ ! props.attributes.contentAlign ? undefined // Only needed in the backend
						: props.attributes.contentAlign === 'alignwide' ? 'wide'
							: props.attributes.contentAlign === 'alignfull' ? 'full' : undefined }
				>
					<Typography
						tagName="div"
						className={ dateClassNames }
						placeholder={ _x( 'Text for This Block', 'Text placeholder', i18n ) }
					/>
					<div
						className="stk-block-timeline__middle"
					>
						<div
							className="stk-block-timeline__middle__dot"
							ref={ middleRef }
						>
							<div
								className="stk-block-timeline__middle__fill"
								style={ {
									height: `max(${ fillHeight.middle }px, 0px)`,
									top: `-${ middleTopPosition.dot }px`,
									maxHeight: `calc(100% + ${ middleTopPosition.dot }px)`,
									backgroundPositionY: `-${ backgroundPosition.middle }px`,
								} }
							/>
						</div>
						<div
							className="stk-block-timeline__middle__branch"
							ref={ branchRef }
						>
							<div
								className="stk-block-timeline__middle__branch__fill"
								style={ {
									height: `max(${ fillHeight.middle }px, 0px)`,
									top: `-${ middleTopPosition.branch }px`,
									maxHeight: `calc(100% + ${ middleTopPosition.branch }px)`,
									backgroundPositionY: `-${ backgroundPosition.middle }px`,
								 } }
							>
							</div>
						</div>
					</div>
					<div className="stk-block-timeline__content">
						<InnerBlocks
							template={ TEMPLATE }
							allowedBlocks={ ALLOWED_INNER_BLOCKS }
							renderAppender={ false }
							templateLock="false"
						/>
					</div>
					<div
						className="stk-block-timeline__vertical-line"
						style={ {
							maxHeight: verticalLineMaxHeight,
							top: verticalLineTopPosition,
						} }
					>
						<div
							className="stk-block-timeline__vertical-line__fill"
							style={ {
								height: `max(${ fillHeight.verticalLine }px, 0px)`,
								backgroundPositionY: `-${ backgroundPosition.verticalLine }px`,
							} }
						/>
					</div>
				</div>
				{ /* </Separator> */ }
			</BlockDiv>
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

// Change the default bottom margin to 0 for the timeline block because this
// block is usually used multiple times in a page and it can be annoying having
// to remove the bottom margin every time. This works in conjunction with the
// margin-bottom set in style.scss
addFilter( 'stackable.resizable-bottom-margin.default', 'stackable/timeline', ( defaultBottomMargin, blockName ) => {
	return blockName === 'stackable/timeline' ? 0 : defaultBottomMargin
} )
