/**
 * Internal dependencies
 */
import { IconLabelStyles } from './style'

/**
 * External dependencies
 */
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import {
	GroupPlaceholder,
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedRangeControl,
} from '~stackable/components'
import {
	BlockDiv,
	MarginBottom,
	getRowClasses,
	Alignment,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
} from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { useBlockContext } from '~stackable/hooks'
import { __ } from '@wordpress/i18n'

const TEMPLATE = [
	[ 'stackable/icon', { contentAlign: 'left' } ],
	[ 'stackable/heading', {
		text: __( 'Icon Label' ), hasP: true, textTag: 'h4',
	} ],
]

const Edit = props => {
	const {
		className, attributes,
	} = props

	const rowClass = getRowClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )
	const { hasInnerBlocks } = useBlockContext()

	const blockClassNames = classnames( [
		className,
		'stk-block-icon-label',
		rowClass,
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	] )

	return (
		<Fragment>
			<InspectorTabs />

			<Alignment.InspectorControls hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					id="general"
					initialOpen={ true }
				>
					<AdvancedRangeControl
						label={ __( 'Icon Gap' ) }
						attribute="iconGap"
						responsive="all"
						min={ 0 }
						sliderMax={ 300 }
						placeholder="64"
					/>
				</PanelAdvancedSettings>

			</InspectorStyleControls>
			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-icon-label" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<IconLabelStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-icon-label" />

			<BlockDiv className={ blockClassNames }>
				{ ! hasInnerBlocks && <GroupPlaceholder /> }
				<Fragment>
					<div className={ contentClassNames }>
						<InnerBlocks
							orientation="horizontal"
							template={ TEMPLATE }
							templateLock={ true }
							templateInsertUpdatesSelection={ true }
						/>
					</div>
				</Fragment>
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}
export default Edit
