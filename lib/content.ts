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
    questionnaireBody:
      "Please open the questionnaire below and complete it in the new tab that appears. When you're done, come back to this tab.",
    questionnaireOpenButton: "Open Questionnaire",
    questionnaireDone: "I have completed the questionnaire",
    openEndedIntro:
      "Before we finish, we would love to hear your thoughts. There are no right or wrong answers — just tell us what you genuinely think.",
    openEndedCaption:
      "This is an example of what our privacy system does to a video recording — the original face has been replaced while keeping the person's movements and expressions intact.",
    openEndedPlaceholder: "Type your thoughts here...",
    openEndedNext: "Next",
    openEndedSkip: "Skip",
    openEndedQuestions: [
      "When you imagine a system that can record you but shows a different face instead of yours, how does that make you feel?",
      "Do you think a tool like this could be useful in any situations or contexts? If yes, where?",
      "What concerns, if any, do you have about a system that replaces faces in video recordings?",
      "Now that you have seen what the system does — do you feel it adequately protects a person's identity? Why or why not?",
      "Would you feel comfortable participating in a research study where your face was replaced using this kind of system? What would make you more or less comfortable?",
    ],
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
      "Tap the button below to open a few more fun questions in a new tab — ask a grown-up if you need help. When you're done, come back here.",
    questionnaireOpenButton: "Open the Questions!",
    questionnaireDone: "All Done With Questions!",
    openEndedCaption:
      "Look at this! Our special computer changed what this person's face looks like in the video — but you can still see everything they are doing!",
    openEndedQuestion:
      "How does it make you feel seeing someone's face changed like this in a video? You can write anything you want or draw how you feel!",
    openEndedPlaceholder: "Write anything you want here!",
    openEndedNext: "Next",
    openEndedEmojiOptions: [
      { emoji: "😊", label: "Cool / I like it" },
      { emoji: "😐", label: "Not sure" },
      { emoji: "😟", label: "It makes me uncomfortable" },
    ],
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

export const TOTAL_PAIRS = 16;
export const TOTAL_ACTIONS = 15;
export const STAND_UP_AFTER_ACTION = 12;

export function actionVideoSrc(_mode: Mode, actionNumber: number) {
  // Both adult and children modes currently play from the adult video
  // folder/naming until dedicated children's action videos are recorded.
  return `/video/adult/action_${actionNumber}_adult.mp4`;
}

export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png"] as const;

export function slideshowPairSrc(pairNumber: number) {
  // No extension here on purpose — FallbackImage tries each of
  // IMAGE_EXTENSIONS in turn, since pair images may be saved as
  // .jpg, .jpeg, or .png.
  return {
    a: `/slideshow/pair_${pairNumber}a`,
    b: `/slideshow/pair_${pairNumber}b`,
  };
}
