import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import { semverCompare } from '~stackable/util'
import {
	BlockDiv, CustomCSS, Button, Typography,
	deprecateBlockBackgroundColorOpacity, deprecateButtonGradientColor,
	deprecateContainerBackgroundColorOpacity, deprecateShadowColor,
	deprecateContainerShadowColor, deprecateBlockShadowColor,
} from '~stackable/block-components'
import { addFilter } from '@wordpress/hooks'
import { useBlockProps } from '@wordpress/block-editor'

// If button style is link, change BlockDiv tag from <div> to <p> to inherit theme link styles.
addFilter( 'stackable.button.save.blockDiv.content', 'stackable/inheritThemeLinkStyles', ( output, props, propsToPass, blockClassNames, customAttributes, typographyInnerClassNames ) => {
	if ( semverCompare( props.version, '<=', '3.15.3' ) ) {
		return (
			<BlockDiv.Content
				{ ...useBlockProps.save( { className: blockClassNames } ) }
				attributes={ props.attributes }
				applyCustomAttributes={ false }
				version={ props.version }
			>
				{ props.attributes.generatedCss && <style>{ props.attributes.generatedCss }</style> }
				<CustomCSS.Content attributes={ props.attributes } />
				<Button.Content
					{ ...propsToPass }
					attributes={ props.attributes }
					buttonProps={ {
						id: props.attributes.anchorId || undefined,
						...customAttributes,
					} }
				>
					<Typography.Content
						attributes={ props.attributes }
						tagName="span"
						className={ typographyInnerClassNames }
					/>
				</Button.Content>
			</BlockDiv.Content>
		)
	}
	return output
} )

const deprecated = [
	{
		// Support the new shadow color.
		attributes: attributes( '3.12.11' ),
		save: withVersion( '3.12.11' )( Save ),
		isEligible: attributes => {
			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )
			const hasButtonShadow = deprecateShadowColor.isEligible( 'button%s' )( attributes )

			return hasBlockShadow || hasContainerShadow || hasButtonShadow
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'button%s' )( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateButtonGradientColor.migrate( 'button%s' )( newAttributes )

			return newAttributes
		},
	},
	{
		// Support the new combined opacity and color.
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			const hasContainerOpacity = deprecateContainerBackgroundColorOpacity.isEligible( attributes )
			const hasBlockOpacity = deprecateBlockBackgroundColorOpacity.isEligible( attributes )
			const hasButtonGradient = deprecateButtonGradientColor.isEligible( 'button%s' )( attributes )

			return hasContainerOpacity || hasBlockOpacity || hasButtonGradient
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateButtonGradientColor.migrate( 'button%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'button%s' )( newAttributes )

			return newAttributes
		},
	},
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		migrate: attributes => {
			let newAttributes = deprecateContainerBackgroundColorOpacity.migrate( attributes )
			newAttributes = deprecateButtonGradientColor.migrate( 'button%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'button%s' )( newAttributes )
			return deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		},
	},
]
export default deprecated
