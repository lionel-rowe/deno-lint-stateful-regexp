const globalFlags = new Map<string, string>([
	['g', 'global'],
	['y', 'sticky'],
])

type Warning = { flag: string; name: string }

function getStatefulRegExpWarning(flags: string) {
	const warnings: Warning[] = []
	for (const flag of flags) {
		const name = globalFlags.get(flag)
		if (name) warnings.push({ flag, name })
	}

	return warnings.length ? warnings : null
}

function formatWarnings(warnings: Warning[]) {
	return `Avoid using stateful RegExp with ${warnings.map((x) => `"${x.flag}" (${x.name})`).join(' or ')} ${
		warnings.length > 1 ? 'flags' : 'flag'
	} at the top level.`
}

function report(context: Deno.lint.RuleContext, node: Deno.lint.Literal | Deno.lint.NewExpression, flags: string) {
	const warnings = getStatefulRegExpWarning(flags)
	if (!warnings) return
	const message = formatWarnings(warnings)

	context.report({
		node,
		message,
	})
}

function handleExpression(context: Deno.lint.RuleContext, node: Deno.lint.Literal | Deno.lint.NewExpression) {
	switch (node.type) {
		case 'Literal': {
			const { value } = node

			if (!(value instanceof RegExp)) break

			const { flags } = value

			report(context, node, flags)
			break
		}
		case 'NewExpression': {
			const { callee, arguments: args } = node

			const isRegExp = callee.type === 'Identifier' && callee.name === 'RegExp'
			if (!isRegExp) break

			const flagsArg = args[1]

			if (flagsArg.type !== 'Literal') break

			const flags = flagsArg.value

			if (typeof flags !== 'string') break

			report(context, node, flags)
			break
		}
	}
}

const plugin: Deno.lint.Plugin = {
	name: 'stateful-regexp',
	rules: {
		'stateful-regexp': {
			create(context) {
				return {
					Program(node) {
						const topLevelAssignments = node.body
							.filter((x) => x.type === 'ExpressionStatement')
							.map((x) => x.expression)
							.filter((x) => x.type === 'AssignmentExpression')
							.flatMap((x) => x.right)

						const exportDeclarations = node.body
							.filter((x) => x.type === 'ExportNamedDeclaration')
							.map((x) => x.declaration)

						const topLevelVariableDeclarations = [...node.body, ...exportDeclarations]
							.filter((x) => x?.type === 'VariableDeclaration')
							.flatMap((x) => x.declarations)
							.flatMap((x) => x.init ?? [])

						const exportDefaultDeclarations = node.body
							.filter((x) => x.type === 'ExportDefaultDeclaration')
							.map((x) => x.declaration)

						for (
							const node of new Set([
								...topLevelAssignments,
								...topLevelVariableDeclarations,
								...exportDefaultDeclarations,
							])
						) {
							if (node.type === 'Literal' || node.type === 'NewExpression') {
								handleExpression(context, node)
							}
						}
					},
				}
			},
		},
	},
}

export default plugin
