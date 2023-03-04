import { getCompletionStream } from 'https://deno.land/x/openai_chat_stream@1.0.0/mod.ts';
import 'https://deno.land/x/dotenv@v3.2.2/load.ts';
import {
  loadpdfInClient,
  parsepdfpage,
} from 'https://deno.land/x/pdf_parser@v1.1.2/main.js';

// Load the pdf.js library
import pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js';

const pdfBytes = await Deno.readFile('example-paper.pdf');
// convert the pdf to base64
const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));

// Pass the pdfjsLib instance to loadpdfInClient
const pdf = await loadpdfInClient(pdfBase64, pdfjsLib);

const numPages = pdf.catalog.Pages.Count;

for (let pageNum = 1; pageNum <= numPages; pageNum++) {
  const page = await parsepdfpage(pdf, pageNum);
  console.log(page.getTextContent());
}

const apiKeyArg = Deno.args.find((arg) => arg.startsWith('--api-key='));
const apiKey = apiKeyArg
  ? apiKeyArg.split('=')[1]
  : Deno.env.get('OPENAI_API_KEY');

if (!apiKey) {
  console.error(
    'Please provide an OpenAI API key using the --api-key flag or by setting the OPENAI_API_KEY environment variable.'
  );
  Deno.exit(1);
}

const userInput = prompt('What do you want to ask?');

try {
  const stream = getCompletionStream({
    apiKey,
    messages: [
      {
        role: 'user',
        content: userInput ? userInput : 'Fallback message',
      },
    ],
  });

  let response = '';

  for await (const token of stream) {
    response += token;
  }

  console.log(response);
} catch (error) {
  console.error(error);
}
