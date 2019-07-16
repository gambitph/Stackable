import { i18n, showProNotice } from 'stackable'
import { InspectorControls, RichText } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { Fragment } from '@wordpress/element'
import { PanelBody } from '@wordpress/components'
import { ProControl } from '@stackable/components'

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
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-expand',
	], applyFilters( 'stackable.expand.mainclasses', {}, design, props ) )

	return (
		<Fragment>
			<InspectorControls>
				{ showProNotice &&
					<PanelBody
						initialOpen={ false }
						title={ __( 'Custom CSS', i18n ) }
					>
						<ProControl
							title={ __( 'Say Hello to Custom CSS 👋', i18n ) }
							description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium', i18n ) }
						/>
					</PanelBody>
				}
				{ applyFilters( 'stackable.expand.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses }>
				{ applyFilters( 'stackable.expand.edit.output.before', null, design, props ) }
				{ /* eslint-disable-next-line jsx-a11y/label-has-for */ }
				{ isSelected && <label className="ugb-expand__label">{ __( 'Less text', i18n ) }</label> }
				<RichText
					multiline="p"
					value={ text }
					onChange={ text => setAttributes( { text } ) }
					className="ugb-expand__less-text"
					placeholder={ __( 'Some short text that can be expanded to show more details.', i18n ) }
					keepPlaceholderOnFocus
				/>
				<a>{ /* eslint-disable-line */ /* Workaround to get around RichText not allowing inlines. */ }
					<RichText
						tagName="div"
						value={ moreLabel }
						onChange={ text => setAttributes( { moreLabel: text } ) }
						formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
						className="ugb-expand__more-toggle-text"
						placeholder={ __( 'Show more', i18n ) }
						keepPlaceholderOnFocus
					/>
				</a>
				{ /* eslint-disable-next-line jsx-a11y/label-has-for */ }
				{ isSelected && <label className="ugb-expand__label">{ __( 'More text', i18n ) }</label> }
				{
					isSelected &&
					<RichText
						multiline="p"
						value={ moreText }
						onChange={ text => setAttributes( { moreText: text } ) }
						className="ugb-expand__more-text"
						placeholder={ `${ __( 'Some short text that can be expanded to show more details.', i18n ) } ${ descriptionPlaceholder( 'medium' ) }` }
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
							placeholder={ __( 'Show less', i18n ) }
							keepPlaceholderOnFocus
						/>
					</a>
				}
				{ applyFilters( 'stackable.expand.edit.output.after', null, design, props ) }
			</div>
		</Fragment>
	)
}

export default edit
