<?php
/**
 *
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Admin_Settings' ) ) {

	class Stackable_Admin_Settings extends WP_REST_Settings_Controller {

		/**
		 * Constructor.
		 *
		 */
		public function __construct() {
			$this->namespace = 'stackable/v3';
			$this->rest_base = 'settings';
			add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		}

		public function get_item_permissions_check( $request ) {
			return current_user_can( 'edit_posts' );
		}

		/**
		 * Updates settings for the settings object.
		 */
		public function update_item( $request ) {

			if ( $request->has_param( '_locale' ) ) {
				unset( $request[ '_locale' ] );
			}

			$params = $request->get_params();

			return parent::update_item( $request );
		}

		/**
		 * Retrieves all of the registered stackable options.
		 *
		 * @return array Array of registered options.
		 */
		protected function get_registered_options() {
			$rest_options = array();

			foreach ( get_registered_settings() as $name => $args ) {
				if ( empty( $args['show_in_rest'] ) ) {
					continue;
				}

				$rest_args = array();

				if ( is_array( $args['show_in_rest'] ) ) {
					$rest_args = $args['show_in_rest'];
				}

				$defaults = array(
					'name'   => ! empty( $rest_args['name'] ) ? $rest_args['name'] : $name,
					'schema' => array(),
				);

				$rest_args = array_merge( $defaults, $rest_args );

				// Skip over settings not from Stackable
				if ( strpos( $rest_args[ 'name' ], 'stackable' ) !== 0 ) {
					continue;
				}

				$default_schema = array(
					'type'        => empty( $args['type'] ) ? null : $args['type'],
					'title'       => empty( $args['label'] ) ? '' : $args['label'],
					'description' => empty( $args['description'] ) ? '' : $args['description'],
					'default'     => isset( $args['default'] ) ? $args['default'] : null,
				);

				$rest_args['schema']      = array_merge( $default_schema, $rest_args['schema'] );
				$rest_args['option_name'] = $name;

				// Skip over settings that don't have a defined type in the schema.
				if ( empty( $rest_args['schema']['type'] ) ) {
					continue;
				}

				/*
				 * Allow the supported types for settings, as we don't want invalid types
				 * to be updated with arbitrary values that we can't do decent sanitizing for.
				 */
				if ( ! in_array( $rest_args['schema']['type'], array( 'number', 'integer', 'string', 'boolean', 'array', 'object' ), true ) ) {
					continue;
				}

				$rest_args['schema'] = rest_default_additional_properties_to_false( $rest_args['schema'] );

				$rest_options[ $rest_args['name'] ] = $rest_args;
			}

			return $rest_options;
		}
	}

	new Stackable_Admin_Settings();
}
