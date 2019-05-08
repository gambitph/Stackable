export default ( props ) => {
	const { terms = [], separator = ', ' } = props;
	if ( ! terms.length ) {
		return null;
	}

	const parts = terms.map( term => {
		return <a href={ term.term_link }>{term.name}</a>;
	} );

	return (
		<div className="ugb-blog-posts__category-list" >
			{ parts.reduce(( prev, curr ) => [ prev, separator, curr ] ) }
		</div>
	);
}
