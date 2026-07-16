export const greetingConversation = {
  id: "greeting-check-in",
  title: "Keep a greeting going",
  description: "Answer, react, and return a question instead of stopping after one phrase.",
  start: "check-in",
  nodes: {
    "check-in": {
      speaker: "Lucía",
      text: "¡Hola! ¿Cómo estás?",
      translation: "Hi! How are you?",
      prompt: "Say how you feel. A strong reply also asks the question back.",
      hint: "Try: Muy bien, gracias. ¿Y tú?",
      replies: [
        {
          id: "positive-return",
          label: "Muy bien, gracias. ¿Y tú?",
          meaning: "Very well, thanks. And you?",
          accepted: ["muy bien gracias y tu", "estoy muy bien gracias y tu", "bien gracias y tu"],
          feedback: "Great: you answered and returned the question.",
          skill: "answer + ask back",
          next: "positive"
        },
        {
          id: "positive-short",
          label: "Muy bien, gracias.",
          meaning: "Very well, thanks.",
          accepted: ["muy bien gracias", "estoy muy bien", "bien gracias", "muy bien"],
          feedback: "Correct. To keep it moving, add “¿Y tú?” next time.",
          skill: "answer",
          next: "positive"
        },
        {
          id: "neutral",
          label: "Más o menos. Estoy un poco cansado.",
          meaning: "So-so. I'm a little tired.",
          accepted: ["mas o menos", "estoy un poco cansado", "estoy un poco cansada", "estoy cansado", "estoy cansada"],
          feedback: "Nice: a feeling plus one detail gives the other person something to answer.",
          skill: "answer + detail",
          next: "neutral"
        },
        {
          id: "negative",
          label: "No muy bien. Estoy enfermo.",
          meaning: "Not very well. I'm sick.",
          accepted: ["no muy bien", "estoy enfermo", "estoy enferma", "estoy mal", "muy mal"],
          feedback: "Good. You expressed a negative state naturally.",
          skill: "negative answer",
          next: "negative"
        }
      ]
    },
    positive: {
      speaker: "Lucía",
      text: "¡Qué bien! Yo también estoy bien. ¿Qué haces hoy?",
      translation: "That's great! I'm well too. What are you doing today?",
      prompt: "Give one activity, then ask Lucía what she is doing.",
      hint: "Trabajo hoy. ¿Y tú, qué haces?",
      replies: [
        {
          id: "work-return",
          label: "Trabajo hoy. ¿Y tú, qué haces?",
          meaning: "I'm working today. And you, what are you doing?",
          accepted: ["trabajo hoy y tu que haces", "hoy trabajo y tu", "trabajo y tu que haces"],
          feedback: "Excellent: answer, detail, and a useful follow-up question.",
          skill: "answer + follow up",
          next: "work-end"
        },
        {
          id: "study",
          label: "Estudio español y después descanso.",
          meaning: "I'm studying Spanish and resting afterwards.",
          accepted: ["estudio espanol", "estudio espanol y despues descanso", "hoy estudio", "voy a estudiar"],
          feedback: "Good: joining two small ideas makes your answer easier to continue.",
          skill: "two details",
          next: "study-end"
        },
        {
          id: "rest",
          label: "Hoy descanso. ¿Y tú?",
          meaning: "I'm resting today. And you?",
          accepted: ["hoy descanso", "descanso hoy", "voy a descansar", "no hago nada hoy"],
          feedback: "Good. A short answer plus “¿Y tú?” keeps the exchange alive.",
          skill: "answer + ask back",
          next: "rest-end"
        }
      ]
    },
    neutral: {
      speaker: "Lucía",
      text: "Vaya. ¿Trabajas mucho hoy?",
      translation: "Oh dear. Are you working a lot today?",
      prompt: "Answer yes or no and add one small reason.",
      hint: "Sí, trabajo mucho por la mañana.",
      replies: [
        { id: "busy", label: "Sí, trabajo mucho por la mañana.", meaning: "Yes, I work a lot in the morning.", accepted: ["si trabajo mucho", "trabajo mucho por la manana", "si estoy trabajando mucho"], feedback: "Well done: your reason creates a natural next topic.", skill: "answer + reason", next: "busy-end" },
        { id: "not-busy", label: "No, pero dormí poco.", meaning: "No, but I didn't sleep much.", accepted: ["no pero dormi poco", "no dormi bien", "dormi poco"], feedback: "Good: “pero” lets you explain the contrast simply.", skill: "answer + contrast", next: "sleep-end" }
      ]
    },
    negative: {
      speaker: "Lucía",
      text: "Qué pena. ¿Necesitas algo?",
      translation: "That's a shame. Do you need anything?",
      prompt: "Say what you need, or politely say no.",
      hint: "Necesito descansar, gracias.",
      replies: [
        { id: "need-rest", label: "Necesito descansar, gracias.", meaning: "I need to rest, thanks.", accepted: ["necesito descansar", "necesito dormir", "quiero descansar"], feedback: "Good: necesito + infinitive is a very useful conversation frame.", skill: "state a need", next: "recover-end" },
        { id: "no-thanks", label: "No, gracias. Voy a descansar.", meaning: "No, thanks. I'm going to rest.", accepted: ["no gracias", "no gracias voy a descansar", "estoy bien gracias"], feedback: "Natural and polite. You also said what you will do next.", skill: "decline + detail", next: "recover-end" }
      ]
    },
    "work-end": { speaker: "Lucía", text: "Yo voy al mercado. ¡Que tengas un buen día!", translation: "I'm going to the market. Have a good day!", complete: true },
    "study-end": { speaker: "Lucía", text: "¡Muy bien! Yo voy al mercado. Nos vemos luego.", translation: "Very good! I'm going to the market. See you later.", complete: true },
    "rest-end": { speaker: "Lucía", text: "Yo voy al mercado. Disfruta tu día libre.", translation: "I'm going to the market. Enjoy your day off.", complete: true },
    "busy-end": { speaker: "Lucía", text: "Entiendo. Espero que descanses esta tarde.", translation: "I understand. I hope you rest this afternoon.", complete: true },
    "sleep-end": { speaker: "Lucía", text: "Ah, entiendo. Entonces descansa esta noche.", translation: "Ah, I understand. Then rest tonight.", complete: true },
    "recover-end": { speaker: "Lucía", text: "Claro. Espero que te mejores pronto.", translation: "Of course. I hope you feel better soon.", complete: true }
  }
};

