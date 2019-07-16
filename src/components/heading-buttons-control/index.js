import { BaseControl, Button, ButtonGroup } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'

const tags = [
	{ tag: 'h1', label: __( 'H1', i18n ) },
	{ tag: 'h2', label: __( 'H2', i18n ) },
	{ tag: 'h3', label: __( 'H3', i18n ) },
	{ tag: 'h4', label: __( 'H4', i18n ) },
	{ tag: 'h5', label: __( 'H5', i18n ) },
	{ tag: 'h6', label: __( 'H6', i18n ) },
]

const HeadingButtonsControl = props => {
	const {
		label = 'Title Tag',
		value = tags[ 0 ].tag,
		onChange = () => {},
	} = props

	return (
		<BaseControl
			label={ label }
			className="ugb-heading-buttons-control"
		>
			<ButtonGroup aria-label={ label }>
				{ tags.map( ( { tag, label }, i ) => {
					return (
						<Button
							key={ i }
							isPrimary={ value === tag }
							isDefault={ value !== tag }
							onClick={ () => onChange( tag ) }
						>
							{ label }
						</Button>
					)
				} ) }
			</ButtonGroup>
		</BaseControl>
	)
}

export default HeadingButtonsControl
