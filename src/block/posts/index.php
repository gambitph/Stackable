<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'generate_render_item_from_stackable_posts_block' ) ) {
	/**
	 * Given a post array, attributes,
	 * and a template, generate a post
	 * item markup
	 *
	 * @param array $post
	 * @param array $attribute
	 * @param string $template
	 *
	 * @return string the generated markup
	 */

	function generate_render_item_from_stackable_posts_block( $post, $attributes, $template ) {
		$image_size = $attributes['imageSize'];
		$excerpt_length = $attributes['excerptLength'];
		$readmore_text = $attributes['readmoreText'];
		$meta_separator = $attributes['metaSeparator'];
		$category_highlighted = $attributes['categoryHighlighted'];

		$new_template = $template;
		// Featured Image.
		$featured_image = '';
		$post_id = $post['ID'];
		$featured_image_id = get_post_thumbnail_id( $post_id );

		if ( ! empty( $featured_image_id ) ) {
			$featured_image_urls = Stackable_Posts_Block::get_featured_image_urls_from_attachment_id( $featured_image_id );
			$featured_image_src = array_key_exists( $image_size, $featured_image_urls ) ? $featured_image_urls[ $image_size ] : $featured_image_urls['full'];
			if ( ! empty( $featured_image_src ) ) {
				$image_alt = get_post_meta( $featured_image_id, '_wp_attachment_image_alt', true );
				$thumbnail = get_the_post_thumbnail(
					$post_id,
					$image_size,
					array(
						'alt' => esc_attr( ! empty( $image_alt ) ? $image_alt : '' ),
						'width' => esc_attr( $featured_image_src[1] ),
						'height' => esc_attr( $featured_image_src[2] ),
					)
				);

				// Get the image tag in the thumbnail markup.
				preg_match( "/<img[^\>]*>/", $thumbnail, $match );

				// Remove the built in style attribute in the image.
				if ( is_array( $match ) && count( $match ) > 0 ) {
					// Only remove the style tag inside the image tag.
					$new_img = preg_replace( '/style=\"[^\"]*\"\s?/', "", $match[ 0 ] );
					$featured_image = preg_replace( "/<img[^\>]*>/", $new_img, $thumbnail );
				}
			}
		}

		// If the featured_image is empty, remove the markup.
		if ( empty( $featured_image ) ) {
			$new_template = preg_replace( '/<figure[^>]*>(.*)<\/figure>/', '', $new_template );
		} else {
			$new_template = preg_replace( '/<img[^>]*>/', $featured_image, $new_template );
		}

		// Title.
		$title = get_the_title( $post_id );
		if ( ! $title ) {
			$title = __( '(Untitled)', STACKABLE_I18N );
		}
		$new_template = str_replace( '!#title!#', $title, $new_template );

		// Category.
		$category = Stackable_Posts_Block::get_category_list_by_id( $post_id );
		if ( $category_highlighted ) {
			preg_match_all( '/<a href="([^"]*)"[^>]*>([^<]*)<\/a>/', $category, $matches );
			foreach ( $matches[0] as $i=>$match ) {
				$href = $matches[1][$i];
				$category_title = $matches[2][$i];
				$category = str_replace( "<a href=\"$href\"", "<a class=\"stk-button\" href=\"$href\"", $category );
				$category = str_replace( ">$category_title<", "><span class=\"stk-button__inner-text\">$category_title</span><", $category );
			}
		}

		$new_template = str_replace( '!#category!#', $category, $new_template );

		// Separator.
		$separator = Stackable_Posts_Block::meta_separators[ $meta_separator ];
		$new_template = str_replace( '!#metaSeparator!#', $separator, $new_template );
		// Author.
		$author = esc_html( get_the_author_meta( 'display_name', $post['post_author'] ) );
		$new_template = str_replace( '!#authorName!#', $author, $new_template );

		// Date.
		$datetime = get_the_date( 'c', $post_id );
		$date = get_the_date( '', $post_id );
		$new_template = str_replace( '!#dateTime!#', $datetime, $new_template );
		$new_template = str_replace( '!#date!#', $date, $new_template );

		// Comments.
		$num = get_comments_number( $post_id );
		$num = sprintf( _n( '%d comment', '%d comments', $num, STACKABLE_I18N ), $num );
		$new_template = str_replace( '!#commentsNum!#', $num, $new_template );

		// Excerpt.
		$excerpt = Stackable_Posts_Block::get_excerpt_by_post_id( $post_id, $post );

		// Trim the excerpt.
		if ( ! empty( $excerpt ) ) {
			$excerpt = explode( ' ', $excerpt );
			$trim_to_length = (int) $excerpt_length;
			if ( count( $excerpt ) > $trim_to_length ) {
				$excerpt = implode( ' ', array_slice( $excerpt, 0, $trim_to_length ) ) . '...';
			} else {
				$excerpt = implode( ' ', $excerpt );
			}

			$excerpt = wp_kses_post( $excerpt );
			$new_template = str_replace( '!#excerpt!#', $excerpt, $new_template );
		} else {
			// If the excerpt is empty, remove the markup.
			$new_template = preg_replace( '/<div class="stk-block-posts__excerpt">!#excerpt!#<\/div>/', '', $new_template );
		}

		// Post Link.
		$new_template = str_replace( '!#postLink!#', esc_url( get_permalink( $post_id ) ), $new_template );

		// Read More Link.
		$new_template = str_replace( '!#readmoreText!#', esc_html( $readmore_text ), $new_template );

		return $new_template;
	}
}

