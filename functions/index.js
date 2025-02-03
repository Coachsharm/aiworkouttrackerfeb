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

  if (!data.workoutText) {
    throw new functions.https.HttpsError('invalid-argument', 'No workout text provided');
  }

  try {
    console.log('Processing workout with data:', data); // Debug log

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

    console.log('OpenAI response:', completion.choices[0].message.content); // Debug log

    // Parse the response
    let parsedWorkout;
    try {
      parsedWorkout = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to parse workout data. Please try again with a clearer description.'
      );
    }

    // Validate the parsed workout
    if (!parsedWorkout.exercises || !Array.isArray(parsedWorkout.exercises)) {
      throw new functions.https.HttpsError(
        'internal',
        'Invalid workout format. Please try again with a clearer description.'
      );
    }

    // Store in Firestore
    const workoutDoc = await admin.firestore()
      .collection('workouts')
      .add({
        ...parsedWorkout,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        rawInput: data.workoutText,
        createdBy: context.auth.uid
      });

    console.log('Workout stored with ID:', workoutDoc.id); // Debug log

    return {
      success: true,
      workout: parsedWorkout,
      id: workoutDoc.id
    };

  } catch (error) {
    console.error('Error processing workout:', error);
    
    // Handle different types of errors
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      throw new functions.https.HttpsError(
        'deadline-exceeded',
        'Request timed out. Please try again.'
      );
    }

    throw new functions.https.HttpsError(
      'internal',
      'Error processing workout: ' + error.message
    );
  }
});