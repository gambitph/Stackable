const Sidebar = props => {
	const {
		onSelect,
		options,
		value,
	} = props

	return (
		<ul className="ugb-sidebar">

			{ props.title && (
				<h3 className="ugb-sidebar__title">{ props.title }</h3>
			) }

			{ ( options || [] ).map( option => (
				<li key={ option.value }>
					<div
						className={ value === option.value ? 'is-active' : undefined }
						role="button"
						tabIndex={ 0 }
						aria-pressed={ value === option.value ? 'true' : 'false' }
						onMouseDown={ () => onSelect( option.value ) }
						onKeyPress={ e => {
							if ( e.keyCode === 13 ) {
								this.click()
							}
						} }
					>
						{ option.label }
					</div>
				</li>
			) ) }

		</ul>
	)
}

Sidebar.defaultProps = {
	title: '',
	options: [],
	onSelect: () => {},
	value: '',
}

export default Sidebar
