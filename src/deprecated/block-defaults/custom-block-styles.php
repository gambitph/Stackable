<?php
/**
 * Custom Block Styles: Default block styles and new layouts.
 *
 * @since 3.3.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Custom_Block_Styles' ) ) {

	/**
	 * Stackable Custom Block Styles.
	 */
    class Stackable_Custom_Block_Styles {

		/**
		 * Capability required to manage site-wide block default styles.
		 *
		 * @var string
		 */
		const BLOCK_STYLES_CAPABILITY = 'edit_theme_options';

		/**
		 * Initialize
		 */
		function __construct() {
			// Register our settings.
			add_action( 'admin_init', array( $this, 'register_block_style_settings' ) );
			add_action( 'rest_api_init', array( $this, 'register_block_style_settings' ) );

			// Sanitize stored styles on read (legacy data / defense in depth).
			add_filter( 'option_stackable_block_styles', array( $this, 'sanitize_stored_block_styles' ) );

			// Register our management rest routes
			add_action( 'rest_api_init', array( $this, 'register_route' ) );

			// We allow editing of default blocks in their own editor, we do
			// this by creating a "dummy" CPT that we'll edit.
			add_action( 'admin_init', array( $this, 'register_temp_block_editor' ) );
			add_action( 'rest_api_init', array( $this, 'register_temp_block_editor' ) );

			// Disallow going through the list of all "dummy" CPTs.
			add_action( 'current_screen', array( $this, 'temp_block_editor_list_disallow' ) );

			// This will trigger the editor to redirect to the editor for a
			// default block.
			if ( isset( $_REQUEST['stk_edit_block_style'] ) && isset( $_REQUEST['stk_edit_block'] ) && isset( $_REQUEST['stk_edit_block_title'] ) ) {
				add_action( 'admin_init', array( $this, 'edit_default_block_redirect' ) );
			}
		}

		/**
		 * Register the settings we need for saving block styles.
		 *
		 * @return void
		 */
		public function register_block_style_settings() {
			// Schema example:
			/**
			 * [
			 * { block: 'stackable/heading', styles: [{ name: 'default', data: 'some-serialized-data', slug: 'default' }] },
			 * { block: 'stackable/hero', styles: [{ name: 'Horizontal', data: 'some-serialized-data', slug: 'horizontal' }] },
			 * ]
			 */
			register_setting(
				'stackable_block_styles',
				'stackable_block_styles',
				array(
					'type' => 'array',
					'description' => __( 'Stackable User Block Styles', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'items' => array(
								'type' => 'object',
								'properties' => array(
									'block' => array( // The block name e.g. stackable/heading
										'type' => 'string',
									),
									'styles' => array( // The block styles
										'type' => 'array',
										'items' => array(
											'type' => 'object',
											'properties' => array(
												'slug' => array( // A unique identifier for the style e.g. default, horizontal
													'type' => 'string',
												),
												'name' => array( // The name of the block style e.g. Default, Horizontal
													'type' => 'string',
												),
												'data' => array( // Serialized block data
													'type' => 'string',
												),
												'save' => array( // The block's serialized save string, we need this for editing the block in its own editor
													'type' => 'string',
												),
											)
										),
									),
								),
							),
						)
					),
					'default' => '',
				)
			);
		}

		public function sanitize_array_setting( $input ) {
			if ( ! is_array( $input ) ) {
				return array();
			}

			return $this->sanitize_stored_block_styles( $input );
		}

		/**
		 * Whether the current user can manage block default styles.
		 *
		 * @return bool
		 */
		public static function can_manage_block_styles() {
			return current_user_can( self::BLOCK_STYLES_CAPABILITY );
		}

		/**
		 * Sanitize all stored block styles (used on read and on save).
		 *
		 * @param array $block_styles Stored block styles.
		 * @return array
		 */
		public function sanitize_stored_block_styles( $block_styles ) {
			if ( ! is_array( $block_styles ) ) {
				return array();
			}

			$sanitized = array();

			foreach ( $block_styles as $block_style ) {
				$block_style = is_object( $block_style ) ? $block_style : (object) $block_style;

				$block = $this->sanitize_block_name( $block_style->block ?? '' );
				if ( empty( $block ) ) {
					continue;
				}

				$styles = array();
				if ( ! empty( $block_style->styles ) && is_array( $block_style->styles ) ) {
					foreach ( $block_style->styles as $style ) {
						$style = is_object( $style ) ? $style : (object) $style;
						$slug = $this->sanitize_style_slug( $style->slug ?? '' );
						if ( empty( $slug ) ) {
							continue;
						}

						$sanitized_style = new stdClass();
						$sanitized_style->slug = $slug;
						$sanitized_style->name = sanitize_text_field( $style->name ?? '' );
						$sanitized_style->data = $this->sanitize_block_style_data( $style->data ?? '' );
						$sanitized_style->save = $this->sanitize_block_style_save( $style->save ?? '' );
						$styles[] = $sanitized_style;
					}
				}

				if ( ! empty( $styles ) ) {
					$entry = new stdClass();
					$entry->block = $block;
					$entry->styles = $styles;
					$sanitized[] = $entry;
				}
			}

			return $sanitized;
		}

		/**
		 * Sanitize a block name (must be a Stackable block).
		 *
		 * @param string $block Block name.
		 * @return string Empty string if invalid.
		 */
		public function sanitize_block_name( $block ) {
			$block = sanitize_text_field( $block );
			if ( stripos( $block, 'stackable/' ) !== 0 ) {
				return '';
			}
			return $block;
		}

		/**
		 * Sanitize a block style slug.
		 *
		 * @param string $slug Style slug.
		 * @return string
		 */
		public function sanitize_style_slug( $slug ) {
			return sanitize_title( $slug );
		}

		/**
		 * Sanitize serialized block style data (JSON).
		 *
		 * @param string $data JSON-encoded block data.
		 * @return string
		 */
		public function sanitize_block_style_data( $data ) {
			if ( ! is_string( $data ) ) {
				return wp_json_encode( array(
					'attributes' => array(),
					'innerBlocks' => array(),
				) );
			}

			$decoded = json_decode( $data, true );
			if ( ! is_array( $decoded ) ) {
				return wp_json_encode( array(
					'attributes' => array(),
					'innerBlocks' => array(),
				) );
			}

			if ( isset( $decoded['attributes'] ) ) {
				$decoded['attributes'] = $this->sanitize_block_style_data_value( $decoded['attributes'] );
			}
			if ( isset( $decoded['innerBlocks'] ) ) {
				$decoded['innerBlocks'] = $this->sanitize_block_style_data_value( $decoded['innerBlocks'] );
			}

			return wp_json_encode( $decoded );
		}

		/**
		 * Recursively sanitize block style data values.
		 *
		 * @param mixed $value Value to sanitize.
		 * @return mixed
		 */
		public function sanitize_block_style_data_value( $value ) {
			if ( is_array( $value ) ) {
				return array_map( array( $this, 'sanitize_block_style_data_value' ), $value );
			}
			if ( is_string( $value ) ) {
				return wp_kses_post( $value );
			}
			if ( is_bool( $value ) || is_int( $value ) || is_float( $value ) || is_null( $value ) ) {
				return $value;
			}
			return '';
		}

		/**
		 * Sanitize block save markup (serialized blocks).
		 *
		 * @param string $save Serialized block markup.
		 * @return string
		 */
		public function sanitize_block_style_save( $save ) {
			if ( ! is_string( $save ) ) {
				return '';
			}

			$save = wp_check_invalid_utf8( $save );
			if ( '' === trim( $save ) ) {
				return '';
			}

			$blocks = parse_blocks( $save );
			$blocks = $this->sanitize_parsed_blocks( $blocks );
			$save = serialize_blocks( $blocks );

			if ( function_exists( 'filter_block_content' ) ) {
				$save = filter_block_content( $save, 'post', array() );
			} else {
				$save = wp_kses_post( $save );
			}

			return $save;
		}

		/**
		 * Sanitize parsed blocks, allowing only Stackable blocks.
		 *
		 * @param array $blocks Parsed blocks.
		 * @return array
		 */
		public function sanitize_parsed_blocks( $blocks ) {
			$sanitized = array();

			foreach ( $blocks as $block ) {
				if ( empty( $block['blockName'] ) ) {
					if ( ! empty( $block['innerHTML'] ) ) {
						$block['innerHTML'] = wp_kses_post( $block['innerHTML'] );
					}
					$sanitized[] = $block;
					continue;
				}

				if ( stripos( $block['blockName'], 'stackable/' ) !== 0 ) {
					continue;
				}

				if ( ! empty( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
					$block['attrs'] = $this->sanitize_block_style_data_value( $block['attrs'] );
				}

				if ( ! empty( $block['innerBlocks'] ) ) {
					$block['innerBlocks'] = $this->sanitize_parsed_blocks( $block['innerBlocks'] );
				}

				if ( ! empty( $block['innerHTML'] ) ) {
					$block['innerHTML'] = wp_kses_post( $block['innerHTML'] );
				}

				if ( ! empty( $block['innerContent'] ) && is_array( $block['innerContent'] ) ) {
					$block['innerContent'] = array_map(
						function( $content ) {
							return is_string( $content ) ? wp_kses_post( $content ) : $content;
						},
						$block['innerContent']
					);
				}

				$sanitized[] = $block;
			}

			return $sanitized;
		}

		public function register_route() {
			register_rest_route( 'stackable/v2', '/update_block_style', array(
				'methods' => 'POST',
				'callback' => array( $this, 'update_block_style' ),
				'permission_callback' => array( __CLASS__, 'can_manage_block_styles' ),
				'args' => array(
					'block' => array(
						'validate_callback' => __CLASS__ . '::validate_string',
						'sanitize_callback' => array( __CLASS__, 'sanitize_block_name_param' ),
					),
					'slug' => array(
						'validate_callback' => __CLASS__ . '::validate_string',
						'sanitize_callback' => array( __CLASS__, 'sanitize_style_slug_param' ),
					),
					'name' => array(
						'validate_callback' => __CLASS__ . '::validate_string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'data' => array(
						'validate_callback' => __CLASS__ . '::validate_string',
					),
					'save' => array(
						'validate_callback' => __CLASS__ . '::validate_string',
					),
				),
			) );

			register_rest_route( 'stackable/v2', '/delete_block_style', array(
				'methods' => 'POST',
				'callback' => array( $this, 'delete_block_style' ),
				'permission_callback' => array( __CLASS__, 'can_manage_block_styles' ),
				'args' => array(
					'block' => array(
						'validate_callback' => __CLASS__ . '::validate_string',
						'sanitize_callback' => array( __CLASS__, 'sanitize_block_name_param' ),
					),
					'slug' => array(
						'validate_callback' => __CLASS__ . '::validate_string',
						'sanitize_callback' => array( __CLASS__, 'sanitize_style_slug_param' ),
					),
				),
			) );
		}

		/**
		 * REST sanitize callback for block name.
		 *
		 * @param string $value Block name.
		 * @return string
		 */
		public static function sanitize_block_name_param( $value ) {
			$value = sanitize_text_field( $value );
			if ( stripos( $value, 'stackable/' ) !== 0 ) {
				return '';
			}
			return $value;
		}

		/**
		 * REST sanitize callback for style slug.
		 *
		 * @param string $value Style slug.
		 * @return string
		 */
		public static function sanitize_style_slug_param( $value ) {
			return sanitize_title( $value );
		}

		public static function validate_string( $value, $request, $param ) {
			if ( ! is_string( $value ) ) {
				return new WP_Error( 'invalid_param', sprintf( esc_html__( '%s must be a string.', STACKABLE_I18N ), $param ) );
			}
			return true;
		}

		public static function validate_boolean( $value, $request, $param ) {
			if ( ! is_bool( $value ) ) {
				return new WP_Error( 'invalid_param', sprintf( esc_html__( '%s must be a boolean.', STACKABLE_I18N ), $param ) );
			}
			return true;
		}

		/**
		 * Adds or updates a block style.
		 *
		 * @param WP_REST_Request $request
		 *
		 * @return void
		 */
		public function update_block_style( $request ) {
			$block = $this->sanitize_block_name( $request->get_param( 'block' ) );
			$slug = $this->sanitize_style_slug( $request->get_param( 'slug' ) );
			$name = sanitize_text_field( $request->get_param( 'name' ) );
			$data = $this->sanitize_block_style_data( $request->get_param( 'data' ) );
			$save = $this->sanitize_block_style_save( $request->get_param( 'save' ) );

			if ( empty( $block ) || empty( $slug ) ) {
				return new WP_Error(
					'invalid_block_style',
					__( 'Invalid block or style slug.', STACKABLE_I18N ),
					array( 'status' => 400 )
				);
			}

			// All our stored styles.
			$block_styles = get_option( 'stackable_block_styles', array() );

			// Find the block.
			$block_index = false;
			foreach ( $block_styles as $i => $block_style ) {
				if ( $block_style->block === $block ) {
					$block_index = $i;
					break;
				}
			}
			if ( $block_index === false ) {
				$block_style = new stdClass();
				$block_style->block = $block;
				$block_style->styles = array();
				$block_styles[] = $block_style;
				$block_index = count( $block_styles ) - 1;
			}

			// Find the style if it exists.
			$style_index = false;
			foreach ( $block_styles[ $block_index ]->styles as $k => $style ) {
				if ( $style->slug === $slug ) {
					$style_index = $k;
					break;
				}
			}

			// Modify existing style or append it.
			$style = new stdClass();
			$style->name = $name;
			$style->slug = $slug;
			$style->data = $data;
			$style->save = $save;
			if ( $style_index !== false ) {
				$block_styles[ $block_index ]->styles[ $style_index ] = $style;
			} else {
				$block_styles[ $block_index ]->styles[] = $style;
			}

			update_option( 'stackable_block_styles', $block_styles, 'no' );

			return rest_ensure_response( true );
		}

		/**
		 * Deletes a block style.
		 *
		 * @param WP_REST_Request $request
		 *
		 * @return void
		 */
		public function delete_block_style( $request ) {
			$block = $this->sanitize_block_name( $request->get_param( 'block' ) );
			$slug = $this->sanitize_style_slug( $request->get_param( 'slug' ) );

			if ( empty( $block ) || empty( $slug ) ) {
				return new WP_Error(
					'invalid_block_style',
					__( 'Invalid block or style slug.', STACKABLE_I18N ),
					array( 'status' => 400 )
				);
			}

			// All our stored styles.
			$block_styles = get_option( 'stackable_block_styles', array() );

			// Find the block.
			$block_index = false;
			foreach ( $block_styles as $i => $block_style ) {
				if ( $block_style->block === $block ) {
					$block_index = $i;
					break;
				}
			}
			if ( $block_index !== false ) {
				// Find the style if it exists.
				foreach ( $block_styles[ $block_index ]->styles as $k => $style ) {
					if ( $style->slug === $slug ) {
						// Remove the style.
						array_splice( $block_styles[ $block_index ]->styles, $k, 1 );
						update_option( 'stackable_block_styles', $block_styles, 'no' );
						break;
					}
				}
			}

			// Also delete the associated post for editing the block style.
			$style_post_ids = get_option( 'stackable_block_edit_posts', array() );
			if ( array_key_exists( $block . '-' . $slug, $style_post_ids ) ) {
				$style_post_id = $style_post_ids[ $block . '-' . $slug ];
				wp_delete_post( $style_post_id, true );
				unset( $style_post_ids[ $block . '-' . $slug ] );
				update_option( 'stackable_block_edit_posts', $style_post_ids, 'no' );
			}

			return rest_ensure_response( true );
		}

		/**
		 * This is a dummy CPT that is mainly used to edit block default styles.
		 *
		 * @return void
		 */
		public function register_temp_block_editor() {
			register_post_type( 'stackable_temp_post',
				array(
					'labels' => array(
						'name' => __( 'Default Blocks', STACKABLE_I18N ),
						'singular_name' => __( 'Default Block', STACKABLE_I18N ),
						'item_updated' => __( 'Saving, please wait...', STACKABLE_I18N ), // We use a please wait message, JS will replace it with the real message.
					),
					'public'                => false, // Only for editing purposes.
					'has_archive'           => false,
					'show_ui'               => true, // This needs to be true for the editor to work.
					'show_in_rest'          => true, // This needs to be true for the editor to work.
					'show_in_menu'          => false, // Hide in the admin UI.
					'show_in_admin_bar'     => false, // Hide in the admin UI.
					'map_meta_cap'          => true,
					'capabilities' => array(
						'create_posts' => '__do_not_allow', // Remove the "add new" button.
						'delete_post' => '__do_not_allow',
					),
					'supports' => array(
						'title',
						'editor',
						'custom-fields', // This is needed for our post meta below to be used in the editor.
					),
				)
			);

			register_post_meta(
				'stackable_temp_post',
				'stk_block_name',
				array(
					'show_in_rest' => true,
					'single' => true,
					'type' => 'string',
				)
			);

			register_post_meta(
				'stackable_temp_post',
				'stk_block_title',
				array(
					'show_in_rest' => true,
					'single' => true,
					'type' => 'string',
				)
			);

			register_post_meta(
				'stackable_temp_post',
				'stk_style_slug',
				array(
					'show_in_rest' => true,
					'single' => true,
					'type' => 'string',
				)
			);
		}

		/**
		 * If someone checks out the list of all "Dummy" CPTs, disallow it.
		 *
		 * @return void
		 */
		public function temp_block_editor_list_disallow() {
			$screen = get_current_screen();
			if ( ! empty( $screen ) && $screen->base === 'edit' && $screen->id === 'edit-stackable_temp_post' ) {
				wp_redirect( admin_url() );
				die();
			}
		}

		/**
		 * Redirect to the block style editor depending on the url params.
		 *
		 * @return void
		 */
		public function edit_default_block_redirect() {
			if ( ! self::can_manage_block_styles() ) {
				wp_die( esc_html__( 'You do not have permission to edit block default styles.', STACKABLE_I18N ) );
			}

			$block_name = $this->sanitize_block_name( sanitize_text_field( wp_unslash( $_REQUEST['stk_edit_block'] ) ) );
			$style_slug = $this->sanitize_style_slug( sanitize_text_field( wp_unslash( $_REQUEST['stk_edit_block_style'] ) ) );
			$block_title = sanitize_text_field( wp_unslash( $_REQUEST['stk_edit_block_title'] ) );

			if ( empty( $block_name ) || empty( $style_slug ) ) {
				wp_die( esc_html__( 'Invalid block default style.', STACKABLE_I18N ) );
			}

			$this->redirect_to_block_style_editor( $block_name, $style_slug, $block_title );
		}

		/**
		 * Redirects to the block style editor for the given block and style.
		 *
		 * @param string $block_name The block name e.g. stackable/heading
		 * @param string $style_slug The slug of the style to edit. e.g. default
		 * @param string $block_name The title of the block to display e.g. Button
		 *
		 * @return boolean False if the block or style doesn't exist, otherwise redirects to the editor.
		 */
		public function redirect_to_block_style_editor( $block_name, $style_slug = 'default', $block_title = 'Block' ) {
			if ( ! self::can_manage_block_styles() ) {
				return false;
			}

			$block_name = $this->sanitize_block_name( $block_name );
			$style_slug = $this->sanitize_style_slug( $style_slug );
			$block_title = sanitize_text_field( $block_title );

			if ( empty( $block_name ) || empty( $style_slug ) ) {
				return false;
			}

			// Find the block.
			$block_styles = get_option( 'stackable_block_styles', array() );

			$block_index = false;
			$style_index = false;

			foreach ( $block_styles as $i => $block_style ) {
				if ( $block_style->block === $block_name ) {
					$block_index = $i;
					break;
				}
			}
			if ( $block_index !== false ) {
				// Find the style if it exists.
				foreach ( $block_styles[ $block_index ]->styles as $k => $style ) {
					if ( $style->slug === $style_slug ) {
						$style_index = $k;
						break;
					}
				}
			}

			// If the block/style doesn't exist and we're editing the default
			// block style, continue on with creating the temporary post which
			// will be used to edit the block style.
			if ( $style_slug === 'default' && $style_index === false ) {
				$style = new stdClass();
				$style->save = '';
			} else if ( $style_index !== false ) {
				// The matching style.
				$style = $block_styles[ $block_index ]->styles[ $style_index ];
			} else {
				return false;
			}

			// This variable holds all the existing post IDs for styles edited.
			$style_post_ids = get_option( 'stackable_block_edit_posts', array() );
			if ( array_key_exists( $block_name . '-' . $style_slug, $style_post_ids ) ) {
				$style_post_id = $style_post_ids[ $block_name . '-' . $style_slug ];
				if ( ! get_post( $style_post_id ) ) {
					$style_post_id = 0;
				}
			} else {
				$style_post_id = 0;
			}

			// Create the block that we will edit.
			$post_content = $this->sanitize_block_style_save( $style->save );
			$post_content = str_replace( '\\', '\\\\', $post_content ); // Need to re-add the backslashes or else some data like global colors will not show up correctly.
			$style_post_id = wp_insert_post( array(
				'ID' => $style_post_id, // If previously edited this block, use the old post id so we don't create tons of posts.
				'post_type' => 'stackable_temp_post',
				'post_status' => 'publish',
				'post_title' => $style_slug !== 'default'
					? $style->name
					: sprintf( __( 'Default %s Block', STACKABLE_I18N ), $block_title ),
				'post_content' => $post_content,
			) );

			// Some non-essential data that we will use within the editor (mostly for notices).
			update_post_meta( $style_post_id, 'stk_block_name', $block_name );
			update_post_meta( $style_post_id, 'stk_block_title', $block_title );
			update_post_meta( $style_post_id, 'stk_style_slug', $style_slug );

			// Update the post id.
			$style_post_ids[ $block_name . '-' . $style_slug ] = $style_post_id;
			update_option( 'stackable_block_edit_posts', $style_post_ids );

			// Redirect to the edit page.
			$url = get_edit_post_link( $style_post_id, 'url' );
			// When the Classic Editor plugin is enabled, force it to use the classic editor.
			$url = add_query_arg( 'classic-editor__forget', '', $url );
			wp_redirect( $url );
			die();
		}
	}

	new Stackable_Custom_Block_Styles();
}
