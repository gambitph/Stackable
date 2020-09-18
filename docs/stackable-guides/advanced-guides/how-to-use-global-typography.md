# How to Use Global Typography

\(This article is still a work in progress\)

{% hint style="warning" %}
This feature is still in beta
{% endhint %}

* You can adjust headings and body text across the blocks in your entire site
* You can choose whether to apply the typography styles to also native blocks and other third-party blocks as well.

![](../../.gitbook/assets/screen-shot-2020-09-12-at-7.20.40-pm.png)

{% hint style="warning" %}
We cannot guarantee that the typography styles will work against the options of other block plugins since each block plugin works differently.
{% endhint %}

* Setting a block's typography will override what's set in the global typography
* To adjust the tablet and mobile typography, use the responsive toggles and select tablet or mobile then edit your typography settings while in tablet or mobile view modes.

## Global Typography Settings

If the global typography settings are not working in the frontend of your theme, you can tweak some of the settings found in **Stackable &gt; Global Settings**

* **Content Selector** - usually theme's content area contains the CSS class `.entry-content` if your theme uses a different class to designate the content area, please put the proper selector here.
* **Force Typography Styles** - if your theme's doesn't display the global typography that you set, then you may enable this to force the typography styles in the frontend. Ideally, you should not enable this and should be the last resort to make your typography work.

