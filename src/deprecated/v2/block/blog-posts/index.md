# How the Blog Posts block works internally

The Blog Posts block is a mixture of a dynamic block (PHP) and a static block (JS)

In a typical dynamic written in PHP the block's `save` property is `null`. The "`save`" functionality
is placed in the `render_callback` in PHP. Because of this dynamic blocks do not have deprecations. 

However, haveing the JS do the `edit` mode and the PHP do the `save` mode has problems.
This means that we need to rewrite a lot of the functionality that we already have built in JS in PHP in order to
generate the block's save output.

The solution is to create a block that's partially dynamic and partially static. Or, in other words,
part of the `save` functionality is written in PHP and part is in JS.

The part written in PHP is in charge of the dynamic portion: getting the latest blog posts and rendering the HTML.
The part written in JS is in charge of creating the rest of the block output: style generation, classnames, unique classes, etc.
This is great since we have written and standardized a lot of the code in JS.

To do this, we need to do the following:

1. Add some output to the `save` function in JS
2. Add some deprecation code since the old version of the block doesn't output anything and will now error out.
3. Since we're adding deprecation code, we'll need to re-define all the block attributes for the deprecation to work, or else an old block would migrate without an error, but will lose all it's attributes. (only redefine all the attributes for deprecation purposes and don't include it in the block registration in JS)
4. Use the `render_block` filter in PHP in order to combine the JS `save` output (`$block['innerHTML']` in the function) and the PHP `save` output (`$block_content`)
5. Implement a custom attribute migration in PHP since our attribute names might have changed, and there's no `deprecated` method in PHP (deprecated.php)
6. Implement a deprecation for JS (deprecated.js)

## Dev Notes

For edit.js:

Complete list of getEntityRecords options: https://developer.wordpress.org/rest-api/reference/posts/#list-posts

```js
export default withSelect( ( select, props ) => {
	const {
		postsToShow = 6,
		order = 'desc',
		orderBy = 'date',
		categories = '',
	} = props.attributes
	const { getEntityRecords } = select( 'core' )
  
	// Get all post types (includes all taxonomies)
	const testposttypes = getEntityRecords( 'root', 'postType' )
	console.log( 'Post types', testposttypes )
  
	// Get categories.
	const cats = getEntityRecords( 'taxonomy', 'category', { per_page: -1, hide_empty: true } )
	// Get tags.
	const tags = getEntityRecords( 'taxonomy', 'post_tag', { per_page: -1, hide_empty: true } )
  
	// Get CPT taxonomy.
	const portfolioCats = getEntityRecords( 'taxonomy', 'portfolio_cat', { per_page: -1, hide_empty: true } )

	// Get CPT by taxonomy.
	const portfolioByCat = getEntityRecords( 'postType', 'portfolio', {
		portfolio_cat: 16,
	} )

	// Complete list of query options: https://developer.wordpress.org/rest-api/reference/posts/#list-posts
	const latestPostsQuery = pickBy( {
		categories,
		order,
		orderby: orderBy,
		per_page: postsToShow, // eslint-disable-line camelcase
		// exclude: [ 2306 ], // Exclude post IDs
		// include: [ 2306 ], // Include only these post IDs
		// search: 'post', // Search results
		// tags_exclude: 14, // Tag ID
	}, value => ! isUndefined( value ) )

	return {
		latestPosts: getEntityRecords( 'postType', 'post', latestPostsQuery ),
	}
} )( Edit )
```

For index.php (save):

Arguments are here: [WP_Query \| Class | WordPress Developer Resources](https://developer.wordpress.org/reference/classes/wp_query/)
```php
$recent_posts = wp_get_recent_posts(
  array(
    // Get CPT by taxonomy
    'post_type' => 'portfolio',
    'tax_query' => array(
      array(
        'taxonomy' => 'portfolio_cat',
        'field'    => 'term_id',
        'terms'    => '16',
        'operator' => 'IN',
      ),
    ),
    
    // By tag
    'tag_slug__in' => array( 'tagslug' ),
    
    // Exclude
    'post__not_in' => array( 2306 ),
		
    // Include
    'post__in' => array( 2306 ),

	// ...
```
