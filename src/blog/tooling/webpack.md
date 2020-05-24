---
title: Prettifying webpack output in your Dev Tools
description: Use source maps!
date: "2020-05-01"
path: /webpack/prettify_devtools
tags: ["webpack", "tooling"]
---

If your dev tools source code looks like this,
you need source maps!

BEFORE:

![Webpack react before source maps](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1590339104/lennythedev/webpack_react_before_source_maps.png)

```javascript
const config = {
	entry: './src/index.js',
	output: {...}
	devtool: 'cheap-module-eval-source-map', // source map
```

any of the values here:
https://webpack.js.org/configuration/devtool/

`cheap-module-eval-source-map` gives the original source but cheaper

AFTER:

![Webpack react after source maps](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1590339104/lennythedev/webpack_react_after_source_maps.png)

Nice and clean! 😎
