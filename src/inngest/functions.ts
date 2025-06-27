import { inngest } from "./client";
import { Agent, openai, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    const summarizer = createAgent({
      name: "writer",
      system:
        "You are an expert writer.  You write readable, concise, simple content.",
      model: openai({ model: "gpt-4o" }),
    });
  }
);
