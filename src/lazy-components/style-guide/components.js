/* eslint-disable jsx-a11y/anchor-is-valid */
import {
	DefaultButton,
	DefaultOutlineButton,
	RenderBlock,
	getPlaceholders,
} from './utils'
import heroBg from './images/hero-bg.webp'
import mediaText from './images/media-text.webp'
import { COLOR_SCHEME_PROPERTY_LABELS } from '../../components/color-scheme-preview'

import {
	i18n, srcUrl, homeUrl,
} from 'stackable'
import { isDarkColor } from '~stackable/util'
import { LONG_TEXT } from './block-templates'

import { __, sprintf } from '@wordpress/i18n'
import {
	Icon,
	addTemplate as addTemplateIcon,
	styles as stylesIcon,
	scheduled as scheduledIcon,
} from '@wordpress/icons'
import { Fragment } from '@wordpress/element'
import { getBlockType } from '@wordpress/blocks'

export const ColorSchemes = ( { colorSchemes, className } ) => {
	return <>
		<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Color Schemes', i18n ) }</h2>
		<div className="ugb-style-guide__columns ugb-style-guide__color-schemes">
			{ colorSchemes.map( ( colorScheme, i ) => {
				return (
					<div key={ colorScheme.key } className="ugb-style-guide__column">
						<h2 className="ugb-style-guide__color-scheme-title ugb-style-guide__title ugb-style-guide__color-label">{ colorScheme.schemeType ? `${ colorScheme.schemeType } (${ colorScheme.name })` : colorScheme.name }</h2>
						<div className={ `ugb-style-guide__color-scheme ugb-style-guide__color-container ugb-style-guide__preview-root ${ className }` } style={ {
							backgroundColor: colorScheme.normal.backgroundColor,
							'--hover-background-color': colorScheme.hover.backgroundColor || colorScheme.normal.backgroundColor,
						} }>
							<div className="ugb-style-guide__color-scheme__subtitle stk-subtitle ugb-style-guide__typography-preview" data-device="desktop" style={ {
								color: colorScheme.normal.accentColor,
								'--parent-hover-color': colorScheme.parentHover.accentColor || colorScheme.normal.accentColor,
							} }>{ __( 'Subtitle', i18n ) }</div>
							<h2 className="ugb-style-guide__color-scheme__heading ugb-style-guide__typography-preview" data-device="desktop" style={ {
								color: colorScheme.normal.headingColor,
								'--parent-hover-color': colorScheme.parentHover.headingColor || colorScheme.normal.headingColor,
							} }>{ __( 'Headings', i18n ) }</h2>

							<p className="ugb-style-guide__color-scheme__body ugb-style-guide__typography-preview" data-device="desktop" style={ {
								color: colorScheme.normal.textColor,
								'--parent-hover-color': colorScheme.parentHover.textColor || colorScheme.normal.textColor,
							} }>
								{ LONG_TEXT[ i % 6 ] }
							&nbsp;
								{ LONG_TEXT[ ( i + 1 ) % 6 ] }
							&nbsp;
								{ LONG_TEXT[ ( i + 2 ) % 6 ] }
							&nbsp;
								{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
								<a href="#" onClick={ e => e.preventDefault() } style={ {
									color: colorScheme.normal.linkColor,
									'--hover-color': colorScheme.hover.linkColor || colorScheme.normal.linkColor || colorScheme.normal.textColor,
									'--parent-hover-color': colorScheme.parentHover.linkColor || colorScheme.normal.linkColor || colorScheme.normal.textColor,
								} }>
									{ __( 'Link', i18n ) }
								</a>
							</p>

							{ /* TODO: Kae: the button looks here should be based on the design system */ }
							<div className={ `ugb-style-guide__preview-button-group stk--container-scheme--${ colorScheme.key }` }>
								<DefaultButton text={ __( 'Button', i18n ) } />
								<DefaultOutlineButton text={ __( 'Button', i18n ) } />
							</div>
						</div>
						<div className="ugb-style-guide__color-scheme__colors">
							<h3 className="ugb-style-guide__section-subheading--small">{ __( 'Base Colors', i18n ) }</h3>
							{ Object.keys( colorScheme.normal ).map( property => {
								const label = COLOR_SCHEME_PROPERTY_LABELS[ property ]
								return <>
									<p>{ label }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.normal[ property ] } } />{ colorScheme.normal[ property ] }</p>
								</>
							} ) }

							{ !! Object.values( colorScheme.hover ).length && <>
								<h3 className="ugb-style-guide__section-subheading--small">{ __( 'Hover Colors', i18n ) }</h3>
								{ Object.keys( colorScheme.hover ).map( property => {
									const label = COLOR_SCHEME_PROPERTY_LABELS[ property ]
									return <>
										<p>{ label }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.hover[ property ] } } />{ colorScheme.hover[ property ] || colorScheme.normal[ property ] }</p>
									</>
								} ) }
							</> }

							{ !! Object.values( colorScheme.parentHover ).length && <>
								<h3 className="ugb-style-guide__section-subheading--small">{ __( 'Parent Hovered Colors', i18n ) }</h3>
								{ Object.keys( colorScheme.parentHover ).map( property => {
									const label = COLOR_SCHEME_PROPERTY_LABELS[ property ]
									return <>
										<p>{ label }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.parentHover[ property ] } } />{ colorScheme.parentHover[ property ] || colorScheme.normal[ property ] }</p>
									</>
								} ) }
							</> }
						</div>
					</div>
				)
			} ) }
		</div>
	</>
}

