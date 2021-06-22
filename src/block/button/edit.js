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
	getTypographyClasses,
	BlockDiv,
	Advanced, CustomCSS,
	Responsive,
	Linking,
	Button,
	Typography,
	Icon,
	BlockStyle,
} from '~stackable/block-components'
import {
	useBlockHoverClass,
} from '~stackable/hooks'

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
import { blockStyles } from './block-styles'

const Edit = props => {
	const {
		className, isHovered, setAttributes,
	} = props

	const [ typographyWrapperClass, typographyInnerClasses ] = getTypographyClasses( props.attributes )

	const blockHoverClass = useBlockHoverClass()
	const buttonClassNames = classnames( [
		'stk-button__button',
	] )

	const blockClassNames = classnames( [
		className,
		'stk-button',
		blockHoverClass,
		typographyWrapperClass,
	] )

	const typographyInnerClassNames = classnames( [
		typographyInnerClasses,
		'stk-button__inner-text',
	] )

	return (
		<Fragment>

			<InspectorTabs />
			<BlockDiv.InspectorControls />

			<BlockStyle.InspectorControls styles={ blockStyles } />
			<Typography.InspectorControls
				enableTextTag={ false }
				disableAlign={ true }
				withToggle={ true }
			/>
			<Button.InspectorControls />
			<Icon.InspectorControls
				enableGradient={ false }
				enableShape={ false }
				enableBackgroundShape={ false }
			/>

			<Advanced.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-button" />
			<Responsive.InspectorControls />

			<ButtonStyles version={ VERSION } />

			<Linking show={ isHovered } />
			<BlockDiv className={ blockClassNames }>
				<Button
					className={ buttonClassNames }
					enableLinearGradient={ false }
				>
					<Icon />
					{ props.attributes.showText && (
						<RichText
							tagName="span"
							className={ typographyInnerClassNames }
							placeholder={ __( 'Button text', i18n ) }
							withoutInteractiveFormatting={ true }
							keepPlaceholderOnFocus
							value={ props.attributes.text }
							onChange={ value => setAttributes( { text: value } ) }
						/>
					) }
				</Button>
			</BlockDiv>
		</Fragment>
	)
}

export default compose(
	withIsHovered
)( Edit )
