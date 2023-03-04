import { getCompletionStream } from 'https://deno.land/x/openai_chat_stream@1.0.0/mod.ts';
import 'https://deno.land/x/dotenv@v3.2.2/load.ts';

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
