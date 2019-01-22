import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { getFontFamily } from './font'
import { range } from '@stackable/util'
import { RichText } from '@wordpress/editor'

const deprecatedSchema_1_10 = {
	columns: {
		type: 'number',
		default: 4,
	},
	backgroundColor: {
		type: 'string',
	},
	backgroundImageID: {
		type: 'number',
	},
	backgroundImageURL: {
		type: 'string',
	},
	backgroundOpacity: {
		type: 'number',
		default: 5,
	},
	fixedBackground: {
		type: 'boolean',
		default: false,
	},
	title1: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(1) h4',
		default: __( 'Title' ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(2) h4',
		default: __( 'Title' ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(3) h4',
		default: __( 'Title' ),
	},
	title4: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(4) h4',
		default: __( 'Title' ),
	},
	countText1: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(1) .ugb-counter',
		default: '$99.99',
	},
	countText2: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(2) .ugb-counter',
		default: '1,234',
	},
	countText3: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(3) .ugb-counter',
		default: '1,234.56',
	},
	countText4: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(4) .ugb-counter',
		default: '£99.99',
	},
	description1: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(1) p',
		default: __( 'Description' ),
	},
	description2: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(2) p',
		default: __( 'Description' ),
	},
	description3: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(3) p',
		default: __( 'Description' ),
	},
	description4: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(4) p',
		default: __( 'Description' ),
	},
	textColor: {
		type: 'string',
	},
	countColor: {
		type: 'string',
	},
	countSize: {
		type: 'number',
		default: 40,
	},
	countFont: {
		type: 'string',
		default: 'theme',
	},
	countFontWeight: {
		type: 'string',
		default: '400',
	},
	contentWidth: {
		type: 'boolean',
		default: false,
	},
	design: {
		type: 'string',
		default: 'plain',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	title: {
		source: 'html',
		selector: 'h4',
	},
	counter: {
		source: 'html',
		selector: '.ugb-counter',
	},
	des: {
		source: 'html',
		selector: 'p',
	},
	fontSize: {
		type: 'number',
		default: 60,
	},
	headingColor: {
		type: 'string',
	},
	desColor: {
		type: 'string',
	},
	color: {
		type: 'string',
	},
}

