# The Blog Posts Block Doesn't Show my Custom Post Type

The Blog Posts block allows you display Custom Post Types  also aside from posts and pages. If your Custom Post Types are not appearing in your Block Editor, you will need to adjust the way your CPT is registered.

{% hint style="warning" %}
Custom Post Types inside the Blog Posts Block is a Stackable Premium feature.
{% endhint %}

If you used a plugin like [Custom Post Type UI](https://wordpress.org/plugins/custom-post-type-ui/) to create your Custom Post Type, you will need to enable the "show\_in\_rest" option.

If you used code to register your Custom Post Type, you will need to add the `show_in_rest` parameter in your `register_post_type` you should have something like this:

```php
add_action( 'init', function() {
	register_post_type( 'artwork',
		array(
			'labels' => array(
				'name' => 'Artwork',
			),
			'public' => true,
			'show_in_rest' => true,
			'has_archive' => true,
			'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt', 'author' ),
			'taxonomies' => array( 'category', 'post_tag' ),
		)
	);
} );
```