export const Colors = ( { colors } ) => {
	return <>
		<h2 className="ugb-style-guide__section-subheading">{ __( 'Global Color Palette', i18n ) }</h2>
		<div className="ugb-style-guide__columns ugb-style-guide__colors">
			{ colors.map( ( color, key ) => {
				return <div key={ key } className="ugb-style-guide__column ugb-style-guide__color-container" style={ { backgroundColor: color.color } }>
					<div className="ugb-style-guide__color-label ugb-style-guide__title" style={ { color: isDarkColor( color.color ) ? '#fff' : '#000' } }>
						<div>{ color.name }</div>
						<div>{ color.color }</div>
					</div>
				</div>
			} ) }
		</div>
	</>
}

export const Typography = ( { typography } ) => {
	return <>
		<h1 className="ugb-style-guide__section-title ugb-style-guide__title ugb-style-guide__typography-title">{ __( 'Typography', i18n ) }</h1>
		<div className="ugb-style-guide__columns ugb-style-guide__typography-headings">

			<div className="ugb-style-guide__column">
				<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Desktop', i18n ) }</h2>
				{ typography.desktop.length > 0 && typography.desktop.map( ( [ element, description ], i ) => {
					const Tag = element.startsWith( 'h' ) ? element : 'p'
					const classname = i === 7 ? 'stk-subtitle' : i === 8 ? 'stk-button__inner-text' : ''

					const label = i < 6 ? sprintf( __( 'Heading %d', i18n ), i + 1 )
						: i === 6 ? __( 'Body', i18n )
							: i === 7 ? __( 'Subtitle', i18n )
								: __( 'Button', i18n )

					return (
						<div key={ i } className="ugb-style-guide__typography-container">
							<Tag className={ `ugb-style-guide__typography-preview ${ classname }` } data-device="desktop">{ label }</Tag>
							<div className="ugb-style-guide__typography-label">{ description }</div>
						</div>
					)
				} ) }
			</div>

			<div className="ugb-style-guide__column">
				<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Tablet', i18n ) }</h2>
				{ typography.tablet.length > 0 && typography.tablet.map( ( [ element, description ], i ) => {
					const Tag = element.startsWith( 'h' ) ? element : 'p'
					const classname = i === 7 ? 'stk-subtitle' : i === 8 ? 'stk-button__inner-text' : ''
					const label = i < 6 ? sprintf( __( 'Heading %d', i18n ), i + 1 )
						: i === 6 ? __( 'Body', i18n )
							: i === 7 ? __( 'Subtitle', i18n )
								: __( 'Button', i18n )

					return (
						<div key={ i } className="ugb-style-guide__typography-container">
							<Tag className={ `ugb-style-guide__typography-preview ${ classname }` } data-device="tablet">{ label }</Tag>
							<div className="ugb-style-guide__typography-label">{ description }</div>
						</div>
					)
				} ) }
			</div>

			<div className="ugb-style-guide__column">
				<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Mobile', i18n ) }</h2>
				{ typography.mobile.length > 0 && typography.mobile.map( ( [ element, description ], i ) => {
					const Tag = element.startsWith( 'h' ) ? element : 'p'
					const classname = i === 7 ? 'stk-subtitle' : i === 8 ? 'stk-button__inner-text' : ''
					const label = i < 6 ? sprintf( __( 'Heading %d', i18n ), i + 1 )
						: i === 6 ? __( 'Body', i18n )
							: i === 7 ? __( 'Subtitle', i18n )
								: __( 'Button', i18n )

					return (
						<div key={ i } className="ugb-style-guide__typography-container">
							<Tag className={ `ugb-style-guide__typography-preview ${ classname }` } data-device="mobile">{ label }</Tag>
							<div className="ugb-style-guide__typography-label">{ description }</div>
						</div>
					)
				} ) }
			</div>
		</div>

		<div className="ugb-style-guide__columns ugb-style-guide__typography-body">
			<div className="ugb-style-guide__column">
				<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Desktop', i18n ) }</h2>
				<h2 className="ugb-style-guide__typography-preview" data-device="desktop">{ __( 'Built on the Moments Between', i18n ) }</h2>
				<p className="ugb-style-guide__typography-preview" data-device="desktop">{ LONG_TEXT[ 0 ] } { LONG_TEXT[ 1 ] } { LONG_TEXT[ 2 ] }</p>
			</div>
			<div className="ugb-style-guide__column">
				<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Tablet', i18n ) }</h2>
				<h2 className="ugb-style-guide__typography-preview" data-device="tablet">{ __( 'Built on the Moments Between', i18n ) }</h2>
				<p className="ugb-style-guide__typography-preview" data-device="tablet">{ LONG_TEXT[ 1 ] } { LONG_TEXT[ 2 ] } { LONG_TEXT[ 3 ] }</p>
			</div>
			<div className="ugb-style-guide__column">
				<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Mobile', i18n ) }</h2>
				<h2 className="ugb-style-guide__typography-preview" data-device="mobile">{ __( 'Built on the Moments Between', i18n ) }</h2>
				<p className="ugb-style-guide__typography-preview" data-device="mobile">{ LONG_TEXT[ 2 ] } { LONG_TEXT[ 1 ] } { LONG_TEXT[ 2 ] }</p>
			</div>
		</div>
	</>
}

