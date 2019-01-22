import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/editor'

const edit = props => {
	const {
		setAttributes,
		className,
		isSelected,
	} = props

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
		<Fragment>
			<div className={ mainClasses }>
				{ /* eslint-disable-next-line jsx-a11y/label-has-for */ }
				{ isSelected && <label className="ugb-expand__label">{ __( 'Less text' ) }</label> }
				<RichText
					multiline="p"
					value={ text }
					onChange={ text => setAttributes( { text } ) }
					className="ugb-expand__less-text"
					placeholder={ __( 'Some short text that can be expanded to show more details.' ) }
					keepPlaceholderOnFocus
				/>
				<a>{ /* eslint-disable-line */ /* Workaround to get around RichText not allowing inlines. */ }
					<RichText
						tagName="div"
						value={ moreLabel }
						onChange={ text => setAttributes( { moreLabel: text } ) }
						formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
						className="ugb-expand__more-toggle-text"
						placeholder={ __( 'Show more' ) }
						keepPlaceholderOnFocus
					/>
				</a>
				{ /* eslint-disable-next-line jsx-a11y/label-has-for */ }
				{ isSelected && <label className="ugb-expand__label">{ __( 'More text' ) }</label> }
				{
					isSelected &&
					<RichText
						multiline="p"
						value={ moreText }
						onChange={ text => setAttributes( { moreText: text } ) }
						className="ugb-expand__more-text"
						placeholder={ `${ __( 'Some short text that can be expanded to show more details.' ) } ${ descriptionPlaceholder( 'medium' ) }` }
						keepPlaceholderOnFocus
					/>
				}
				{ isSelected &&
					<a>{ /* eslint-disable-line */ /* Workaround to get around RichText not allowing inlines. */ }
						<RichText
							tagName="div"
							value={ lessLabel }
							onChange={ text => setAttributes( { lessLabel: text } ) }
							formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
							className="ugb-expand__less-toggle-text"
							placeholder={ __( 'Show less' ) }
							keepPlaceholderOnFocus
						/>
					</a>
				}
			</div>
		</Fragment>
	)
}

export default edit
