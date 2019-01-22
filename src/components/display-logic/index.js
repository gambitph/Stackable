function DisplayLogic( { condition, children } ) {
	return (
		<div style={ { display: condition ? 'block' : 'none' } } >{ children }</div>
	)
}

export default DisplayLogic
