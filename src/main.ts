import { ChatOpenAI } from 'langchain/chat_models/openai'
import { LLMChain } from 'langchain/chains'
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from 'langchain/prompts'
// @ts-ignore – There is an issue with the types for this package
import pdf from 'pdf-parse/lib/pdf-parse'

const dataBuffer = await Bun.file('./examples/example-paper.pdf').arrayBuffer()
const pdfBuffer = Buffer.from(dataBuffer)
let pdfText = await pdf(pdfBuffer).then(function (data: any) {
  return data.text
})

const template =
  'You are a helpful scientific assistant that summarises papers in the IMRaD structure to concise summaries.'
const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(template)
const inputText = '{text}'
const inputTextPrompt = HumanMessagePromptTemplate.fromTemplate(inputText)

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  systemMessagePrompt,
  inputTextPrompt,
])

const chat = new ChatOpenAI({
  temperature: 0, // No randomness, be predictable
})

const chain = new LLMChain({
  llm: chat,
  prompt: chatPrompt,
})

const result = await chain.call({
  text: pdfText,
})

console.log(result)
