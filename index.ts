import { Configuration, OpenAIApi } from 'openai';
import 'https://deno.land/x/dotenv@v3.2.2/load.ts';

const configuration = new Configuration({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

const openai = new OpenAIApi(configuration);

try {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
        name: 'Daniel',
      },
    ],
  });

  console.log(completion.data.choices[0].message?.content);
} catch (error) {
  console.error(error);
}
