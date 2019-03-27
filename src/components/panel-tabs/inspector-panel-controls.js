import classnames from 'classnames'
import { InspectorControls } from '@wordpress/editor'

const InspectorPanelControls = props => {
	const {
		tab = 'layout',
	} = props

	const mainClasses = classnames( [
		'ugb-inspector-panel-controls',
		`ugb-panel-${ tab }`,
	] )

	return (
		<InspectorControls>
			<div className={ mainClasses }>
				{ props.children }
			</div>
		</InspectorControls>
	)
}

export default InspectorPanelControls
