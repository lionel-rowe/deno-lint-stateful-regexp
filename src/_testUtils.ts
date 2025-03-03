type ExpectedWarning = { range: [number, number]; message: string }

export function getExpectedWarnings(source: string): ExpectedWarning[] {
	const expected: ExpectedWarning[] = []
	const lines = source.match(/[^\r\n]*\r?\n?/g)!

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

	return expected
}
