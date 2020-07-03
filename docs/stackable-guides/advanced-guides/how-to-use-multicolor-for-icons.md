# How to Use Multicolor for Icons

Stackable allows you adjust the color of multiple paths or shapes in your SVG icons.

{% hint style="warning" %}
This feature is only available in Stackable Premium
{% endhint %}

Multicolor is only available for 1\) custom uploaded icons that have multiple path elements, or 2\) for Font Awesome Pro Duotones.

#### For Custom SVG Icons

If you uploaded a custom SVG icon, Stackable tries to detect the different SVG elements that it can apply multiple colors to. These elements are SVG child tags such as `<path>`, `<shape>`, `<rect>`, `<circle>`, etc.

For each of the detected tags, you will be able to modify the color and opacity of that area.

{% hint style="danger" %}
The detection isn't perfect and the number of areas you can re-color depend mostly on how the SVG was constructed. If your SVG groups together items that can be colored separately, then Stackable should be able to handle it well. But if your SVG contains a lot of nested shapes and groups or `<g>` tags, then the number of color pickers shown might be inaccurate.
{% endhint %}

{% hint style="success" %}
For best results, upload simple SVGs which have cleanly grouped together shapes.
{% endhint %}

#### For Font Awesome Pro Duotones

If you're using Font Awesome Pro, when you have a [duotone icon](https://blog.fontawesome.com/introducing-duotone/) selected, you can use multicolor to colorize the different parts of your duotone icon.

