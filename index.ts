import { Configuration, OpenAIApi } from 'openai';
import 'https://deno.land/x/dotenv@v3.2.2/load.ts';

const configuration = new Configuration({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

const openai = new OpenAIApi(configuration);

// Prompt the user for input
const userInput = prompt('What do you want to ask?');

try {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: userInput ? userInput : 'Fallback message',
        name: 'Daniel',
      },
    ],
  });

  console.log(completion.data.choices[0].message?.content);
} catch (error) {
  console.error(error);
}
