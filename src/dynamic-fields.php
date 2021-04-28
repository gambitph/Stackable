<?php
/**
 * Dynamic Fields.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_get_dynamic_fields_settings' ) ) {
	function stackable_get_dynamic_fields_settings() {
		$options = get_option( 'stackable_dynamic_fields_admin' );
		if ( empty( $options ) ) {
			return array(
				'manager' => array( 'administrator' ),
				'enabled' => true,
			);
		}
		return $options;
	}
}

if ( ! function_exists( 'stackable_is_dynamic_fields_enabled' ) ) {
	function stackable_is_dynamic_fields_enabled() {
		return sugb_fs()->can_use_premium_code() && stackable_get_dynamic_fields_settings()['enabled'];
	}
}

if ( ! function_exists( 'stackable_is_dynamic_fields_manager' ) ) {
	function stackable_is_dynamic_fields_manager() {
		if ( ! is_user_logged_in() ) {
			return false;
		}

		$manager_roles = stackable_get_dynamic_fields_settings()['manager'];
		if ( ! $manager_roles ) {
			return false;
		}

		$user = wp_get_current_user();
		foreach ( $user->roles as $user_role ) {
			if ( in_array( $user_role, $manager_roles ) ) {
				return true;
			}
		}

		return false;
	}
}

if ( ! class_exists( 'Stackable_Premium_Settings_Dynamic_Fields' ) ) {

	/**
	 * Premium dynamic fields settings page.
	 */
    class Stackable_Premium_Settings_Dynamic_Fields {
		/**
		 * Initialize
		 */
        function __construct() {
			if ( sugb_fs()->can_use_premium_code() ) {
				// Register our settings.
				add_action( 'init', array( $this, 'register_dynamic_fields_settings_admin' ) );
			}
		}

		/**
		 * Register the settings we need to load icons
		 *
		 * @return void
		 */
		public function register_dynamic_fields_settings_admin() {
			register_setting(
				'stackable_dynamic_fields_settings_admin',
				'stackable_dynamic_fields_admin',
				array(
					'type' => 'object',
					'description' => __( 'Settings that control dynamic fields functionality and permissions.', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_dynamic_fields_admin' ),
					'show_in_rest' => array(
						'schema' => array(
							'type' => 'object',
							'properties'=> array(
								'enabled' => array(
									'type' => 'boolean'
								),
								'manager' => array(
									'type'  => 'array',
									'items' => array(
										'type' => 'string',
									),
								)
							)
						),
					),
					'default' => '',
				)
			);
		}

		public function sanitize_dynamic_fields_admin( $input ) {
			$sanitized_array = ! is_array( $input ) ? array() : $input;
			
			if ( empty( $sanitized_array ) ) {
				return $sanitized_array;
			}

			// Update role's manager capabilities
			$managers = $sanitized_array[ 'manager' ];
			$roles_obj = new WP_Roles();
			foreach ( $roles_obj->roles as $role => $role_data ) {
				$current_role = get_role( $role );
				if( in_array( $role, $managers ) ) {
					$current_role->add_cap( 'manage_stackable_dynamic_fields' );
				}
				else {
					$current_role->remove_cap( 'manage_stackable_dynamic_fields' );
				}
			}

			return $sanitized_array;
		}
	}

	new Stackable_Premium_Settings_Dynamic_Fields();
}
