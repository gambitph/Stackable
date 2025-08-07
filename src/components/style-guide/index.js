/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import { isDarkColor } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
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
	const { designSystem } = props

	const {
		colors,
		colorSchemes = DUMMY_COLOR_SCHEMES,
		contentRef = null,
	} = designSystem

	return (
		<>
			<div className="ugb-style-guide">
				<div className="ugb-style-guide__content" ref={ contentRef }>

					<h1 className="ugb-style-guide__section-title ugb-style-guide__title">{ __( 'Colors', i18n ) }</h1>

					{ colorSchemes && <>
						<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Color Schemes', i18n ) }</h2>
						<div className="ugb-style-guide__columns ugb-style-guide__color-schemes">
							{ colorSchemes.map( ( colorScheme, i ) => {
								return (
									<div key={ colorScheme.key } className="ugb-style-guide__column">
										<div className="ugb-style-guide__color-scheme ugb-style-guide__color-container" style={ { backgroundColor: colorScheme.backgroundColor.color } }>
											<h2 className="ugb-style-guide__color-scheme-title ugb-style-guide__title ugb-style-guide__color-label" style={ { color: isDarkColor( colorScheme.backgroundColor.color ) ? '#fff' : '#000' } }>{ colorScheme.name }</h2>
											{ /* TODO: Kae: the fonts and sizes here should be based on the design system */ }
											<div className="ugb-style-guide__color-scheme__subtitle" style={ { color: colorScheme.accentColor.color } }>{ __( 'Subtitle', i18n ) }</div>
											<div className="ugb-style-guide__color-scheme__heading" style={ { color: colorScheme.headingColor.color } }>{ __( 'Headings', i18n ) }</div>

											<div className="ugb-style-guide__color-scheme__body" style={ { color: colorScheme.textColor.color } }>
												{ LONG_TEXT[ i % 6 ] }
                                                &nbsp;
												{ LONG_TEXT[ ( i + 1 ) % 6 ] }
                                                &nbsp;
												{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
												<a href="#" onClick={ e => e.preventDefault() } style={ {
													color: colorScheme.linkColor.color,
													'--hover-color': colorScheme.linkColor.hoverColor || colorScheme.textColor.color, // TODO: Kae: please double check if this falls back to textColor
												} }>
													{ __( 'Link', i18n ) }
												</a>
											</div>

											{ /* TODO: Kae: the button looks here should be based on the design system */ }
											<div className="ugb-style-guide__color-scheme__links">

												<button className="ugb-style-guide__color-scheme__button" style={ {
													backgroundColor: colorScheme.buttonColor.color,
													color: colorScheme.buttonTextColor.color,
													'--hover-background-color': colorScheme.buttonColor.hoverColor || colorScheme.buttonColor.color,
													'--hover-color': colorScheme.buttonTextColor.hoverColor || colorScheme.buttonTextColor.color,
												} }>{ __( 'Button', i18n ) }</button>

												<button className="ugb-style-guide__color-scheme__button--outline" style={ {
													borderColor: colorScheme.buttonOutlineColor.color,
													color: colorScheme.buttonOutlineColor.color,
													'--hover-border-color': colorScheme.buttonOutlineColor.hoverColor || colorScheme.buttonOutlineColor.color,
													'--hover-color': colorScheme.buttonOutlineColor.hoverColor || colorScheme.buttonOutlineColor.color,
												} }>{ __( 'Button', i18n ) }</button>

											</div>
										</div>
										<div className="ugb-style-guide__color-scheme__colors">
											<p>{ __( 'Background Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.backgroundColor.color } } />{ colorScheme.backgroundColor.name || colorScheme.backgroundColor.color }</p>
											<p>{ __( 'Heading Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.headingColor.color } } />{ colorScheme.headingColor.name || colorScheme.headingColor.color }</p>
											<p>{ __( 'Text Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.textColor.color } } />{ colorScheme.textColor.name || colorScheme.textColor.color }</p>
											<p>{ __( 'Link Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.linkColor.color } } />{ colorScheme.linkColor.name || colorScheme.linkColor.color }</p>
											<p>{ __( 'Accent Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.accentColor.color } } />{ colorScheme.accentColor.name || colorScheme.accentColor.color }</p>
											<p>{ __( 'Button Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.buttonColor.color } } />{ colorScheme.buttonColor.name || colorScheme.buttonColor.color }</p>
											<p>{ __( 'Button Text Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.buttonTextColor.color } } />{ colorScheme.buttonTextColor.name || colorScheme.buttonTextColor.color }</p>
											<p>{ __( 'Button Outline Color', i18n ) }{ `: ` }<span className="ugb-style-guide__color-indicator" style={ { backgroundColor: colorScheme.buttonOutlineColor.color } } />{ colorScheme.buttonOutlineColor.name || colorScheme.buttonOutlineColor.color }</p>
										</div>
									</div>
								)
							} ) }
						</div>
					</> }

					{ colors && <>
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
					<div className="ugb-style-guide__columns">
						<div className="ugb-style-guide__column">
							<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Titles & Headings', i18n ) }</h2>
							<h1>{ __( 'Heading 1', i18n ) }</h1>
							<h2>{ __( 'Heading 2', i18n ) }</h2>
							<h3>{ __( 'Heading 3', i18n ) }</h3>
							<h4>{ __( 'Heading 4', i18n ) }</h4>
							<h5>{ __( 'Heading 5', i18n ) }</h5>
							<h6>{ __( 'Heading 6', i18n ) }</h6>
						</div>
						<div className="ugb-style-guide__column">
							<h2 className="ugb-style-guide__section-subheading ugb-style-guide__title">{ __( 'Body Text', i18n ) }</h2>
							<p>{ LONG_TEXT[ 0 ] } { LONG_TEXT[ 1 ] }</p>
							<p>{ LONG_TEXT[ 2 ] } { LONG_TEXT[ 3 ] }</p>
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
