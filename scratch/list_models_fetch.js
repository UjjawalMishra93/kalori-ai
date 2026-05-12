require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    const data = await response.json();
    if (data.models) {
      console.log("Available models:");
      data.models.forEach(m => {
        console.log(`${m.name} - ${m.displayName}`);
      });
    } else {
      console.log("No models found or error:");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

listModels();
