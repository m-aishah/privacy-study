import { Mode } from "./supabase";

export const AUDIO_BASE = (mode: Mode) => `/audio/${mode === "adult" ? "adult" : "children"}`;

export const audioClip = (mode: Mode, name: string) => `${AUDIO_BASE(mode)}/${name}.mp3`;

export const content = {
  adult: {
    welcomeHeading: "Welcome",
    welcomeBody:
      "Thank you for taking part in this study. Please enter the participant ID you were given below to begin.",
    participantIdLabel: "Enter your Participant ID",
    submit: "Continue",
    slideshowIntroHeading: "Comparing Faces",
    slideshowQuestion: "Are these the same person?",
    confidenceLabel: "How confident are you?",
    answerSame: "Same Person",
    answerNotSame: "Not the Same Person",
    answerNotSure: "Not Sure",
    next: "Next",
    standUpHeading: "Time to Stand Up",
    standUpBody:
      "Please stand up and make sure you have some space around you. The next few actions will need a bit more room.",
    standUpReady: "Ready",
    seeYourselfHeading: "Take a Look",
    seeYourselfQuestion: "Do you recognise yourself in this image?",
    seeYourselfYes: "Yes",
    seeYourselfNo: "No",
    seeYourselfNotSure: "Not Sure",
    questionnaireHeading: "Final Questionnaire",
    questionnaireBody: "Please complete the short questionnaire below.",
    questionnaireDone: "I have completed the questionnaire",
    goodbyeHeading: "Thank You",
    goodbyeBody:
      "Thank you for participating in this study. Your contribution helps advance privacy-preserving technology. You may now let the session coordinator know you are finished.",
  },
  children: {
    welcomeHeading: "Hi there!",
    welcomeBody: "We're so happy you're here! Type in your special ID number to start the fun.",
    participantIdLabel: "Type your ID number",
    submit: "Let's Go!",
    slideshowIntroHeading: "Spot the Match!",
    slideshowQuestion: "Are these two pictures the same person?",
    confidenceLabel: "How sure are you?",
    answerSame: "Same Person 👍",
    answerNotSame: "Different Person 👎",
    answerNotSure: "Not Sure 🤔",
    next: "Next ➡️",
    standUpHeading: "Wiggle Break!",
    standUpBody: "Stand up and give yourself some space — it's time to move around a little!",
    standUpReady: "I'm Ready! 🙌",
    seeYourselfHeading: "Look Closely!",
    seeYourselfQuestion: "Is this you?",
    seeYourselfYes: "Yes! 😄",
    seeYourselfNo: "No 🙅",
    seeYourselfNotSure: "Not Sure 🤔",
    questionnaireHeading: "Almost Done!",
    questionnaireBody: "Please answer a few more fun questions below with a grown-up if you need help.",
    questionnaireDone: "All Done With Questions! ✅",
    goodbyeHeading: "You Did Amazing!",
    goodbyeBody:
      "Thank you so much for playing with us today! You were super helpful. You can tell the grown-up in the room that you're finished. 🎉",
  },
} as const;

export const TOTAL_PAIRS = 15;
export const TOTAL_ACTIONS = 15;
export const STAND_UP_AFTER_ACTION = 12;

export function actionVideoSrc(mode: Mode, actionNumber: number) {
  const suffix = mode === "adult" ? "adult" : "child";
  return `/video/${mode}/action_${actionNumber}_${suffix}.mp4`;
}

export function slideshowPairSrc(pairNumber: number) {
  return {
    a: `/slideshow/pair_${pairNumber}a.jpg`,
    b: `/slideshow/pair_${pairNumber}b.jpg`,
  };
}
