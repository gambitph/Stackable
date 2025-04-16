import { i18n } from 'stackable'
import { Button } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

const NOOP = () => {}

const InspectorSubHeader = props => {
	const {
		onBack = NOOP,
		onTrash = NOOP,
		onReset = NOOP,
		onDuplicate = NOOP,
		title = '',
		showTrash = true,
		showReset = false,
		showDuplicate = false,
	} = props
	return (
		<div className="stk-inspector-sub-header">
			<Button
				icon="arrow-left-alt2"
				alt={ __( 'Back', i18n ) }
				onClick={ onBack }
			/>
			<h2 className="components-base-control__label">{ title }</h2>
			{ showDuplicate && (
				<Button
					className="stk-inspector-sub-header__duplicate"
					size="small"
					icon="admin-page"
					alt={ __( 'Duplicate', i18n ) }
					onClick={ onDuplicate }
				/>
			) }
			{ showTrash && (
				<Button
					className="stk-inspector-sub-header__trash"
					size="small"
					icon="trash"
					alt={ __( 'Delete', i18n ) }
					onClick={ onTrash }
				/>
			) }
			{ showReset && (
				<Button
					className="stk-inspector-sub-header__reset"
					size="small"
					icon="image-rotate"
					alt={ __( 'Reset', i18n ) }
					onClick={ onReset }
				/>
			) }
		</div>
	)
}

export default InspectorSubHeader
