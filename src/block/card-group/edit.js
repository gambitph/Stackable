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
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	InnerBlocks,
} from '@wordpress/block-editor'
import { Fragment, useEffect } from '@wordpress/element'
import {
	BlockDiv, MarginBottom, Style,
} from '~stackable/block-components'
import { useBlockContext } from '~stackable/hooks'

const Edit = props => {
	const {
		className,
		setAttributes,
	} = props
	const {
		hasBackground,
	} = props.attributes

	const { hasInnerBlocks, numInnerBlocks } = useBlockContext()

	const blockClassNames = classnames( [
		className,
		'stk-card-group',
		'stk-row',
	], {
		[ `stk-columns-${ numInnerBlocks }` ]: hasInnerBlocks,
	} )
	useEffect( () => {
		props.attributes.numInnerBlocks = numInnerBlocks
	}, [ numInnerBlocks ] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		'stk-block-content',
	] )

	return <Fragment>

		<InspectorTabs />

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

		<BlockDiv className={ blockClassNames }>
			<Style styleFunc={ createStyles( VERSION ) } />
			<div className={ contentClassNames }>
				<InnerBlocks
					orientation="horizontal"
					allowedBlocks={ [ 'stackable/card' ] }
				/>
			</div>
			<MarginBottom />
		</BlockDiv>
	</Fragment>
}

export default Edit
