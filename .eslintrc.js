module.exports = {
	extends: ["eslint:recommended", "prettier"],
	plugins: ["prettier"],
	rules: {
		"prettier/prettier": ["error", { useTabs: true }],
		"standard/computed-property-even-spacing": "off"
	},
	overrides: [
		{
			files: "*.xml",
			rules: {
				"no-unused-expressions": "off"
			}
		}
	],
	"parserOptions": {
		"ecmaVersion": 2017
	},
	"env": {
		"es6": true,
		"amd": true,
		"node": true
	}
};
