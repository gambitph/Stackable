import {
	InnerBlocks,
} from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import {
	InspectorTabs,
	PanelAdvancedSettings,
	InspectorSectionControls,
	ResizableBottomMargin,
} from '~stackable/components'
import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import {
	useUniqueId,
} from '~stackable/hooks'

const Edit = props => {
	const {
		className,
		setAttributes,
	} = props
	const {
		hasBackground,
	} = props.attributes

	useUniqueId( props )

	const blockClassNames = classnames( [
		className,
		'stk-card-group',
		'stk-block',
		'stk-row',
		`stk-${ props.attributes.uniqueId }`,
	], {
		'stk-block-background': hasBackground,
	} )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		'stk-block-content',
	] )

	return <Fragment>

		<InspectorTabs
			{ ...props }
		/>

		<InspectorSectionControls>
			<PanelAdvancedSettings
				title={ __( 'Background', i18n ) }
				id="background"
				checked={ hasBackground }
				onChange={ hasBackground => setAttributes( { hasBackground } ) }
				// toggleOnSetAttributes={ [
				// 	'arrowSize',
				// 	'arrowColor',
				// ] }
				toggleAttributeName="hasBackground"
			>
			</PanelAdvancedSettings>
		</InspectorSectionControls>

		<div className={ blockClassNames } data-id={ props.attributes.uniqueId }>
			<style>
				{ props.attributes.blockMarginBottom !== '' ? `.stk-${ props.attributes.uniqueId } { margin-bottom: ${ props.attributes.blockMarginBottom }px; }` : '' }
			</style>
			<div className={ contentClassNames }>
				<InnerBlocks
					orientation="horizontal"
					allowedBlocks={ [ 'stackable/card' ] }
				/>
			</div>
			<ResizableBottomMargin
				previewSelector={ `.stk-${ props.attributes.uniqueId }` }
				value={ props.attributes.blockMarginBottom }
				onChange={ value => setAttributes( { blockMarginBottom: value } ) }
			/>
		</div>
	</Fragment>
}

export default Edit
