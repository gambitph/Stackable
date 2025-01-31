import AdminBaseSetting from '../admin-base-setting'
import Button from '../button'
import { ButtonGroup } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'

const AdminToolbarSetting = props => {
	return (
		<AdminBaseSetting
			{ ...props }
			showLabel={ false }
		>
			<div className="ugb-admin-toolbar-setting__wrapper">
				<h3>{ props.label }</h3>
				<a
					href={ props.demoLink }
					target="_blank"
					rel="noopener noreferrer"
					onClick={ ev => ev.stopPropagation() }
				>
					{ __( 'view demo', i18n ) }
				</a>
				<div className="ugb-admin-toolbar-setting__group-wrapper">
					<ButtonGroup
						children={
							props.controls.map( option => {
								const isSelected = props.value ? props.value === option.value : props.placeholder === option.value
								const tabindex = isSelected ? '0' : '-1'
								// If no available states provided, all states are allowed.
								const isAvailable = props.availableStates ? props.availableStates.includes( option.value ) : true

								// Do not show the button if not available.
								if ( ! isAvailable ) {
									return null
								}

								return <Button
									style={ option.selectedColor && isSelected ? { color: option.selectedColor } : {} }
									isPrimary={ ! option.selectedColor && isSelected }
									key={ option.value }
									label={ option.title || props.label }
									tabIndex={ tabindex }
									aria-pressed={ isSelected }
									onClick={ () => {
										if ( option.value === props.value ) {
											return
										}
										props.onChange( option.value )
									} }
									onKeyDown={ e => {
										const el = e.target
										if ( el ) {
											// On right, select the next value or loop to first.
											if ( e.keyCode === 39 ) {
												const nextEl = el.nextElementSibling || el.parentElement.firstElementChild
												nextEl.focus()
												nextEl.click()

											// Trigger click on the previous option or loop to last.
											} else if ( e.keyCode === 37 ) {
												const prevEl = el.previousElementSibling || el.parentElement.lastElementChild
												prevEl.focus()
												prevEl.click()
											}
										}
									} }
									children={ <span className="ugb-admin-toolbar-setting__option">{ option.title }</span> }
								/>
							} )
						}
						className="ugb-admin-toolbar-setting"
					/>
				</div>
			</div>
		</AdminBaseSetting>
	)
}

AdminToolbarSetting.defaultProps = {
	controls: [],
	label: '',
	value: '',
	onChange: () => {},
}

export default AdminToolbarSetting
