---
title: ESLint Config
date: "2019-07-05"
description: Disabling a rule in ESLint is super easy!
tags: ["eslint", "tooling"]
path: /eslint_disabling_a_rule
---

## Disabling a rule

1. Get the rule to be disabled. If using VSCode, you can see this when hovering over the error

![Disable eslint rule](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1590339104/lennythedev/disable_eslint_rule.png)

2. Add to your `package.json` > `eslintConfig` section , or in a `.eslintrc.*` file

```
  "eslintConfig": {
    "rules": {
      "react/display-name": false
    }
```

3. Possible values:

- `false` to disable rule
- `"error"` to enable rule

Full guide:

https://eslint.org/docs/user-guide/configuring
