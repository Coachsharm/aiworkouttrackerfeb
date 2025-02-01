const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');

admin.initializeApp();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.processWorkout = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  try {
    // Process with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a workout tracking assistant. Extract workout details from user input.
            Return a JSON object with the following structure:
            {
              exercises: [{
                name: string,
                sets: number,
                reps: number,
                weight?: number,
                notes?: string
              }],
              duration: number (in minutes),
              type: "strength" | "cardio" | "hybrid"
            }`
        },
        {
          role: "user",
          content: data.workoutText
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    // Parse the response
    const parsedWorkout = JSON.parse(completion.choices[0].message.content);

    // Store in Firestore
    await admin.firestore()
      .collection('users')
      .doc(context.auth.uid)
      .collection('workouts')
      .add({
        ...parsedWorkout,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        rawInput: data.workoutText
      });

    return {
      success: true,
      workout: parsedWorkout
    };

  } catch (error) {
    console.error('Error processing workout:', error);
    throw new functions.https.HttpsError('internal', 'Error processing workout');
  }
});