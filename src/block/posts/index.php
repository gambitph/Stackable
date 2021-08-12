<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Posts_Block' ) ) {
	class Stackable_Posts_Block {
		public $meta_separators = array(
			'dot' => '·',
			'space' => ' ',
			'comma' => ',',
			'dash' => '—',
			'pipe' => '|',
		);

		/**
		 * List of default attribute values.
		 * Ideally, we only need attributes
		 * related to post render function
		 * since block styles are already
		 * handled by the JS save function.
		 */
		const default_attributes = array(
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
		);

		function __construct() {
			add_filter( 'stackable.register-blocks.options', array( $this, 'register_block_type' ), 1, 3 );
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
			$out = array();
			foreach ( $attributes as $name => $value ) {
				$out[ $name ] = $value;
			}
			foreach ( self::default_attributes as $name => $default ) {
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

		/***
		 * Query generator. Given an object of
		 * attributes, create a post query.
		 *
		 * @param array $attributes
		 * @return array post query
		 */
		public static function generate_query( $attributes ) {
			$attributes = self::generate_defaults( $attributes );
			$post_query = array(
					'post_type' => $attributes['type'],
					'post_status' => 'publish',
					'order' => $attributes['order'],
					'orderby' => $attributes['orderBy'],
					'numberposts' => $attributes['numberOfItems'],
					'suppress_filters' => false,
			);

			if ( ! empty( $attributes['taxonomy'] ) && ! empty( $attributes['taxonomyType'] ) ) {
				// Categories.
				if ( $attributes['taxonomyType'] === 'category' ) {
					$post_query[ 'category' . $attributes['taxonomyFilterType'] ] = explode( ',', $attributes['taxonomy'] );
				// Tags.
				} else if ( $attributes['taxonomyType'] === 'post_tag' ) { $post_query[ 'tag' . $attributes['taxonomyFilterType'] ] = explode( ',', $attributes['taxonomy'] );
				// Custom taxonomies.
				} else {
					$post_query['tax_query'] = array(
						array(
							'taxonomy' => $attributes['taxonomyType'],
							'field' => 'term_id',
							'terms' => explode( ',', $attributes['taxonomy'] ),
							'operator' => $attributes['taxonomyFilterType'] === '__in' ? 'IN' : 'NOT IN',
						),
					);
				}
			}

			return apply_filters( 'stackable/posts/post_query',
				$post_query,
				$attributes,
			);
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
		public function render_callback( $attributes, $content, $block ) {
			preg_match( '/\&lt;[^w]*wp:stk\/start [^>]*>(.*)\&lt;[^w]*wp:stk\/end [^>]*>/', $content, $match );
			if ( ! isset( $match[ 1 ] ) ) {
				return $content;
			}

			$content = $this->render_post_items( $match, $content, $attributes );
			$content = apply_filters( 'stackable/posts/output', 
				$content, 
				$this->generate_defaults( $attributes ),
				$block );
			return $content;
		}

		/**
		 * Render the post items
		 */
		public function render_post_items( $match, $content, $attributes ) {
			$to_replace = $match[ 0 ];
			$template = $match[ 1 ];

			/**
			 * Default attributes
			 */
			$image_size = isset( $attributes[ 'imageSize' ] ) ? $attributes[ 'imageSize' ] : 'full';
			$excerpt_length = isset( $attributes[ 'excerptLength' ] ) ? $attributes[ 'excerptLength' ] : 55;
			$readmore_text = isset( $attributes[ 'readmoreText' ] ) ? $attributes[ 'readmoreText' ] : __( 'Continue Reading', STACKABLE_I18N );
			$meta_separator = isset( $attributes[ 'metaSeparator' ] ) ? $attributes[ 'metaSeparator' ] : 'dot';

			$posts = '';
			$recent_posts = wp_get_recent_posts( self::generate_query( $attributes ) );

			foreach ( $recent_posts as $post ) {
				$new_template = $template;
				// Featured Image.
				$featured_image = '';
				$post_id = $post['ID'];
				$featured_image_id = get_post_thumbnail_id( $post_id );

				if ( ! empty( $featured_image_id ) ) {
					$featured_image_urls = self::get_featured_image_urls( $featured_image_id );
					$featured_image_src = $featured_image_urls[ $image_size ];
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
				$category = get_the_category_list( esc_html__( ', ', STACKABLE_I18N ), '', $post_id );
				$new_template = str_replace( '!#category!#', $category, $new_template );

				// Separator.
				$separator = $this->meta_separators[ $meta_separator ];
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
				$excerpt = self::get_excerpt( $post_id, $post );

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

				$posts .= $new_template;
			}
			
			$new_content = str_replace( $to_replace, $posts, $content );
			return $new_content;
		}

		/**
		 * Get the featured image URLs
		 *
		 * @param string $attachment_id
		 *
		 * @return array featured image URLs
		 */
		public static function get_featured_image_urls( $attachment_id ) {
			$image = wp_get_attachment_image_src( $attachment_id, 'full', false );
			$sizes = get_intermediate_image_sizes();

			$image_sizes = array( 'full' => is_array( $image ) ? $image : '' );

			foreach ( $sizes as $size ) {
				$image_sizes[ $size ] = wp_get_attachment_image_src( $attachment_id, $size, false );
			}

			return $image_sizes;
		}

		/**
		 * Get the post excerpt
		 *
		 * @param string $post_id
		 * @param array $post
		 *
		 * @return string the excerpt.
		 */
		public static function get_excerpt( $post_id, $post ) {
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
	}


	new Stackable_Posts_Block();
}