export const BlockStyles = ( { allBlockStyles, className } ) => {
	return <>
		<h1 className="ugb-style-guide__section-title ugb-style-guide__title">{ __( 'Web Elements', i18n ) }</h1>
		<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Buttons', i18n ) }</h2>
		<div className={ `ugb-style-guide__elements ugb-style-guide__elements__buttons ugb-style-guide__preview-root ${ className }` }>
			<RenderBlock blockName="stackable/button" attributes={ { text: __( 'Button', i18n ) } } />
			{ 'stackable/button' in allBlockStyles && allBlockStyles[ 'stackable/button' ].length > 0 && <>
				{ allBlockStyles[ 'stackable/button' ].map( ( blockStyle, index ) => {
					return <RenderBlock
						key={ index }
						blockName="stackable/button"
						attributes={ {
							...blockStyle.attributes,
							text: __( 'Button', i18n ),
							blockStyle: blockStyle.slug,
						} }
						name={ blockStyle.name }
					/>
				} ) }
			</> }
		</div>
		<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Images', i18n ) }</h2>
		<div className={ `ugb-style-guide__elements ugb-style-guide__elements__images ugb-style-guide__preview-root ${ className }` }>
			{ /* <DefaultImage imgSrc={ srcUrl + '/' + heroBg } /> */ }
			<RenderBlock blockName="stackable/image" attributes={ { imageExternalUrl: `${ srcUrl }/${ heroBg }` } } />
			{ 'stackable/image' in allBlockStyles && allBlockStyles[ 'stackable/image' ].length > 0 && <>
				{ allBlockStyles[ 'stackable/image' ].map( ( blockStyle, index ) => {
					return <RenderBlock
						key={ index }
						blockName="stackable/image"
						attributes={ {
							...blockStyle.attributes,
							imageExternalUrl: `${ srcUrl }/${ heroBg }`,
							blockStyle: blockStyle.slug,
						} }
						name={ blockStyle.name }
					/>
				} ) }
			</> }
		</div>

		{ typeof allBlockStyles === 'object' && Object.keys( allBlockStyles ).length > 0 && <>
			{ Object.entries( allBlockStyles ).map( ( [ blockName, blockStyles ], index ) => {
				// Skip 'stackable/button' and 'stackable/image'
				if ( blockName === 'stackable/button' || blockName === 'stackable/image' ) {
					return null
				}

				const blockTitle = getBlockType( blockName ).title
				const { attributes, innerBlocks } = getPlaceholders( blockName )
				return ( <Fragment key={ index }>
					<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ blockTitle }</h2>
					<div className={ `ugb-style-guide__elements ugb-style-guide__preview-root ${ className }` }>
						{ /* Render Default Block Style */ }
						<RenderBlock key={ 0 } blockName={ blockName } attributes={ attributes } innerBlocks={ innerBlocks } />
						{ blockStyles.map( ( blockStyle, styleIndex ) => (
							<RenderBlock
								key={ styleIndex + 1 }
								blockName={ blockName }
								attributes={ {
									...attributes,
									...blockStyle.attributes,
									blockStyle: blockStyle.slug,
								} }
								innerBlocks={ innerBlocks }
								name={ blockStyle.name }
							/>
						) ) }
					</div>
				</Fragment>
				)
			} ) }
		</>
		}
	</>
}

