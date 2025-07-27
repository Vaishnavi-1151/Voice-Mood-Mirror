let recognition;
let isListening = false;

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'en-US';

  recognition.onresult = function (event) {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    document.getElementById('userInput').value += transcript;
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);
  };
}

function startListening() {
  if (recognition && !isListening) {
    recognition.start();
    isListening = true;
  }
}

function stopListening() {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
  }
}

function detectMood(text) {
  const sadWords = ["sad", "hurt", "depressed", "alone", "tired", "cry"];
  const happyWords = ["happy", "excited", "joy", "grateful", "smile"];
  const angryWords = ["angry", "mad", "upset", "frustrated", "annoyed"];

  const lc = text.toLowerCase();
  if (sadWords.some(w => lc.includes(w))) return "sad";
  if (happyWords.some(w => lc.includes(w))) return "happy";
  if (angryWords.some(w => lc.includes(w))) return "angry";
  return "neutral";
}

function talkToMirror() {
  const input = document.getElementById("userInput").value.trim();
  const responseDiv = document.getElementById("response");

  if (!input) {
    responseDiv.innerText = "Please speak or type something.";
    return;
  }

  const mood = detectMood(input);
  let reply = "";

  switch (mood) {
    case "happy":
      reply = "I can feel your joy! Let’s hold on to this sunshine together.";
      break;
    case "sad":
      reply = "I hear your pain. It's okay to feel this way — I'm here with you.";
      break;
    case "angry":
      reply = "Let it out. You're allowed to feel anger. I'm still here listening.";
      break;
    default:
      reply = "Thank you for opening up. What else is on your heart?";
  }

  responseDiv.innerText = reply;

  // Voice reply
  const synth = window.speechSynthesis;
  if (synth.speaking) synth.cancel();

  const utterance = new SpeechSynthesisUtterance(reply);
  utterance.rate = 0.9; // slower, more comforting
  utterance.pitch = 1.1; // slightly warm
  utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes("Google") || v.name.includes("Female")) || speechSynthesis.getVoices()[0];
  synth.speak(utterance);
}
