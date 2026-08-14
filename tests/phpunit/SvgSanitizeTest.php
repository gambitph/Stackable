<?php
/**
 * Custom SVG setting sanitizer.
 *
 * @package Stackable
 */

class SvgSanitizeTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/editor-settings.php' );
	}

	private function sanitizer() {
		$settings = new Stackable_Editor_Settings();
		return $settings;
	}

	public function test_empty_returns_empty_string() {
		$this->assertSame( '', $this->sanitizer()->sanitize_svg_setting( '' ) );
	}

	public function test_strips_script_onclick_and_javascript_urls() {
		$input = '<svg><script>alert(1)</script><path onclick="alert(1)" d="M0 0"/><a href="javascript:alert(1)"/></svg>';
		$out = $this->sanitizer()->sanitize_svg_setting( $input );
		$this->assertStringNotContainsString( '<script>', $out );
		$this->assertStringNotContainsString( 'onclick', $out );
		$this->assertStringNotContainsString( 'javascript:', $out );
		$this->assertStringContainsString( '<path', $out );
	}

	public function test_harmless_path_remains() {
		$input = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M10 10h10"/></svg>';
		$out = $this->sanitizer()->sanitize_svg_setting( $input );
		$this->assertStringContainsString( '<path d="M10 10h10"/>', $out );
	}
}
