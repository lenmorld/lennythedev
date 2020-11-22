---
title: ESLint and Prettier setup on VSCode for React dev
date: "2020-11-10"
description: How to configure ESLint and Prettier for React development on VSCode
tags: ["eslint", "prettier", "react", "vscode", "tooling", "advanced"]
path: /eslint_prettier_react_vscode
---

![VSCode ESLint code actions on save](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1605013884/lennythedev/vscode_eslint_prettier_fix_on_save_2.gif)

If I had a dollar 💰 for each time I had to setup ESLint and Prettier for a project,
I'd have enough to order take out 🥡!

So I think it's time that I write about it now and copy-paste it later.
Maybe you'll find it as useful as my future self would.

# What and why?

You want to automate the enforcement of a code style guide for your (or your team's) JS code, so violations are:
- identified early during dev time 🔍
- fixed automatically to save effort and mental energy 🤖

> 📚 More on Style Guides: [Prettier - Building and enforcing a style guide](https://prettier.io/docs/en/why-prettier.html#building-and-enforcing-a-style-guide)

Note that you don't need to setup ESLint if you're using tooling with **ESLint baked in**, like [Create React App](https://create-react-app.dev/docs/setting-up-your-editor/) or [codesandbox](https://codesandbox.io/) where the default VSCode has ESLint integrated.

Let's specify first what they both are to make the difference clear once and for all.

## ESLint - a linter

- linter, aka _static code analysis_ tool
- identify and report bugs and problematic patterns, like syntax and semantic errors
- e.g. undefined variables, modification of constants, implicit globals, use of `==`, ...
- extremely configurable - rules to enable/disable, parsers, plugins

## Prettier - a formatter

- formatter, aka _prettifier_ or _pretty print_ tool
- reprints your code to adhere to formatting rules of a style guide
- e.g. fixes max line length, whitespace, tabs, spaces, semicolon, comma, ...

In short, ESLint for **code quality** and Prettier for **code formatting**

# Initial repo

Here's an example React repo using bare-bones Parcel and Babel.
Focus on `src/Hello.jsx` with a lot of formatting errors, which we want to lint.

[Github: react_eslint_prettier](https://github.com/lenmorld/lennythedev_src/tree/react_eslint_prettier_1/react_eslint_prettier)

> 📚 [Parcel](https://parceljs.org/) is a zero-config bundler as an alternative to Webpack. [Babel](https://babeljs.io/) compiles JSX and other new-gen JS to regular JS that browsers understand. 

# ESLint - install and config

```bash
# install eslint as a dev dep on your project
npm install eslint -D
# initial config
npx eslint --init
```
`eslint --init` shows a wizard-like CLI to setup ESLint and install deps at the end.

> `npx` is a tool included with npm to run not-global tools via CLI

Here's the options I picked:

![eslint init options for react](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1605013884/lennythedev/eslint_init_options_react.png)

Results:

**`.eslintrc.js`**

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
  },
};
```

The `eslint` wizard also installed configs and plugins for us.

**`package.json`**

```json
  "devDependencies": {
    // ...
    "eslint": "^7.12.0",
    "eslint-config-airbnb": "^18.2.0",
    "eslint-plugin-import": "^2.22.1",
    "eslint-plugin-jsx-a11y": "^6.4.1",
    "eslint-plugin-react": "^7.21.5",
    "eslint-plugin-react-hooks": "^4.2.0",
    // ...
  }
```

> 📚 Full details on config options here: [Configuring ESLint](https://eslint.org/docs/user-guide/configuring)

You can also run [eslint CLI](https://eslint.org/docs/user-guide/command-line-interface) manually, e.g. `npx eslint --fix src/Hello.jsx` for a specific file and `npx eslint --fix .` to autofix all files, but I want to focus here on integrating with VSCode

## VSCode ESLint extension

Install this ESLint extension from VSCode's extension tab

![VSCode ESLint extension](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1605013884/lennythedev/vscode_eslint_extension.png)

_We'll do the config for autofix on save later_

### Watch out for global and local ESLint conflicts

If you have ESLint installed and configured both globally (in your machine) and locally (in your project), you might get this error.

![ESLint VSCode local and global conflict error](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1605013884/lennythedev/eslint_vscode_error.png)

I suggest to "Allow" local config to be used, to respect individual repo's ESLint rules. Any plugins you use must be installed locally anyways.

![ESLint VSCode allow local config](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1605013884/lennythedev/eslint_vscode_allow_local_config.png)


### Look ma, lints!

At this point, you should see some lints on `Hello.jsx`

![ESLint lints after config](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1605013884/lennythedev/lints_after_eslint_config.png)

💅 It would be nice to fix the formatting issues, and for that we need Prettier.

# Prettier - install and config

```bash
# install prettier to dev deps with exact version
npm install -DE prettier
# create an empty config file, initialize with an empty object
echo {}> .prettierrc.json
```

Put these initial config in:

**`.prettierrc.json`**

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "jsxBracketSameLine": false
}
```

Quick rundown of some options:
- `printWidth`: max line length. More than that, Prettier wraps to next line
- `tabWidth`: number of spaces per indent
- `semi`: semicolons required if true
- `singleQuote`: strings must be 'single quoted' if true, "double quoted" if false
- `jsxBracketSameLine` and `bracketSpacing` are **IMPORTANT FOR JSX** to make component tags more readable

There's only a few options to configure for Prettier, compared to ESLint.

> 📚 More details at [Prettier install and initial config](https://prettier.io/docs/en/install.html)

You can also run `prettier` CLI manually, e.g. `npx prettier --write src/`. But we'll focus here on integrating Prettier with ESLint, to have auto-fix on save with VSCode.


# Integrating ESLint with Prettier

## Run Prettier from ESLint

We'll use an ESLint plugin that runs Prettier as if it was a linter rule.

```bash
npm install -D eslint-plugin-prettier
```

1. Add `prettier` plugin to ESLint config as the last item.
2. In the `rules` object, add prettier "error" as the last item.

**`..eslintrc.js`**
```js
{
  // ...
  "plugins": [
      // ...
      "prettier"
    ],
  "rules": {
    // ...
    "prettier/prettier": "error"
  }
  // ...
}
```

> 📚 The other way to integrate is to run both ESLint and Prettier separately. See [Prettier ESLint](https://github.com/prettier/prettier-eslint)


## Eliminate conflicting rules

Fundamentally, it's better to leave **code quality** to ESLint, and **code formatting** to Prettier.

But ESLint also have stylistic rules that can conflict with Prettier, like semicolon and quotes rules.

To resolve this, we'll use a config to turn off ESLint rules that conflicts with Prettier.

```bash
npm install -D eslint-config-prettier
```

Add `prettier/recommended` config rules in ESLint config `extends`. If it's not yet an array, make it an array and add prettier as the last entry.

**`.eslintrc.js`**
```js
{
  // ...
  "extends": [
    // ...
    "plugin:prettier/recommended"
  ]
  // ...
}
```

This is the [Recommended Configuration](https://github.com/prettier/eslint-plugin-prettier#recommended-configuration) when using `eslint-plugin-prettier` plugin and `eslint-config-prettier` config.

🤖 Last piece is to have VSCode automatically fix issue on save.

# VSCode - fixing issues automatically on save

> Note that since we are using ESLint to run Prettier, we only need the ESLint extension, not the Prettier one.

In VSCode, go to Settings (CTRL + SHIFT + P) then search for "Open Settings JSON". Choose the "Folder" option - **Preferences: Open Folder Settings (JSON)**

![VSCode open folder settings JSON](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1605013884/lennythedev/vscode_open_folder_settings.png)

This creates a `.vscode/settings.json` in our project folder (if it doesn't exist yet). This settings is scoped only to our project so it won't conflict with the other repos you have.

> If you intend to apply this globally on all folders in VSCode, you can use global(user) instead _Preferences: Open Settings (JSON)_.

Add these configs in the object:

**`settings.json`**
```json
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
}
```

> 📚 For other options: [VSCode ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

# Fixing time!

Go to all the files that has lint errors, and just save them.
That simple! 😆

![VSCode ESLint code actions on save](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1605013884/lennythedev/vscode_eslint_prettier_fix_on_save.gif)

_I showed File > Save in the gif, but you can just Ctrl + S as usual_

Do the same for `hooks.jsx` and `.eslintrc.js` which had some formatting issues as well.

## "Unfixable" errors

ESLint can only fix "auto-fixable" problems.

In this example, you'll have to manually add `PropTypes` and add `name` to your prop types validation.

# Bonus: Hooks linting

If you check `hooks.jsx`, there are a lot of violations to React [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html) that are left undetected.

For that, we'll need a ESLint plugin

```bash
npm install -D eslint-plugin-react-hooks
```

Add it to the `extends`

**`.eslintrc.js`**
```js
{
  // ...
  "extends": [
    // ...
    "plugin:react-hooks/recommended"
  ]
  // ...
}
```

![ESLint React Hooks rules lint errors](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1605013884/lennythedev/eslint_react_hooks_rules.png)

Now we're getting lint errors for using hooks in functions that are not components or custom hooks. 🔍


# Code

[Github: react_eslint_prettier after](https://github.com/lenmorld/lennythedev_src/tree/master/react_eslint_prettier)


# Conclusion

So hopefully this helps, because this will definitely help me. 🤓

Catch you in the next one! Enjoy fixing those errors. ❌ ➡️ ✅