const introductionConversation = {
  id: "meeting-someone",
  title: "Meet someone new",
  description: "Introduce yourself, say where you are from, and return a personal question.",
  level: "Starter",
  start: "introduction",
  nodes: {
    introduction: {
      speaker: "Diego",
      text: "¡Hola! Me llamo Diego. ¿Cómo te llamas?",
      translation: "Hi! My name is Diego. What's your name?",
      prompt: "Introduce yourself, then ask Diego where he is from.",
      starter: "Me llamo…",
      words: ["me llamo", "soy", "¿de dónde eres?"],
      hint: "Me llamo Alex. ¿De dónde eres?",
      replies: [
        { id: "name-return", label: "Me llamo Alex. ¿De dónde eres?", meaning: "My name is Alex. Where are you from?", accepted: ["me llamo alex de donde eres", "soy alex de donde eres", "mi nombre es alex de donde eres"], feedback: "Excellent: you introduced yourself and returned a personal question.", skill: "introduce + ask", next: "origin" },
        { id: "name-short", label: "Me llamo Alex. Mucho gusto.", meaning: "My name is Alex. Nice to meet you.", accepted: ["me llamo alex", "soy alex", "mi nombre es alex", "mucho gusto"], feedback: "Good introduction. Asking a question next would keep it moving.", skill: "introduce", next: "origin" }
      ]
    },
    origin: {
      speaker: "Diego",
      text: "Soy de México. ¿Y tú, de dónde eres?",
      translation: "I'm from Mexico. And you, where are you from?",
      prompt: "Say where you are from and react to Diego's answer.",
      starter: "Soy de…",
      words: ["soy de", "vivo en", "qué bien"],
      hint: "Soy de Austria. ¡Qué bien!",
      replies: [
        { id: "from", label: "Soy de Austria. ¡Qué bien!", meaning: "I'm from Austria. That's great!", accepted: ["soy de austria", "vengo de austria", "austria que bien"], feedback: "Nice: you answered and reacted instead of ending abruptly.", skill: "answer + react", next: "intro-end" },
        { id: "live", label: "Soy de Austria, pero vivo aquí.", meaning: "I'm from Austria, but I live here.", accepted: ["soy de austria pero vivo aqui", "vivo aqui", "vivo en espana"], feedback: "Great use of “pero” to add an interesting detail.", skill: "answer + detail", next: "intro-end" }
      ]
    },
    "intro-end": { speaker: "Diego", text: "¡Encantado de conocerte! Nos vemos pronto.", translation: "Nice to meet you! See you soon.", complete: true }
  }
};