const deprecatedSave_1_10 = props => {
	const { className, attributes } = props
	const {
		columns,
		backgroundColor,
		backgroundImageURL,
		fixedBackground,
		backgroundOpacity = 5,
		textColor,
		countColor,
		countSize,
		contentWidth,
		design,
		align,
		borderRadius,
		shadow,
		countFont,
		countFontWeight,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-countup',
		'ugb-countup-v3', // For backward compatibility.
		`columns-${ columns }`,
		'ugb-has-background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		// 'ugb-has-background': backgroundColor || backgroundImageURL,
		'ugb-has-background-image': backgroundImageURL,
		[ `ugb-content-width` ]: align === 'full' && contentWidth,
		[ `ugb-design-${ design }` ]: design !== 'plain',
		[ `ugb-shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

	const mainStyle = {
		backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
		backgroundImage: design !== 'plain' && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': design !== 'plain' && backgroundImageURL ? backgroundColor : undefined,
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	const countStyle = {
		color: countColor ? countColor : undefined,
		fontSize: countSize ? countSize + 'px' : undefined,
		// fontFamily: countFont && countFont !== 'theme' ? getFontFamily( countFont ) : undefined,
		fontWeight: countFontWeight ? countFontWeight : undefined,
	}
	if ( countFont && countFont !== 'theme' ) {
		countStyle.fontFamily = getFontFamily( countFont )
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			<div className="ugb-content-wrapper">
				{ range( 1, columns + 1 ).map( i => {
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]
					const countText = attributes[ `countText${ i }` ]
					return (
						<div className="ugb-countup-item" key={ i }>
							{ ! RichText.isEmpty( title ) && (
								<RichText.Content
									tagName="h4"
									style={ { color: textColor ? textColor : undefined } }
									value={ title }
								/>
							) }
							{ ! RichText.isEmpty( countText ) && (
								<RichText.Content
									tagName="div"
									className="ugb-counter"
									style={ countStyle }
									value={ countText }
									data-duration="1000"
									data-delay="16"
								/>
							) }
							{ ! RichText.isEmpty( description ) && (
								<RichText.Content
									tagName="p"
									style={ { color: textColor ? textColor : undefined } }
									value={ description }
								/>
							) }
						</div>
					)
				} ) }
			</div>
		</div>
	)
}

const deprecatedSchema_1_9_1 = {
	columns: {
		type: 'number',
		default: 4,
	},
	backgroundColor: {
		type: 'string',
	},
	backgroundImageID: {
		type: 'number',
	},
	backgroundImageURL: {
		type: 'string',
	},
	backgroundOpacity: {
		type: 'number',
		default: 5,
	},
	fixedBackground: {
		type: 'boolean',
		default: false,
	},
	title1: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(1) h4',
		default: __( 'Stat Title' ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(2) h4',
		default: __( 'Stat Title' ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(3) h4',
		default: __( 'Stat Title' ),
	},
	title4: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(4) h4',
		default: __( 'Stat Title' ),
	},
	countText1: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(1) .ugb-counter',
		default: '$99.99',
	},
	countText2: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(2) .ugb-counter',
		default: '1,234',
	},
	countText3: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(3) .ugb-counter',
		default: '1,234.56',
	},
	countText4: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(4) .ugb-counter',
		default: '£99.99',
	},
	description1: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(1) p',
		default: __( 'stat description' ),
	},
	description2: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(2) p',
		default: __( 'stat description' ),
	},
	description3: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(3) p',
		default: __( 'stat description' ),
	},
	description4: {
		source: 'html',
		selector: '.ugb-countup-item:nth-child(4) p',
		default: __( 'stat description' ),
	},
	textColor: {
		type: 'string',
	},
	countColor: {
		type: 'string',
	},
	countSize: {
		type: 'number',
		default: 40,
	},

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	title: {
		source: 'html',
		selector: 'h4',
		default: __( 'Happy Customers' ),
	},
	counter: {
		source: 'html',
		selector: '.ugb-counter',
		default: '12,345',
	},
	des: {
		source: 'html',
		selector: 'p',
		default: __( 'and counting' ),
	},
	fontSize: {
		type: 'number',
		default: 60,
	},
	headingColor: {
		type: 'string',
	},
	desColor: {
		type: 'string',
	},
	color: {
		type: 'string',
	},
}

const deprecatedSave_1_9_1 = props => {
	const { className, attributes } = props
	const {
		columns,
		backgroundColor,
		backgroundImageURL,
		fixedBackground,
		backgroundOpacity = 5,
		textColor,
		countColor,
		countSize,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-countup',
		'ugb-countup-v2', // For backward compatibility.
		`columns-${ columns }`,
		'ugb-has-background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		'ugb-has-background': backgroundColor || backgroundImageURL,
		'ugb-has-background-image': backgroundImageURL,
	} )

	const mainStyle = {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL ? backgroundColor : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			{ range( 1, columns + 1 ).map( i => {
				const title = attributes[ `title${ i }` ]
				const description = attributes[ `description${ i }` ]
				const countText = attributes[ `countText${ i }` ]
				return (
					<div className="ugb-countup-item" key={ i }>
						{ ! RichText.isEmpty( title ) && (
							<RichText.Content
								tagName="h4"
								style={ { color: textColor ? textColor : undefined } }
								value={ title }
							/>
						) }
						{ ! RichText.isEmpty( countText ) && (
							<RichText.Content
								tagName="div"
								className="ugb-counter"
								style={ {
									color: countColor ? countColor : undefined,
									fontSize: countSize ? countSize + 'px' : undefined,
								} }
								value={ countText }
								data-duration="1000"
								data-delay="16"
							/>
						) }
						{ ! RichText.isEmpty( description ) && (
							<RichText.Content
								tagName="p"
								style={ { color: textColor ? textColor : undefined } }
								value={ description }
							/>
						) }
					</div>
				)
			} ) }
		</div>
	)
}

export const deprecatedSchema_1_4 = {
	title: {
		source: 'html',
		selector: 'h4',
		default: __( 'Happy Customers' ),
	},
	counter: {
		source: 'html',
		selector: '.ugb-counter',
		default: '12,345',
	},
	des: {
		source: 'html',
		selector: 'p',
		default: __( 'and counting' ),
	},
	fontSize: {
		type: 'number',
		default: 60,
	},
	headingColor: {
		type: 'string',
	},
	desColor: {
		type: 'string',
	},
	color: {
		type: 'string',
	},
}

export const deprecatedSave_1_4 = props => {
	const { className } = props
	const {
		color, headingColor, desColor, title, counter, des, fontSize,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-countup',
	] )

	return (
		<div className={ mainClasses }>
			<RichText.Content
				tagName="h4"
				style={ { color: headingColor } }
				value={ title }
			/>
			<RichText.Content
				tagName="div"
				className="ugb-counter"
				style={ { color: color, fontSize: fontSize + 'px' } }
				value={ counter }
				data-duration="1000"
				data-delay="16"
			/>
			<RichText.Content
				tagName="p"
				style={ { color: desColor } }
				value={ des }
			/>
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			const className = ( attributes.className || '' ).replace( /align\w+/, '' ).trim()
			return {
				...attributes,
				className: className ? className : undefined,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_9_1,
		save: deprecatedSave_1_9_1,
		migrate: attributes => {
			return {
				...attributes,
				design: attributes.backgroundColor ? 'basic' : 'plain',
				borderRadius: 12,
				shadow: 3,
				contentWidth: false,
				countFont: 'theme',
				countFontWeight: '400',
				className: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? '' : attributes.className,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_4,
		save: deprecatedSave_1_4,
		migrate: attributes => {
			return {
				columns: 1,
				title1: attributes.title,
				description1: attributes.des,
				countText1: attributes.counter,
				textColor: attributes.headingColor,
				countColor: attributes.color,
				countSize: attributes.fontSize,
			}
		},
	},
]

export default deprecated
