/**
 * Internal dependencies
 */
import blockStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import {
	ColumnInnerBlocks,
	ControlSeparator,
	GroupPlaceholder,
	InspectorLayoutControls,
	InspectorTabs,
	AdvancedToolbarControl,
	AdvancedRangeControl,
	AdvancedToggleControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
	IconControl,
	SvgIcon,
	ColorPaletteControl,
	InspectorAdvancedControls,
	AdvancedTextControl,
	useBlockCssGenerator,
} from '~stackable/components'
import {
	BlockDiv,
	MarginBottom,
	getRowClasses,
	Alignment,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	ConditionalDisplay,
	Separator,
	getSeparatorClasses,
	Transform,
	ContentAlign,
	getContentAlignmentClasses,
	ColumnsControl,
} from '~stackable/block-components'
import { useDeviceType } from '~stackable/hooks'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import {
	useState, useRef, useEffect, memo,
} from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { __, sprintf } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'
import { range } from 'lodash'
import { defaultIconNext, defaultIconPrev } from './schema'

const ALLOWED_INNER_BLOCKS = [ 'stackable/column' ]

const TEMPLATE = [
	[ 'stackable/column' ],
	[ 'stackable/column' ],
	[ 'stackable/column' ],
]

const Edit = props => {
	const {
		className,
		attributes,
		setAttributes,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { hasInnerBlocks, numInnerBlocks } = useSelect( select => {
		const { getBlockOrder } = select( 'core/block-editor' )
		const numInnerBlocks = getBlockOrder( props.clientId ).length
		return {
			hasInnerBlocks: numInnerBlocks > 0,
			numInnerBlocks,
		}
	}, [ props.clientId ] )
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

	const carouselType = attributes.carouselType === '' ? 'slide' : attributes.carouselType

	const blockClassNames = classnames( [
		className,
		'stk-block-carousel',
		rowClass,
		separatorClass,
		columnTooltipClass,
		{
			'stk--is-slide': carouselType === 'slide',
			'stk--is-fade': carouselType === 'fade',
			'stk--infinite-scroll': carouselType === 'slide' && attributes.infiniteScroll,
			'stk--hide-mobile-arrows': attributes.showArrowsOnMobile === false,
			'stk--hide-mobile-dots': attributes.showDotsOnMobile === false,

			'stk--arrows-outside': attributes.arrowPosition === 'outside',
			'stk--dots-outline': attributes.dotsStyle === 'outline',
			[ `stk--arrows-justify-${ attributes.arrowJustify || 'space-between' }` ]: attributes.arrowJustify || 'space-between',
			[ `stk--arrows-align-${ attributes.arrowAlign || 'center' }` ]: attributes.arrowAlign || 'center',
		},
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
		'stk-block-carousel__slider-wrapper',
	], getContentAlignmentClasses( props.attributes ) )

	const deviceType = useDeviceType()
	const [ activeSlide, setActiveSlide ] = useState( 1 )
	const [ dotActiveSlide, setDotActiveSlide ] = useState( 1 )
	const [ slideOffset, setSlideOffset ] = useState( 0 )
	const [ defaultIcon, setDefaultIcon ] = useState( { next: defaultIconNext, prev: defaultIconPrev } )
	const sliderRef = useRef()
	const dotActiveJustChanged = useRef()

	const isRTL = document.documentElement?.getAttribute( 'dir' ) === 'rtl' || document.body?.getAttribute( 'dir' ) === 'rtl'

	let maxSlides = numInnerBlocks
	let slidesToShow = attributes.slidesToShow || 1
	if ( carouselType === 'slide' ) {
		if ( ( deviceType === 'Tablet' || deviceType === 'Mobile' ) && attributes.slidesToShowTablet ) {
			slidesToShow = attributes.slidesToShowTablet
		}
		if ( deviceType === 'Mobile' && attributes.slidesToShowMobile ) {
			slidesToShow = attributes.slidesToShowMobile
		}
		if ( ! isRTL ) {
			maxSlides -= ( slidesToShow - 1 )
		}
	}

	useEffect( () => {
		if ( isRTL ) {
			setDefaultIcon( { next: defaultIconPrev, prev: defaultIconNext } )
		} else {
			setDefaultIcon( { next: defaultIconNext, prev: defaultIconPrev } )
		}
	}, [ isRTL ] )

	useEffect( () => {
		if ( isRTL && carouselType === 'slide' ) {
			setSlideOffset( slidesToShow - 1 )
		} else {
			setSlideOffset( 0 )
		}
	}, [ slidesToShow, carouselType ] )

	const nextSlide = ev => {
		ev?.preventDefault()

		let newSlide = activeSlide + 1
		if ( newSlide > maxSlides ) {
			newSlide = slideOffset + 1
		}
		goToSlide( newSlide )
	}

	const prevSlide = ev => {
		ev.preventDefault()

		let newSlide = activeSlide - 1
		if ( newSlide <= slideOffset ) {
			newSlide = maxSlides
		}
		goToSlide( newSlide )
	}

	const goToSlide = slide => {
		setActiveSlide( slide )
		setDotActiveSlide( slide )

		if ( carouselType === 'slide' ) {
			const slider = sliderRef.current.querySelector( '.block-editor-block-list__layout' )
			if ( slider ) {
				sliderRef.current.scrollLeft = slider.children[ slide - 1 ].offsetLeft
			}
		}

		// Disallow rapid changing of the dotActiveSlide because this will cause
		// the active dot to flicker.
		clearTimeout( dotActiveJustChanged.current )
		dotActiveJustChanged.current = setTimeout( () => {
			dotActiveJustChanged.current = null
		}, 500 )
	}

	// Reset the slider location when the carousel type changes.
	useEffect( () => {
		sliderRef.current.scrollLeft = 0
		setActiveSlide( 1 )
		setDotActiveSlide( 1 )
	}, [ carouselType ] )

	useEffect( () => {
		const timeout = setInterval( () => {
			// Update the active dot when the slider is scrolled.  This checks the
			// scroll position and finds the closest slide to the left. This is the best
			// way here because there are a number of ways to change the slide position.
			// (e.g. changing column order)
			if ( carouselType === 'slide' ) {
				const slider = sliderRef.current.querySelector( '.block-editor-block-list__layout' )
				const scrollLeft = sliderRef.current.scrollLeft
				const { slide } = Array.from( slider.children ).reduce( ( result, slideEl, i ) => {
					const slide = i + 1
					const offsetDiff = Math.abs( slideEl.offsetLeft - scrollLeft )
					if ( offsetDiff <= result.offsetDiff ) {
						return { slide, offsetDiff }
					}
					return result
				}, { slide: 1, offsetDiff: 1000 } )

				// Disallow rapid changing of the dotActiveSlide because this will cause
				// the active dot to flicker.
				if ( ! dotActiveJustChanged.current ) {
					setActiveSlide( slide )
					setDotActiveSlide( slide )
				}

			// Bring the current slide into view if the selected column changes
			// in fade (this only happens in fade because it cannot slide into
			// view).
			} else { // fade
				const selectedSlideEl = sliderRef.current.querySelector( ':scope > .block-editor-inner-blocks > .block-editor-block-list__layout > .is-selected' )
				if ( selectedSlideEl ) {
					const slide = Array.from( selectedSlideEl.parentElement.children ).indexOf( selectedSlideEl ) + 1
					if ( slide !== activeSlide ) {
						if ( ! dotActiveJustChanged.current ) {
							setActiveSlide( slide )
							setDotActiveSlide( slide )
						}
					}
				}
			}
		}, 1000 )
		return () => clearInterval( timeout )
	}, [ carouselType, activeSlide ] )

	useEffect( () => {
		if ( activeSlide > maxSlides ) {
			setActiveSlide( maxSlides )
		}
	}, [ maxSlides, activeSlide ] )

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
				carouselType={ carouselType }
				setAttributes={ setAttributes }
				infiniteScroll={ attributes.infiniteScroll }
				autoplay={ attributes.autoplay }
				showArrows={ attributes.showArrows }
				arrowIconPrev={ attributes.arrowIconPrev }
				arrowIconNext={ attributes.arrowIconNext }
				arrowPosition={ attributes.arrowPosition }
				arrowJustify={ attributes.arrowJustify }
				arrowHeight={ attributes.arrowHeight }
				arrowWidth={ attributes.arrowWidth }
				showArrowsOnMobile={ attributes.showArrowsOnMobile }
				showDots={ attributes.showDots }
				dotsSize={ attributes.dotsSize }
				dotsGap={ attributes.dotsGap }
				showDotsOnMobile={ attributes.showDotsOnMobile }
				defaultIcon={ defaultIcon }
			/>

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				{ blockCss && <style key="block-css">{ blockCss }</style> }
				<CustomCSS mainBlockClass="stk-block-carousel" />

				{ ! hasInnerBlocks && <GroupPlaceholder /> }
				<Separator>
					<div className="stk-block-carousel__content-wrapper">
						<div
							className={ contentClassNames }
							data-align={ ! props.attributes.contentAlign ? undefined // Only needed in the backend
								: props.attributes.contentAlign === 'alignwide' ? 'wide'
									: props.attributes.contentAlign === 'alignfull' ? 'full' : undefined }
						>
							{ carouselType === 'fade' && (
								<style>
									{ range( maxSlides ).map( i => {
										return `.stk-${ attributes.uniqueId }-column > .stk-block-carousel__slider > .block-editor-inner-blocks > .block-editor-block-list__layout > [data-type="stackable/column"]:nth-child(${ i + 1 }) {
										opacity: 0;
										visibility: hidden;
										left: ${ isRTL ? '' : '-' }${ 100 * ( i ) }%;
									}`
									} ) }
									{ `.stk-${ attributes.uniqueId }-column > .stk-block-carousel__slider > .block-editor-inner-blocks > .block-editor-block-list__layout > [data-type="stackable/column"]:nth-child(${ activeSlide }) {
									opacity: 1;
									visibility: visible;
									z-index: 2;
									transition-duration: var(--transition-duration, 0.3s);
									transition-delay: 0s;
								}` }
								</style>
							) }
							<div
								className="stk-block-carousel__slider"
								ref={ sliderRef }
								role="list"
							>
								<ColumnInnerBlocks
									providerValue={ columnProviderValue }
									orientation="horizontal"
									template={ props.attributes.templateLock ? undefined : TEMPLATE }
									allowedBlocks={ ALLOWED_INNER_BLOCKS }
									renderAppender={ false }
									templateLock={ props.attributes.templateLock || false }
								/>
							</div>
							{ attributes.showArrows && (
								<div className="stk-block-carousel__buttons">
									<button
										className="stk-block-carousel__button stk-block-carousel__button__prev"
										onClick={ prevSlide }
									>
										<SvgIcon value={ attributes.arrowIconPrev || defaultIcon.prev } />
									</button>
									<button
										className="stk-block-carousel__button stk-block-carousel__button__next"
										onClick={ nextSlide }
									>
										<SvgIcon value={ attributes.arrowIconNext || defaultIcon.next } />
									</button>
								</div>
							) }
						</div>
						{ attributes.showDots && (
							<div className="stk-block-carousel__dots" role="list" data-label="Slide %d">
								{ range( maxSlides ).map( i => {
									// active dot is the leftmost slide
									// for RTL, don't show the first n dots
									// where n is the offset number
									if ( isRTL && i < slideOffset ) {
										return null
									}
									const className = classnames( 'stk-block-carousel__dot', {
										'stk-block-carousel__dot--active': i + 1 === dotActiveSlide,
									} )
									return (
										<div key={ i } role="listitem">
											<button
												className={ className }
												onClick={ ev => {
													ev.preventDefault()
													goToSlide( i + 1 )
												} }
											/>
										</div>
									)
								} ) }
							</div>
						) }
					</div>
				</Separator>
			</BlockDiv>
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( props => {
	const sizeControlSpacingProps = {
		enableMargin: false,
	}
	return (
		<>
			<InspectorTabs />

			<InspectorLayoutControls>
				<ColumnsControl
					label={ __( 'Slides', i18n ) }
					sliderMax={ 10 }
				/>
				<AdvancedToolbarControl
					label={ __( 'Carousel Type', i18n ) }
					controls={ [
						{
							value: '',
							title: __( 'Slide', i18n ),
						},
						{
							value: 'fade',
							title: __( 'Fade', i18n ),
						},
					] }
					attribute="carouselType"
				/>
				{ props.carouselType === 'slide' &&
					<AdvancedToggleControl
						label={ __( 'Infinite Scrolling', i18n ) }
						checked={ props.infiniteScroll }
						onChange={ infiniteScroll => props.setAttributes( { infiniteScroll } ) }
						defaultValue={ false }
						help={ __( 'Only visible in the frontend.', i18n ) }
					/>
				}
				{ props.carouselType === 'slide' && (
					<>
						<AdvancedRangeControl
							label={ __( 'Slides to Show', i18n ) }
							sliderMax={ 4 }
							min={ 1 }
							attribute="slidesToShow"
							placeholder="1"
							responsive="all"
						/>
						<AdvancedRangeControl
							label={ __( 'Slide Gap', i18n ) }
							sliderMax={ 100 }
							min={ 0 }
							attribute="slideColumnGap"
							placeholder="30"
							responsive="all"
						/>
					</>
				) }
				{ props.carouselType === 'fade' && (
					<AdvancedRangeControl
						label={ __( 'Fade duration', i18n ) }
						attribute="fadeDuration"
						sliderMax={ 2 }
						min={ 0 }
						step={ 0.1 }
						placeholder="0.3"
					/>
				) }
				<ControlSeparator />

				<AdvancedToggleControl
					label={ __( 'Autoplay', i18n ) }
					checked={ props.autoplay }
					onChange={ autoplay => props.setAttributes( { autoplay } ) }
					defaultValue={ true }
				/>
				{ props.autoplay && (
					<AdvancedRangeControl
						label={ __( 'Speed (ms)', i18n ) }
						attribute="autoplaySpeed"
						sliderMax={ 6000 }
						sliderMin={ 1000 }
						min={ 0 }
						step={ 100 }
						placeholder="4000"
					/>
				) }
				<ControlSeparator />
			</InspectorLayoutControls>

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Arrows', i18n ) }
					id="arrows"
					hasToggle={ true }
					checked={ props.showArrows }
					onChange={ showArrows => props.setAttributes( { showArrows } ) }
				>
					<IconControl
						label={ __( 'Previous Slide Icon', i18n ) }
						value={ props.arrowIconPrev || props.defaultIcon.prev }
						defaultValue={ props.defaultIcon.prev }
						onChange={ arrowIconPrev => {
							if ( arrowIconPrev === props.defaultIcon.prev ) {
								props.setAttributes( { arrowIconPrev: '' } )
							} else {
								props.setAttributes( { arrowIconPrev } )
							}
								 } }
					/>
					<IconControl
						label={ __( 'Next Slide Icon', i18n ) }
						value={ props.arrowIconNext || props.defaultIcon.next }
						defaultValue={ props.defaultIcon.next }
						onChange={ arrowIconNext => {
							if ( arrowIconNext === props.defaultIcon.next ) {
								props.setAttributes( { arrowIconNext: '' } )
							} else {
								props.setAttributes( { arrowIconNext } )
							}
								 } }
					/>
					<AdvancedToolbarControl
						label={ __( 'Arrow Position', i18n ) }
						attribute="arrowPosition"
						controls={ [
							{ value: '', title: __( 'Inside', i18n ) },
							{ value: 'outside', title: __( 'Outside', i18n ) },
						] }
						onChange={ arrowPosition => {
							props.setAttributes( {
								arrowPosition,
								arrowJustify: '',
								arrowAlign: '',
							} )
						} }
					/>
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Justify', i18n ), __( 'Button', i18n ) ) }
						attribute="arrowJustify"
						controls="flex-horizontal-alt"
						placeholder="space-between"
						disabled={ props.arrowPosition === 'outside' && [ '', 'center' ].includes( props.arrowAlign ) ? [ 'flex-start', 'center', 'flex-end' ] : [] }
					/>
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Alignment', i18n ), __( 'Button', i18n ) ) }
						attribute="arrowAlign"
						controls="vertical"
						placeholder="center"
						disabled={ props.arrowPosition === 'outside' && [ 'flex-start', 'center', 'flex-end' ].includes( props.arrowJustify ) ? [ 'center' ] : [] }
						onChange={ arrowAlign => {
							if ( ! arrowAlign && props.arrowPosition === 'outside' ) {
								props.setAttributes( {
									arrowAlign,
									arrowJustify: '',
								} )
							} else {
								props.setAttributes( { arrowAlign } )
							}
						} }
					/>
					<AdvancedRangeControl
						label={ sprintf( __( '%s Offset', i18n ), __( 'Button', i18n ) ) }
						attribute="arrowButtonOffset"
						sliderMin={ props.arrowPosition === 'outside' ? 0 : -100 }
						sliderMax={ 100 }
						responsive="all"
						placeholder="12"
					/>
					{ [ 'flex-start', 'center', 'flex-end' ].includes( props.arrowJustify ) &&
						<AdvancedRangeControl
							label={ __( 'Button Gap', i18n ) }
							attribute="arrowButtonGap"
							min={ 0 }
							sliderMax={ 100 }
							responsive="all"
							placeholder="12"
						/>
					}
					<ControlSeparator />
					<ColorPaletteControl
						label={ sprintf( __( '%s Color', i18n ), __( 'Button', i18n ) ) }
						attribute="arrowButtonColor"
						hover="all"
					/>
					<ColorPaletteControl
						label={ sprintf( __( '%s Color', i18n ), __( 'Icon', i18n ) ) }
						attribute="arrowIconColor"
						hover="all"
					/>
					<AdvancedRangeControl
						label={ sprintf( __( '%s Width', i18n ), __( 'Button', i18n ) ) }
						attribute="arrowWidth"
						units={ [ 'px', '%' ] }
						sliderMax={ [ 200, 100 ] }
						min={ [ 0, 0 ] }
						responsive="all"
						placeholder="40"
					/>
					<AdvancedRangeControl
						label={ sprintf( __( '%s Height', i18n ), __( 'Button', i18n ) ) }
						attribute="arrowHeight"
						units={ [ 'px', '%' ] }
						sliderMax={ [ 200, 100 ] }
						min={ [ 0, 0 ] }
						responsive="all"
						placeholder="40"
					/>
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						attribute="arrowBorderRadius"
						sliderMax={ Math.max( props.arrowHeight, props.arrowWidth, 40 ) }
						min={ 0 }
						placeholder="40"
					/>
					<AdvancedRangeControl
						label={ sprintf( __( '%s Size', i18n ), __( 'Icon', i18n ) ) }
						attribute="arrowIconSize"
						sliderMax={ 100 }
						min={ 0 }
						responsive="all"
						placeholder="16"
					/>
					<AdvancedRangeControl
						label={ __( 'Opacity', i18n ) }
						attribute="arrowOpacity"
						hover="all"
						min={ 0 }
						max={ 1 }
						step={ 0.01 }
						placeholder="0.9"
					/>
					<AdvancedToggleControl
						label={ sprintf(
							// Translators: %s is the name of the setting. e.g. "Show arrows on mobile".
							__( 'Show %s on mobile', i18n ),
							// Translators: lower caps "arrows" is the name of the setting.
							__( 'arrows', i18n )
						) }
						checked={ props.showArrowsOnMobile }
						onChange={ showArrowsOnMobile => props.setAttributes( { showArrowsOnMobile } ) }
						defaultValue={ true }
					/>
				</PanelAdvancedSettings>

				<PanelAdvancedSettings
					title={ __( 'Dots', i18n ) }
					id="dots"
					hasToggle={ true }
					checked={ props.showDots }
					onChange={ showDots => props.setAttributes( { showDots } ) }
				>

					<AdvancedToolbarControl
						label={ sprintf( __( '%s Justify', i18n ), __( 'Dots', i18n ) ) }
						attribute="dotsJustify"
						controls="horizontal"
						placeholder="center"
					/>
					<AdvancedRangeControl
						label={ sprintf( __( '%s Offset', i18n ), __( 'Dots', i18n ) ) }
						attribute="dotsOffset"
						sliderMin={ -100 }
						sliderMax={ 100 }
						responsive="all"
						placeholder="12"
					/>
					<ControlSeparator />
					<AdvancedToolbarControl
						label={ __( 'Dot Style', i18n ) }
						attribute="dotsStyle"
						controls={ [
							{ value: '', title: __( 'Solid', i18n ) },
							{ value: 'outline', title: __( 'Outline', i18n ) },
						] }
						isSmall
					/>
					<ColorPaletteControl
						label={ sprintf( __( '%s Color', i18n ), __( 'Dot', i18n ) ) }
						attribute="dotsColor"
						hover="all"
					/>
					<ColorPaletteControl
						label={ sprintf( __( '%s Color', i18n ), __( 'Active Dot', i18n ) ) }
						attribute="dotsActiveColor"
					/>
					<AdvancedRangeControl
						label={ sprintf( __( '%s Size', i18n ), __( 'Dot', i18n ) ) }
						attribute="dotsSize"
						sliderMin={ 1 }
						sliderMax={ 40 }
						placeholder="8"
					/>
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						attribute="dotsBorderRadius"
						sliderMax={ props.dotsSize || 8 }
						min={ 0 }
						placeholder={ props.dotsSize || '8' }
					/>
					<AdvancedRangeControl
						label={ sprintf( __( '%s Gap', i18n ), __( 'Dots', i18n ) ) }
						attribute="dotsGap"
						sliderMin={ 0 }
						sliderMax={ 40 }
						placeholder="16"
						help={ ( props.dotsSize || 8 ) + ( props.dotsGap || 16 ) < 24 ? sprintf( __( 'To improve accessibility, the clickable area of the dots will not go below %s.', i18n ), '24px' ) : undefined }
					/>
					<ControlSeparator />
					<AdvancedRangeControl
						label={ sprintf( __( '%s Width', i18n ), __( 'Active Dot', i18n ) ) }
						attribute="dotsActiveWidth"
						sliderMin={ 1 }
						sliderMax={ 40 }
						placeholder="30"
					/>
					<AdvancedRangeControl
						label={ sprintf( __( '%s Height', i18n ), __( 'Active Dot', i18n ) ) }
						attribute="dotsActiveHeight"
						sliderMin={ 1 }
						sliderMax={ 40 }
						placeholder={ props.dotsSize || '8' }
					/>

					<AdvancedToggleControl
						label={ sprintf(
							// Translators: %s is the name of the setting. e.g. "Show arrows on mobile".
							__( 'Show %s on mobile', i18n ),
							// Translators: lower caps "dots" is the name of the setting.
							__( 'dots', i18n )
						) }
						checked={ props.showDotsOnMobile }
						onChange={ showDotsOnMobile => props.setAttributes( { showDotsOnMobile } ) }
						defaultValue={ true }
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<ContentAlign.InspectorControls />
			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls sizeControlSpacingProps={ sizeControlSpacingProps } />
			<Separator.InspectorControls />
			<Advanced.InspectorControls />

			<InspectorAdvancedControls>
				<PanelAdvancedSettings
					title={ __( 'Accessibility', i18n ) }
					id="accessibility"
				>
					<AdvancedTextControl
						label={ sprintf(
							// Translators: %s is the name of the setting. e.g. "Previous Slide".
							__( '%s label', i18n ),
							__( 'Previous slide', i18n )
						) }
						attribute="ariaLabelPrev"
						placeholder="Previous slide"
					/>
					<AdvancedTextControl
						label={ sprintf(
							// Translators: %s is the name of the setting. e.g. "Previous Slide".
							__( '%s label', i18n ),
							__( 'Next slide', i18n )
						) }
						attribute="ariaLabelNext"
						placeholder="Next slide"
					/>
					<AdvancedTextControl
						label={ sprintf(
							// Translators: %s is the name of the setting. e.g. "Previous Slide".
							__( '%s label', i18n ),
							__( 'Slide', i18n )
						) }
						attribute="ariaLabelSlide"
						placeholder="Slide %%d"
						help={ __( 'Use %%d to show the slide number.', i18n ) }
					/>
					<AdvancedTextControl
						label={ sprintf(
							// Translators: %s is the name of the setting. e.g. "Previous Slide".
							__( '%s label', i18n ),
							// Translators: This is for the "Slide 1 of 3" option label.
							__( 'Slide N of N', i18n )
						) }
						attribute="ariaLabelSlideOf"
						placeholder="Slide %%d of %%d"
						help={ __( 'Use two %%d to show the slide number and the total slides. e.g. Slide 1 of 3.', i18n ) }
					/>
				</PanelAdvancedSettings>
			</InspectorAdvancedControls>

			<Transform.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-carousel" />
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
