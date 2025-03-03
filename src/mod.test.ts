import { assertEquals } from 'jsr:@std/assert'
import plugin from './statefulRegexp.ts'

const source = await Deno.readTextFile('./src/_fixtures/lintErrors.ts')
const lines = source.match(/[^\r\n]*\r?\n?/g)!
const expected: { range: [number, number]; message: string }[] = []

let cursor = 0
for (const [idx, line] of lines.entries()) {
	cursor += lines[idx - 2]?.length ?? 0

	const match = line.match(/\/\/\s*(?<indicator>\^+)\s*(?<message>.+)/)

	if (!match) continue

	const { indicator, message } = match.groups!
	const start = cursor + line.indexOf(indicator)
	const end = start + indicator.length
	expected.push({ range: [start, end], message: message.trim() })
}

Deno.test(plugin.name, () => {
	const diagnostics = Deno.lint.runPlugin(plugin, 'lintErrors.ts', source)

	assertEquals(
		diagnostics
			.toSorted((a, b) => a.range[0] - b.range[0] || a.range[1] - b.range[1])
			.map(({ range, message }) => ({ range, message })),
		expected,
	)

	for (const d of diagnostics) {
		assertEquals(d.id, `${plugin.name}/${Object.keys(plugin.rules)[0]!}`)
	}
})