const cafeConversation = {
  id: "at-the-cafe",
  title: "Order at a café",
  description: "Order a drink, respond to a follow-up question, and close politely.",
  level: "Starter",
  start: "order",
  nodes: {
    order: {
      speaker: "Camarera",
      text: "Buenos días. ¿Qué quieres tomar?",
      translation: "Good morning. What would you like to drink?",
      prompt: "Order one drink politely.",
      starter: "Quiero…",
      words: ["quiero", "un café", "un té", "por favor"],
      hint: "Quiero un café, por favor.",
      replies: [
        { id: "coffee", label: "Quiero un café, por favor.", meaning: "I'd like a coffee, please.", accepted: ["quiero un cafe por favor", "un cafe por favor", "quisiera un cafe"], feedback: "Perfect: a clear request softened with “por favor.”", skill: "polite request", next: "milk" },
        { id: "tea", label: "Un té, por favor.", meaning: "A tea, please.", accepted: ["un te por favor", "quiero un te", "quisiera un te"], feedback: "Good: short, natural, and polite.", skill: "short request", next: "tea-followup" }
      ]
    },
    milk: {
      speaker: "Camarera",
      text: "Claro. ¿Con leche o solo?",
      translation: "Of course. With milk or black?",
      prompt: "Choose one and thank the server.",
      starter: "Con… / Solo…",
      words: ["con leche", "solo", "gracias"],
      hint: "Con leche, gracias.",
      replies: [
        { id: "with-milk", label: "Con leche, gracias.", meaning: "With milk, thank you.", accepted: ["con leche gracias", "con leche", "quiero leche"], feedback: "Exactly right: answer the choice and acknowledge the server.", skill: "choose + thank", next: "cafe-end" },
        { id: "black", label: "Solo, gracias.", meaning: "Black, thank you.", accepted: ["solo gracias", "sin leche", "cafe solo"], feedback: "Natural and concise.", skill: "choose + thank", next: "cafe-end" }
      ]
    },
    "tea-followup": {
      speaker: "Camarera",
      text: "Muy bien. ¿Quieres algo para comer?",
      translation: "Very well. Would you like something to eat?",
      prompt: "Accept or decline politely.",
      starter: "Sí, quiero… / No, gracias.",
      words: ["sí", "quiero", "no, gracias"],
      hint: "No, gracias. Solo el té.",
      replies: [
        { id: "decline", label: "No, gracias. Solo el té.", meaning: "No, thank you. Just the tea.", accepted: ["no gracias solo el te", "no gracias", "solo el te"], feedback: "Good: polite and clear.", skill: "decline politely", next: "cafe-end" },
        { id: "food", label: "Sí, quiero un bocadillo.", meaning: "Yes, I'd like a sandwich.", accepted: ["si quiero un bocadillo", "un bocadillo por favor", "quiero comer"], feedback: "Good: you accepted and made a specific request.", skill: "accept + request", next: "cafe-end" }
      ]
    },
    "cafe-end": { speaker: "Camarera", text: "Perfecto. Ahora mismo.", translation: "Perfect. Right away.", complete: true }
  }
};

