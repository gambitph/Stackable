/**
 * External dependencies
 */
import classnames from 'classnames'

const InspectorPanelControls = props => {
	const mainClasses = classnames( [
		'ugb-inspector-panel-controls',
		`ugb-panel-${ props.tab }`,
	] )

	return (
		<div className={ mainClasses }>
			{ props.children }
		</div>
	)
}

InspectorPanelControls.defaultProps = {
	tab: 'layout',
}

export default InspectorPanelControls
