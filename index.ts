import { getCompletionStream } from 'https://deno.land/x/openai_chat_stream@1.0.0/mod.ts';
import 'https://deno.land/x/dotenv@v3.2.2/load.ts';

if (!Deno.env.get('OPENAI_API_KEY')) {
  const apiKeyInput = prompt('Please enter your OpenAI API key:');

  if (apiKeyInput) {
    Deno.env.set('OPENAI_API_KEY', apiKeyInput);
  }
}

const userInput = prompt('What do you want to ask?');

try {
  const stream = getCompletionStream({
    apiKey: Deno.env.get('OPENAI_API_KEY') || '',
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
