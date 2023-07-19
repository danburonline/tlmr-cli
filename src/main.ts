import { OpenAI } from 'langchain/llms/openai'

const llm = new OpenAI({
  temperature: 0.9,
})

console.log(
  await llm.predict(
    'What would be a good company name for a company that makes colorful socks?'
  )
)