if ( ! function_exists( 'generate_post_query_from_stackable_posts_block' ) ) {
	/**
	 * Query generator for 'stackable/posts' block.
	 *
	 * @since 3.0.0
	 * @param WP_Query | array $block_or_attribute
	 * @param string | number $page
	 *
	 * @return array post query which will be used for WP_Query.
	 */
	function generate_post_query_from_stackable_posts_block( $block_or_attribute ) {
		$is_wp_block = ! is_array( $block_or_attribute ) && get_class( $block_or_attribute ) === 'WP_Block';
		/**
		 * If the passed object is an instance of
		 * WP_Block, it is assumed that the block
		 * uses the provided context of the posts block.
		 *
		 * Otherwise, the block using this function
		 * is a posts block, and the passed object is
		 * an attribute object.
		 */
		$context = Stackable_Posts_Block::generate_defaults( $is_wp_block ? $block_or_attribute->context : $block_or_attribute );
		$post_query = array(
				'post_type' => $context['type'],
				'post_status' => 'publish',
				'order' => $context['order'],
				'orderby' => $context['orderBy'],
				'numberposts' => $context['numberOfItems'],
				'suppress_filters' => false,
		);

		if ( ! empty( $context['taxonomy'] ) && ! empty( $context['taxonomyType'] ) ) {
			// Categories.
			if ( $context['taxonomyType'] === 'category' ) {
				$post_query[ 'category' . $context['taxonomyFilterType'] ] = explode( ',', $context['taxonomy'] );
			// Tags.
			} else if ( $context['taxonomyType'] === 'post_tag' ) { $post_query[ 'tag' . $context['taxonomyFilterType'] ] = explode( ',', $context['taxonomy'] );
			// Custom taxonomies.
			} else {
				$post_query['tax_query'] = array(
					array(
						'taxonomy' => $context['taxonomyType'],
						'field' => 'term_id',
						'terms' => explode( ',', $context['taxonomy'] ),
						'operator' => $context['taxonomyFilterType'] === '__in' ? 'IN' : 'NOT IN',
					),
				);
			}
		}

		return apply_filters( 'stackable/posts/post_query',
			$post_query,
			$context
		);
	}
}

