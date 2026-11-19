/**
 * External dependencies
 */
import classnames from 'classnames'
import { getPropsWithDefaults } from '../../util/props'

const InspectorPanelControls = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, INSPECTOR_PANEL_CONTROLS_DEFAULT_PROPS )
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

const INSPECTOR_PANEL_CONTROLS_DEFAULT_PROPS = {
	tab: 'layout',
}

export default InspectorPanelControls
