const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export async function generateAiReply(messageBody) {
  const trimmed = String(messageBody || '').trim()
  if (!trimmed) {
    return 'Thanks for your message. How can I help you today?'
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return `Thanks for your message: "${trimmed}". I am using fallback mode right now, but I received this successfully.`
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are AlumniConnect assistant. Reply briefly, clearly, and helpfully for an alumni networking platform.',
          },
          { role: 'user', content: trimmed },
        ],
        temperature: 0.6,
        max_tokens: 180,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`OpenAI error ${response.status}: ${text}`)
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (typeof content === 'string' && content.trim()) {
      return content.trim()
    }
  } catch (error) {
    console.error('AI reply generation failed:', error)
  }

  return `Thanks for your message: "${trimmed}". I could not reach AI right now, but I am here and your message is saved.`
}
