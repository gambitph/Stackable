/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { AdvancedAutosuggestControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useState } from '@wordpress/element'
import { Button } from '@wordpress/components'

// TODO:
const StyleItem = props => {
	const [ isOver, setIsOver ] = useState( false )

	return (
		<div
			onMouseEnter={ () => setIsOver( true ) }
			onMouseLeave={ () => setIsOver( false ) }
		>
			{ props.label }
			{ isOver &&
				<Button
					// onClick={ this.handleOpen }
					// className="ugb-button-icon-control__edit"
					label={ __( 'Edit', i18n ) }
					// isDefault
					isTertiary
					icon="edit"
					// id={ `ugb-button-icon-control__edit-${ this.instanceId }` }
					// ref={ this.buttonRef }
				/>
			}
		</div>
	)
}

const GlobalStyleControl = props => {
	return (
		<AdvancedAutosuggestControl
			label={ __( 'Style', i18n ) }
			onChange={ props.onChangeStyle }
			value={ props.style }
			options={ [
				{ label: '100', value: '100' },
				{ label: '200', value: '200' },
				{ label: '300', value: '300' },
				{ label: '400', value: '400' },
				{ label: '500', value: '500' },
				{ label: '600', value: '600' },
				{ label: '700', value: '700' },
				{ label: '800', value: '800' },
				{ label: '900', value: '900' },
			] }
			renderOption={ option => <StyleItem { ...option } /> }
		/>
	)
}

export default GlobalStyleControl