export const WebPreview = ( { className } ) => {
	return <>
		<h1 className="ugb-style-guide__section-title ugb-style-guide__title">{ __( 'Example Website Preview', i18n ) }</h1>
		<div className="ugb-style-guide__preview">
			<div className="ugb-style-guide__preview-mock-browser">
				<div className="ugb-style-guide__preview-mock-browser__buttons">
					<div className="ugb-style-guide__preview-mock-browser__button"></div>
					<div className="ugb-style-guide__preview-mock-browser__button"></div>
					<div className="ugb-style-guide__preview-mock-browser__button"></div>
				</div>
				{ /* TODO: can we get the URL of the current site here? */ }
				<div className="ugb-style-guide__preview-mock-browser__url">{ homeUrl }</div>
				<div className="ugb-style-guide__preview-mock-browser__resize-handle"></div>
			</div>
			<div className={ `ugb-style-guide__preview-root ${ className }` }>
				{ /* HERO SECTION */ }
				<div className="wp-block-stackable-columns alignfull stk-block-columns stk-block stk-2d5f398 stk-block-background stk--has-background-overlay ugb-style-guide__preview-hero" data-block-id="2d5f398" style={ { '--bg-image': `url(${ srcUrl + '/' + heroBg })` } }>
					<style>{ `.stk-2d5f398 {min-height:450px !important;align-items:center !important;display:flex !important; background-size: cover !important; background-position: center !important; background-repeat: no-repeat !important;}` }</style>
					<div className="stk-row stk-inner-blocks stk-block-content stk-content-align stk-2d5f398-column alignwide">
						<div className="wp-block-stackable-column stk-block-column stk-column stk-block stk-830918c" data-v="4" data-block-id="830918c">
							<div className="stk-column-wrapper stk-block-column__content stk-container stk-830918c-container stk--no-background stk--no-padding">
								<div className="has-text-align-center stk-block-content stk-inner-blocks stk-830918c-inner-blocks">
									<div className="wp-block-stackable-subtitle stk-block-subtitle stk-block stk-fb52f96" data-block-id="fb52f96">
										<style>{ '.stk-fb52f96 .stk-block-subtitle__text{color:#bbbbbb !important;}' }</style>
										<p className="stk-block-subtitle__text stk-subtitle has-text-color">{ __( 'Welcome to Our Company', i18n ) }</p>
									</div>

									<div className="wp-block-stackable-heading stk-block-heading stk-block-heading--v2 stk-block stk-6602002" id="hero" data-block-id="6602002">
										<style>{ '.stk-6602002 .stk-block-heading__text{color:#ffffff !important;}' }</style>
										<h1 className="stk-block-heading__text has-text-color">{ __( 'Professional Solutions for Businesses', i18n ) }</h1>
									</div>

									<div className="wp-block-stackable-text stk-block-text stk-block stk-f9171eb" data-block-id="f9171eb">
										<style>{ '.stk-f9171eb .stk-block-text__text{color:#ffffff !important;}' }</style>
										<p className="stk-block-text__text has-text-color">
											{ __( 'We provide innovative services and support to help your business grow and succeed in a competitive market.', i18n ) }
										</p>
									</div>

									<div className="wp-block-stackable-button-group stk-block-button-group stk-block stk-ff42814" data-block-id="ff42814">
										<div className="stk-row stk-inner-blocks stk-block-content stk-button-group">
											<div className="wp-block-stackable-button stk-block-button stk-block stk-65bd3dd" data-block-id="65bd3dd">
												<a className="stk-link stk-button stk--hover-effect-darken" href="#" onClick={ e => e.preventDefault() }>
													<span className="stk-button__inner-text">{ __( 'Get Started', i18n ) }</span>
												</a>
											</div>

											<div className="wp-block-stackable-button stk-block-button is-style-ghost stk-block stk-5b35e19" data-block-id="5b35e19">
												<style>{ '.stk-5b35e19 .stk-button{background:transparent !important;}.stk-5b35e19 .stk-button:hover:after{background:transparent !important;opacity:1 !important;}:where(.stk-hover-parent:hover,  .stk-hover-parent.stk--is-hovered) .stk-5b35e19 .stk-button:after{background:transparent !important;opacity:1 !important;}.stk-5b35e19 .stk-button:before{border-style:solid !important;border-color:#ffffff !important;}.stk-5b35e19 .stk-button__inner-text{color:#ffffff !important;}' }</style>
												<style className="stk-custom-css">{ '.stk-5b35e19.stk-block-button{--stk-button-outline-color:#fff !important}' }</style>
												<a className="stk-link stk-button stk--hover-effect-darken" href="#" onClick={ e => e.preventDefault() }>
													<span className="has-text-color stk-button__inner-text">{ __( 'Learn More', i18n ) }</span>
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{ /* END OF HERO SECTION */ }

				{ /* 3-COLUMN CONTAINER SECTION */ }
				<div className="wp-block-stackable-columns alignfull stk-block-columns stk-block stk-9a39825" data-block-id="9a39825">
					<div className="stk-row stk-inner-blocks stk-block-content stk-content-align stk-9a39825-column alignwide">
						<div className="wp-block-stackable-column stk-block-column stk-column stk-block stk-24d7b12" data-v="4" data-block-id="24d7b12">
							<div className="stk-column-wrapper stk-block-column__content stk-container stk-24d7b12-container stk--no-background stk--no-padding">
								<div className="has-text-align-center stk-block-content stk-inner-blocks stk-24d7b12-inner-blocks">
									<div className="wp-block-stackable-heading stk-block-heading stk-block-heading--v2 stk-block stk-8b4585e" id="section-title" data-block-id="8b4585e">
										<h2 className="stk-block-heading__text">{ __( 'Our Services', i18n ) }</h2>
									</div>

									<div className="wp-block-stackable-text stk-block-text stk-block stk-111d3c5" data-block-id="111d3c5">
										<p className="stk-block-text__text">{ __( 'Explore a wide range of solutions designed to meet your business needs.', i18n ) }</p>
									</div>

									<div className="wp-block-stackable-columns stk-block-columns stk-block stk-a05e839" data-block-id="a05e839">
										<div className="stk-row stk-inner-blocks stk-block-content stk-content-align stk-a05e839-column">
											<div className="wp-block-stackable-column stk-block-column stk-column stk-block stk-cc2cc69" data-v="4" data-block-id="cc2cc69">
												<div className="stk-column-wrapper stk-block-column__content stk-container stk-cc2cc69-container stk-hover-parent">
													<div className="stk-block-content stk-inner-blocks stk-cc2cc69-inner-blocks">
														<div className="wp-block-stackable-icon stk-block-icon stk-block stk-e4ae2c1" data-block-id="e4ae2c1">
															<span className="stk--svg-wrapper">
																<div className="stk--inner-svg">
																	<Icon icon={ addTemplateIcon } />
																</div>
															</span>
														</div>

														<div className="wp-block-stackable-heading stk-block-heading stk-block-heading--v2 stk-block stk-3b5efe7" id="grid-item-title" data-block-id="3b5efe7">
															<h3 className="stk-block-heading__text">{ __( 'Consulting', i18n ) }</h3>
														</div>

														<div className="wp-block-stackable-text stk-block-text stk-block stk-b456df6" data-block-id="b456df6">
															<p className="stk-block-text__text">
																{ __( 'Strategic guidance and expert advice to help your organization achieve its objectives.', i18n ) }
															</p>
														</div>
													</div>
												</div>
											</div>

											<div className="wp-block-stackable-column stk-block-column stk-column stk-block stk-7437b03" data-v="4" data-block-id="7437b03">
												<div className="stk-column-wrapper stk-block-column__content stk-container stk-7437b03-container stk-hover-parent">
													<div className="stk-block-content stk-inner-blocks stk-7437b03-inner-blocks">
														<div className="wp-block-stackable-icon stk-block-icon stk-block stk-a8356d9" data-block-id="a8356d9">
															<span className="stk--svg-wrapper">
																<div className="stk--inner-svg">
																	<Icon icon={ stylesIcon } />
																</div>
															</span>
														</div>

														<div className="wp-block-stackable-heading stk-block-heading stk-block-heading--v2 stk-block stk-8248330" id="grid-item-title" data-block-id="8248330">
															<h3 className="stk-block-heading__text">{ __( 'Technology', i18n ) }</h3>
														</div>

														<div className="wp-block-stackable-text stk-block-text stk-block stk-dd2581b" data-block-id="dd2581b">
															<p className="stk-block-text__text">
																{ __( 'Custom software and IT solutions to streamline your business processes.', i18n ) }
															</p>
														</div>
													</div>
												</div>
											</div>

											<div className="wp-block-stackable-column stk-block-column stk-column stk-block stk-b606511" data-v="4" data-block-id="b606511">
												<div className="stk-column-wrapper stk-block-column__content stk-container stk-b606511-container stk-hover-parent">
													<div className="stk-block-content stk-inner-blocks stk-b606511-inner-blocks">
														<div className="wp-block-stackable-icon stk-block-icon stk-block stk-bb4e0fd" data-block-id="bb4e0fd">
															<span className="stk--svg-wrapper">
																<div className="stk--inner-svg">
																	<Icon icon={ scheduledIcon } />
																</div>
															</span>
														</div>

														<div className="wp-block-stackable-heading stk-block-heading stk-block-heading--v2 stk-block stk-3d2ed89" id="grid-item-title" data-block-id="3d2ed89">
															<h3 className="stk-block-heading__text">{ __( 'Support', i18n ) }</h3>
														</div>

														<div className="wp-block-stackable-text stk-block-text stk-block stk-ffddcf7" data-block-id="ffddcf7">
															<p className="stk-block-text__text">
																{ __( 'Dedicated assistance and ongoing support for all your business needs.', i18n ) }
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{ /* END OF 3-COLUMN CONTAINER SECTION */ }

				{ /* COLUMNS WITH BACKGROUND SECTION */ }
				<div className="wp-block-stackable-columns alignfull stk-block-columns stk-block-background stk-block stk-d3ac391" data-block-id="d3ac391">
					<style>{ '.stk-d3ac391{margin-bottom: 0px !important;}' }</style>
					<div className="stk-row stk-inner-blocks stk-block-content stk-content-align stk-d3ac391-column alignwide">
						<div className="wp-block-stackable-column stk-block-column stk-column stk-block stk-e559c74" data-v="4" data-block-id="e559c74">
							<div className="stk-column-wrapper stk-block-column__content stk-container stk-e559c74-container stk--no-background stk--no-padding">
								<div className="stk-block-content stk-inner-blocks stk-e559c74-inner-blocks">
									<div className="wp-block-stackable-image stk-block-image stk-block stk-f263134" data-block-id="f263134">
										<style>{ '.stk-f263134 .stk-img-wrapper{width:100% !important;height:400px !important;}.stk-f263134 .stk-img-wrapper img{object-fit:cover !important;}' }</style>
										<figure>
											<span className="stk-img-wrapper stk-image--shape-stretch">
												<img className="stk-img wp-image-5695" src={ srcUrl + '/' + mediaText } width="1125" height="750" alt="Placeholder" />
											</span>
										</figure>
									</div>
								</div>
							</div>
						</div>

						<div className="wp-block-stackable-column stk-block-column stk-column stk-block stk-d99e48d" data-v="4" data-block-id="d99e48d">
							<style>{ '.stk-d99e48d {padding-top:50px !important;}' }</style>
							<div className="stk-column-wrapper stk-block-column__content stk-container stk-d99e48d-container stk--no-background stk--no-padding">
								<div className="stk-block-content stk-inner-blocks stk-d99e48d-inner-blocks">
									<div className="wp-block-stackable-subtitle stk-block-subtitle stk-block stk-9514e13" data-block-id="9514e13">
										<p className="stk-block-subtitle__text stk-subtitle">{ __( 'About Our Company', i18n ) }</p>
									</div>

									<div className="wp-block-stackable-heading stk-block-heading stk-block-heading--v2 stk-block stk-505a24b" id="section-title" data-block-id="505a24b">
										<h2 className="stk-block-heading__text">{ __( 'Committed to Your Success', i18n ) }</h2>
									</div>

									<div className="wp-block-stackable-text stk-block-text stk-block stk-36a0bf6" data-block-id="36a0bf6">
										<p className="stk-block-text__text">
											{ __( 'Our experienced team delivers reliable solutions and outstanding results for businesses of all sizes and industries.', i18n ) }
										</p>
									</div>

									<div className="wp-block-stackable-button-group stk-block-button-group stk-block stk-cdea3f4" data-block-id="cdea3f4">
										<div className="stk-row stk-inner-blocks stk-block-content stk-button-group">
											<div className="wp-block-stackable-button stk-block-button stk-block stk-96502ae" data-block-id="96502ae">
												<a className="stk-link stk-button stk--hover-effect-darken" href="#" onClick={ e => e.preventDefault() }>
													<span className="stk-button__inner-text">{ __( 'Read More', i18n ) }</span>
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{ /* END OF COLUMNS WITH BACKGROUND SECTION */ }
			</div>
		</div>
	</>
}
