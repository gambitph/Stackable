/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION, i18n } from 'stackable'
import {
	InspectorTabs,
} from '~stackable/components'
import {
	withIsHovered,
} from '~stackable/higher-order'
import {
	Column,
	getColumnClasses,
	getTypographyClasses,
	BlockDiv,
	Advanced,
	CustomCSS,
	Responsive,
	Linking,
	Button,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { RichText } from '@wordpress/block-editor'

/**
 * Internal dependencies
 */
import { ButtonStyles } from './style'

const Edit = props => {
	const {
		className, isHovered, setAttributes,
	} = props

	const [ columnClass ] = getColumnClasses( props.attributes )

	const [ typographyWrapperClass, typographyInnerClasses ] = getTypographyClasses( props.attributes, { hoverAttrNameTemplate: 'hover%s' } )

	const buttonClassNames = classnames( [
		'stk-button__button',
		typographyWrapperClass,
	] )

	const blockClassNames = classnames( [
		className,
		'stk-button',
		columnClass,
	] )

	const typographyInnerClassNames = classnames( [
		typographyInnerClasses,
		'stk-button__inner-text',
	] )

	return (
		<Fragment>

			<InspectorTabs />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Button.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-button" />
			<Responsive.InspectorControls />

			<ButtonStyles version={ VERSION } />

			<Column showHandle={ isHovered }>
				<Linking show={ isHovered } />
				<BlockDiv className={ blockClassNames }>
					<Button
						className={ buttonClassNames }
					>
						<RichText
							tagName="span"
							className={ typographyInnerClassNames }
							placeholder={ __( 'Button text', i18n ) }
							withoutInteractiveFormatting={ true }
							keepPlaceholderOnFocus
							value={ props.attributes.text }
							onChange={ value => setAttributes( { text: value } ) }
						/>
					</Button>
				</BlockDiv>
			</Column>
		</Fragment>
	)
}

export default compose(
	withIsHovered
)( Edit )
