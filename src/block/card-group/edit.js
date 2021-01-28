import {
	InnerBlocks,
} from '@wordpress/block-editor'
import { Fragment, useState } from '@wordpress/element'
import {
	BlockContainer,
	InspectorTabs,
	InspectorStyleControls,
	InspectorControls,
	PanelAdvancedSettings,
	InspectorSectionControls,
} from '~stackable/components'
import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import {
	useUniqueId,
	useBlockContext,
} from '~stackable/hooks'

const edit = props => {
	const {
		setAttributes,
	} = props
	const {
		hasBackground,
	} = props.attributes

	useUniqueId( props )

	console.log( 'props.attributes.columnWidths', props.attributes.columnWidths )
	const columns = ( props.attributes.columnWidths || [] ).map( ( width, i ) => {
		return `[data-block="${ props.clientId }"] .block-editor-block-list__layout > [data-type^="stackable/"]:nth-child(${ i + 1 }) {
			flex: 1 1 ${ width }% !important;
			max-width: ${ width }% !important;
		}`
	} )

	const classNames = classnames( [
		'stk-card-group',
		'stk-block',
		'stk-row',
		`stk-${ props.attributes.uniqueId }`,
	], {
		'stk-block-background': hasBackground,
	} )

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

		<div className={ classNames } data-id={ props.attributes.uniqueId }>
			{ columns.length ? <style>{ columns.join( '' ) }</style> : null }
			<div className="stk-card-group-inner">
				<InnerBlocks
					orientation="horizontal"
					allowedBlocks={ [ 'stackable/card' ] }
				/>
			</div>
		</div>
	</Fragment>
}

export default edit
