/**
 * Internal dependencies
 */
import blockStyles from './style'

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
	useBlockCssGenerator,
} from '~stackable/components'
import {
	BlockDiv,
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
import { useDeviceType } from '~stackable/hooks'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'
import { range } from 'lodash'
import { substituteCoreIfDisabled } from '~stackable/util'
import { substitutionRules } from '../../blocks'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { InnerBlocks } from '@wordpress/block-editor'
import { addFilter } from '@wordpress/hooks'
import { dispatch, useSelect } from '@wordpress/data'
import {
	useEffect, useRef, useState, memo,
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
		substituteCoreIfDisabled(
			'stackable/text',
			{ text: _x( 'Description for this block. Use this space for describing your block. Any text will do.', 'Content placeholder', i18n ) },
			[],
			substitutionRules,
		),
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
		setAttributes,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const typographyClass = getTypographyClasses( props.attributes )

	const {
		hasInnerBlocks, nextBlock, previousBlock, adjacentBlocks, blockIndex,
	} = useSelect( select => {
		const {
			getBlockRootClientId, getBlocks, getBlockIndex,
		} = select( 'core/block-editor' )

		const parentClientId = getBlockRootClientId( clientId )
		const adjacentBlocks = getBlocks( parentClientId )
		const blockIndex = getBlockIndex( clientId )
		const hasInnerBlocks = adjacentBlocks[ blockIndex ]?.innerBlocks?.length > 0
		const nextBlock = blockIndex < adjacentBlocks.length - 1 ? adjacentBlocks[ blockIndex + 1 ] : undefined
		const previousBlock = blockIndex > 0 ? adjacentBlocks[ blockIndex - 1 ] : undefined

		return {
			hasInnerBlocks,
			nextBlock,
			previousBlock,
			adjacentBlocks,
			blockIndex,
		}
	}, [ clientId ] )

	const deviceType = useDeviceType()

	const middleRef = useRef()
	const branchRef = useRef()
	const blockRef = useRef()
	const updateTimeout = useRef( null )
	const [ middleTopPosition, setMiddleTopPosition ] = useState( { dot: 0, branch: 0 } )
	const [ fillHeight, setFillHeight ] = useState( { verticalLine: 0, middle: 0 } )
	const [ verticalLineMaxHeight, setVerticalLineMaxHeight ] = useState( 0 )
	const [ verticalLineTopPosition, setVerticalLineTopPosition ] = useState( 0 )
	const [ timelinePosition, setTimelinePosition ] = useState( { isFirst: false, isLast: false } )
	const [ numTimelineBlocksAfter, setNumTimelineBlocksAfter ] = useState( 0 )
	const [ backgroundPosition, setBackgroundPosition ] = useState( { verticalLine: 0, middle: 0 } )

	useEffect( () => {
		let blocksAfter = 0
		for ( let i = blockIndex + 1; i < adjacentBlocks?.length; i++ ) {
			if ( adjacentBlocks[ i ].name === 'stackable/timeline' ) {
				blocksAfter++
			} else {
				break
			}
		}
		setNumTimelineBlocksAfter( blocksAfter )
	}, [ adjacentBlocks ] )

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

	// Get Paddings
	const getSelectAttributes = () => {
		let backgroundPadding, bottomPadding, topPadding
		const defaultValue = deviceType === 'Mobile' ? 0 : 16

		// Desktop paddings
		const topPaddingDesktop = props.attributes.blockPadding && props.attributes.blockPadding.top !== '' ? props.attributes.blockPadding.top : defaultValue
		const bottomPaddingDesktop = props.attributes.blockPadding && props.attributes.blockPadding.bottom !== '' ? props.attributes.blockPadding.bottom : defaultValue
		const backgroundPaddingDesktop = props.attributes.hasBackground && props.attributes.blockPadding?.top === '' && props.attributes.blockPadding?.bottom === '' ? 8 : 0

		// Tablet paddings
		const topPaddingTablet = props.attributes.blockPaddingTablet && props.attributes.blockPaddingTablet.top !== ''
			? props.attributes.blockPaddingTablet.top : topPaddingDesktop
		const bottomPaddingTablet = props.attributes.blockPaddingTablet && props.attributes.blockPaddingTablet.bottom !== ''
			? props.attributes.blockPaddingTablet.bottom : bottomPaddingDesktop
		const backgroundPaddingTablet = props.attributes.hasBackground && props.attributes.blockPaddingTablet?.top === '' &&
			props.attributes.blockPaddingTablet?.bottom === '' ? 8 : backgroundPaddingDesktop

		if ( deviceType === 'Tablet' ) {
			topPadding = topPaddingTablet
			bottomPadding = bottomPaddingTablet
			backgroundPadding = backgroundPaddingTablet
		} else if ( deviceType === 'Mobile' ) {
			topPadding = props.attributes.blockPaddingMobile && props.attributes.blockPaddingMobile.top !== ''
				? props.attributes.blockPaddingMobile.top : topPaddingTablet
			bottomPadding = props.attributes.blockPaddingMobile && props.attributes.blockPaddingMobile.bottom !== ''
				? props.attributes.blockPaddingMobile.bottom : bottomPaddingTablet
			backgroundPadding = props.attributes.hasBackground && props.attributes.blockPaddingMobile?.top === '' &&
				props.attributes.blockPaddingMobile?.bottom === '' ? 8 : backgroundPaddingTablet
		} else {
			topPadding = topPaddingDesktop
			bottomPadding = bottomPaddingDesktop
			backgroundPadding = backgroundPaddingDesktop
		}

		return {
			topPadding,
			bottomPadding,
			backgroundPadding,
		}
	}

	const handleScroll = () => {
		const {
			topPadding, bottomPadding, backgroundPadding,
		} = getSelectAttributes()

		const { height: blockRectHeight, top: blockRectTop } = blockRef.current.getBoundingClientRect()
		const middleRectTop = middleRef.current.getBoundingClientRect().top
		const bgPositionValue = `calc( -${ blockRectTop }px + ${ topPadding }px + ${ backgroundPadding }px  )`

		const blockHeight = blockRectHeight + topPadding + bottomPadding + ( backgroundPadding * 2 )
		const fillPercent = `( ( ${ ( document?.body?.clientHeight || 10000 ) }px * var(--stk-timeline-anchor, 0.5) ) + ${ -blockRectTop + topPadding + backgroundPadding }px ) / ${ blockHeight } * 100`

		// gets equivalent px of 1%
		const fillPxPercent = blockHeight / 100
		// converts percent to px
		const fillPx = `${ fillPercent } * ${ fillPxPercent }`

		let fill = { verticalLine: `calc(${ fillPx })`, middle: `calc(${ fillPx })` }
		let bgPosition = { verticalLine: bgPositionValue, middle: bgPositionValue }

		const dot = ( middleRectTop - blockRectTop ) + topPadding + backgroundPadding
		const branch = ( branchRef.current.getBoundingClientRect().top - blockRectTop ) + topPadding + backgroundPadding

		// corrects the position of the fill for the first timeline block since the line starts at the middle
		if ( ! previousBlock || previousBlock.name !== 'stackable/timeline' ) {
			fill = {
				verticalLine: `calc(${ fillPx } - ${ dot }px)`,
				middle: `calc(${ fillPx })`,
			}
			bgPosition = {
				verticalLine: `-${ middleRectTop }px`,
				middle: bgPositionValue,
			}
		}
		setMiddleTopPosition( { dot, branch } )
		setFillHeight( fill )
		setBackgroundPosition( bgPosition )
	}

	const updateMaxHeight = () => {
		const {
			topPadding, bottomPadding,
		} = getSelectAttributes()

		let lineMaxHeight = '100%'
		let top = ''
		if ( timelinePosition.isFirst && timelinePosition.isLast ) {
			lineMaxHeight = '0'
		} else if ( deviceType === 'Mobile' && timelinePosition.isFirst ) {
			const dotSize = props.attributes.timelineDotSize || 11
			lineMaxHeight = `calc(100% - ${ topPadding }px - 16px - ${ dotSize / 2 }px)`
			top = `${ topPadding + 16 + ( dotSize / 2 ) }px`
		} else if ( deviceType === 'Mobile' && timelinePosition.isLast ) {
			lineMaxHeight = `${ topPadding + 16 }px`
		} else if ( deviceType === 'Mobile' ) {
			lineMaxHeight = '100%'
		} else if ( timelinePosition.isFirst ) {
			lineMaxHeight = `calc(50% + ${ bottomPadding / 2 }px - ${ topPadding / 2 }px)`
		} else if ( timelinePosition.isLast ) {
			lineMaxHeight = `calc(50% + ${ topPadding / 2 }px - ${ bottomPadding / 2 }px)`
		}

		setVerticalLineMaxHeight( lineMaxHeight )
		setVerticalLineTopPosition( top )
	}

	// update max height when device type & padding changes
	useEffect( () => {
		clearTimeout( updateTimeout.current )
		updateTimeout.current = setTimeout( () => {
			updateMaxHeight()
		}, 300 )
	}, [ deviceType,
		timelinePosition,
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
		const scrollEvent = new Event( 'scroll', { bubbles: true } )
		doc?.dispatchEvent( scrollEvent )
		return () => {
			doc?.removeEventListener( 'scroll', handleScroll )
		}
	}, [
		deviceType,
		nextBlock,
		previousBlock,
		props.attributes.timelineAnchor,
		props.attributes.timelineDotSize,
		props.attributes.blockPadding,
		props.attributes.blockPaddingTablet,
		props.attributes.blockPaddingMobile,
		props.attributes.hasBackground,
	] )

	// update blocks if position changes
	useEffect( () => {
		// set attribute for frontend
		let isUpdating = false
		if ( nextBlock && nextBlock.name === 'stackable/timeline' && props.attributes.timelineIsLast ) {
			dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
			setAttributes( { timelineIsLast: false } )
			isUpdating = true
		} else if ( ( ! nextBlock || nextBlock.name !== 'stackable/timeline' ) && ! props.attributes.timelineIsLast ) {
			dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
			setAttributes( { timelineIsLast: true } )
			isUpdating = true
		}
		if ( isUpdating ) {
			clearTimeout( updateTimeout.current )
			updateTimeout.current = setTimeout( () => {
				updateMaxHeight()
			}, 300 )
		}
	}, [ nextBlock ] )

	useEffect( () => {
		setTimelinePosition(
			{
				isFirst: ! previousBlock || previousBlock.name !== 'stackable/timeline',
				isLast: ! nextBlock || nextBlock.name !== 'stackable/timeline',
			}
		)
	}, [ nextBlock, previousBlock ] )

	// Generate the CSS styles for the block.
	const blockCss = useBlockCssGenerator( {
		attributes: props.attributes,
		blockStyles,
		clientId: props.clientId,
		context: props.context,
		setAttributes: props.setAttributes,
		blockState: props.blockState,
		version: VERSION,
	} )

	return (
		<>
			<InspectorControls
				blockState={ props.blockState }
				timelineThickness={ props.attributes.timelineThickness }
				timelineDotSize={ props.attributes.timelineDotSize }
				timelineAccentColorType={ props.attributes.timelineAccentColorType }

			/>

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				{ blockCss && <style key="block-css">{ blockCss }</style> }
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
									height: `max(${ fillHeight.middle }, 0px)`,
									top: `-${ middleTopPosition.dot }px`,
									maxHeight: `calc(100% + ${ middleTopPosition.dot }px)`,
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
									height: `max(${ fillHeight.middle }, 0px)`,
									top: `-${ middleTopPosition.branch }px`,
									maxHeight: `calc(100% + ${ middleTopPosition.branch }px)`,
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
								height: `max(${ fillHeight.verticalLine }, 0px)`,
							} }
						/>
					</div>

					{ timelinePosition.isFirst && (
						<style>
							{ range( numTimelineBlocksAfter + 1 ).map( i => {
								const adjacentSelector = range( i ).map( () => '+ [data-type="stackable/timeline"]' ).join( ' ' )
								return `[data-block="${ clientId }"] ${ adjacentSelector } {
									--stk-timeline-anchor: ${ props.attributes.timelineAnchor === '' ? 0.5 : ( props.attributes.timelineAnchor / 100 ) };
									}
									[data-block="${ clientId }"] ${ adjacentSelector } .stk-block-timeline {
									--line-accent-bg-location: ${ props.attributes.timelineAnchor === '' ? '50%' : `${ props.attributes.timelineAnchor }%` };
								}`
							} ) }
						</style>
					)
					}
					{
						<style>
							{
								`[data-block="${ clientId }"] {
									--stk-timeline-vertical-line-bg-position: ${ backgroundPosition.verticalLine };
									--stk-timeline-middle-bg-position: ${ backgroundPosition.middle };
								}`
							}
						</style>
					}
				</div>
				{ /* </Separator> */ }
			</BlockDiv>
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( props => {
	return (
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
						sliderMin={ props.timelineThickness || 3 }
						min={ 1 }
						placeholder="11"
					/>
					<AdvancedRangeControl
						label={ sprintf( __( '%s Border Radius', i18n ), __( 'Dot', i18n ) ) }
						attribute="timelineDotBorderRadius"
						sliderMax={ ( props.timelineDotSize || 11 ) / 2 }
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
						isSmall={ true }
					/>
					<ColorPaletteControl
						label={
							props.timelineAccentColorType === 'gradient'
								? sprintf( _x( '%s #%d', 'option title', i18n ), __( 'Timeline Accent Color', i18n ), 1 )
								: __( 'Timeline Accent Color', i18n )
						}
						attribute="timelineAccentColor"
					/>
					{ props.timelineAccentColorType === 'gradient' &&
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
	)
} )

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
