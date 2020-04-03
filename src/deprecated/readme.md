Deprecated Folder
=================

All the files here are for deprecation / backward compatibility with either old WordPress / Gutenberg / Stackable versions.

This folder contains the following:

## `blocks-v1`

When blocks were migrated from v1.17.x to v2, a lot of CSS styles were changed. Due to the nature of the Block Editor, existing v1 blocks would retain their original structure unless every single post was updated by the user manually. To prevent this, the old styles of the blocks are kept here for the v1 blocks to work properly in the frontend even if Stackable was already upgraded to v2.

The compiled deprecated styles enqueued for users who upgraded from v1 to v2.

## `editor-wp-v5-3`

WordPress 5.4 changed a lot of how the Block Editor is structured and introduced a lot of editor style issues. The styles in this folder contains the old editor styles that Stackable blocks need in WordPress 5.3 and below.

The compiled editor styles is enqueued for users who still have WordPress 5.3 or earlier installed.
