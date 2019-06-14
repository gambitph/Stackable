import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { RichText } from '@wordpress/block-editor'

const save = props => {
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
	], applyFilters( 'stackable.expand.mainclasses', {}, design, props ) )

	return (
		<div className={ mainClasses } aria-expanded="false">
			{ applyFilters( 'stackable.expand.save.output.before', null, design, props ) }
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
			{ applyFilters( 'stackable.expand.save.output.after', null, design, props ) }
		</div>
	)
}

export default save
