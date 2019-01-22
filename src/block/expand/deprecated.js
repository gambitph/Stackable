import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { RichText } from '@wordpress/editor'

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
		default: __( 'Show more' ),
	},
	lessLabel: {
		source: 'html',
		selector: '.ugb-expand-less',
		default: __( 'Show less' ),
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
		default: __( 'Show more' ),
	},
	lessLabel: {
		source: 'html',
		selector: '.ugb-expand-less',
		default: __( 'Show less' ),
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
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
	},
	{
		attributes: deprecatedSchema_1_3,
		save: deprecatedSave_1_3,
	},
]

export default deprecated
