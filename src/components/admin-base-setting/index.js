import { useState } from '@wordpress/element'
import classnames from 'classnames'

let i = 1

const AdminBaseSetting = props => {
	const [ uid ] = useState( `ugb-admin-setting-${ i++ }` )
	const mainClasses = classnames( [
		'ugb-admin-setting',
	], {
		[ `ugb-admin-setting--${ props.size }` ]: props.size,
	} )

	return (
		<div className={ mainClasses } id={ uid }>
			<label // eslint-disable-line
				className="ugb-admin-setting__label-wrapper"
				htmlFor={ uid }
				onClick={ props.onClick }
			>
				{ !! props.label && <span className="ugb-admin-setting__label">{ props.label }</span> }
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
