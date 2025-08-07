/**
 * External dependencies
 */
import { i18n, srcUrl } from 'stackable'

/**
 * Internal dependencies
 */
import { isDarkColor } from '~stackable/util'
import heroBg from './images/hero-bg.webp'
import mediaText from './images/media-text.webp'
import {
	Icon,
	addTemplate as addTemplateIcon,
	styles as stylesIcon,
	scheduled as scheduledIcon,
} from '@wordpress/icons'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
// import { RawHTML } from '@wordpress/element'
// import { createBlock, serialize } from '@wordpress/blocks'

export { default as StyleGuidePopover } from './popover'

// DUMMY DATA
const DUMMY_COLOR_SCHEMES = [
	{
		name: 'Base Color Scheme',
		key: 'color-scheme-1',
		backgroundColor: {
			name: undefined,
			color: '#EBE9E1',
			hoverColor: undefined,
		},
		headingColor: {
			name: undefined,
			color: '#E43D12',
			hoverColor: undefined,
		},
		textColor: {
			name: undefined,
			color: '#E43D12',
			hoverColor: undefined,
		},
		linkColor: {
			name: undefined,
			color: '#EFB11D',
			hoverColor: undefined,
		},
		accentColor: {
			name: undefined,
			color: '#FFA2B6',
			hoverColor: undefined,
		},
		buttonColor: {
			name: undefined,
			color: '#D6536D',
			hoverColor: '#E43D12',
		},
		buttonTextColor: {
			name: undefined,
			color: '#EBE9E1',
			hoverColor: undefined,
		},
		buttonOutlineColor: {
			name: undefined,
			color: '#D6536D',
			hoverColor: '#E43D12',
		},
	},
	{
		name: 'Background Color Scheme',
		key: 'color-scheme-2',
		backgroundColor: {
			name: undefined,
			color: '#E2E8FA',
			hoverColor: undefined,
		},
		headingColor: {
			name: undefined,
			color: '#0A21C0',
			hoverColor: undefined,
		},
		textColor: {
			name: undefined,
			color: '#050A44',
			hoverColor: undefined,
		},
		linkColor: {
			name: undefined,
			color: '#2C2E3A',
			hoverColor: undefined,
		},
		accentColor: {
			name: undefined,
			color: '#7988F7',
			hoverColor: undefined,
		},
		buttonColor: {
			name: undefined,
			color: '#050A44',
			hoverColor: '#E43D12',
		},
		buttonTextColor: {
			name: undefined,
			color: '#B3B4BD',
			hoverColor: undefined,
		},
		buttonOutlineColor: {
			name: undefined,
			color: '#050A44',
			hoverColor: undefined,
		},
	},
]

