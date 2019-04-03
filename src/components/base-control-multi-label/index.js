import { Component } from '@wordpress/element'
import { ResponsiveToggle } from '@stackable/components'

class BaseControlMultiLabel extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			unit: this.props.unit || 'px',
		}
	}

	onChangeUnit( value ) {
		this.props.onChangeUnit( value )
		this.setState( { unit: value } )
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.unit !== prevProps.unit ) {
			this.setState( { unit: this.props.unit } )
		}
	}

	render() {
		return (
			<div className="ugb-base-control-multi-label">
				<div className="ugb-base-control-multi-label__label components-base-control__label">{ this.props.label }</div>
				<ResponsiveToggle
					screens={ this.props.screens }
					onChangeScreen={ this.props.onChangeScreen }
				/>
				<div className="ugb-base-control-multi-label__units">
					{ this.props.units.length > 1 &&
						this.props.units.map( ( unit, i ) => {
							return (
								<button
									key={ i }
									className={ this.state.unit === unit ? 'is-active' : '' }
									onClick={ () => this.onChangeUnit( unit ) }
								>{ unit }</button>
							)
						} )
					}
				</div>
			</div>
		)
	}
}

BaseControlMultiLabel.defaultProps = {
	label: '',
	units: [ 'px' ],
	unit: 'px',
	onChangeUnit: () => {},
	screens: [ 'desktop' ],
	onChangeScreen: () => {},
}

export default BaseControlMultiLabel
