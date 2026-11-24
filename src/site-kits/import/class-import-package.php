<?php
/**
 * Validated Site Kit import package.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Import_Package' ) ) {
	class Stackable_Site_Kit_Import_Package {

		private $data;
		private $files;
		private $directory;

		public function __construct( $data, $files, $directory ) {
			$this->data = $data;
			$this->files = $files;
			$this->directory = $directory;
		}

		public function get_data() {
			return $this->data;
		}

		public function get_data_array() {
			return $this->to_array( $this->data );
		}

		public function get_files() {
			return $this->files;
		}

		public function get_directory() {
			return $this->directory;
		}

		public function cleanup() {
			if ( $this->directory && is_dir( $this->directory ) ) {
				$this->delete_directory( $this->directory );
			}
			$this->directory = '';
		}

		private function to_array( $value ) {
			if ( is_object( $value ) ) {
				$value = get_object_vars( $value );
			}
			if ( ! is_array( $value ) ) {
				return $value;
			}
			foreach ( $value as $key => $item ) {
				$value[ $key ] = $this->to_array( $item );
			}
			return $value;
		}

		private function delete_directory( $directory ) {
			$items = scandir( $directory );
			if ( false === $items ) {
				return;
			}
			foreach ( $items as $item ) {
				if ( '.' === $item || '..' === $item ) {
					continue;
				}
				$path = $directory . DIRECTORY_SEPARATOR . $item;
				if ( is_dir( $path ) && ! is_link( $path ) ) {
					$this->delete_directory( $path );
				} else {
					wp_delete_file( $path );
				}
			}
			rmdir( $directory );
		}
	}
}
