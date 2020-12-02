/**
 * External dependencies
 */
import { Button } from '@wordpress/components'
import classnames from 'classnames'

const Sidebar = props => {
	const {
		onSelect,
		options,
		value,
		forceDisabledExcept,
		className,
	} = props

	const mainClasses = classnames( 'ugb-design-library__sidebar', {
		[ className ]: className,
	} )

	return (
		<ul className={ mainClasses }>

			{ props.title && (
				<h4 className="ugb-design-library__sidebar__title">{ props.title }</h4>
			) }

			{ ( options || [] ).map( option => {
				const disabled = forceDisabledExcept !== null ?
					( Array.isArray( forceDisabledExcept ) ?
						! forceDisabledExcept.includes( option.value ) :
						option.value !== forceDisabledExcept ) : false

				return (
					<li key={ option.value }>
						<Button
							className={ value === option.value ? 'is-active' : undefined }
							disabled={ disabled	}
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
							isLink
						>
							{ option.label }
						</Button>
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
