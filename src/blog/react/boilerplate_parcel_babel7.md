---
path: "/blog/react-boilerplate-parcel-babel7"
date: "2020-06-29"
tags: ["react", "tooling", "boilerplate", "beginners", "babel"]
title: React Boilerplate with Parcel and Babel 7
published: true
description: Setup your React environment from scratch in under 5 minutes!
---

Tired of webpack config for setting up a React project? 😫

Try Parcel!

Parcel is a zero-config fast bundler.
Everything just works out-of-the-box 🎉

# Initialize npm

```bash
$ npm init -y
```

# Install parcel

```bash
$ npm install --save-dev parcel-bundler
```

You can also install it globally if you're planning to run it as a CLI.

# Create files

Here we have a vanilla HTML, CSS, JS and React setup.
Nothing fancy 🍦

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link href="./style.css" type="text/css" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
    <script src="index.js"></script>
  </body>
</html>
```

**index.js**

```js
import React from "react";
import ReactDOM from "react-dom";

class Hello extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello {this.props.name}</h1>
      </div>
    );
  }
}

ReactDOM.render(<Hello name="Lenny" />, document.getElementById("app"));
```

**style.css**

```css
body {
  font-family: Arial, Helvetica, sans-serif;
}
```

# Install React

```bash
$ npm install --save react
& npm install --save react-dom
```

# Configure Babel 7

Since Babel 7, we have to use the `@babel`-namespaced version of the presets

**.babelrc**

```js
{
	"presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

# Add npm scripts for dev and build

Parcel needs an entry point to start the build, which could be any file.

For simplicity, let's stick with our `index.html` where the React app will be mounted

**package.json**

```json
  "scripts": {
    "dev": "parcel index.html",
    "build": "parcel build index.html"
  },
```

### Build dir

Default build dir is `dist/`, but you can specify using `-d` e.g. `parcel build -d public/`

### Port

Default port is 1234, but you can specify yours using
`--port`, e.g. `parcel index.html --port 5000`

# Finally, ignore these files to not blow up your Git repo ✅

**.gitignore**

```bash
node_modules/

# parcel temp build files
.cache
dist
```

# Run it!

```bash
$ npm install
$ npm run dev
```

# Build and Deploy

## Build

```bash
$ npm run build
```

## Deploy

surge.sh is such an ease to use, but feel free to use any CLI-deploy tool you have.

```bash
$ npm install --global surge
$ surge dist/
```

### Surge options

Surge takes a directory to deploy, which is `dist/` since we left Parcel's default build dir.

It also asks you for a sub-domain name <yourname>.surge.sh.
So as long as it's not taken yet, go bananas 🤗!

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1593476845/lennythedev/react-biolerplate-sample.png)

💥

🙌 Awesome! Catch you in the next one! 🤓

# Full code:

https://github.com/lenmorld/react_boilerplate
