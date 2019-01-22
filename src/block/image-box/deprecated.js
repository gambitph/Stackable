import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { omit } from 'lodash'
import { range } from '@stackable/util'
import { RichText } from '@wordpress/editor'

const deprecatedSchema_1_10 = {
	columns: {
		type: 'number',
		default: 3,
	},
	titleColor: {
		type: 'string',
		default: '#ffffff',
	},
	subtitleColor: {
		type: 'string',
		default: '#ffffff',
	},
	overlayColor: {
		type: 'string',
	},
	width: {
		type: 'number',
		default: 400,
	},
	height: {
		type: 'number',
		default: 400,
	},
	verticalAlign: {
		type: 'string',
		default: 'center',
	},
	horizontalAlign: {
		type: 'string',
		default: 'center',
	},

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	full: {
		type: 'boolean',
	},
	title: {
		type: 'string',
	},
	subtitle: {
		type: 'string',
	},
	id: {
		type: 'number',
	},
	url: {
		type: 'string',
	},
	href: {
		type: 'string',
	},
	align: {
		type: 'string',
	},
}

// Wrap in curly or else statement will merge with the previous one and will error out.
{ [ 1, 2, 3, 4 ].forEach( i => {
	deprecatedSchema_1_10[ `title${ i }` ] = {
		source: 'html',
		selector: `.ugb-image-box-wrapper > *:nth-child(${ i }) h4`,
		default: __( 'Title' ),
	}
	deprecatedSchema_1_10[ `description${ i }` ] = {
		source: 'html',
		selector: `.ugb-image-box-wrapper > *:nth-child(${ i }) p`,
		default: __( 'Description' ),
	}
	deprecatedSchema_1_10[ `imageURL${ i }` ] = {
		type: 'string',
	}
	deprecatedSchema_1_10[ `imageID${ i }` ] = {
		type: 'number',
	}
	deprecatedSchema_1_10[ `link${ i }` ] = {
		type: 'string',
		source: 'attribute',
		selector: `.ugb-image-box-wrapper > *:nth-child(${ i }) a`,
		attribute: 'href',
	}
} ) }

const deprecatedSave_1_10 = props => {
	const { className, attributes } = props
	const {
		titleColor,
		subtitleColor,
		overlayColor,
		height,
		width,
		verticalAlign,
		horizontalAlign,
		align,
		columns,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-image-box-wrapper',
		'ugb-image-box-v2',
		`columns-${ columns }`,
	] )

	const mainStyles = {
		textAlign: horizontalAlign ? horizontalAlign : undefined,
		'--overlay-color': overlayColor,
	}

	return (
		<div className={ mainClasses } style={ mainStyles }>
			{ range( 1, columns + 1 ).map( i => {
				const imageURL = attributes[ `imageURL${ i }` ]
				const title = attributes[ `title${ i }` ]
				const description = attributes[ `description${ i }` ]
				const link = attributes[ `link${ i }` ]
				const boxStyles = {
					backgroundImage: imageURL ? `url(${ imageURL })` : undefined,
					maxWidth: align !== 'wide' && align !== 'full' && columns === 1 ? width : undefined,
					height: height,
					textAlign: horizontalAlign,
					justifyContent: verticalAlign,
				}
				return (
					<div className="ugb-image-box" style={ boxStyles } key={ i }>
						{ /* eslint-disable-next-line */ }
						<a href={ link } />
						{ ! RichText.isEmpty( title ) && (
							<RichText.Content
								tagName="h4"
								style={ { color: titleColor } }
								value={ title }
							/>
						) }
						{ ! RichText.isEmpty( description ) && (
							<RichText.Content
								tagName="p"
								style={ { color: subtitleColor } }
								value={ description }
							/>
						) }
					</div>
				)
			} ) }
		</div>
	)
}

export const deprecatedSave_1_5 = props => {
	const { className } = props
	const {
		url,
		href,
		title,
		titleColor,
		subtitle,
		subtitleColor,
		overlayColor,
		height,
		width,
		verticalAlign,
		horizontalAlign,
		full,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-image-box',
	], {
		'has-image': url,
		'full-width': full,
		'has-no-content': ! title && ! subtitle,
		'has-content': title || subtitle,
	} )

	return (
		<div className={ mainClasses }
			data-url={ url }
			style={ {
				width: width + 'px',
				height: height + 'px',
				backgroundImage: `url(${ url })`,
				alignItems: horizontalAlign,
				justifyContent: verticalAlign,
			} }
		>
			{ /* eslint-disable-next-line */ }
			<a href={ href } style={ { backgroundColor: overlayColor } } />
			{ ! RichText.isEmpty( title ) && (
				<RichText.Content
					tagName="h4"
					style={ { color: titleColor } }
					value={ title }
				/>
			) }
			{ ! RichText.isEmpty( subtitle ) && (
				<RichText.Content
					tagName="p"
					style={ { color: subtitleColor } }
					value={ subtitle }
				/>
			) }
		</div>
	)
}

