import { Command } from 'commander'
import { LLMChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'
import fs from 'node:fs'
import path from 'node:path'
// @ts-expect-error
import pdf from 'pdf-parse/lib/pdf-parse'
import PDFDocument from 'pdfkit'

const program = new Command()
program.option('-f, --file <path>', 'PDF file or directory path')
program.parse(process.argv)

const options = program.opts()
if (!options.file) {
  console.warn(
    'Please provide a -f flag followed by a path to a PDF file or a directory of PDFs.'
  )
  process.exit(1)
}

const processPdf = async (pdfFilePath: string, outputDirectory: string) => {
  const pdfBuffer = Buffer.from(await Bun.file(pdfFilePath).arrayBuffer())

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

  // Get the results from the LLM API
  const result = await chain.call({
    text: pdfText,
  })

  // Create the PDF document
  const doc = new PDFDocument()
  const outputFilePath = path.join(
    outputDirectory,
    `${path.basename(pdfFilePath, path.extname(pdfFilePath))}_summary.pdf`
  )
  doc.pipe(fs.createWriteStream(outputFilePath))
  doc.fontSize(11).text(result.text, 100, 100)
  doc.end()
}

const filePath = path.resolve(options.file)
fs.lstat(filePath, (err, stats) => {
  if (err) {
    console.error(`Error reading the file or directory: ${err}`)
    process.exit(1)
  }
  if (stats.isDirectory()) {
    fs.readdir(filePath, (err, files) => {
      if (err) {
        console.error(`Error reading the directory: ${err}`)
        process.exit(1)
      }
      const pdfFiles = files.filter((file) => path.extname(file) === '.pdf')
      if (pdfFiles.length === 0) {
        console.warn('The directory does not contain any PDF files.')
        process.exit(1)
      }
      pdfFiles.forEach((file) =>
        processPdf(path.join(filePath, file), filePath)
      )
    })
  } else if (path.extname(filePath) === '.pdf') {
    processPdf(filePath, path.dirname(filePath))
  } else {
    console.error('Provided path is not a PDF file or a directory.')
    process.exit(1)
  }
})