const LONG_TEXT = [
	// Translators: This is placeholder text used in the style guide.
	__( 'They didn\'t plan to build a life around shared walls and hand-me-down furniture, but somehow, it worked.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'Morning routines bled into late-night talks, and even the silence felt familiar.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'Careers shifted, relationships changed, and expectations rarely lined up with reality.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'But there was always time for inside jokes, spontaneous distractions, and someone to show up, even without being asked.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'Each of them brought something different—quiet patience, loud opinions, unexpected wisdom.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'Change arrived slowly, then all at once. Some said goodbye, some stayed longer, and some simply evolved.', i18n ),
]

// TODO: This is not yet finished
const StyleGuide = props => {
	const { designSystem, contentRef = null } = props

	const {
		colors,
		colorSchemes = DUMMY_COLOR_SCHEMES,
		typography = {
			desktop: [], tablet: [], mobile: [],
		},
		designSystemStyles = '',
	} = designSystem

	return (
		<>
			<div className="ugb-style-guide">
				<div className="ugb-style-guide__content" ref={ contentRef }>
					<style>{ designSystemStyles }</style>
					<h1 className="ugb-style-guide__section-title ugb-style-guide__title">{ __( 'Colors', i18n ) }</h1>

					{ /* TODO: Kae: the color schemes should always output at least 2 entries: 1 base color scheme and 1 background color scheme even at their default states. className="ugb-style-guide__typography-preview" data-device="desktop" */ }
					{ colorSchemes && <>
						<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Color Schemes', i18n ) }</h2>
						<div className="ugb-style-guide__columns ugb-style-guide__color-schemes">
							{ colorSchemes.map( ( colorScheme, i ) => {
								return (
									<div key={ colorScheme.key } className="ugb-style-guide__column">
										<h2 className="ugb-style-guide__color-scheme-title ugb-style-guide__title ugb-style-guide__color-label">{ colorScheme.name }</h2>
										<div className="ugb-style-guide__color-scheme ugb-style-guide__color-container" style={ { backgroundColor: colorScheme.backgroundColor.color } }>
											{ /* TODO: Kae: the fonts and sizes here should be based on the design system */ }
											<div className="ugb-style-guide__color-scheme__subtitle stk-subtitle ugb-style-guide__typography-preview" data-device="desktop" style={ { color: colorScheme.accentColor.color } }>{ __( 'Subtitle', i18n ) }</div>
											<h2 className="ugb-style-guide__color-scheme__heading ugb-style-guide__typography-preview" data-device="desktop" style={ { color: colorScheme.headingColor.color } }>{ __( 'Headings', i18n ) }</h2>

											<p className="ugb-style-guide__color-scheme__body ugb-style-guide__typography-preview" data-device="desktop" style={ { color: colorScheme.textColor.color } }>
												{ LONG_TEXT[ i % 6 ] }
                                                &nbsp;
												{ LONG_TEXT[ ( i + 1 ) % 6 ] }
                                                &nbsp;
												{ LONG_TEXT[ ( i + 2 ) % 6 ] }
                                                &nbsp;
												{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
												<a href="#" onClick={ e => e.preventDefault() } style={ {
													color: colorScheme.linkColor.color,
													'--hover-color': colorScheme.linkColor.hoverColor || colorScheme.textColor.color, // TODO: Kae: please double check if this falls back to textColor
												} }>
													{ __( 'Link', i18n ) }
												</a>
											</p>

											{ /* TODO: Kae: the button looks here should be based on the design system */ }
											<div className="ugb-style-guide__color-scheme__links">

												<button className="ugb-style-guide__color-scheme__button" style={ {
													backgroundColor: colorScheme.buttonColor.color,
													color: colorScheme.buttonTextColor.color,
													'--hover-background-color': colorScheme.buttonColor.hoverColor || colorScheme.buttonColor.color,
													'--hover-color': colorScheme.buttonTextColor.hoverColor || colorScheme.buttonTextColor.color,
												} }><span className="stk-button__inner-text ugb-style-guide__typography-preview" data-device="desktop">{ __( 'Button', i18n ) }</span></button>

												<button className="ugb-style-guide__color-scheme__button--outline" style={ {
													borderColor: colorScheme.buttonOutlineColor.color,
													color: colorScheme.buttonOutlineColor.color,
													'--hover-border-color': colorScheme.buttonOutlineColor.hoverColor || colorScheme.buttonOutlineColor.color,
													'--hover-color': colorScheme.buttonOutlineColor.hoverColor || colorScheme.buttonOutlineColor.color,
												} }><span className="stk-button__inner-text ugb-style-guide__typography-preview" data-device="desktop">{ __( 'Button', i18n ) }</span></button>

											</div>
										</div>
										<div className="ugb-style-guide__color-scheme__colors">
											<h3 className="ugb-style-guide__section-subheading--small">{ __( 'Base Colors', i18n ) }</h3>
											<p>{ __( 'Background Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.backgroundColor.color } } />{ colorScheme.backgroundColor.name || colorScheme.backgroundColor.color }</p>
											<p>{ __( 'Heading Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.headingColor.color } } />{ colorScheme.headingColor.name || colorScheme.headingColor.color }</p>
											<p>{ __( 'Text Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.textColor.color } } />{ colorScheme.textColor.name || colorScheme.textColor.color }</p>
											<p>{ __( 'Link Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.linkColor.color } } />{ colorScheme.linkColor.name || colorScheme.linkColor.color }</p>
											<p>{ __( 'Accent Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.accentColor.color } } />{ colorScheme.accentColor.name || colorScheme.accentColor.color }</p>
											<p>{ __( 'Button Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.buttonColor.color } } />{ colorScheme.buttonColor.name || colorScheme.buttonColor.color }</p>
											<p>{ __( 'Button Text Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.buttonTextColor.color } } />{ colorScheme.buttonTextColor.name || colorScheme.buttonTextColor.color }</p>
											<p>{ __( 'Button Outline Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.buttonOutlineColor.color } } />{ colorScheme.buttonOutlineColor.name || colorScheme.buttonOutlineColor.color }</p>
											<h3 className="ugb-style-guide__section-subheading--small">{ __( 'Hover Colors', i18n ) }</h3>
											<p>{ __( 'Button Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.buttonColor.color } } />{ colorScheme.buttonColor.name || colorScheme.buttonColor.color }</p>
											<p>{ __( 'Button Text Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.buttonTextColor.color } } />{ colorScheme.buttonTextColor.name || colorScheme.buttonTextColor.color }</p>
											<p>{ __( 'Button Outline Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.buttonOutlineColor.color } } />{ colorScheme.buttonOutlineColor.name || colorScheme.buttonOutlineColor.color }</p>
											<h3 className="ugb-style-guide__section-subheading--small">{ __( 'Parent Hovered Colors', i18n ) }</h3>
											<p>{ __( 'Background Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.backgroundColor.color } } />{ colorScheme.backgroundColor.name || colorScheme.backgroundColor.color }</p>
											<p>{ __( 'Heading Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.headingColor.color } } />{ colorScheme.headingColor.name || colorScheme.headingColor.color }</p>
											<p>{ __( 'Text Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.textColor.color } } />{ colorScheme.textColor.name || colorScheme.textColor.color }</p>
										</div>
									</div>
								)
							} ) }
						</div>
					</> }

					{ !! colors.length && <>
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
					</> }

					{ /* TODO: Kae: Also add the color scheme colors here */ }

					<h1 className="ugb-style-guide__section-title ugb-style-guide__title">{ __( 'Typography', i18n ) }</h1>
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

					<h1 className="ugb-style-guide__section-title ugb-style-guide__title">{ __( 'Web Elements', i18n ) }</h1>
					<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Buttons', i18n ) }</h2>
					<div className="ugb-style-guide__elements ugb-style-guide__elements__buttons">
						<button className="ugb-style-guide__button">Button</button>
						{ /* TODO: Kae: These are block styles: */ }
						<button className="ugb-style-guide__button">Secondary Button</button>
						<button className="ugb-style-guide__button">Outline Button</button>
					</div>
					<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Images', i18n ) }</h2>
					<div className="ugb-style-guide__elements ugb-style-guide__elements__images">
						<img src={ srcUrl + '/' + heroBg } alt="Placeholder" />
						{ /* TODO: Kae: Block styles here if any */ }
					</div>
					{ /* TODO: Kae: Remaining block styles: */ }

					<h1 className="ugb-style-guide__section-title ugb-style-guide__title">{ __( 'Design System Preview', i18n ) }</h1>
					<div className="ugb-style-guide__preview">
						<div className="ugb-style-guide__preview-mock-browser">
							<div className="ugb-style-guide__preview-mock-browser__buttons">
								<div className="ugb-style-guide__preview-mock-browser__button"></div>
								<div className="ugb-style-guide__preview-mock-browser__button"></div>
								<div className="ugb-style-guide__preview-mock-browser__button"></div>
							</div>
							{ /* TODO: can we get the URL of the current site here? */ }
							<div className="ugb-style-guide__preview-mock-browser__url">https://example.com</div>
							<div className="ugb-style-guide__preview-mock-browser__resize-handle"></div>
						</div>
						{ /* TODO: this is a section with a background */ }
						<div className="ugb-style-guide__preview-hero" style={ { '--bg-image': `url(${ srcUrl + '/' + heroBg })` } }>
							<div>{ __( 'Subtitle', i18n ) }</div>
							<h1>{ __( 'Hero', i18n ) }</h1>
							<p>{ LONG_TEXT[ 0 ] }</p>
							<div>
								<button>{ __( 'Get Started', i18n ) }</button>
								<button>{ __( 'Learn More', i18n ) }</button>
							</div>
						</div>
						{ /* TODO: no background section */ }
						<div className="ugb-style-guide__preview-content">
							<h2>{ __( 'Section Title', i18n ) }</h2>
							<p>{ __( 'Description', i18n ) }</p>
							<div className="ugb-style-guide__preview-content__grid">
								{ /* TODO: this should have containers on */ }
								<div className="ugb-style-guide__preview-content__grid-item">
									<Icon icon={ addTemplateIcon } />
									<h3>{ __( 'Grid Item Title', i18n ) }</h3>
									<p>{ LONG_TEXT[ 1 ] }</p>
								</div>
								<div className="ugb-style-guide__preview-content__grid-item">
									<Icon icon={ stylesIcon } />
									<h3>{ __( 'Grid Item Title', i18n ) }</h3>
									<p>{ LONG_TEXT[ 3 ] }</p>
								</div>
								<div className="ugb-style-guide__preview-content__grid-item">
									<Icon icon={ scheduledIcon } />
									<h3>{ __( 'Grid Item Title', i18n ) }</h3>
									<p>{ LONG_TEXT[ 4 ] }</p>
								</div>
							</div>
							{ /* TODO: Kae: Add the content here */ }
						</div>
						{ /* TODO: section with background: media on left, text on right */ }
						<div className="ugb-style-guide__preview-content-2">
							<div className="ugb-style-guide__preview-content__media">
								{ /* TODO: use actual random neutral image */ }
								<img src={ srcUrl + '/' + mediaText } alt="Placeholder" />
							</div>
							<div className="ugb-style-guide__preview-content__text">
								<p>{ __( 'Subtitle', i18n ) }</p>
								<h2>{ __( 'Section Title', i18n ) }</h2>
								<p>{ LONG_TEXT[ 5 ] }</p>
								<div>
									<button>{ __( 'Learn More', i18n ) }</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default StyleGuide

// const RenderBlock = props => {
// 	const {
// 		blockName, attributes, innerBlocks,
// 	} = props

// 	return (
// 		<RawHTML>
// 			{ serialize( createBlock(
// 				blockName,
// 				attributes,
// 				innerBlocks
// 			) ) }
// 		</RawHTML>
// 	)
// }
