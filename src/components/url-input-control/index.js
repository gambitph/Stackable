import { Dashicon, IconButton, ToggleControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Component } from '@wordpress/element'
import { i18n } from 'stackable'
import { URLInput } from '@wordpress/block-editor'

const ariaClosed = __( 'Show more tools & options', i18n )
const ariaOpen = __( 'Hide more tools & options', i18n )

class URLInputControl extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			isOpen: false,
		}
		this.handleToggle = this.handleToggle.bind( this )
	}

	handleToggle() {
		this.setState( { isOpen: ! this.state.isOpen } )
	}

	render() {
		const {
			value,
			newTab,
			onChange,
			onChangeNewTab,
		} = this.props
		return (
			<form
				className="blocks-button__inline-link ugb-url-input-control"
				onSubmit={ event => event.preventDefault() }>
				<div className="ugb-url-input-control__wrapper">
					<Dashicon className="ugb-url-input-control__icon" icon="admin-links" />
					<URLInput
						className="ugb-url-input-control__input"
						value={ value }
						onChange={ onChange }
						autoFocus={ false } // eslint-disable-line
					/>
					{ onChangeNewTab &&
						<IconButton
							className="ugb-url-input-control__more-button"
							icon="ellipsis"
							label={ this.state.isOpen ? ariaOpen : ariaClosed }
							onClick={ this.handleToggle }
							aria-expanded={ this.state.isOpen }
						/>
					}
				</div>
				{ onChangeNewTab && this.state.isOpen &&
					<div className="ugb-url-input-control__new-tab">
						<ToggleControl
							label={ __( 'Open in New Tab', i18n ) }
							checked={ newTab }
							onChange={ onChangeNewTab }
						/>
					</div>
				}
			</form>
		)
	}
}

export default URLInputControl
