<?php
/**
 * Frontend CSS loading.
 *
 * Before v3.21.0, every page with a Stackable block loaded one big stylesheet
 * (dist/frontend_blocks.css) with the styles of every block. Now a page only
 * gets the CSS it can use. The steps, in the order they happen:
 *
 * 1. Detect - while the page is rendered, note which Stackable blocks and
 *    which Stackable CSS classes are in the HTML.
 *    See src/frontend-css/class-page-content.php
 * 2. Pick stylesheets - the shared styles, plus one stylesheet per block that
 *    is on the page. See src/frontend-css/class-stylesheets.php and
 *    src/frontend-css/class-block-styles.php
 * 3. Trim - from those stylesheets, keep only the CSS rules whose classes are
 *    on the page. See src/frontend-css/class-rules.php
 * 4. Print - print everything as one inline <style> in the head, in the same
 *    order as in the old big stylesheet, so the CSS cascade stays the same.
 *    Blocks found later (widgets, footer) add their rules to that same
 *    <style>. See src/frontend-css/class-printer.php
 * 5. Content added after the page loads - content rendered over AJAX / REST
 *    carries its own CSS (src/frontend-css/class-injected-content.php), and a
 *    tiny script loads the CSS of blocks that scripts add in the browser
 *    (src/frontend-css/class-injected-loader.php).
 *
 * Sites that upgraded from an older version keep the old loading through
 * the "Use Legacy Frontend CSS Loading" setting (the
 * stackable_use_legacy_frontend_css option). When it's on, plugin.php loads
 * src/deprecated/legacy-frontend-css.php, which turns all of the above off
 * through hooks. The old behavior only lives in that file.
 *
 * The editor always uses the big stylesheet.
 *
 * A longer explanation, with the filters you can use: src/frontend-css.md
 *
 * @since 3.21.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once( __DIR__ . '/frontend-css/class-stylesheets.php' );
require_once( __DIR__ . '/frontend-css/class-block-styles.php' );
require_once( __DIR__ . '/frontend-css/class-page-content.php' );
require_once( __DIR__ . '/frontend-css/class-rules.php' );
require_once( __DIR__ . '/frontend-css/class-color-schemes.php' );
require_once( __DIR__ . '/frontend-css/class-breakpoints.php' );
require_once( __DIR__ . '/frontend-css/class-printer.php' );
require_once( __DIR__ . '/frontend-css/class-injected-content.php' );
require_once( __DIR__ . '/frontend-css/class-injected-loader.php' );

if ( ! class_exists( 'Stackable_Frontend_CSS' ) ) {

	/**
	 * The "Use Legacy Frontend CSS Loading" setting, and the starting point
	 * that connects all the frontend CSS classes to WordPress.
	 */
	class Stackable_Frontend_CSS {

		/**
		 * The option of the "Use Legacy Frontend CSS Loading" setting.
		 */
		const LEGACY_OPTION = 'stackable_use_legacy_frontend_css';

		/**
		 * The version that introduced the new loading. Sites upgrading from
		 * an older version keep the legacy loading.
		 */
		const INTRODUCED_VERSION = '3.21.0';

		function __construct() {
			add_action( 'register_stackable_global_settings', array( $this, 'register_legacy_setting' ) );
			add_action( 'stackable_early_version_upgraded', array( $this, 'keep_legacy_loading_on_upgrade' ), 10, 2 );
			add_action( 'stackable_early_version_upgraded_frontend', array( $this, 'keep_legacy_loading_on_upgrade' ), 10, 2 );

			// Priority 2: after the upgrade check (init, priority 1), which
			// can turn the legacy setting on. The legacy file removes this.
			add_action( 'init', array( __CLASS__, 'start' ), 2 );
		}

		/**
		 * Connects all the frontend CSS classes to WordPress.
		 *
		 * Only for pages and AJAX / REST responses, the admin (block editor)
		 * uses the big stylesheet.
		 */
		public static function start() {
			if ( is_admin() && ! wp_doing_ajax() ) {
				return;
			}
			Stackable_Frontend_CSS_Block_Styles::add_hooks();
			Stackable_Frontend_CSS_Page_Content::add_hooks();
			Stackable_Frontend_CSS_Color_Schemes::add_hooks();
			Stackable_Frontend_CSS_Printer::add_hooks();
			Stackable_Frontend_CSS_Injected_Content::add_hooks();
			Stackable_Frontend_CSS_Injected_Loader::add_hooks();
		}

		/**
		 * Registers the setting, it's shown in Settings > Miscellaneous
		 * (see src/welcome/admin.js).
		 */
		public function register_legacy_setting() {
			register_setting(
				'stackable_global_settings',
				self::LEGACY_OPTION,
				array(
					'type' => 'boolean',
					'description' => __( 'Use the frontend CSS loading of v3.20 and below', STACKABLE_I18N ),
					'sanitize_callback' => 'rest_sanitize_boolean',
					'show_in_rest' => true,
					'default' => false,
				)
			);
		}

		/**
		 * Sites that upgrade from a version before the new loading keep the
		 * old loading, so their pages look exactly the same. New installs get
		 * the new loading.
		 *
		 * @param string $old_version The version before the upgrade, empty for new installs.
		 * @param string $new_version The version now.
		 */
		public function keep_legacy_loading_on_upgrade( $old_version, $new_version ) {
			// New install: save the option as "off". Saved options are
			// autoloaded, so reading it on every page doesn't need a query.
			if ( empty( $old_version ) ) {
				add_option( self::LEGACY_OPTION, '', '', true );
				return;
			}

			if ( version_compare( $old_version, self::INTRODUCED_VERSION, '>=' ) ) {
				return;
			}

			// The user already chose a setting, keep it.
			if ( get_option( self::LEGACY_OPTION ) !== false ) {
				return;
			}

			update_option( self::LEGACY_OPTION, '1' );
			// Use the legacy loading already in this request. This runs
			// before start(), so the legacy file can still turn it off.
			require_once( plugin_dir_path( STACKABLE_FILE ) . 'src/deprecated/legacy-frontend-css.php' );
		}
	}

	new Stackable_Frontend_CSS();
}
