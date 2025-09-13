<?php
/**
 * Getting Started screen.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Getting_Started_Screen' ) ) {
	class Stackable_Getting_Started_Screen {
		function __construct() {
            // Register settings.
            add_action( 'admin_init', array( $this, 'register_settings' ) );
            add_action( 'rest_api_init', array( $this, 'register_settings' ) );
            
            if ( is_admin() ) {
                add_filter( 'stackable_localize_script', array( $this, 'add_localize_script' ) );
                add_filter( 'stackable_localize_settings_script', array( $this, 'add_localize_script' ) );
            }
        }
        
        public function register_settings() {
            // This is used to store whether the user has completed a guided tour.
            // If the tour ID is not saved here, the tour will be shown.
            // This is overridable by `?tour=tourId` in the URL.
			register_setting(
				'stackable_guided_tour_states',
				'stackable_guided_tour_states',
				array(
					'type' => 'array',
					'description' => __( 'An array of strings representing completed block tours.', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
                    'show_in_rest' => array(
						'schema' => array(
                            'type' => 'array',
							'items' => array(
								'type' => 'string',
							),
						),
					),
					'default' => array(),
				)
			);
        }

        public function sanitize_array_setting( $input ) {
            if ( ! is_array( $input ) ) {
                return array();
            }
            return array_map( 'sanitize_text_field', $input );
        }

        public function add_localize_script( $args ) {
            $args['guidedTourStates'] = get_option( 'stackable_guided_tour_states', array() );
            return $args;
        }
	}

	new Stackable_Getting_Started_Screen();
}