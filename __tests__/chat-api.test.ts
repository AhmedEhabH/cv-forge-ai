import { POST } from "@/app/api/chat/route";

jest.mock("@google/generative-ai", () => {
  const mockStream = {
    stream: (async function* () {
      yield { text: () => "Hello" };
    })(),
  };
  const mockChat = {
    sendMessageStream: jest.fn().mockResolvedValue(mockStream),
  };
  const mockModel = {
    startChat: jest.fn().mockReturnValue(mockChat),
  };
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue(mockModel),
    })),
  };
});

test("API should return 200 for valid chat request", async () => {
  const mockRequest = new Request("http://localhost/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages: [{ role: "user", content: "Hi" }] }),
  });
  const response = await POST(mockRequest);
  expect(response.status).toBe(200);
});
