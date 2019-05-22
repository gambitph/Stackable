# Advance Autosuggest Control

# Options

Options can be non-grouped or grouped:

```js
const nonGrouped = [
	{ label: __( 'Sans-Serif' ), value: 'sans+serif' },
	{ label: __( 'Serif' ), value: 'serif' },
	{ label: __( 'Monospace' ), value: 'monospace' },
	{ label: __( 'Montserrat' ), value: 'montserrat' },
	{ label: __( 'Open Sans' ), value: 'open+sans' },
	{ label: __( 'Roboto' ), value: 'roboto' },
]
```

```js
const grouped = [
	{
		title: 'System Fonts',
		options: [
			{ label: __( 'Sans-Serif' ), value: 'sans+serif' },
			{ label: __( 'Serif' ), value: 'serif' },
			{ label: __( 'Monospace' ), value: 'monospace' },
		],
	},
	{
		title: 'Google Fonts',
		options: [
			{ label: __( 'Montserrat' ), value: 'montserrat' },
			{ label: __( 'Open Sans' ), value: 'open+sans' },
			{ label: __( 'Roboto' ), value: 'roboto' },
		],
	},
]
```
