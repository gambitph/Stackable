import { useState } from '@wordpress/element'
import classnames from 'classnames'

let i = 1

const AdminBaseSetting = props => {
	const { showLabel = true } = props
	const [ uid ] = useState( `ugb-admin-setting-${ i++ }` )
	const isSearched = props.searchedSettings ? props.searchedSettings.includes( props.label ) : true
	const mainClasses = classnames( [
		'ugb-admin-setting',
		props.className,
	], {
		[ `ugb-admin-setting--${ props.size }` ]: props.size,
		'ugb-admin-setting--not-highlight': ! isSearched,
	} )

	return (
		<div className={ mainClasses } id={ uid }>
			<label // eslint-disable-line
				className="ugb-admin-setting__label-wrapper"
				htmlFor={ uid }
				onClick={ props.onClick }
			>
				{ !! props.label && showLabel && <span className="ugb-admin-setting__label">{ props.label }</span> }
				<div className="ugb-admin-setting__field">
					{ props.children }
				</div>
			</label>
			{ props.help && <p className="ugb-admin-setting__help">{ props.help }</p> }
		</div>
	)
}

AdminBaseSetting.defaultProps = {
	label: '',
	onClick: () => {},
}

export default AdminBaseSetting
