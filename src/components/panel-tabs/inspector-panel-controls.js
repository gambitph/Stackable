/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { InspectorControls } from '@wordpress/block-editor'

const InspectorPanelControls = props => {
	const mainClasses = classnames( [
		'ugb-inspector-panel-controls',
		`ugb-panel-${ props.tab }`,
	] )

	return (
		<InspectorControls>
			<div className={ mainClasses }>
				{ props.children }
			</div>
		</InspectorControls>
	)
}

InspectorPanelControls.defaultProps = {
	tab: 'layout',
}

export default InspectorPanelControls
