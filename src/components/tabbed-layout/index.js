/**
 * WordPress dependencies
 */
import {
	ButtonGroup, Button,
} from '@wordpress/components'

const TabbedLayout = props => {
	return (
		<ButtonGroup className="stk-tabbed-layout">
			{ props.options.map( ( { label, value } ) =>
				<Button
					isSmall={ true }
					key={ value }
					onClick={ () => props.onChange( value ) }
					isPressed={ value === props.value }
				>
					{ label }
				</Button>
			) }
		</ButtonGroup>
	)
}

TabbedLayout.defaultProps = {
	options: [],
	onChange: () => {},
	value: '',
}

export default TabbedLayout
