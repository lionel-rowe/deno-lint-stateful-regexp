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

function handleExpression(context: Deno.lint.RuleContext, node: Deno.lint.Expression) {
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

export default {
	name: 'stateful-regexp',
	rules: {
		'stateful-regexp': {
			create(context) {
				return {
					Program(node) {
						const topLevelDeclarations = node.body.filter((x) => x.type === 'VariableDeclaration')

						const topLevelAssignments = node.body
							.filter((x) => x.type === 'ExpressionStatement')
							.map((x) => x.expression)
							.filter((x) => x.type === 'AssignmentExpression')

						for (
							const node of [
								...topLevelDeclarations.flatMap((x) => x.declarations).flatMap((x) => x.init ?? []),
								...topLevelAssignments.flatMap((x) => x.right),
							]
						) {
							handleExpression(context, node)
						}
					},
				}
			},
		},
	},
} satisfies Deno.lint.Plugin
