import { assertEquals } from 'jsr:@std/assert'
import plugin from './statefulRegexp.ts'
import { getExpectedWarnings } from './_testUtils.ts'

const source = await Deno.readTextFile('./src/_fixtures/lintErrors.ts')

Deno.test(plugin.name, () => {
	const diagnostics = Deno.lint.runPlugin(plugin, 'lintErrors.ts', source)

	assertEquals(
		diagnostics
			.toSorted((a, b) => a.range[0] - b.range[0] || a.range[1] - b.range[1])
			.map(({ range, message }) => ({ range, message })),
		getExpectedWarnings(source),
	)

	for (const d of diagnostics) {
		assertEquals(d.id, `${plugin.name}/${Object.keys(plugin.rules)[0]!}`)
	}
})
