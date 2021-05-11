<?php
class PluginTest extends WP_UnitTestCase {

	/**
	 * Test if WordPress site is loaded.
	 */
	function test_wordpress_is_properly_loaded() {
		$this->assertTrue( function_exists( 'do_action' ) );
		$this->assertTrue( function_exists( 'add_filter' ) );
		$this->assertTrue( function_exists( 'apply_filters' ) );
	}

	/**
	 * Test if Stackable Free plugin is properly loaded.
	 */
	function test_stackable_is_properly_loaded() {
		$this->assertTrue( function_exists( 'stackable_php_requirement_activation_check' ) );
		$this->assertTrue( function_exists( 'stackable_version_upgrade_check' ) );
		$this->assertTrue( function_exists( 'stackable_notice_gutenberg_plugin_activated' ) );
		$this->assertTrue( function_exists( 'stackable_notice_gutenberg_plugin_ignore' ) );

		// Test loaded assets inside init.php.
		$this->assertTrue( function_exists( 'stackable_block_assets' ) );
		$this->assertTrue( function_exists( 'stackable_block_editor_assets' ) );
		$this->assertTrue( function_exists( 'stackable_load_plugin_textdomain' ) );
		$this->assertTrue( function_exists( 'stackable_add_required_block_styles' ) );

		// Test loaded assets inside fonts.php.
		$this->assertTrue( class_exists( 'Stackable_Google_Fonts' ) );

		// Test loaded assets inside icons.php.
		$this->assertTrue( class_exists( 'Stackable_Icons' ) );

		// Test loaded assets inside pro.php.
		$this->assertTrue( function_exists( 'stackable_show_pro_notices_option' ) );
		$this->assertTrue( function_exists( 'stackable_register_show_pro_notice_option' ) );
		$this->assertTrue( function_exists( 'stackable_should_show_pro_notices' ) );
		$this->assertTrue( class_exists( 'Stackable_Go_Premium_Notification' ) );

		// Test loaded assets inside help-tooltip.php.
		$this->assertTrue( class_exists( 'Stackable_Help_Tooltip' ) );

		// Test loaded assets inside welcome-tutorial-video.php.
		$this->assertTrue( function_exists( 'stackable_welcome_video_closed_callback' ) );
		$this->assertTrue( function_exists( 'stackable_welcome_video_closed_endpoint' ) );
		$this->assertTrue( function_exists( 'stackable_display_welcome_video' ) );

		// Test loaded assets inside jetpack.php.
		$this->assertTrue( function_exists( 'stackable_jetpack_photon_render_block' ) );
		$this->assertTrue( function_exists( 'stackable_jetpack_photon_render_block_replace_style' ) );
		$this->assertTrue( function_exists( 'stackable_jetpack_photon_render_block' ) );

		// Test loaded assets inside multisite.php.
		$this->assertTrue( function_exists( 'stackable_allow_safe_style_css' ) );
		$this->assertTrue( function_exists( 'stackable_allow_wp_kses_allowed_html' ) );
		$this->assertTrue( function_exists( 'stackable_fix_gt_style_errors' ) );

		// Test loaded assets inside desin-library/init.php.
		$this->assertTrue( class_exists( 'Stackable_Design_Library' ) );

		// Test loaded assets inside global-settings.php.
		$this->assertTrue( class_exists( 'Stackable_Global_Settings' ) );

		// Test loaded assets inside global-settings.php.
		$this->assertTrue( class_exists( 'Stackable_Plugin_Premium_Notice' ) );

		// Test loaded welcome screen assets.
		$this->assertTrue( class_exists( 'Stackable_Welcome_Screen' ) );
		$this->assertTrue( function_exists( 'stackable_news_feed_links' ) );
		$this->assertTrue( function_exists( 'stackable_news_feed_links_cached' ) );
		$this->assertTrue( function_exists( 'stackable_news_feed_ajax' ) );
		$this->assertTrue( function_exists( 'stackable_get_news_feed_nonce' ) );
		$this->assertTrue( has_filter( 'fs_templates/account.php_stackable-ultimate-gutenberg-blocks' ) );
		$this->assertTrue( has_filter( 'fs_/forms/affiliation.php_stackable-ultimate-gutenberg-blocks' ) );
		$this->assertTrue( has_filter( 'fs_templates/contact.php_stackable-ultimate-gutenberg-blocks' ) );
		$this->assertTrue( has_filter( 'fs_templates/pricing.php_stackable-ultimate-gutenberg-blocks' ) );
		$this->assertTrue( has_filter( 'fs_templates/checkout.php_stackable-ultimate-gutenberg-blocks' ) );
		$this->assertTrue( function_exists( 'stackable_get_latest_update_article' ) );
		$this->assertTrue( function_exists( 'stackable_get_latest_update_article_cached' ) );
		$this->assertTrue( function_exists( 'stackable_ajax_dismiss_notice' ) );
		$this->assertTrue( function_exists( 'stackable_add_in_notification_dismissed' ) );
		$this->assertTrue( function_exists( 'stackable_notification_count' ) );
		$this->assertTrue( function_exists( 'stackable_welcome_notification' ) );
		$this->assertTrue( function_exists( 'stackable_add_welcome_notification' ) );
		$this->assertTrue( class_exists( 'Stackable_Welcome_Notification_Rate' ) );
	}
}
