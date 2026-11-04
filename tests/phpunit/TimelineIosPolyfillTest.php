<?php
/**
 * Timeline iOS polyfill is only for iPhone, iPad, and Safari.
 *
 * @package Stackable
 */

class TimelineIosPolyfillTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/block/timeline/index.php' );
	}

	/**
	 * Known-good user agents. Chrome, Edge, and Android include "Safari/"
	 * for compatibility, but they are not Safari.
	 *
	 * @return array
	 */
	public function user_agent_provider() {
		return array(
			'empty' => array(
				'',
				false,
			),
			'chrome desktop' => array(
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
				false,
			),
			'chrome android' => array(
				'Mozilla/5.0 (Linux; Android 13; Redmi 10C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.193 Mobile Safari/537.36',
				false,
			),
			'edge desktop' => array(
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
				false,
			),
			'android webview' => array(
				'Mozilla/5.0 (Linux; Android 10; Redmi 10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.193 Mobile Safari/537.36',
				false,
			),
			'firefox desktop' => array(
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
				false,
			),
			'safari macos' => array(
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
				true,
			),
			'safari ipados desktop ua' => array(
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
				true,
			),
			'iphone safari' => array(
				'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
				true,
			),
			'iphone chrome' => array(
				'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1',
				true,
			),
			'ipad safari' => array(
				'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
				true,
			),
		);
	}

	/**
	 * @dataProvider user_agent_provider
	 *
	 * @param string $user_agent
	 * @param bool   $expected
	 */
	public function test_ios_polyfill_user_agent_detection( $user_agent, $expected ) {
		$this->assertSame(
			$expected,
			stackable_is_timeline_ios_polyfill_user_agent( $user_agent )
		);
	}

	public function test_polyfill_adds_class_at_render_time() {
		$html = '<div class="wp-block-stackable-timeline stk-block-timeline"></div>';
		$out = stackable_load_timeline_ios_frontend_polyfill( $html, array() );

		$this->assertSame(
			'<div class="wp-block-stackable-timeline stk-block-timeline stk-block-timeline__ios-polyfill"></div>',
			$out
		);
	}
}