export const deprecatedSchema_1_5 = {
	title: {
		source: 'html',
		selector: 'h4',
		default: __( 'Title' ),
	},
	subtitle: {
		source: 'html',
		selector: 'p',
		default: __( 'Subtitle goes here' ),
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-image-box',
		attribute: 'data-url',
	},
	href: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'href',
	},
	titleColor: {
		type: 'string',
		default: '#ffffff',
	},
	subtitleColor: {
		type: 'string',
		default: '#ffffff',
	},
	overlayColor: {
		type: 'string',
		default: '#42b078',
	},
	id: {
		type: 'number',
	},
	width: {
		type: 'number',
		default: '400',
	},
	height: {
		type: 'number',
		default: '400',
	},
	verticalAlign: {
		type: 'string',
		default: 'center',
	},
	horizontalAlign: {
		type: 'string',
		default: 'center',
	},
	full: {
		type: 'boolean',
		default: false,
	},
}

export const deprecatedSchema_1_1_2 = {
	title: {
		type: 'array',
		source: 'children',
		selector: 'h4',
		default: __( 'Title' ),
	},
	subtitle: {
		type: 'array',
		source: 'children',
		selector: 'p',
		default: __( 'Subtitle goes here' ),
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-image-box',
		attribute: 'data-url',
	},
	titleColor: {
		type: 'string',
		default: '#ffffff',
	},
	subtitleColor: {
		type: 'string',
		default: '#ffffff',
	},
	overlayColor: {
		type: 'string',
		default: '#42b078',
	},
	id: {
		type: 'number',
	},
	width: {
		type: 'number',
		default: '400',
	},
	height: {
		type: 'number',
		default: '400',
	},
	verticalAlign: {
		type: 'string',
		default: 'center',
	},
	horizontalAlign: {
		type: 'string',
		default: 'center',
	},
	full: {
		type: 'boolean',
		default: false,
	},
}

export const deprecatedSave_1_1_2 = props => {
	const {
		url,
		title,
		titleColor,
		subtitle,
		subtitleColor,
		overlayColor,
		height,
		width,
		verticalAlign,
		horizontalAlign,
		full,
	} = props.attributes

	const imageClass = url ? 'has-image' : ''

	const fullWidth = full ? 'full-width' : ''

	const displayNone = ( ! title.length && ! subtitle.length ) ? 'has-no-content' : 'has-content'

	return (
		<div className={ `ugb-image-box ${ imageClass } ${ displayNone } ${ fullWidth }` }
			data-url={ url }
			style={ {
				width: width + 'px',
				height: height + 'px',
				backgroundImage: `url(${ url })`,
				alignItems: horizontalAlign,
				justifyContent: verticalAlign,
			} }
		>
			{ /* eslint-disable-next-line */ }
			<a href="#" style={ { backgroundColor: overlayColor } } />
			{ ! RichText.isEmpty( title ) && (
				<RichText.Content
					tagName="h4"
					style={ { color: titleColor } }
					value={ title }
				/>
			) }
			{ ! RichText.isEmpty( subtitle ) && (
				<RichText.Content
					tagName="p"
					style={ { color: subtitleColor } }
					value={ subtitle }
				/>
			) }
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			const className = ( attributes.className || '' ).replace( /align\w+/, '' ).replace( /\s+/, ' ' ).trim()
			return {
				...attributes,
				design: 'basic',
				borderRadius: 12,
				shadow: 3,
				className: className ? className : undefined,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
				newTab1: false,
				newTab2: false,
				newTab3: false,
				newTab4: false,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_5,
		save: deprecatedSave_1_5,
		migrate: attributes => {
			return omit( {
				...attributes,
				columns: 1,
				horizontalAlign: attributes.horizontalAlign === 'flex-end' ? 'right' :
					attributes.horizontalAlign === 'flex-start' ? 'left' :
						attributes.horizontalAlign,
				align: attributes.full ? 'wide' : '',
				title1: attributes.title,
				description1: attributes.subtitle,
				link1: attributes.href,
				imageURL1: attributes.url,
				imageID1: attributes.id,
			}, [
				'full', 'title', 'subtitle', 'href', 'url', 'id',
			] )
		},
	},
	{
		attributes: deprecatedSchema_1_1_2,
		save: deprecatedSave_1_1_2,
	},
]

export default deprecated
