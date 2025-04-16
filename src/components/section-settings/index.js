export const SectionSettings = props => {
	return <>
		<div className="ugb-global-settings__section-settings">
			<p className="ugb-global-settings__section-title">{ props.title }</p>
			{ props.description && <p>{ props.description }</p> }
			{ props.children }
		</div>
	</>
}
