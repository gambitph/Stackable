/**
 * External dependencies
 */
import classnames from 'classnames'

const UncollapsiblePanelBody = props => {
	const {
		sideRender,
		title,
	} = props
	const className = classnames( 'components-panel__body', 'ugb-uncollapsible-panel-body', 'is-opened', props.className )
	return (
		<div className={ className }>
			<div className="ugb-uncollapsible-panel-body__wrapper">
				{ title && <h2>{ title }</h2> }
				{ sideRender }
			</div>
			{ props.children && <div>{ props.children }</div> }
		</div>
	)
}

UncollapsiblePanelBody.defaultProps = {
	className: '',
	title: '',
	sideRender: null,
}

export default UncollapsiblePanelBody
