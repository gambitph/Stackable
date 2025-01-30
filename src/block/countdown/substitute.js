export const substitute = {
	from: 'stackable/countdown',
	variations: [],
	to: 'stackable/columns',
	transform: () => {
		return [
			'stackable/columns',
			{},
			[
				[
					'stackable/column',
					{ align: 'center' },
					[
						[ 'core/text', {
							fontSize: 'x-large',
							content: '3',
							align: 'center',
							style: { spacing: { margin: { top: '0', bottom: '0' } } },
						} ],
						[ 'core/text', {
							content: 'Days',
							align: 'center',
							style: { spacing: { margin: { top: '0', bottom: '0' } } },
						} ],
					],
				],
				[
					'stackable/column',
					{ align: 'center' },
					[
						[ 'core/text', {
							fontSize: 'x-large',
							content: '16',
							align: 'center',
							style: { spacing: { margin: { top: '0', bottom: '0' } } },
						} ],
						[ 'core/text', {
							content: 'Hours',
							align: 'center',
							style: { spacing: { margin: { top: '0', bottom: '0' } } },
						} ],
					],
				],
			],
		]
	},
}

export default substitute
