/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * External dependencies
 */
import { i18n, version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	InspectorTabs,
	PanelAdvancedSettings,
	InspectorSectionControls,
	ResizableBottomMargin,
	Style,
} from '~stackable/components'
import {
	useUniqueId,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	InnerBlocks,
} from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { getMarginBottomProps, useMarginBottom } from '~stackable/helpers'

const Edit = props => {
	const {
		className,
		setAttributes,
	} = props
	const {
		hasBackground,
	} = props.attributes

	useUniqueId( props )
	const marginBottomProps = getMarginBottomProps( props.attributes )
	const { setMarginBottom } = useMarginBottom()

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
			<Style
				blockUniqueClassName={ `stk-${ props.attributes.uniqueId }` }
				blockMainClassName={ 'stk-card-group' }
				styleFunc={ createStyles( VERSION ) }
				blockProps={ props }
				editorMode={ true }
			/>
			<div className={ contentClassNames }>
				<InnerBlocks
					orientation="horizontal"
					allowedBlocks={ [ 'stackable/card' ] }
				/>
			</div>
			<ResizableBottomMargin
				{ ...marginBottomProps }
				{ ...setMarginBottom }
			/>
		</div>
	</Fragment>
}

export default Edit
