eslint-plugin-fest
==================

Usage
-----

Simply install via `npm install --save-dev eslint-plugin-fest` and add the plugin to your ESLint
configuration. See
[ESLint documentation](http://eslint.org/docs/user-guide/configuring#configuring-plugins).

Example:

```javascript
{
    "plugins": [
        "eslint-plugin-fest"
    ]
}
```

Note: by default, when executing the `eslint` command on a directory, only `.js` files will be
linted. You will have to specify extra extensions with the `--ext` option. Example: `eslint --ext
.xml,.js src` will lint both `.xml` and `.js` files in the `src` directory. See [ESLint
documentation](http://eslint.org/docs/user-guide/command-line-interface#ext).
