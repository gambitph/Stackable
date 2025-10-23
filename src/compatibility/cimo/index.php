<?php
/**
 * Cimo Notice
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Cimo_Notice' ) ) {
	class Stackable_Cimo_Notice {

		private static $CIMO_SLUG = 'cimo-image-optimizer';
		private static $CIMO_FULL_SLUG = 'cimo-image-optimizer/cimo.php';

		function __construct() {
			if ( is_admin() ) {
				add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_script' ), 1 );
			}
		}

		public static function is_plugin_installed() {
			if ( ! function_exists( 'get_plugins' ) ) {
				include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			$all_plugins = get_plugins();
			if ( isset( $all_plugins[ self::$CIMO_FULL_SLUG ] ) ) {
				return true;
			}

			return false;
		}

		public static function is_plugin_activated() {
			if ( ! function_exists( 'is_plugin_active' ) ) {
				include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			if ( is_plugin_active( self::$CIMO_FULL_SLUG ) && defined( CIMO_FILE ) ) {
				return true;
			}

			return false;

		}

		public function enqueue_script() {
			$cimo_state = 'activated';
			$cimo_action = '';

			if ( ! self::is_plugin_installed() ) {
				$cimo_state = 'not_installed';
				$cimo_action = wp_nonce_url(
					add_query_arg(
						[
							'action' => 'install-plugin',
							'plugin' => self::$CIMO_SLUG,
						],
						admin_url( 'update.php' )
					),
					'install-plugin_' . self::$CIMO_SLUG
				);
			} else if ( ! self::is_plugin_activated() ) {
				$cimo_state = 'installed';
				$cimo_action = wp_nonce_url(
					admin_url( 'plugins.php?action=activate&plugin=' . self::$CIMO_FULL_SLUG ),
					'activate-plugin_' . self::$CIMO_FULL_SLUG
				);
			}

			if ( $cimo_state === 'activated' && ! $cimo_action ) {
				return;
			}

			$content = sprintf('%s <a class="stk-cimo-notice" href="%s" target="_blank">%s</a>.',
				__( 'Optimize your images with Cimo Image Optimizer.', STACKABLE_I18N ),
				$cimo_action,
				( $cimo_state === 'installed' ? __( 'Activate', STACKABLE_I18N )  : __( 'Install', STACKABLE_I18N ) )
					. ' ' . __( 'Cimo Image Optimizer', STACKABLE_I18N )
			);

			$data = array(
				'state' => $cimo_state,
				'content' => $content,
				'action' => wp_json_encode( [ 'action' => $cimo_action ] )
			);

			wp_enqueue_script(
				'stk-cimo-notice',
				plugins_url( 'dist/stk_cimo_notice.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);

			add_filter( 'stackable_localize_script', function ( $args ) use( $data ) {
				return $this->add_localize_script( $args, $data );
			} );


		}

		public function add_localize_script( $args, $data ) {
			$args[ 'cimo-notice' ] = $data;
			return $args;
		}

	}

	new Stackable_Cimo_Notice();
}
