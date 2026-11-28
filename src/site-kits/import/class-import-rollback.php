<?php
/**
 * In-request rollback journal for Site Kit imports.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Import_Rollback' ) ) {
	class Stackable_Site_Kit_Import_Rollback {

		private $options = array();
		private $posts = array();
		private $new_posts = array();
		private $new_attachments = array();
		private $new_menus = array();
		private $post_terms = array();
		private $term_meta = array();
		private $activated_plugins = array();
		private $installed_plugins = array();
		private $callbacks = array();

		public function record_option( $name ) {
			if ( array_key_exists( $name, $this->options ) ) {
				return;
			}
			$missing = new stdClass();
			$value = get_option( $name, $missing );
			$this->options[ $name ] = array(
				'exists' => $missing !== $value,
				'value' => $value,
			);
		}

		public function record_post( $post_id ) {
			$post_id = (int) $post_id;
			if ( ! $post_id || isset( $this->posts[ $post_id ] ) || in_array( $post_id, $this->new_posts, true ) ) {
				return;
			}
			$post = get_post( $post_id, ARRAY_A );
			if ( $post ) {
				$this->posts[ $post_id ] = array(
					'post' => $post,
					'meta' => get_post_meta( $post_id ),
				);
			}
		}

		public function record_new_post( $post_id ) {
			$this->new_posts[] = (int) $post_id;
		}

		public function record_new_attachment( $post_id ) {
			$this->new_attachments[] = (int) $post_id;
		}

		public function record_new_menu( $term_id ) {
			$this->new_menus[] = (int) $term_id;
		}

		public function record_post_terms( $post_id, $taxonomy ) {
			$key = (int) $post_id . ':' . $taxonomy;
			if ( isset( $this->post_terms[ $key ] ) ) {
				return true;
			}
			$terms = wp_get_object_terms( $post_id, $taxonomy, array( 'fields' => 'ids' ) );
			if ( is_wp_error( $terms ) ) {
				return $terms;
			}
			$this->post_terms[ $key ] = array(
				'postId' => (int) $post_id,
				'taxonomy' => $taxonomy,
				'terms' => $terms,
			);
			return true;
		}

		public function record_term_meta( $term_id ) {
			$term_id = (int) $term_id;
			if ( ! isset( $this->term_meta[ $term_id ] ) ) {
				$this->term_meta[ $term_id ] = get_term_meta( $term_id );
			}
		}

		public function record_activated_plugin( $plugin ) {
			$this->activated_plugins[] = $plugin;
		}

		public function record_installed_plugin( $plugin ) {
			$this->installed_plugins[] = $plugin;
		}

		public function record_callback( $callback, $description ) {
			if ( is_callable( $callback ) ) {
				$this->callbacks[] = array(
					'callback' => $callback,
					'description' => $description,
				);
			}
		}

		/**
		 * Reverse completed operations where WordPress provides a safe inverse.
		 *
		 * @return string[] Human-readable rollback failures.
		 */
		public function rollback() {
			$errors = array();
			foreach ( array_reverse( $this->callbacks ) as $entry ) {
				try {
					$result = call_user_func( $entry['callback'] );
					if ( is_wp_error( $result ) ) {
						$errors[] = $entry['description'] . ': ' . $result->get_error_message();
					} elseif ( true !== $result ) {
						$errors[] = $entry['description'] . '.';
					}
				} catch ( Throwable $exception ) {
					$errors[] = $entry['description'] . ': ' . $exception->getMessage();
				}
			}
			foreach ( array_reverse( array_unique( $this->new_attachments ) ) as $post_id ) {
				if ( ! wp_delete_attachment( $post_id, true ) ) {
					$errors[] = 'Could not remove imported attachment ' . $post_id . '.';
				}
			}

			foreach ( array_reverse( array_unique( $this->new_posts ) ) as $post_id ) {
				if ( ! wp_delete_post( $post_id, true ) ) {
					$errors[] = 'Could not remove imported post ' . $post_id . '.';
				}
			}
			foreach ( array_reverse( array_unique( $this->new_menus ) ) as $term_id ) {
				$result = wp_delete_nav_menu( $term_id );
				if ( is_wp_error( $result ) ) {
					$errors[] = 'Could not remove imported menu ' . $term_id . '.';
				}
			}
			if ( $this->activated_plugins && function_exists( 'deactivate_plugins' ) ) {
				deactivate_plugins( array_values( array_unique( $this->activated_plugins ) ), true );
			}
			if ( $this->installed_plugins && function_exists( 'delete_plugins' ) ) {
				$result = delete_plugins( array_values( array_unique( $this->installed_plugins ) ) );
				if ( is_wp_error( $result ) ) {
					$errors[] = $result->get_error_message();
				}
			}

			foreach ( $this->posts as $post_id => $snapshot ) {
				$result = wp_update_post( wp_slash( $snapshot['post'] ), true );
				if ( is_wp_error( $result ) ) {
					$errors[] = 'Could not restore post ' . $post_id . '.';
					continue;
				}
				$keys = array_keys( get_post_meta( $post_id ) );
				foreach ( $keys as $key ) {
					delete_post_meta( $post_id, $key );
				}
				foreach ( $snapshot['meta'] as $key => $values ) {
					foreach ( $values as $value ) {
						if ( false === add_post_meta( $post_id, $key, wp_slash( maybe_unserialize( $value ) ) ) ) {
							$errors[] = 'Could not restore metadata for post ' . $post_id . '.';
						}
					}
				}
			}

			foreach ( $this->post_terms as $snapshot ) {
				$result = wp_set_object_terms( $snapshot['postId'], $snapshot['terms'], $snapshot['taxonomy'] );
				if ( is_wp_error( $result ) ) {
					$errors[] = 'Could not restore terms for post ' . $snapshot['postId'] . '.';
				}
			}

			foreach ( $this->term_meta as $term_id => $meta ) {
				foreach ( array_keys( get_term_meta( $term_id ) ) as $key ) {
					delete_term_meta( $term_id, $key );
				}
				foreach ( $meta as $key => $values ) {
					foreach ( $values as $value ) {
						if ( false === add_term_meta( $term_id, $key, wp_slash( maybe_unserialize( $value ) ) ) ) {
							$errors[] = 'Could not restore metadata for menu ' . $term_id . '.';
						}
					}
				}
			}

			foreach ( $this->options as $name => $snapshot ) {
				if ( $snapshot['exists'] ) {
					if ( false === update_option( $name, $snapshot['value'] ) && get_option( $name ) !== $snapshot['value'] ) {
						$errors[] = 'Could not restore option ' . $name . '.';
					}
				} elseif ( false === delete_option( $name ) && false !== get_option( $name, false ) ) {
					$errors[] = 'Could not remove option ' . $name . '.';
				}
			}

			return $errors;
		}
	}
}
