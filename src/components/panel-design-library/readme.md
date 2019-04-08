# PanelDesignSettings

A panel for picking design.

# Usage

```
import ImageDesignWave2 from './image.jpg'

<PanelDesignSettings
	options={ [
		{
			image: 'https://gambitph.github.io/Stackable/assets/premium-slider/cover.jpg',
			value: {
				marginTop: '100',
				design: 'curve-2',
				layer1Color: 'red',
			},
		},
		{
			image: ImageDesignWave2,
			value: {
				marginTop: '200',
				design: 'curve-1',
				layer1Color: '',
			},
		},
		{
			image: ImageDesignWave3,
			value: {
				marginTop: '300',
			},
		},
		...applyFilters( 'stackable.separator.edit.designs', [] ),
	] }
/>
```
