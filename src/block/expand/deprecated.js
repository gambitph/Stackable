/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'

const deprecatedSchema_1_17_3 = {
	text: {
		source: 'html',
		selector: '.ugb-expand__less-text',
		multiline: 'p',
		default: '',
	},
	moreText: {
		source: 'html',
		selector: '.ugb-expand__more-text',
		multiline: 'p',
		default: '',
	},
	moreLabel: {
		source: 'html',
		selector: '.ugb-expand__more-toggle-text',
		default: __( 'Show more', i18n ),
	},
	lessLabel: {
		source: 'html',
		selector: '.ugb-expand__less-toggle-text',
		default: __( 'Show less', i18n ),
	},

	// Custom CSS attributes.
	customCSSUniqueID: {
		type: 'string',
		default: '',
	},
	customCSS: {
		type: 'string',
		default: '',
	},
	customCSSCompiled: {
		type: 'string',
		default: '',
	},
}

const deprecatedSave_1_17_3 = props => {
	const { className } = props
	const {
		text,
		moreLabel,
		moreText,
		lessLabel,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-expand',
	], applyFilters( 'stackable.expand.mainclasses_1_17_3', {}, design, props ) )

	return (
		<div className={ mainClasses } aria-expanded="false">
			{ applyFilters( 'stackable.expand.save.output.before_1_17_3', null, design, props ) }
			<div className="ugb-expand__less-text">
				{ ! RichText.isEmpty( text ) && (
					<RichText.Content
						multiline="p"
						value={ text }
					/>
				) }
			</div>
			<div className="ugb-expand__more-text" style={ { display: 'none' } }>
				{ ! RichText.isEmpty( moreText ) && (
					<RichText.Content
						multiline="p"
						value={ moreText }
					/>
				) }
			</div>
			{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
			<a className="ugb-expand__toggle" href="#">
				<RichText.Content
					className="ugb-expand__more-toggle-text"
					tagName="span"
					value={ moreLabel }
				/>
				<RichText.Content
					className="ugb-expand__less-toggle-text"
					tagName="span"
					value={ lessLabel }
					style={ { display: 'none' } }
				/>
			</a>
			{ applyFilters( 'stackable.expand.save.output.after_1_17_3', null, design, props ) }
		</div>
	)
}

const deprecatedSchema_1_10 = {
	text: {
		source: 'html',
		selector: '.ugb-expand-less-text',
		multiline: 'p',
		default: '',
	},
	moreText: {
		source: 'html',
		selector: '.ugb-expand-more-text',
		multiline: 'p',
		default: '',
	},
	moreLabel: {
		source: 'html',
		selector: '.ugb-expand-more',
		default: 'Show more',
	},
	lessLabel: {
		source: 'html',
		selector: '.ugb-expand-less',
		default: 'Show less',
	},
}

const deprecatedSave_1_10 = props => {
	const { className } = props
	const {
		text,
		moreLabel,
		moreText,
		lessLabel,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-expand',
	] )

	return (
		<div className={ mainClasses }>
			<div className="ugb-expand-less-text">
				{ ! RichText.isEmpty( text ) && (
					<RichText.Content
						multiline="p"
						value={ text }
					/>
				) }
			</div>
			<div className="ugb-expand-more-text" style={ { display: 'none' } }>
				{ ! RichText.isEmpty( moreText ) && (
					<RichText.Content
						multiline="p"
						value={ moreText }
					/>
				) }
			</div>
			{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
			<a className="ugb-expand-button" href="#">
				<RichText.Content
					className="ugb-expand-more"
					tagName="span"
					value={ moreLabel }
				/>
				<RichText.Content
					className="ugb-expand-less"
					tagName="span"
					value={ lessLabel }
					style={ { display: 'none' } }
				/>
			</a>
		</div>
	)
}

export const deprecatedSchema_1_3 = {
	text: {
		source: 'html',
		selector: '.ugb-expand-less-text',
		multiline: 'p',
		default: '',
	},
	moreText: {
		source: 'html',
		selector: '.ugb-expand-more-text',
		multiline: 'p',
		default: '',
	},

	// Single lines.
	moreLabel: {
		source: 'html',
		selector: '.ugb-expand-more',
		default: 'Show more',
	},
	lessLabel: {
		source: 'html',
		selector: '.ugb-expand-less',
		default: 'Show less',
	},
}

export const deprecatedSave_1_3 = props => {
	const {
		text,
		moreLabel,
		moreText,
		lessLabel,
	} = props.attributes

	return (
		<div>
			<div className="ugb-expand-less-text">
				{ ! RichText.isEmpty( text ) && (
					<RichText.Content
						multiline="p"
						value={ text }
					/>
				) }
			</div>
			<div className="ugb-expand-more-text" style={ { display: 'none' } }>
				{ ! RichText.isEmpty( moreText ) && (
					<RichText.Content
						multiline="p"
						value={ moreText }
					/>
				) }
			</div>
			{ /* eslint-disable-next-line */ }
			<a className="ugb-expand-button" href="#">
				<RichText.Content
					className="ugb-expand-more"
					tagName="span"
					value={ moreLabel }
				/>
				<RichText.Content
					className="ugb-expand-less"
					tagName="span"
					value={ lessLabel }
					style={ { display: 'none' } }
				/>
			</a>
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_17_3,
		save: deprecatedSave_1_17_3,
		migrate: attributes => {
			return {
				...attributes,
				showTitle: false,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
	},
	{
		attributes: deprecatedSchema_1_3,
		save: deprecatedSave_1_3,
	},
]

export default deprecated