if ( ! class_exists( 'Stackable_Posts_Block' ) ) {
	class Stackable_Posts_Block {

		const meta_separators = array(
			'dot' => '·',
			'space' => ' ',
			'comma' => ',',
			'dash' => '—',
			'pipe' => '|',
		);

		function __construct() {
			add_filter( 'stackable.register-blocks.options', array( $this, 'register_block_type' ), 1, 3 );
			add_action( 'rest_api_init', array( $this, 'register_rest_fields' ) );
		}

		/**
		 * Add more data in the REST API that we'll use in the posts block
		 *
		 * @since 3.0.0
		 */
		public function register_rest_fields() {
			$post_types = get_post_types( array( 'public' => true ), 'objects' );

			foreach ( $post_types as $post_type => $data ) {
				if ( $post_type === 'attachment' ) {
					continue;
				}

				// Feature image urls.
				register_rest_field( $post_type, 'featured_image_urls',
					array(
						'get_callback' => array( new Stackable_Posts_Block(), 'get_featured_image_urls' ),
						'update_callback' => null,
						'schema' => array(
							'description' => __( 'Different sized featured images', STACKABLE_I18N ),
							'type' => 'array',
						)
					)
				);

				// Excerpt.
				register_rest_field( $post_type, 'post_excerpt_stackable',
					array(
						'get_callback' => array( new Stackable_Posts_Block(), 'get_excerpt' ),
						'update_callback' => null,
						'schema' => array(
							'description' => __( 'Post excerpt for Stackable', STACKABLE_I18N ),
							'type' => 'string',
						),
					)
				);

				// Category links.
				register_rest_field( $post_type, 'category_list',
					array(
						'get_callback' => array( new Stackable_Posts_Block(), 'get_category_list' ),
						'update_callback' => null,
						'schema' => array(
							'description' => __( 'Category list links', STACKABLE_I18N ),
							'type' => 'string',
						),
					)
				);

				// Author name.
				register_rest_field( $post_type, 'author_info',
					array(
						'get_callback' => array( new Stackable_Posts_Block(), 'get_author_info' ),
						'update_callback' => null,
						'schema' => array(
							'description' => __( 'Author information', STACKABLE_I18N ),
							'type' => 'array',
						),
					)
				);

				// Number of comments.
				register_rest_field( $post_type, 'comments_num',
					array(
						'get_callback' => 'stackable_commments_number_v2',
						'get_callback' => array( new Stackable_Posts_Block(), 'get_comments_number' ),
						'update_callback' => null,
						'schema' => array(
							'description' => __( 'Number of comments', STACKABLE_I18N ),
							'type' => 'number',
						),
					)
				);

				// API endpoint for getting all the terms/taxonomies.
				register_rest_route( 'stackable/v3', '/terms', array(
					'methods' => 'GET',
					'callback' => array( new Stackable_Posts_Block(), 'get_terms' ),
					'permission_callback' => function () {
						return current_user_can( 'edit_posts' );
					},
				) );
			}
		}

		/**
		 * Some of the attribute keys are not defined,
		 * especially when those attributes are not modified.
		 * Give them default values.
		 *
		 * @param array $attributes
		 * @return array $attributes with default values
		 */
		public static function generate_defaults( $attributes ) {
			/**
			 * List of default attribute values.
			 * Ideally, we only need attributes
			 * related to post render function
			 * since block styles are already
			 * handled by the JS save function.
			 */
			$default_attributes = array(
				'type' => 'post',
				'numberOfItems' => 6,
				'orderBy' => 'date',
				'order' => 'desc',
				'taxonomyType' => 'category',
				'taxonomy' => '',
				'taxonomyFilterType' => '__in',
				'postOffset' => 0,
				'postExclude' => '',
				'postInclude' => '',
				'imageSize' => 'full',
				'excerptLength' => 55,
				'readmoreText' => __( 'Continue Reading', STACKABLE_I18N ),
				'metaSeparator' => 'dot',
				'categoryHighlighted' => false,
				'excludeCurrentPost' => false,
			);

			$out = array();
			foreach ( $attributes as $name => $value ) {
				$out[ $name ] = $value;
			}
			foreach ( $default_attributes as $name => $default ) {
				if ( array_key_exists( $name, $out ) ) {
					if ( $out[ $name ] === '' ) {
						$out[ $name ] = $default;
					}
				} else {
					$out[ $name ] = $default;
				}
			}
			return $out;
		}

		/**
		 * Modify the register_options of the
		 * posts block.
		 *
		 * @param array $register_options
		 * @param string $name
		 * @param array $metadata
		 *
		 * @return array new register options.
		 */
		public function register_block_type( $register_options, $name, $metadata ) {
			if ( $name !== 'stackable/posts' ) {
				return $register_options;
			}

			$register_options[ 'render_callback' ] = array( $this, 'render_callback' );

			return $register_options;
		}

		/**
		 * The dynamic render method of the posts block.
		 *
		 * @param array $attributes
		 * @param string $content
		 * @param array $block
		 *
		 * @param string new content.
		 */
		public function render_callback( $attributes, $content, $block = null ) {
			preg_match( '/\&lt;.*?stk-start:posts\/template [^>]*>(.*)\&lt;.*?stk-end:post\/template[^>]*>/', $content, $match );
			if ( ! isset( $match[ 1 ] ) ) {
				return $content;
			}

			$attributes = $this->generate_defaults( $attributes );
			$content = $this->render_post_items( $match, $content, $attributes );
			$content = apply_filters( 'stackable.posts.output',
				$content,
				$attributes,
				$block,
				$match
			);
			return $content;
		}

		/**
		 * Render the post items
		 */
		public function render_post_items( $match, $content, $attributes ) {
			$to_replace = $match[ 0 ];
			$template = $match[ 1 ];

			$posts = '';
			$post_query = generate_post_query_from_stackable_posts_block( $attributes );
			$recent_posts = wp_get_recent_posts( $post_query );
			// Manually slice the array based on the number of posts per page.
			if ( is_array( $recent_posts ) && count( $recent_posts ) > (int) $post_query['numberposts'] ) {
				$recent_posts = array_slice( $recent_posts, 0, (int) $post_query['numberposts'] );
			}

			foreach ( $recent_posts as $post ) {
				$posts .= generate_render_item_from_stackable_posts_block( $post, $attributes, $template );
			}

			$new_content = str_replace( $to_replace, $posts, $content );
			return $new_content;
		}

		/**
		 * Get the featured image URLs by attachment ID.
		 *
		 * @param string $attachment_id
		 *
		 * @return array featured image URLs
		 */
		public static function get_featured_image_urls_from_attachment_id( $attachment_id ) {
			$image = wp_get_attachment_image_src( $attachment_id, 'full', false );
			$sizes = get_intermediate_image_sizes();

			$image_sizes = array( 'full' => is_array( $image ) ? $image : '' );
			foreach ( $sizes as $size ) {
				$image_sizes[ $size ] = is_array( $image ) ? wp_get_attachment_image_src( $attachment_id, $size, false ) : '';
			}

			return $image_sizes;
		}

		/**
		 * Get the featured image URLs.
		 *
		 * @param array post object
		 *
		 * @return array featured image URLs
		 */
		public static function get_featured_image_urls( $object, $field_name, $request ) {
			return Stackable_Posts_Block::get_featured_image_urls_from_attachment_id( ! empty( $object['featured_media'] ) ? $object['featured_media'] : '' );
		}

		/**
		 * Get the post excerpt by post ID
		 *
		 * @param string $post_id
		 * @param array $post
		 *
		 * @return string the excerpt.
		 */
		public static function get_excerpt_by_post_id( $post_id, $post = null ) {
			// Remove jetpack sharing button.
			add_filter( 'sharing_show', '__return_false' );
			$excerpt = get_post_field( 'post_excerpt', $post_id, 'display' );
			// We need to check before running the filters since some plugins override it.
			if ( ! empty( $excerpt ) ) {
				$excerpt = apply_filters( 'the_excerpt', $excerpt );
			}

			if ( empty( $excerpt ) ) {
				$max_excerpt = 100; // WP default is 55.

				// If there's post content given to us, trim it and use that.
				if ( ! empty( $post['post_content'] ) ) {
					$excerpt = apply_filters( 'the_excerpt', wp_trim_words( $post['post_content'], $max_excerpt ) );
				} else {
					// If there's no post content given to us, then get the content.
					$post_content = get_post_field( 'post_content', $post_id );
					if ( ! empty( $post_content ) ) {
						// Remove the jetpack sharing button filter.
						$post_content = apply_filters( 'the_content', $post_content );
						$excerpt = apply_filters( 'the_excerpt', wp_trim_words( $post_content, $max_excerpt ) );
					}
				}
			}

			// Remove the jetpack sharing button filter.
			remove_filter( 'sharing_show', '__return_false' );
			return empty( $excerpt ) ? "" : $excerpt;
		}

		/**
		 * Get the post excerpt
		 *
		 * @param array post object
		 *
		 * @return string the excerpt.
		 */
		public static function get_excerpt( $object ) {
			return Stackable_Posts_Block::get_excerpt_by_post_id( $object['id'] );
		}

		/**
		 * Get the category list by post id
		 *
		 * @param string post id
		 *
		 * @return string the category list
		 */
		public static function get_category_list_by_id( $id ) {
			return get_the_category_list( esc_html__( ', ', STACKABLE_I18N ), '', $id );
		}

		/**
		 * Get the category list
		 *
		 * @param array post object
		 *
		 * @return string the category list.
		 */
		public static function get_category_list( $object ) {
			return Stackable_Posts_Block::get_category_list_by_id( $object['id'] );
		}

		/**
		 * Get the author info
		 *
		 * @param array post object
		 *
		 * @return author info.
		 */
		public static function get_author_info( $object ) {
			if ( ! array_key_exists( 'author', $object ) ) {
				return array(
					'name' => '',
					'url' => ''
				);
			}

			return array(
				'name' => get_the_author_meta( 'display_name', $object['author'] ),
				'url' => get_author_posts_url( $object['author'] )
			);
		}

		/**
		 * Get the post's comments number
		 *
		 * @param array post object
		 *
		 * @return comments number.
		 */
		public static function get_comments_number( $object ) {
			$num = get_comments_number( $object['id'] );
			return sprintf( _n( '%d comment', '%d comments', $num, STACKABLE_I18N ), $num );
		}

		/**
		 * REST Callback. Get all the terms registered for all post types.
		 *
		 * @return array
		 */
		public static function get_terms() {
			$args = array(
				'public' => true,
			);
			$taxonomies = get_taxonomies( $args, 'objects' );

			$return = array();

			$post_types = get_post_types( array( 'public' => true ), 'objects' );
			foreach ( $post_types as $post_type => $data ) {
				// Don't include attachments.
				if ( $post_type === 'attachment' ) {
					continue;
				}
				$return[ $post_type ] = array(
					'label' => $data->label,
					'taxonomies' => array(),
				);
			}

			foreach ( $taxonomies as $taxonomy_slug => $taxonomy ) {
				foreach ( $taxonomy->object_type as $post_type ) {

					// Don't include post formats.
					if ( $post_type === 'post' && $taxonomy_slug === 'post_format' ) {
						continue;
					}

					$return[ $post_type ]['taxonomies'][ $taxonomy_slug ] = array(
						'label' => $taxonomy->label,
						'terms' => get_terms( $taxonomy->name ),
					);
				}
			}

			return new WP_REST_Response( $return, 200 );
		}
	}


	new Stackable_Posts_Block();
}

