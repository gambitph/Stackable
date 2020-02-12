import { useState } from '@wordpress/element'
import { BaseControl, ColorPalette } from '@wordpress/components'

const COLORS = {
	red: {
		color: '#f44336',
		name: 'red',
	},
	green: {
		color: '#4caf50',
		name: 'green',
	},
	yellow: {
		color: '#ffeb3b',
		name: 'yellow',
	},
	blue: {
		color: '#2196f3',
		name: 'blue',
	},
	pink: {
		color: '#e91e63',
		name: 'pink',
	},
	gray: {
		color: '#9e9e9e',
		name: 'gray',
	},
	brown: {
		color: '#795548',
		name: 'brown',
	},
	orange: {
		color: '#ff9800',
		name: 'orange',
	},
	purple: {
		color: '#9c27b0',
		name: 'purple',
	},
	black: {
		color: '#212121',
		name: 'black',
	},
	white: {
		color: '#fff',
		name: 'white',
	},
}

const ColorList = props => {
	const [ selectedColors, setSelectedColors ] = useState( [] )

	return (
		<BaseControl className="ugb-modal-design-library__color-list" id="design-colors">
			<div className="ugb-modal-design-library__color-list-wrapper">
				{ Object.keys( props.colors ).map( id => {
					const { color, name } = COLORS[ id ]
					return <ColorPalette
						key={ id }
						value={ selectedColors.includes( name ) ? color : '' } // Mimic active state.
						colors={ [ { color, name } ] }
						onChange={ color => {
							let newColors
							if ( ! color ) {
								newColors = selectedColors.filter( n => n !== name )
							} else {
								newColors = [ ...selectedColors, name ]
							}
							setSelectedColors( newColors )
							props.onSelect( newColors )
						} }
						clearable={ false }
						disableCustomColors={ true }
					/>
				} ) }
			</div>
		</BaseControl>
	)
}

ColorList.defaultProps = {
	onSelect: () => {},
	colors: COLORS,
}

export default ColorList
