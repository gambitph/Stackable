/**
 * Internal dependencies
 */
import BlockStyles from './style'

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
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	MarginBottom,
	getRowClasses,
	Alignment,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Separator,
	getSeparatorClasses,
	Transform,
	ContentAlign,
	getContentAlignmentClasses,
	ColumnsControl,
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
import {
	useState, useRef, useEffect,
} from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { __, sprintf } from '@wordpress/i18n'
import { range } from 'lodash'

const ALLOWED_INNER_BLOCKS = [ 'stackable/column' ]

const TEMPLATE = [
	[ 'stackable/column' ],
	[ 'stackable/column' ],
	[ 'stackable/column' ],
]

const Edit = props => {
	const {
		className,
		clientId,
		isSelected,
		attributes,
		setAttributes,
	} = props

	useGeneratedCss( props.attributes )

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { hasInnerBlocks } = useBlockContext()
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
			'stk--hide-others': carouselType === 'fade' && attributes.fadeOutOtherSlides,
			'stk--hide-mobile-arrows': attributes.showArrowsOnMobile === false,
			'stk--hide-mobile-dots': attributes.showDotsOnMobile === false,
		},
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
		'stk-block-carousel__slider-wrapper',
	], getContentAlignmentClasses( props.attributes ) )

	const deviceType = useDeviceType()
	const { numInnerBlocks } = useBlockContext()
	const [ activeSlide, setActiveSlide ] = useState( 1 )
	const [ dotActiveSlide, setDotActiveSlide ] = useState( 1 )
	const sliderRef = useRef()
	const dotActiveJustChanged = useRef()

	let maxSlides = numInnerBlocks
	if ( carouselType === 'slide' ) {
		let slidesToShow = attributes.slidesToShow || 1
		if ( ( deviceType === 'Tablet' || deviceType === 'Mobile' ) && attributes.slidesToShowTablet ) {
			slidesToShow = attributes.slidesToShowTablet
		}
		if ( deviceType === 'Mobile' && attributes.slidesToShowMobile ) {
			slidesToShow = attributes.slidesToShowMobile
		}
		maxSlides -= ( slidesToShow - 1 )
	}

	const nextSlide = ev => {
		ev.preventDefault()

		let newSlide = activeSlide + 1
		if ( newSlide > maxSlides ) {
			newSlide = 1
		}
		goToSlide( newSlide )
	}

	const prevSlide = ev => {
		ev.preventDefault()

		let newSlide = activeSlide - 1
		if ( newSlide <= 0 ) {
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
		}, 500 )
		return () => clearInterval( timeout )
	}, [ carouselType, activeSlide ] )

	useEffect( () => {
		if ( activeSlide > maxSlides ) {
			setActiveSlide( maxSlides )
		}
	}, [ maxSlides, activeSlide ] )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />

					<InspectorLayoutControls>
						<ColumnsControl
							label={ __( 'Slides', i18n ) }
							sliderMax={ 10 }
						/>
						<AdvancedToolbarControl
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
						{ carouselType === 'slide' && (
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
						{ carouselType === 'fade' && (
							<AdvancedToggleControl
								label={ __( 'Fade out previous slide', i18n ) }
								attribute="fadeOutOtherSlides"
								help={ __( 'Useful for backgroundless slides. May cause unwanted white fadeout on slides with a background', i18n ) }
								defaultValue={ true }
							/>
						) }
						<ControlSeparator />
					</InspectorLayoutControls>

					<InspectorStyleControls>
						<PanelAdvancedSettings
							title={ __( 'Arrows', i18n ) }
							id="arrows"
							hasToggle={ true }
							checked={ attributes.showArrows }
							onChange={ showArrows => setAttributes( { showArrows } ) }
						>
							<AdvancedToggleControl
								label={ sprintf(
									// Translators: %s is the name of the setting. e.g. "Show arrows on mobile".
									__( 'Show %s on mobile', i18n ),
									// Translators: lower caps "arrows" is the name of the setting.
									__( 'arrows', i18n )
								) }
								checked={ attributes.showArrowsOnMobile }
								onChange={ showArrowsOnMobile => setAttributes( { showArrowsOnMobile } ) }
								defaultValue={ true }
							/>
						</PanelAdvancedSettings>
						<PanelAdvancedSettings
							title={ __( 'Dots', i18n ) }
							id="dots"
							hasToggle={ true }
							checked={ attributes.showDots }
							onChange={ showDots => setAttributes( { showDots } ) }
						>
							<AdvancedToggleControl
								label={ sprintf(
									// Translators: %s is the name of the setting. e.g. "Show arrows on mobile".
									__( 'Show %s on mobile', i18n ),
									// Translators: lower caps "dots" is the name of the setting.
									__( 'dots', i18n )
								) }
								checked={ attributes.showDotsOnMobile }
								onChange={ showDotsOnMobile => setAttributes( { showDotsOnMobile } ) }
								defaultValue={ true }
							/>
						</PanelAdvancedSettings>
					</InspectorStyleControls>

					<ContentAlign.InspectorControls />
					<Alignment.InspectorControls />
					<BlockDiv.InspectorControls />
					<Separator.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-carousel" />
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
				<CustomCSS mainBlockClass="stk-block-columns" />

				{ ! hasInnerBlocks && <GroupPlaceholder /> }
				<Separator>
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
										left: -${ 100 * ( i ) }%;
									}`
								} ) }
								{ `.stk-${ attributes.uniqueId }-column > .stk-block-carousel__slider > .block-editor-inner-blocks > .block-editor-block-list__layout > [data-type="stackable/column"]:nth-child(${ activeSlide }) {
									opacity: 1;
									visibility: visible;
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
									onClick={ prevSlide }>
									{ '<' }
								</button>
								<button
									className="stk-block-carousel__button stk-block-carousel__button__next"
									onClick={ nextSlide }>
									{ '>' }
								</button>
							</div>
						) }
					</div>
					{ attributes.showDots && (
						<div className="stk-block-carousel__dots" role="list" data-label="Slide %d">
							{ range( maxSlides ).map( i => {
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
				</Separator>
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
