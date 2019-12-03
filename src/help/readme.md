Help Tooltips
=============

These are video tooltips that can be added to any control / component in the Inspector.

Usage
=====

1. Pick a name unique to the help tooltip: e.g. "General Shadow". Keep note of the following slugs derived from the name:
	* `general-shadow` kebabCase
	* generalShadow camelCase
2. Add help entries in `videos.js`, follow the template provided there, use the **camelCase** version as the key
3. Make sure you add a video in **.mp4** format with the dimensions `600 x 450`, give it the **kebabCase** name, place it in the `videos` folder.
4. Give the inspector control / component you want the tooltip to belong to, a className of `ugb--help-tip-kebabCase` where `kebabCase` is the **kebabCase** name.

Deployment
==========

Be sure to deploy the video files in the CDN prior to plugin distribution.