const weekendConversation = {
  id: "weekend-plans",
  title: "Talk about the weekend",
  description: "Share a plan, react to someone else's plan, and ask a follow-up question.",
  level: "Beginner",
  start: "plans",
  nodes: {
    plans: {
      speaker: "Sofía",
      text: "¿Qué vas a hacer este fin de semana?",
      translation: "What are you going to do this weekend?",
      prompt: "Share one plan. Use “voy a” plus an action.",
      starter: "Voy a…",
      words: ["voy a", "descansar", "salir", "visitar", "este fin de semana"],
      hint: "Voy a descansar y ver una película.",
      replies: [
        { id: "relax", label: "Voy a descansar y ver una película.", meaning: "I'm going to rest and watch a movie.", accepted: ["voy a descansar", "voy a ver una pelicula", "descanso este fin de semana"], feedback: "Great: “voy a” gives you a reusable way to discuss plans.", skill: "share a plan", next: "invite" },
        { id: "friends", label: "Voy a salir con mis amigos. ¿Y tú?", meaning: "I'm going out with my friends. And you?", accepted: ["voy a salir con mis amigos", "salgo con mis amigos", "con mis amigos y tu"], feedback: "Excellent: a plan plus “¿Y tú?” naturally passes the turn back.", skill: "plan + ask back", next: "sofia-plan" }
      ]
    },
    invite: {
      speaker: "Sofía",
      text: "¡Qué bien! Yo voy al parque. ¿Quieres venir?",
      translation: "That's great! I'm going to the park. Do you want to come?",
      prompt: "Accept or decline, then add a reason.",
      starter: "Sí, claro… / Lo siento, pero…",
      words: ["sí, claro", "lo siento", "no puedo", "porque"],
      hint: "Sí, claro. ¿A qué hora?",
      replies: [
        { id: "accept", label: "Sí, claro. ¿A qué hora?", meaning: "Yes, of course. At what time?", accepted: ["si claro a que hora", "quiero ir", "si voy contigo"], feedback: "Excellent: you accepted and asked for the missing detail.", skill: "accept + follow up", next: "weekend-end" },
        { id: "decline", label: "Lo siento, pero no puedo. Tengo trabajo.", meaning: "Sorry, but I can't. I have work.", accepted: ["lo siento pero no puedo", "no puedo tengo trabajo", "tengo que trabajar"], feedback: "Natural: decline politely and give a short reason.", skill: "decline + reason", next: "weekend-end" }
      ]
    },
    "sofia-plan": {
      speaker: "Sofía",
      text: "Yo voy al parque con Ana.",
      translation: "I'm going to the park with Ana.",
      prompt: "React and ask one follow-up question.",
      starter: "¡Qué bien! ¿…?",
      words: ["qué bien", "dónde", "cuándo", "a qué hora"],
      hint: "¡Qué bien! ¿A qué hora vais?",
      replies: [
        { id: "when", label: "¡Qué bien! ¿A qué hora vais?", meaning: "That's great! What time are you going?", accepted: ["que bien a que hora vais", "a que hora", "cuando vais"], feedback: "Perfect: reaction plus a specific follow-up question.", skill: "react + follow up", next: "weekend-end" },
        { id: "where", label: "¡Qué bien! ¿Dónde está el parque?", meaning: "That's great! Where is the park?", accepted: ["que bien donde esta el parque", "donde esta el parque", "que parque"], feedback: "Good: your question opens another useful topic.", skill: "react + question", next: "weekend-end" }
      ]
    },
    "weekend-end": { speaker: "Sofía", text: "Luego te cuento. ¡Que tengas un buen fin de semana!", translation: "I'll tell you later. Have a good weekend!", complete: true }
  }
};

greetingConversation.level = "Starter";
Object.assign(greetingConversation.nodes["check-in"], {
  starter: "Estoy… / Muy…",
  words: ["muy bien", "más o menos", "estoy cansado", "gracias", "¿y tú?"]
});
Object.assign(greetingConversation.nodes.positive, {
  starter: "Hoy… / Voy a…",
  words: ["trabajo", "estudio", "descanso", "después", "¿y tú?"]
});
Object.assign(greetingConversation.nodes.neutral, {
  starter: "Sí… / No, pero…",
  words: ["trabajo", "mucho", "dormí poco", "por la mañana"]
});
Object.assign(greetingConversation.nodes.negative, {
  starter: "Necesito… / No, gracias…",
  words: ["necesito", "descansar", "dormir", "no, gracias"]
});

export const conversationScenarios = [greetingConversation, introductionConversation, cafeConversation, weekendConversation];

export function normalizeConversationText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchConversationReply(node, answer) {
  const submitted = normalizeConversationText(answer);
  if (!submitted) return null;
  const candidates = (node?.replies || []).flatMap((reply) =>
    (reply.accepted || []).map((accepted) => ({ reply, text: normalizeConversationText(accepted) }))
  );
  const exact = candidates.find((candidate) => submitted === candidate.text);
  if (exact) return exact.reply;

  // Prefer the most specific phrase. This prevents a negative reply such as
  // "no muy bien" from being swallowed by the shorter positive "muy bien".
  const contained = candidates
    .filter((candidate) => candidate.text && submitted.includes(candidate.text))
    .sort((a, b) => b.text.length - a.text.length)[0];
  return contained?.reply || null;
}
