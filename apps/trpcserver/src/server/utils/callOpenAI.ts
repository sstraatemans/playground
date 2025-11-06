import type OpenAI from 'openai';
import { openai } from './ai/client.js';

interface Props {
  jsonSchema: any;
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  tools: {
    tool: any;
    name: string;
    func: () => (args: any) => Promise<any>;
  }[];
}

export const callOpenAI = async ({ jsonSchema, messages, tools }: Props) => {
  // Call OpenAI chat completion with tools
  let completion = await openai.chat.completions.create({
    model: 'gpt-4o', // Or whichever model you prefer
    messages,
    tools: tools.map((t) => t.tool),
    tool_choice: 'auto',
    response_format: jsonSchema as any,
  });

  let responseMessage = completion.choices[0].message;

  if (responseMessage.tool_calls) {
    messages.push(responseMessage); // Add assistant's message to history

    for (const toolCall of responseMessage.tool_calls) {
      const toolCalled = tools.find(
        (t) => toolCall.type === 'function' && t.name === toolCall.function.name
      );

      if (toolCall.type === 'function' && toolCalled) {
        const args = JSON.parse(toolCall.function.arguments);
        const albumData = await toolCalled.func()(args);

        // Add tool result back to messages
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(albumData),
        });
      }
    }

    // Call OpenAI again with updated messages
    completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools: tools.map((t) => t.tool),
      tool_choice: 'auto',
      response_format: jsonSchema as any,
    });

    responseMessage = completion.choices[0].message;
  }

  return responseMessage;
};
