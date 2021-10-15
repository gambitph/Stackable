<?php
/**
 * Post picker control
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Post_Picker' ) ) {

	/**
	 * Premium icon settings page.
	 */
    class Stackable_Post_Picker {

		/**
		 * Initialize
		 */
        function __construct() {
			// Add our REST endpoint for getting all posts.
			add_action( 'rest_api_init', array( $this, 'register_rest_route' ) );
		}

		/**
		 * Register our get posts endpoint.
		 */
		public function register_rest_route() {
			register_rest_route( 'stackable/v2', '/editor_mode_get_all_posts', array(
				'methods' => 'GET',
				'callback' => array( $this, 'editor_mode_get_all_posts' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
				'args' => array(
					'search' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			) );
		}

		/**
		 * Get all posts for our post picker
		 */
		public function editor_mode_get_all_posts( $request ) {
			// Get all posts.
			$args = array(
				'posts_per_page' => 50,
				'post_type' => 'any',
			);

			$search = $request->get_param( 'search' );
			if ( $search ) {
				$args['s'] = $search;
			}

			$posts = get_posts( $args );

			$posts_data = array();
			foreach( $posts as $post ) {
				$posts_data[] = (object) array(
					'postId' => $post->ID,
					'edit_url' => get_edit_post_link( $post->ID, 'url' ),
					'url' => get_permalink( $post->ID ),
					'title' => $post->post_title,
					'postType' => get_post_type_object( $post->post_type )->labels->singular_name,
				);
			}

			$response = new WP_REST_Response( $posts_data, 200 );
			return $response;
		}
	}

	new Stackable_Post_Picker();
}
