/**
 * Internal dependencies
 */
import { TextStyles } from './style'

/**
 * External dependencies
k*/
import {
	BlockDiv,
	CustomCSS,
	Responsive,
	Advanced,
	Typography,
	getTypographyClasses,
	getAlignmentClasses,
	Alignment,
	MarginBottom,
	CustomAttributes,
} from '~stackable/block-components'
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import {
	InspectorTabs, InspectorStyleControls, PanelAdvancedSettings, AdvancedRangeControl,
} from '~stackable/components'
import { useBlockHoverClass } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { createBlock } from '@wordpress/blocks'
import { __ } from '@wordpress/i18n'

const Edit = props => {
	const {
		className,
		onReplace,
	} = props

	const blockHoverClass = useBlockHoverClass()
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-text',
		blockHoverClass,
	] )

	const textClassNames = classnames( [
		'stk-text__text',
		textClasses,
		blockAlignmentClass,
	] )

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					initialOpen={ true }
					id="general"
				>
					<AdvancedRangeControl
						label={ __( 'Columns', i18n ) }
						allowReset={ true }
						attribute="columns"
						min={ 1 }
						max={ 4 }
						step={ 1 }
						placeholder="1"
						responsive="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						allowRest={ true }
						attribute="columnGap"
						min={ 0 }
						max={ 100 }
						responsive="all"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<Typography.InspectorControls
				hasTextTag={ false }
				isMultiline={ true }
				initialOpen={ false }
			/>
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-text" />
			<Responsive.InspectorControls />

			<TextStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-text__text" />

			<BlockDiv className={ blockClassNames }>
				<Typography
					tagName="p"
					keepPlaceholderOnFocus
					className={ textClassNames }
					onReplace={ onReplace }
					onSplit={ value => createBlock(
						'stackable/text',
						{ ...props.attributes, text: value }
					) }
				/>
				<MarginBottom />
			</BlockDiv>
		</Fragment>
	)
}

export default Edit
