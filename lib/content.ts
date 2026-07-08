import { Mode } from "./supabase";

export const AUDIO_BASE = (mode: Mode) =>
  `/audio/${mode === "adult" ? "adult" : "children"}`;

export const audioClip = (mode: Mode, name: string) =>
  `${AUDIO_BASE(mode)}/${name}_${mode === "adult" ? "adult" : "child"}.mp3`;

export const STUDY_TITLE =
  "Privacy-Preserving Video Anonymization for Human-Robot Interaction Research";

export const content = {
  adult: {
    welcomeHeading: "Welcome",
    welcomeBody:
      "Thank you for taking part in this study. Please enter the participant ID you were given below to begin.",
    participantIdLabel: "Enter your Participant ID",
    participantIdPlaceholder: "e.g. A1",
    duplicateIdError:
      "This participant ID has already been used. Please check with your session coordinator for the correct ID.",
    submit: "Continue",
    slideshowIntroHeading: "Comparing Faces",
    slideshowQuestion: "Are these the same person?",
    confidenceLabel: "How confident are you?",
    answerSame: "Same Person",
    answerNotSame: "Not the Same Person",
    answerNotSure: "Not Sure",
    next: "Next",
    replay: "Replay",
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
    finishSession: "Finish Session",
    leaveWarningTitle: "Leaving will end this session",
    leaveWarningBody:
      "This study does not support going back. Going back from here means restarting the session from the beginning.",
    leaveWarningDismiss: "Okay, continue",
    leaveWarningConfirm: "Restart Session",
    reloadWarningTitle: "Refreshing will restart this session",
    reloadWarningBody:
      "Your answers so far are already saved, but refreshing will send you back to the very beginning.",
    reloadWarningDismiss: "Okay, stay here",
    reloadWarningConfirm: "Restart Session",
    errorTitle: "Something went wrong",
    errorBody:
      "Please let your session coordinator know. They can help get things back on track.",
    errorRetry: "Try Again",
  },
  children: {
    welcomeHeading: "Hi there!",
    welcomeBody:
      "We're so happy you're here! Type in your special ID to start the fun.",
    participantIdLabel: "Type your ID",
    participantIdPlaceholder: "e.g. C1",
    duplicateIdError:
      "That ID has already been used! Ask the grown-up in the room for the right one.",
    submit: "Let's Go!",
    slideshowIntroHeading: "Spot the Match!",
    slideshowQuestion: "Are these two pictures the same person?",
    confidenceLabel: "How sure are you?",
    answerSame: "Same Person 👍",
    answerNotSame: "Different Person 👎",
    answerNotSure: "Not Sure 🤔",
    next: "Next",
    replay: "Watch Again",
    standUpHeading: "Wiggle Break!",
    standUpBody:
      "Stand up and give yourself some space. It's time to move around a little!",
    standUpReady: "I'm Ready!",
    seeYourselfHeading: "Look Closely!",
    seeYourselfQuestion: "Is this you?",
    seeYourselfYes: "Yes!",
    seeYourselfNo: "No",
    seeYourselfNotSure: "Not Sure",
    questionnaireHeading: "Almost Done!",
    questionnaireBody:
      "Please answer a few more fun questions below with a grown-up if you need help.",
    questionnaireDone: "All Done With Questions!",
    goodbyeHeading: "You Did Amazing!",
    goodbyeBody:
      "Thank you so much for playing with us today! You were super helpful. You can tell the grown-up in the room that you're finished.",
    finishSession: "All Done!",
    leaveWarningTitle: "Whoops, hold on!",
    leaveWarningBody:
      "We can't go back during this game. Going back means starting over from the beginning!",
    leaveWarningDismiss: "Okay!",
    leaveWarningConfirm: "Start Over",
    reloadWarningTitle: "Wait, don't refresh!",
    reloadWarningBody:
      "Refreshing will start the game over from the very beginning!",
    reloadWarningDismiss: "Okay!",
    reloadWarningConfirm: "Start Over",
    errorTitle: "Oops!",
    errorBody:
      "Something went a little wonky. Let's ask the grown-up in the room for help!",
    errorRetry: "Try Again!",
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
    a: `/slideshow/pair_${pairNumber}a.png`,
    b: `/slideshow/pair_${pairNumber}b.png`,
  };
}
