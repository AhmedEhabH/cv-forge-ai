import { geminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  try {
    const chat = geminiModel.startChat({
      history: messages.slice(0, -1),
    });

    const result = await chat.sendMessageStream(messages[messages.length - 1].content);
    
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to stream response" }, { status: 500 });
  }
}
