module.exports = (code, config) => {
	const quotesDouble = config.rules.quotes.includes("double");
	const inFestForTags = code.match(/<fest:(for|each)(.*?)>/gi) || [];
	const inFestIfTags = code.match(/<fest:(if|when) test="(.*?)">/gi) || [];
	const inFestVarTags = code.match(/<fest:var(.*?)>/gi) || [];
	const inFestGetTags = code.match(/<fest:(get|element)(.*?)>/gi) || [];
	const inFestIncludeTags = code.match(/<fest:include(.*?)>/gi) || [];
	const inHtmlAttrs = code.match(/<(\w*?)(.*?)="{(.*?)}"(.*?)>/gi) || [];

	if (config.rules.semi !== "off") {
		code = code.replace(/<fest:value(.*?)>/g, `$&/* eslint semi: "off" */`);
	}

	// html tags with arrts {}
	if (inHtmlAttrs.length) {
		inHtmlAttrs.forEach(htmlTag => {
			const htmlAttrMatch = htmlTag.match(/{(.*?)}/i);
			const htmlAttrVar = Array.isArray(htmlAttrMatch) && htmlAttrMatch[1];
			const htmlArrtJsExp =
				Boolean(htmlAttrVar) && `${htmlAttrVar.replace(" ", "")};`;

			if (htmlArrtJsExp) {
				code = code.replace(htmlTag, `${htmlTag}<f:l>${htmlArrtJsExp}</f:l>`);
			}
		});
	}

	// fest:include context
	if (inFestIncludeTags.length) {
		inFestIncludeTags.forEach(includeTags => {
			const contextAttrMatch = includeTags.match(/context="(.*?)"/i);
			const contextAttrVar =
				Array.isArray(contextAttrMatch) && contextAttrMatch[1];
			const contextJsExp =
				Boolean(contextAttrVar) && `${contextAttrVar.replace(" ", "")};`;

			if (contextJsExp) {
				code = code.replace(
					includeTags,
					`${includeTags}<f:l>${contextJsExp}</f:l>`
				);
			}
		});
	}

	// fest:get, fest:element with name, select
	if (inFestGetTags.length) {
		inFestGetTags.forEach(getTag => {
			let attrVar;

			if (getTag.includes(`name=`)) {
				let nameMatch = getTag.match(/name="(.*?){(.*?)}(.*?)"/i);
				attrVar = Array.isArray(nameMatch) ? nameMatch[2] : null;
			} else if (getTag.includes(`select=`)) {
				let selectMatch = getTag.match(/select="(.*?)"/i);
				attrVar = Array.isArray(selectMatch) ? selectMatch[1] : null;
			}

			let getJsExp = Boolean(attrVar) && `${attrVar.replace(" ", "")};`;

			if (getJsExp) {
				if (quotesDouble) {
					getJsExp = getJsExp.replace(/'/g, '"');
				}

				code = code.replace(getTag, `${getTag}<f:l>${getJsExp}</f:l>`);
			}
		});
	}

	// fest:var
	if (inFestVarTags.length) {
		inFestVarTags.forEach(varTag => {
			const nameAttrMatch = varTag.match(/name="(.*?)"/i);
			const nameAttrVar = Array.isArray(nameAttrMatch) && nameAttrMatch[1];
			const varJsExp =
				Boolean(nameAttrVar) && `var ${nameAttrVar.replace(" ", "")} = "...";`;

			if (varJsExp) {
				code = code.replace(varTag, `${varTag}<f:l>${varJsExp}</f:l>`);
			}
		});
	}

	// fest:for, fest:each
	if (inFestForTags.length) {
		inFestForTags.forEach(forTag => {
			const valueAttrMatch = forTag.match(/value="(.*?)"/i);
			const iterateAttrMatch = forTag.match(/iterate="(.*?)"/i);
			const indexAttrMatch = forTag.match(/index="(.*?)"/i);

			const valueAttrVar = Array.isArray(valueAttrMatch) && valueAttrMatch[1];
			const iterateAttrVar =
				Array.isArray(iterateAttrMatch) && iterateAttrMatch[1];
			const indexAttrVar = Array.isArray(indexAttrMatch) && indexAttrMatch[1];

			let forJsExp = "";

			if (valueAttrVar) {
				forJsExp += `var ${valueAttrVar}; ${valueAttrVar}; `;
			}

			if (indexAttrVar) {
				forJsExp += `var ${indexAttrVar}; ${indexAttrVar}; `;
			}

			if (iterateAttrVar) {
				forJsExp += `${iterateAttrVar}; `;
			}

			if (forJsExp) {
				if (quotesDouble) {
					forJsExp = forJsExp.replace(/'/g, '"');
				}

				code = code.replace(forTag, `${forTag}<f:l>${forJsExp}</f:l>`);
			}
		});
	}

	// fest:if, fest:when
	if (inFestIfTags.length) {
		inFestIfTags.forEach(ifTag => {
			const testAttrMatch = ifTag.match(/test="(.*?)"/i);
			const testAttrVar = Array.isArray(testAttrMatch) && testAttrMatch[1];
			let ifJsExp =
				Boolean(testAttrVar) &&
				`if (${testAttrVar.replace(" ", "")}) {/* code */}`;

			if (ifJsExp) {
				if (config.rules.quotes.includes("double")) {
					ifJsExp = ifJsExp.replace(/'/g, '"');
				}

				code = code.replace(ifTag, `${ifTag}<f:l>${ifJsExp}</f:l>`);
			}
		});
	}

	code = code
		.replace(/<fest:params>/g, "$&(")
		.replace(/<\/fest:params>/g, ");$&");

	return code;
};
