type Turn = { role: 'user' | 'assistant'; content: string };

export function toGeminiContents(turns: Turn[]): Array<{role: 'user' | 'model'; parts: {text: string}[]}> {
    return turns.map(t => ({
      role: t.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: t.content }],
    }));
}