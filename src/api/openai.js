// openai.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_API_KEY,
  dangerouslyAllowBrowser: true, //  for client-side usage
});

// Create a new thread for an assistant conversation
export async function createThread() {
  try {
    const thread = await openai.beta.threads.create();
    return thread.id;
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error;
  }
}

// Send a message from the user to the thread
export async function sendMessage(threadId, userMessage) {
  try {
    const message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userMessage,
    });
    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function runAssistant(threadId, assistantId) {
  try {
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Return both run ID and the promise for the result
    return {
      runId: run.id,
      result: (async () => {
        // Poll for completion
        let runStatus;
        while (true) {
          runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

          if (runStatus.status === "completed") {
            break;
          }

          if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
            throw new Error(`Run was ${runStatus.status}`);
          }

          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Get the latest assistant message
        const messages = await openai.beta.threads.messages.list(threadId);
        const lastMessage = messages.data.find(
          (msg) => msg.role === "assistant"
        );

        const content = lastMessage?.content;
        if (!content || content.length === 0)
          return "No response from assistant.";
        const text = content.find((c) => c.type === "text");
        return text?.text?.value || "No text response from assistant.";
      })(),
    };
  } catch (error) {
    console.error("Error running assistant:", error);
    throw error;
  }
}

// Cancel an ongoing assistant run (when switching assistants)
export async function cancelRun(threadId, runId) {
  try {
    await openai.beta.threads.runs.cancel(threadId, runId);
    console.log("Cancelled run:", runId);
  } catch (error) {
    console.error("Failed to cancel run or no run in progress.", error);
  }
}
