import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { messages, subject } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1]?.content || "";
    const apiKey = process.env.GEMINI_API_KEY;

    // Self-healing Simulated response if Gemini Key is not configured yet
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not configured inside .env.local. Executing simulated academic agent response...");
      
      const simulatedResponses: Record<string, string> = {
        math: `### 📐 Quantum Calculus Homework Helper (Offline Sandbox Mode)
        
Let's solve your Math question step-by-step!

1. **Identify the variables:** 
   Let $x$ be the velocity and $y$ be the trajectory orbit.
2. **Setup the equation:**
   $$f(x) = \int (3x^2 + 2x) dx$$
3. **Integrate the function:**
   Applying the power rule:
   $$F(x) = x^3 + x^2 + C$$

*Tip: Always remember to add the constant of integration ($C$) for indefinite integrals!*

Configure your \`GEMINI_API_KEY\` inside \`.env.local\` to activate live Gemini AI model streams!`,

        science: `### 🧪 Astro-Physics Science Tutor (Offline Sandbox Mode)

Let's break down this scientific concept!

* **Concept:** Keplerian Orbits
* **Law of Harmonics:** A planet's orbital period squared is proportional to the semi-major axis cubed:
  $$T^2 \propto a^3$$
* **Simple Explanation:** This means planets that are further away from the sun take a significantly longer time to complete one revolution because their orbits are wider and they move slower!

*To test live answers from Google's Gemini models, please add your \`GEMINI_API_KEY\` inside your \`.env.local\` file.*`,

        grammar: `### 📝 Grammar & Writing Coach (Offline Sandbox Mode)

Let's analyze this grammar structure:

* **Active Voice:** "The student uploaded the PDF assignment solution." (Clear and direct!)
* **Passive Voice:** "The PDF assignment solution was uploaded by the student." (Less direct, shifts focus.)

**Key Grammar Rule:**
> [!NOTE]
> Use active voice for strong, engaging sentences, especially when writing essays or presenting projects!

*To fetch live grammatical responses, configure your \`GEMINI_API_KEY\` in your \`.env.local\` configurations.*`,

        coding: `### 💻 Cybernetic Coding Assistant (Offline Sandbox Mode)

Let's write a clean TypeScript function to solve this problem!

\`\`\`typescript
interface Cadet {
  id: string;
  name: string;
  score: number;
}

// Function to filter passing cadets (score >= 20)
function getPassingCadets(cadets: Cadet[]): Cadet[] {
  return cadets.filter(cadet => cadet.score >= 20);
}

const roster: Cadet[] = [
  { id: "1", name: "Marcus Vance", score: 25 },
  { id: "2", name: "Elena Petrova", score: 18 }
];

console.log(getPassingCadets(roster));
// Output: [{ id: "1", name: "Marcus Vance", score: 25 }]
\`\`\`

*To unlock live code generation and formatting, plug your \`GEMINI_API_KEY\` into your \`.env.local\` file!*`
      };

      const fallbackText = simulatedResponses[subject?.toLowerCase()] || `### 🤖 Readers School AI Tutor (Sandbox Mode)
      
Hello! I am here to help you study.

* To unlock live questions, add your **\`GEMINI_API_KEY\`** to your **\`.env.local\`** file.
* Select a subject at the top (Math, Science, Grammar, or Coding) to receive custom styled sandbox responses instantly!`;

      // Return simulated delay for hyper-realistic feel
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({ content: fallbackText });
    }

    // Google Gemini API connection
    const ai = new GoogleGenerativeAI(apiKey);
    
    // System Prompt for student mentoring
    const systemInstruction = `You are the Readers School AI Homework Helper, a cybernetic educational AI designed by the Google DeepMind team. 
    Your goal is to explain complex homework questions in simple, understandable language suitable for school students.
    Support the student with detailed, encouraging, and friendly assistance.
    
    Current subject topic: ${subject || "General Study"}.
    
    Format your responses with clear markdown headers, bold bullet points, blockquotes for important rules, and beautifully structured code blocks when coding.`;

    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });

    // Format previous messages to match Gemini API structure
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const result = await model.generateContent({
      contents,
    });

    const responseText = result.response.text();
    return NextResponse.json({ content: responseText });

  } catch (err: any) {
    console.error("Gemini API Route Error:", err);
    return NextResponse.json({ error: err.message || "Failed to contact Gemini." }, { status: 500 });
  }
}
