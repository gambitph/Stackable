const Sidebar = props => {
	const {
		onSelect,
		options,
		value,
		forceDisabledExcept,
	} = props

	return (
		<ul className="ugb-sidebar">

			{ props.title && (
				<h3 className="ugb-sidebar__title">{ props.title }</h3>
			) }

			{ ( options || [] ).map( option => {
				const disabled = forceDisabledExcept !== null ?
					( Array.isArray( forceDisabledExcept ) ?
						! forceDisabledExcept.includes( option.value ) :
						option.value !== forceDisabledExcept ) : false

				return (
					<li key={ option.value }>
						<div
							className={ value === option.value ? 'is-active' : undefined }
							role="button"
							disabled={ disabled	}
							aria-pressed={ value === option.value ? 'true' : 'false' }
							onMouseDown={ () => {
								if ( ! disabled ) {
									onSelect( option.value )
								}
							} }
							onKeyPress={ e => {
								if ( ! disabled && e.keyCode === 13 ) {
									this.click()
								}
							} }
						>
							{ option.label }
						</div>
					</li>
				)
			} ) }

		</ul>
	)
}

Sidebar.defaultProps = {
	title: '',
	options: [],
	onSelect: () => {},
	value: '',
	forceDisabledExcept: null,
}

export default Sidebar
