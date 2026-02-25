const STORAGE_KEY = "operator-discovery-toolkit:v1";
const QUICK_KEY = "operator-discovery-toolkit:quick:v1";

const PHASES = [
  { id: 1, name: "Systems Mapping", minutes: 30 },
  { id: 2, name: "Pattern Extraction", minutes: 12 },
  { id: 3, name: "Failure Modes", minutes: 10 },
  { id: 4, name: "Doctrine", minutes: 8 },
  { id: 5, name: "Alignment", minutes: 10 },
];

const SYSTEMS = [
  [
    "energy",
    "Energy",
    "How cognitive fuel is spent and restored.",
    "This reveals what truly charges you.",
    [
      "What drains energy even when work looks simple?",
      "What usually precedes an energized state?",
      "Do you recover by stopping or by switching modes?",
      "What triggers 'tired but wired' for you?",
      "When you're depleted, what's the first thing that degrades - patience, creativity, focus, or something else?",
    ],
  ],
  [
    "attention",
    "Attention",
    "How focus moves and breaks.",
    "This reveals what your focus actually needs.",
    [
      "When flow appears, what conditions are present?",
      "What reliably breaks focus?",
      "How long does context rebuild take after interruption?",
      "Which task switches are cheap versus expensive?",
      "Do you focus better with background activity (music, noise, movement) or in silence?",
    ],
  ],
  [
    "motivation",
    "Motivation",
    "What sustains engagement.",
    "This shows what keeps you going - and what stalls you.",
    [
      "What keeps you engaged when work gets hard?",
      "Do you respond more to momentum or completion?",
      "What kills momentum quickly?",
      "Where do you reliably re-engage without force?",
    ],
  ],
  [
    "identity",
    "Identity",
    "How self-story amplifies friction.",
    "Naming identity threats reduces shame loops.",
    [
      "Where is the gap between how you work and should-work stories?",
      "Which failures trigger self-judgment fastest?",
      "What strengths do you under-credit?",
      "What would feel safer in an actually aligned system?",
      "What's something about how you work that you've apologized for or tried to fix - but it keeps coming back?",
    ],
  ],
  [
    "memory",
    "Memory",
    "How context is recalled or reconstructed.",
    "This reveals how you get back to where you were.",
    [
      "When returning to work, what is hardest to recover?",
      "Do you depend more on recall or recognition cues?",
      "What artifacts make re-entry fast?",
      "What fails when external context is missing?",
      "When you remember something well, what form is it usually in - visual, verbal, spatial, emotional, procedural?",
    ],
  ],
  [
    "learning",
    "Learning",
    "How information is absorbed.",
    "This shows how information actually enters your world.",
    [
      "How do you learn new domains in practice?",
      "Which learning formats create friction?",
      "What helps ideas stick for use?",
      "Where do you learn faster than expected?",
    ],
  ],
  [
    "environment",
    "Environment",
    "Where your surroundings work with you versus against you.",
    "This reveals where friction lives in your daily context.",
    [
      "What parts of your daily environment feel like they work with you - where things just flow?",
      "Where do you regularly feel like you're translating - converting how you think into how something expects you to work?",
      "When has changing a tool, space, or routine dramatically changed how well you work?",
      "If your environment could stop asking one thing of you, what would it be?",
    ],
  ],
];

const PATTERN_EXAMPLES = [
  "Runs on stimulation more than restoration",
  "Detects momentum more than completion",
  "Loses context easily but rebuilds fast with the right cues",
  "Learns by doing, not by reading - format mismatch creates friction",
  "Needs closure to rest - open loops drain energy even during downtime",
  "Thinks by talking - ideas form in conversation, not isolation",
];

const CATA = [
  "Being pulled in too many directions at once",
  "Getting interrupted during deep focus",
  "Too many things to hold in your head at once",
  "Having to decide before you're ready",
  "Feeling like you're failing at something you should be good at",
];

const OKAY = [
  "A messy desk or cluttered files",
  "Having the same thing in two places",
  "Not being sure exactly where something is",
  "Open loops and unfinished tasks",
  "Too many notifications or too much information",
];

const DIRECTIVE_EXAMPLES = [
  "Preserve and extend cognitive momentum",
  "Ensure understanding before action",
  "Maintain connection between work and meaning",
];

const DOCTRINE_EXAMPLES = [
  {
    title: "Momentum-Driven System",
    directive: "Preserve and extend cognitive momentum.",
    meta: "Does this preserve or degrade cognitive momentum?",
    patterns: [
      "Runs on stimulation, not restoration.",
      "Detects momentum, not completion.",
      "Restart cost is the dominant memory friction.",
    ],
  },
  {
    title: "Precision-First System",
    directive: "Ensure understanding before action.",
    meta: "Can I explain why this is correct, not just that it works?",
    patterns: [
      "Learns by constructing mental models before doing.",
      "Needs depth, not superficial familiarity.",
      "Trust is earned through demonstrated correctness.",
    ],
  },
  {
    title: "Relational-Contextual System",
    directive: "Maintain connection between work and meaning.",
    meta: "Who benefits from this, and do I believe that?",
    patterns: [
      "Engagement is sustained by perceived impact.",
      "Thinking happens in dialogue more than isolation.",
      "Context switching is easier with relational continuity.",
    ],
  },
];

const QUICK_QUESTIONS = [
  "When you get interrupted mid-task, how long does it usually take to get fully back in?",
  "Do you usually know what you want to build before you start, or do you figure it out by building?",
  "When someone gives you feedback, do you want to understand their reasoning or just know what to change?",
  "What's the last tool or process you abandoned, and what specifically felt wrong?",
  "When do you do your best thinking: alone, in conversation, by writing, or by doing?",
];

let idSeed = Date.now();
const uid = (prefix) => `${prefix}-${++idSeed}`;

const questionRows = SYSTEMS.flatMap(([sid, sname, , , qs]) =>
  qs.map((q, i) => ({ id: `${sid}-${i}`, sid, sname, q, index: i }))
);

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function emptyPattern() {
  return { id: uid("p"), statement: "", prediction: "", implication: "" };
}

function emptyTool() {
  return { id: uid("t"), name: "", context: "", alignment: "mixed", notes: "", action: "" };
}

function blankMainState() {
  return {
    startedAt: null,
    lastActivity: null,
    currentPhase: 1,
    p1: { s: 0, q: 0, answers: {} },
    p2: { themes: "", observations: [], observationResponses: {}, patterns: [emptyPattern()] },
    p3: { analyses: {} },
    p4: {
      directive: "",
      meta: "",
      notes: "",
      scaffold: { commonThread: "", protect: "", depends: "" },
      checks: { descriptive: false, testable: false, generative: false, singular: false },
    },
    p5: { tools: [emptyTool()], synthesis: "" },
    updatedAt: null,
  };
}

function blankQuickState() {
  return {
    startedAt: null,
    completedAt: null,
    currentQuestion: 0,
    answers: Array.from({ length: QUICK_QUESTIONS.length }, () => ""),
    reflectionSeen: false,
    lastSavedAt: null,
  };
}

function hydrateMain(raw) {
  const base = blankMainState();
  const hydrated = {
    ...base,
    ...raw,
    p1: { ...base.p1, ...(raw.p1 || {}) },
    p2: { ...base.p2, ...(raw.p2 || {}) },
    p3: { ...base.p3, ...(raw.p3 || {}) },
    p4: { ...base.p4, ...(raw.p4 || {}) },
    p5: { ...base.p5, ...(raw.p5 || {}) },
  };

  const migratedAnswers = {};
  Object.entries(hydrated.p1.answers || {}).forEach(([key, value]) => {
    if (key.startsWith("tool-")) {
      migratedAnswers[key.replace("tool-", "environment-")] = value;
    } else {
      migratedAnswers[key] = value;
    }
  });
  hydrated.p1.answers = migratedAnswers;

  if (!Array.isArray(hydrated.p2.patterns) || hydrated.p2.patterns.length === 0) {
    hydrated.p2.patterns = [emptyPattern()];
  }
  if (!Array.isArray(hydrated.p2.observations)) {
    hydrated.p2.observations = [];
  }
  if (!hydrated.p2.observationResponses || typeof hydrated.p2.observationResponses !== "object") {
    hydrated.p2.observationResponses = {};
  }
  if (!Array.isArray(hydrated.p5.tools) || hydrated.p5.tools.length === 0) {
    hydrated.p5.tools = [emptyTool()];
  }

  hydrated.p2.patterns = hydrated.p2.patterns.map((item) => ({ ...emptyPattern(), ...item }));
  hydrated.p5.tools = hydrated.p5.tools.map((item) => ({ ...emptyTool(), ...item }));
  hydrated.p4.scaffold = { ...base.p4.scaffold, ...(hydrated.p4.scaffold || {}) };
  hydrated.p4.checks = { ...base.p4.checks, ...(hydrated.p4.checks || {}) };

  return hydrated;
}

function hydrateQuick(raw) {
  const base = blankQuickState();
  const hydrated = { ...base, ...(raw || {}) };
  if (!Array.isArray(hydrated.answers) || hydrated.answers.length !== QUICK_QUESTIONS.length) {
    hydrated.answers = base.answers;
  }
  return hydrated;
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const initialRawMain = loadJson(STORAGE_KEY, null);
let state = hydrateMain(initialRawMain || {});
let quickState = hydrateQuick(loadJson(QUICK_KEY, null));

const runtime = {
  mode: "landing",
  landingType: initialRawMain ? "welcome" : "fresh",
  savedFlashUntil: 0,
  doctrineStatus: "",
};

function saveMain({ flash = false } = {}) {
  state.updatedAt = new Date().toISOString();
  state.lastActivity = state.updatedAt;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (flash) runtime.savedFlashUntil = Date.now() + 1500;
}

function saveQuick() {
  quickState.lastSavedAt = new Date().toISOString();
  localStorage.setItem(QUICK_KEY, JSON.stringify(quickState));
}

function resetQuick() {
  quickState = blankQuickState();
  saveQuick();
}

function resetMain() {
  state = blankMainState();
  saveMain();
}

function nonEmptyPatterns() {
  return state.p2.patterns.filter((pattern) => pattern.statement.trim());
}

function syncAnalyses() {
  const next = {};
  nonEmptyPatterns().forEach((pattern) => {
    next[pattern.id] = {
      catastrophic: "",
      acceptable: "",
      severity: "contextual",
      tradeoff: "",
      ...(state.p3.analyses[pattern.id] || {}),
    };
  });
  state.p3.analyses = next;
}

function answeredCount() {
  return Object.values(state.p1.answers).filter((row) => row.status === "answered").length;
}

function touchedCount() {
  return Object.keys(state.p1.answers).length;
}

function phaseScore(n) {
  if (n === 1) return Math.min(1, touchedCount() / questionRows.length);
  if (n === 2) {
    return Math.min(1, (nonEmptyPatterns().length + (state.p2.themes.trim() ? 1 : 0)) / 4);
  }
  if (n === 3) {
    const patterns = nonEmptyPatterns();
    if (patterns.length === 0) return 0;
    const complete = patterns.filter((pattern) => {
      const analysis = state.p3.analyses[pattern.id] || {};
      return (analysis.catastrophic || "").trim() && (analysis.acceptable || "").trim();
    }).length;
    return complete / patterns.length;
  }
  if (n === 4) {
    const essentials = state.p4.directive.trim() && state.p4.meta.trim() ? 1 : 0;
    const checks = Object.values(state.p4.checks).filter(Boolean).length;
    return Math.min(1, (essentials + checks) / 5);
  }
  if (n === 5) {
    const toolCount = state.p5.tools.filter((tool) => tool.name.trim()).length;
    const synthesis = state.p5.synthesis.trim() ? 1 : 0;
    return Math.min(1, (toolCount + synthesis) / 4);
  }
  return 0;
}

function estimatedRemainingMinutes() {
  let minutes = 0;
  PHASES.forEach((phase) => {
    if (phase.id < state.currentPhase) return;
    if (phase.id > state.currentPhase) {
      minutes += phase.minutes;
      return;
    }
    minutes += Math.max(2, Math.round((1 - phaseScore(phase.id)) * phase.minutes));
  });
  return minutes;
}

function phaseClass(phaseId) {
  if (phaseId < state.currentPhase) return "complete";
  if (phaseId === state.currentPhase) return "active";
  return "pending";
}

function progressFillWidth() {
  const total = PHASES.length;
  const completedPhases = state.currentPhase - 1;
  const currentRatio = phaseScore(state.currentPhase);
  const ratio = (completedPhases + currentRatio) / total;
  return `${Math.max(0.02, Math.min(1, ratio)) * 100}%`;
}

function nowSavedFlash() {
  return Date.now() < runtime.savedFlashUntil;
}

function answerBySystem(systemId) {
  const system = SYSTEMS.find((entry) => entry[0] === systemId);
  return system[4].map((prompt, index) => {
    return { prompt, answer: state.p1.answers[`${systemId}-${index}`] || null };
  });
}

function phasesTouched() {
  const touched = [];
  if (Object.keys(state.p1.answers).length) touched.push("Phase 1");
  if (state.p2.themes.trim() || nonEmptyPatterns().length) touched.push("Phase 2");
  if (Object.keys(state.p3.analyses).length) touched.push("Phase 3");
  if (state.p4.directive.trim() || state.p4.meta.trim()) touched.push("Phase 4");
  if (state.p5.tools.some((tool) => tool.name.trim()) || state.p5.synthesis.trim())
    touched.push("Phase 5");
  return touched.length ? touched : ["None yet"];
}

function renderSessionInfoPanel() {
  const panel = document.getElementById("session-info-panel");
  const content = document.getElementById("session-info-content");
  if (!panel || !content) return;

  const hasSessionData = !!state.startedAt || !!state.updatedAt || touchedCount() > 0;
  panel.hidden = !hasSessionData;
  if (!hasSessionData) return;

  content.innerHTML = `
    <div class="session-info-content-grid" data-testid="session-info-panel">
      <div class="session-meta"><strong>Started:</strong> ${escapeHtml(
        state.startedAt ? new Date(state.startedAt).toLocaleString() : "Not started"
      )}</div>
      <div class="session-meta"><strong>Last activity:</strong> ${escapeHtml(
        state.lastActivity ? new Date(state.lastActivity).toLocaleString() : "No activity yet"
      )}</div>
      <div class="session-meta"><strong>Phases touched:</strong> ${escapeHtml(phasesTouched().join(", "))}</div>
      <div class="session-meta"><strong>Questions answered:</strong> ${answeredCount()} of ${questionRows.length}</div>
    </div>
  `;
}

function renderLanding() {
  if (runtime.landingType === "welcome") {
    const current = PHASES.find((phase) => phase.id === state.currentPhase) || PHASES[0];
    const completion = Math.round(phaseScore(state.currentPhase) * 100);
    return `
      <section class="panel landing-panel phase-transition" data-testid="landing-welcome">
        <h2>Welcome back</h2>
        <p class="lede">You were on Phase ${state.currentPhase}: ${escapeHtml(current.name)} - ${completion}% complete.</p>
        <p class="muted">Last saved: ${escapeHtml(
          state.updatedAt ? new Date(state.updatedAt).toLocaleString() : "Unknown"
        )}</p>
        <div class="actions">
          <button class="primary" data-action="continue-session">Continue Where I Left Off</button>
          <button data-action="start-fresh">Start Fresh</button>
        </div>
        <p class="quick-link">
          Not ready to dive back in?
          <button data-action="start-quick">Try the 5-Question Quick Assessment</button>
        </p>
      </section>
    `;
  }

  return `
    <section class="panel landing-panel phase-transition" data-testid="landing-fresh">
      <h2>The Discovery Journal</h2>
      <p class="lede">Discover how your mind actually works - not how you think it should.</p>
      <div class="landing-copy">
        <p>You use tools every day that were designed for someone else's brain.</p>
        <p>Not maliciously. The people who built them assumed everyone thinks the same way. For some people, that fit is real. For others, it becomes constant low-grade friction they learn to blame on themselves.</p>
        <p>This toolkit helps you stop guessing and start observing. You will examine seven cognitive systems, extract patterns with predictive power, and derive one doctrine that turns design decisions into testable ones.</p>
        <p>You leave with a Cognitive Architecture Document: a clear, portable description of how your mind operates and what that means for your tools, workflows, and systems.</p>
      </div>
      <p><span class="landing-meta">45-60 minutes, or take it across multiple sessions</span></p>
      <div class="actions">
        <button class="primary" data-action="begin-discovery">Begin Discovery</button>
      </div>
      <p class="quick-link">
        Not ready for the full process?
        <button data-action="start-quick">Try the 5-Question Quick Assessment</button>
      </p>
    </section>
  `;
}

function includesAny(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword));
}

function generateObservations(currentState) {
  const observations = [];
  const p1 = currentState.p1?.answers || {};
  const entriesForSystem = (systemId) => {
    const system = SYSTEMS.find((item) => item[0] === systemId);
    if (!system) return [];
    return system[4].map((_, index) => p1[`${systemId}-${index}`] || null);
  };
  const statusCount = (systemId, statuses) =>
    entriesForSystem(systemId).filter((entry) => entry && statuses.includes(entry.status)).length;
  const averageWordCount = (systemId) => {
    const entries = entriesForSystem(systemId).filter((entry) => entry && entry.text);
    if (!entries.length) return 0;
    const totalWords = entries.reduce((sum, entry) => {
      return sum + String(entry.text).trim().split(/\s+/).filter(Boolean).length;
    }, 0);
    return totalWords / entries.length;
  };
  const toText = (systemId) =>
    Object.entries(p1)
      .filter(([key]) => key.startsWith(`${systemId}-`))
      .map(([, value]) => String(value?.text || "").toLowerCase())
      .join(" ");

  const energy = toText("energy");
  const motivation = toText("motivation");
  const attention = toText("attention");
  const memory = toText("memory");
  const identity = toText("identity");
  const learning = toText("learning");
  const environment = toText("environment");

  const addObservation = (id, text, systems, confidence, prediction) => {
    observations.push({ id, text, systems, confidence, prediction });
  };

  const varietyEnergy = includesAny(energy, ["switch", "variety", "change", "different"]);
  const momentumMotivation = includesAny(motivation, ["momentum", "forward", "progress"]);
  if (varietyEnergy && momentumMotivation) {
    const confidence =
      (energy.match(/switch|variety|change|different/g) || []).length +
        (motivation.match(/momentum|forward|progress/g) || []).length >=
      3
        ? "strong"
        : "suggestive";
    addObservation(
      "energy-motivation-variety",
      "You seem to recharge through variety rather than rest, and what keeps you going is the feeling of forward motion. This combination means sustained sameness may be the real threat to your energy, not hard work itself.",
      ["Energy", "Motivation"],
      confidence,
      "Predict: I will disengage from work that stays in one mode for too long, even when the goal matters."
    );
  }

  const restEnergy = includesAny(energy, ["rest", "quiet", "recover", "recovery"]);
  const completionMotivation = includesAny(motivation, ["completion", "finishing", "done"]);
  if (restEnergy && completionMotivation) {
    const confidence =
      (energy.match(/rest|quiet|recover|recovery/g) || []).length +
        (motivation.match(/completion|finishing|done/g) || []).length >=
      3
        ? "strong"
        : "suggestive";
    addObservation(
      "energy-motivation-rest",
      "You appear to run on a rest-work-complete cycle. Genuine downtime helps you recharge, and finishing something makes effort feel worthwhile. Open loops may keep draining you even while you're trying to rest.",
      ["Energy", "Motivation"],
      confidence,
      "Predict: Unfinished tasks will keep pulling attention during downtime, even when I intend to rest."
    );
  }

  const longRebuild = includesAny(attention, ["long", "slow", "minutes", "hour", "afternoon"]);
  const contextLoss = includesAny(memory, ["context", "recover", "where", "rebuild", "lost"]);
  if (longRebuild && contextLoss) {
    const confidence = includesAny(attention, ["30", "20", "hour"]) ? "strong" : "suggestive";
    addObservation(
      "attention-memory-rebuild",
      "Interruptions seem to hit you double: breaking focus and erasing context. You likely need strong interruption protection and reliable external breadcrumbs to rebuild quickly.",
      ["Attention", "Memory"],
      confidence,
      "Predict: If I get interrupted without notes or breadcrumbs, restart time will increase sharply."
    );
  }

  const easySwitch = includesAny(attention, ["easy", "quick", "switch"]);
  const recognitionMemory = includesAny(memory, ["recognition", "cue", "visual", "trigger"]);
  if (easySwitch && recognitionMemory) {
    const confidence = easySwitch && recognitionMemory ? "strong" : "suggestive";
    addObservation(
      "attention-memory-cues",
      "You can switch contexts fairly easily when recognition cues are present. Multiple active threads may work for you as long as each has visible state you can scan.",
      ["Attention", "Memory"],
      confidence,
      "Predict: I can move between projects smoothly when each has clear visual state and next-step cues."
    );
  }

  if (includesAny(identity, ["should", "supposed to", "normal"])) {
    addObservation(
      "identity-should-gap",
      "You've noticed a gap between how you actually work and how you think you should. That gap often creates more friction than your real work patterns do.",
      ["Identity"],
      "strong",
      "Predict: When I force myself into a should-based process, resistance and self-judgment will increase."
    );
  }

  const identityNotSure = entriesForSystem("identity").filter(
    (entry) => entry && ["not_sure", "skipped"].includes(entry.status)
  ).length;
  const maxNotSure = SYSTEMS.reduce((max, system) => {
    const count = statusCount(system[0], ["not_sure", "skipped"]);
    return Math.max(max, count);
  }, 0);
  if (identityNotSure > 0 && identityNotSure === maxNotSure) {
    addObservation(
      "identity-hardest",
      "Identity questions were the hardest to answer. That's common and meaningful. Patterns closest to self-image are often hardest to see clearly at first.",
      ["Identity"],
      "suggestive",
      "Predict: As other patterns become clearer, identity-related friction will be easier to name directly."
    );
  }

  if (
    includesAny(learning, ["doing", "hands-on", "building", "experiment"]) &&
    includesAny(environment, ["translate", "friction", "format", "expects"])
  ) {
    addObservation(
      "learning-environment-mismatch",
      "You seem to learn by doing, while parts of your environment may force formats that don't match. The friction may be in the container, not the content.",
      ["Learning", "Environment"],
      "strong",
      "Predict: When learning is hands-on and iterative, retention and engagement will rise."
    );
  }

  SYSTEMS.forEach((system) => {
    const systemId = system[0];
    const systemName = system[1];
    const unclearCount = statusCount(systemId, ["not_sure", "skipped"]);
    if (unclearCount >= 3) {
      addObservation(
        `unclear-${systemId}`,
        `You had less clarity about ${systemName} than other areas. That can mean this system runs automatically for you, or that it hasn't had language yet.`,
        [systemName],
        "suggestive",
        `Predict: Revisiting ${systemName} after reviewing other systems will produce clearer language.`
      );
    }
    const avgWords = averageWordCount(systemId);
    if (avgWords > 0 && avgWords < 20) {
      addObservation(
        `short-${systemId}`,
        `Your ${systemName} answers were brief. That can mean the system is simple for you, or that you are still building language for it.`,
        [systemName],
        "suggestive",
        `Predict: Cross-system comparisons will reveal more nuance in ${systemName}.`
      );
    }
  });

  if (!observations.length) {
    addObservation(
      "fallback",
      "Your answers suggest useful signal is present, but not yet fully explicit. The next step is to turn one concrete observation into a prediction you can test.",
      ["Systems Mapping"],
      "suggestive",
      "Predict: Naming one recurring friction pattern will make later design decisions easier."
    );
  }

  const deduped = [];
  const seen = new Set();
  observations.forEach((observation) => {
    if (seen.has(observation.id)) return;
    seen.add(observation.id);
    deduped.push(observation);
  });

  return deduped
    .sort((a, b) => (a.confidence === b.confidence ? 0 : a.confidence === "strong" ? -1 : 1))
    .slice(0, 5);
}
function computeQuickObservations(answers) {
  const observations = [];
  const q1 = (answers[0] || "").toLowerCase();
  const q2 = (answers[1] || "").toLowerCase();
  const q5 = (answers[4] || "").toLowerCase();

  if (q1.includes("afternoon") || q1.includes("hours")) {
    observations.push(
      "This suggests a high context reconstruction cost. You might do better with tools that preserve state for you."
    );
  }
  if (q2.includes("building") || q2.includes("figuring out")) {
    observations.push(
      "You might be an exploratory thinker. Specification-first workflows may feel constraining."
    );
  }
  if (q5.includes("alone") || q5.includes("writing")) {
    observations.push(
      "You might think by writing. This suggests using tools and collaborators as reviewers rather than starting with generated drafts."
    );
  }

  if (observations.length === 0) {
    observations.push(
      "These answers suggest there is likely more signal underneath. The full discovery can help surface it."
    );
  }

  return observations.slice(0, 2);
}

function ensureObservations() {
  if (state.p2.observations && state.p2.observations.length) return;
  state.p2.observations = generateObservations(state);
}

function observationResponse(observationId) {
  return state.p2.observationResponses?.[observationId] || { choice: "", detail: "" };
}

function upsertPatternFromObservation(observation) {
  const existing = state.p2.patterns.find(
    (pattern) => pattern.sourceObservationId === observation.id
  );
  if (existing) return;
  state.p2.patterns.push({
    ...emptyPattern(),
    sourceObservationId: observation.id,
    statement: observation.text,
    prediction: observation.prediction || "",
    implication: "",
  });
}

function renderQuickAssessment() {
  const index = quickState.currentQuestion;
  const isComplete = index >= QUICK_QUESTIONS.length;

  if (isComplete) {
    const observations = computeQuickObservations(quickState.answers);
    const answerRows = QUICK_QUESTIONS.map((question, qIndex) => {
      return `
        <article class="record">
          <p><strong>${escapeHtml(question)}</strong></p>
          <p>${escapeHtml(quickState.answers[qIndex] || "No response")}</p>
        </article>
      `;
    }).join("");

    return `
      <section class="panel phase-transition" data-testid="quick-reflection">
        <h2>Quick Assessment Reflection</h2>
        <p class="lede">Thanks for doing that. Here are your responses and a few gentle pattern signals.</p>
        <div class="grid">${answerRows}</div>
        <h3>Possible pattern signals</h3>
        <div class="note">
          <p class="muted">These are suggestions, not verdicts.</p>
          <ul>
            ${observations.map((observation) => `<li>${escapeHtml(observation)}</li>`).join("")}
          </ul>
        </div>
        <div class="field">
          <label>
            <input type="checkbox" id="quick-import" checked />
            Import useful quick-assessment answers into Phase 1 where they fit
          </label>
        </div>
        <div class="actions">
          <button class="primary" data-action="quick-to-full">Want to go deeper? Start Full Discovery</button>
          <button data-action="back-to-landing">Back to Landing</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="panel phase-transition" data-testid="quick-flow">
      <h2>5-Question Quick Assessment</h2>
      <p class="lede">A lightweight 3-5 minute entry ramp. One question at a time.</p>
      <p class="muted">Question ${index + 1} of ${QUICK_QUESTIONS.length}</p>
      <p class="prompt">${escapeHtml(QUICK_QUESTIONS[index])}</p>
      <div class="field">
        <label for="quick-answer">Your reflection</label>
        <textarea id="quick-answer" data-bind="quick.answer">${escapeHtml(quickState.answers[index] || "")}</textarea>
      </div>
      <div class="actions">
        <button class="primary" data-action="quick-next">Continue</button>
        ${index > 0 ? '<button data-action="quick-back">Back</button>' : ""}
        <button data-action="back-to-landing">Exit to Landing</button>
      </div>
    </section>
  `;
}

function renderProgress() {
  return `
    <section class="progress-meta" data-testid="progress-journey">
      <div class="progress-rail-wrap">
        <div class="progress-rail">
          <div class="progress-line"><div class="progress-fill" style="width: ${progressFillWidth()};"></div></div>
          <ul class="phase-nodes">
            ${PHASES.map((phase) => {
              const score = Math.round(phaseScore(phase.id) * 100);
              const cls = phaseClass(phase.id);
              return `
                <li>
                  <button class="phase-node-btn ${cls}" data-action="jump" data-phase="${phase.id}">
                    <span class="phase-node-name">${phase.id}. ${escapeHtml(phase.name)}</span>
                    <span class="phase-node-sub">${score}%</span>
                  </button>
                </li>
              `;
            }).join("")}
          </ul>
        </div>
      </div>
      <div class="meta-row">
        <span>Estimated remaining time: about ${estimatedRemainingMinutes()} minutes.</span>
        <span>
          Saved locally: ${escapeHtml(state.updatedAt ? new Date(state.updatedAt).toLocaleString() : "Not yet")}
          <span class="saved-indicator ${nowSavedFlash() ? "show" : ""}">Saved ✓</span>
        </span>
      </div>
    </section>
  `;
}

function renderPhase1() {
  const [sid, sname, sdesc, swhy, questions] = SYSTEMS[state.p1.s];
  const question = questions[state.p1.q];
  const qid = `${sid}-${state.p1.q}`;
  const answer = state.p1.answers[qid] || { text: "" };
  const priorQuestions = SYSTEMS.slice(0, state.p1.s).reduce(
    (sum, system) => sum + system[4].length,
    0
  );
  const globalNumber = priorQuestions + state.p1.q + 1;

  return `
    <section class="panel phase-transition question-card" data-testid="phase-1-card">
      <h2>Phase 1: Systems Mapping</h2>
      <p class="lede">One question at a time. Answer how your mind actually behaves in practice.</p>
      <div class="meta-row">
        <span>System ${state.p1.s + 1} of ${SYSTEMS.length}: ${escapeHtml(sname)}</span>
        <span>Question ${globalNumber} of ${questionRows.length}</span>
      </div>
      <div class="callout">
        <strong>${escapeHtml(sname)}:</strong> ${escapeHtml(sdesc)}<br />
        <span class="muted">${escapeHtml(swhy)}</span>
      </div>
      <p class="prompt">${escapeHtml(question)}</p>
      <div class="field">
        <label for="phase1-answer">Your reflection</label>
        <textarea id="phase1-answer">${escapeHtml(answer.text || "")}</textarea>
      </div>
      <div class="actions">
        <button class="primary" data-action="save-answer">Save & Continue</button>
        <button data-action="not-sure">I'm Not Sure Yet</button>
        <button data-action="skip">Skip for Now</button>
        <button data-action="prev-q">Back</button>
        ${touchedCount() >= questionRows.length ? '<button data-action="jump" data-phase="2">Continue to Phase 2</button>' : ""}
      </div>
      <p class="muted">Progress without pressure: ${touchedCount()} of ${questionRows.length} prompts touched.</p>
    </section>
  `;
}

function renderPhase2() {
  ensureObservations();

  const answersBySystem = SYSTEMS.map((system) => {
    const rows = answerBySystem(system[0])
      .map((entry) => {
        return `
          <div class="record">
            <p><strong>${escapeHtml(entry.prompt)}</strong><span class="status-pill">${escapeHtml(entry.answer?.status || "unanswered")}</span></p>
            <p>${escapeHtml(entry.answer?.text || "No response yet.")}</p>
          </div>
        `;
      })
      .join("");

    return `<details><summary>${escapeHtml(system[1])}</summary>${rows}</details>`;
  }).join("");

  const observations = (state.p2.observations || [])
    .map((observation) => {
      const response = observationResponse(observation.id);
      return `
      <article class="record" data-testid="observation-card-${escapeHtml(observation.id)}">
        <p><strong>${escapeHtml(observation.text)}</strong></p>
        <p class="muted">From your ${escapeHtml(observation.systems.join(" and "))} answers (${escapeHtml(observation.confidence)} confidence).</p>
        <div class="actions">
          <button data-action="observation-choice" data-id="${observation.id}" data-choice="yes" ${response.choice === "yes" ? 'aria-pressed="true"' : ""}>Yes, that's right</button>
          <button data-action="observation-choice" data-id="${observation.id}" data-choice="partly" ${response.choice === "partly" ? 'aria-pressed="true"' : ""}>Partly - here's what's different</button>
          <button data-action="observation-choice" data-id="${observation.id}" data-choice="no" ${response.choice === "no" ? 'aria-pressed="true"' : ""}>No, that doesn't fit</button>
        </div>
        ${
          response.choice === "partly"
            ? `<div class="field"><label for="obs-detail-${observation.id}">What's different?</label><textarea id="obs-detail-${observation.id}" data-kind="observation-detail" data-id="${observation.id}">${escapeHtml(response.detail || "")}</textarea></div>`
            : ""
        }
      </article>
    `;
    })
    .join("");

  const patterns = state.p2.patterns
    .map((pattern, index) => {
      return `
      <article class="record">
        <h3>Pattern ${index + 1}</h3>
        <div class="field">
          <label for="pattern-statement-${pattern.id}">Pattern statement (descriptive, not aspirational)</label>
          <textarea id="pattern-statement-${pattern.id}" data-kind="pattern" data-id="${pattern.id}" data-field="statement">${escapeHtml(pattern.statement)}</textarea>
        </div>
        <div class="grid cols-2">
          <div class="field">
            <label for="pattern-prediction-${pattern.id}">Prediction test</label>
            <textarea id="pattern-prediction-${pattern.id}" data-kind="pattern" data-id="${pattern.id}" data-field="prediction">${escapeHtml(pattern.prediction)}</textarea>
          </div>
          <div class="field">
            <label for="pattern-implication-${pattern.id}">Design implication</label>
            <textarea id="pattern-implication-${pattern.id}" data-kind="pattern" data-id="${pattern.id}" data-field="implication" placeholder="What would need to change in your environment if this pattern is real?">${escapeHtml(pattern.implication)}</textarea>
          </div>
        </div>
        <button data-action="remove-pattern" data-id="${pattern.id}">Remove Pattern</button>
      </article>
    `;
    })
    .join("");

  return `
    <section class="panel phase-transition">
      <h2>Phase 2: Pattern Extraction</h2>
      <p class="lede">A pattern isn't a feeling - it's a prediction. "I get distracted easily" is a judgment. "My focus breaks when I switch between unrelated contexts, and it takes 20+ minutes to recover" is a pattern.</p>
      <div class="note">
        <strong>How to use this section:</strong>
        <p class="muted">Look at the observations below. For the ones that resonate, sharpen them: can you predict when they appear, and what happens if ignored? If yes, you are finding real behavioral physics.</p>
        <div class="tag-list">${PATTERN_EXAMPLES.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>
      </div>
      <h3>What I Notice</h3>
      <p class="muted">Based on your answers, these are starting points, not conclusions. Resonance and disagreement are both useful data.</p>
      <div class="grid" data-testid="phase2-observations">${observations}</div>
      <h3>Your answers by system</h3>
      ${answersBySystem}
      <div class="field">
        <label for="themes">Cross-system reflection</label>
        <textarea id="themes" data-bind="p2.themes">${escapeHtml(state.p2.themes)}</textarea>
      </div>
      <h3>Your pattern statements</h3>
      <p class="muted">Confirmed or partly-confirmed observations are prefilled here. Edit freely.</p>
      <div class="grid">${patterns}</div>
      <div class="actions">
        <button data-action="add-pattern">Add Pattern</button>
        <button class="primary" data-action="save">Save</button>
        <button data-action="jump" data-phase="3">Continue to Phase 3</button>
        <button data-action="jump" data-phase="1">Back to Phase 1</button>
      </div>
    </section>
  `;
}
function renderPhase3() {
  syncAnalyses();
  const patterns = nonEmptyPatterns();

  const analysisBlocks = patterns.length
    ? patterns
        .map((pattern, index) => {
          const analysis = state.p3.analyses[pattern.id] || {};
          return `
          <article class="record">
            <h3>Pattern ${index + 1}</h3>
            <p><strong>${escapeHtml(pattern.statement)}</strong></p>
            <div class="grid cols-2">
              <div class="field">
                <label for="cat-${pattern.id}">What breaks you if this pattern is ignored?</label>
                <textarea id="cat-${pattern.id}" data-kind="analysis" data-id="${pattern.id}" data-field="catastrophic">${escapeHtml(analysis.catastrophic || "")}</textarea>
              </div>
              <div class="field">
                <label for="acc-${pattern.id}">What gets messy but you can still function?</label>
                <textarea id="acc-${pattern.id}" data-kind="analysis" data-id="${pattern.id}" data-field="acceptable">${escapeHtml(analysis.acceptable || "")}</textarea>
              </div>
            </div>
            <div class="grid cols-2">
              <div class="field">
                <label for="sev-${pattern.id}">Severity</label>
                <select id="sev-${pattern.id}" data-kind="analysis" data-id="${pattern.id}" data-field="severity">
                  <option value="catastrophic" ${analysis.severity === "catastrophic" ? "selected" : ""}>Mostly catastrophic</option>
                  <option value="acceptable" ${analysis.severity === "acceptable" ? "selected" : ""}>Mostly acceptable</option>
                  <option value="contextual" ${!analysis.severity || analysis.severity === "contextual" ? "selected" : ""}>Context-dependent</option>
                </select>
              </div>
              <div class="field">
                <label for="trade-${pattern.id}">Trade-off you accept</label>
                <textarea id="trade-${pattern.id}" data-kind="analysis" data-id="${pattern.id}" data-field="tradeoff">${escapeHtml(analysis.tradeoff || "")}</textarea>
              </div>
            </div>
          </article>
        `;
        })
        .join("")
    : `<p class="note">Add at least one pattern in Phase 2 first.</p>`;

  return `
    <section class="panel phase-transition">
      <h2>Phase 3: What breaks you versus what just makes a mess.</h2>
      <p class="lede">Not all friction is equal. Some things destroy your capacity to work - protect those first. Others create disorder but leave you functional - those are often acceptable trade-offs.</p>
      <div class="callout">
        <strong>Key insight:</strong>
        Here's something worth sitting with: most conventional advice eliminates acceptable failures by introducing catastrophic ones.
        "Keep a clean desk" removes visible mess but can force premature organization that breaks context.
        "One tool for everything" reduces redundancy but creates devastating loss when that tool fails.
        "Close your open loops" reduces incompletion but can force premature closure that kills momentum.
        The question isn't "what's the right way to work?" It's "which failures can you survive, and which ones can't you?"
      </div>
      <div class="grid cols-2">
        <div class="note"><strong>Catastrophic examples</strong><div class="tag-list">${CATA.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div></div>
        <div class="note"><strong>Acceptable examples</strong><div class="tag-list">${OKAY.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div></div>
      </div>
      <div class="grid">${analysisBlocks}</div>
      <div class="actions">
        <button class="primary" data-action="save">Save</button>
        <button data-action="jump" data-phase="4">Continue to Phase 4</button>
        <button data-action="jump" data-phase="2">Back to Phase 2</button>
      </div>
    </section>
  `;
}

function doctrineCardText() {
  const topPatterns = nonEmptyPatterns()
    .slice(0, 3)
    .map((pattern) => `- ${pattern.statement}`);
  return [
    "Doctrine Card",
    `Primary directive: ${state.p4.directive || "Not specified"}`,
    `Meta-rule: ${state.p4.meta || "Not specified"}`,
    "Key patterns:",
    ...(topPatterns.length ? topPatterns : ["- No patterns captured yet."]),
    `Generated: ${new Date().toLocaleDateString()}`,
  ].join("\n");
}

function renderDoctrineCard() {
  if (!state.p4.directive.trim() && !state.p4.meta.trim()) return "";
  const topPatterns = nonEmptyPatterns().slice(0, 3);
  return `
    <section class="doctrine-card" id="doctrine-card" data-testid="doctrine-card">
      <h4>Shareable Doctrine Card</h4>
      <p class="directive">${escapeHtml(state.p4.directive || "Not specified")}</p>
      <p class="meta-question">${escapeHtml(state.p4.meta || "No meta-rule yet")}</p>
      <strong>Key patterns</strong>
      <ul>
        ${
          topPatterns.length
            ? topPatterns.map((pattern) => `<li>${escapeHtml(pattern.statement)}</li>`).join("")
            : "<li>No pattern statements yet</li>"
        }
      </ul>
      <p class="muted">Generated ${escapeHtml(new Date().toLocaleDateString())}</p>
      <div class="actions">
        <button data-action="copy-doctrine-text">Copy as Text</button>
        <button data-action="copy-doctrine-image">Copy as Image</button>
      </div>
      <p class="copy-status" id="doctrine-copy-status" aria-live="polite">${escapeHtml(runtime.doctrineStatus)}</p>
    </section>
  `;
}

function renderPhase4() {
  const checks = state.p4.checks;
  const suggestedDirective =
    !state.p4.directive.trim() && state.p4.scaffold?.depends?.trim()
      ? state.p4.scaffold.depends.trim()
      : state.p4.directive;
  return `
    <section class="panel phase-transition">
      <h2>Phase 4: Doctrine Derivation</h2>
      <p class="lede">Derive one primary directive and one meta-rule question.</p>
      <div class="note">
        <p class="muted">Example directives:</p>
        <div class="tag-list">${DIRECTIVE_EXAMPLES.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>
        <p class="muted">Notice how different these are. There's no right doctrine - only yours.</p>
      </div>
      <div class="note">
        <p>Your doctrine is one principle that, if protected, keeps everything else working. It is descriptive, not aspirational.</p>
        <p><strong>Step 1:</strong> Look at your catastrophic failures. What do they have in common?</p>
        <div class="field">
          <label for="scaffold-common">Common thread</label>
          <textarea id="scaffold-common" data-bind="p4.scaffold.commonThread">${escapeHtml(state.p4.scaffold?.commonThread || "")}</textarea>
        </div>
        <p><strong>Step 2:</strong> If you could protect one condition that keeps everything else working, what would it be?</p>
        <div class="field">
          <label for="scaffold-protect">One condition to protect</label>
          <textarea id="scaffold-protect" data-bind="p4.scaffold.protect">${escapeHtml(state.p4.scaffold?.protect || "")}</textarea>
        </div>
        <p><strong>Step 3:</strong> Try completing this sentence: "My capacity depends on ___"</p>
        <div class="field">
          <label for="scaffold-depends">My capacity depends on...</label>
          <textarea id="scaffold-depends" data-bind="p4.scaffold.depends">${escapeHtml(state.p4.scaffold?.depends || "")}</textarea>
        </div>
        <p class="muted">Now compress those answers into one principle.</p>
      </div>
      <details class="note">
        <summary>Doctrine examples (inspiration, not templates)</summary>
        ${DOCTRINE_EXAMPLES.map(
          (example) => `
            <article class="record">
              <h4>${escapeHtml(example.title)}</h4>
              <p><strong>Primary directive:</strong> ${escapeHtml(example.directive)}</p>
              <p><strong>Meta-rule:</strong> ${escapeHtml(example.meta)}</p>
              <ul>${example.patterns.map((pattern) => `<li>${escapeHtml(pattern)}</li>`).join("")}</ul>
            </article>
          `
        ).join("")}
      </details>
      <div class="field">
        <label for="directive">Primary directive</label>
        <textarea id="directive" data-bind="p4.directive">${escapeHtml(suggestedDirective)}</textarea>
      </div>
      <div class="field">
        <label for="meta">Meta-rule question</label>
        <textarea id="meta" data-bind="p4.meta">${escapeHtml(state.p4.meta)}</textarea>
      </div>
      <div class="field">
        <label for="notes">Why this is load-bearing for you</label>
        <textarea id="notes" data-bind="p4.notes">${escapeHtml(state.p4.notes)}</textarea>
      </div>
      <h3>Doctrine self-test</h3>
      <div class="check-grid">
        <label><input type="checkbox" data-check="descriptive" ${checks.descriptive ? "checked" : ""} />Descriptive, not aspirational (Does it describe how you work, or how you wish you worked?)</label>
        <label><input type="checkbox" data-check="testable" ${checks.testable ? "checked" : ""} />Testable in decisions (Can you evaluate a specific choice and get a clear answer?)</label>
        <label><input type="checkbox" data-check="generative" ${checks.generative ? "checked" : ""} />Generative (Does it create design decisions, or just sound good?)</label>
        <label><input type="checkbox" data-check="singular" ${checks.singular ? "checked" : ""} />Singular (Is it one principle, or several squeezed together?)</label>
      </div>
      ${renderDoctrineCard()}
      <div class="actions">
        <button class="primary" data-action="save">Save</button>
        <button data-action="jump" data-phase="5">Continue to Phase 5</button>
        <button data-action="jump" data-phase="3">Back to Phase 3</button>
      </div>
    </section>
  `;
}

function reportSections() {
  const phase1 = SYSTEMS.map((system) => {
    const rows = answerBySystem(system[0])
      .map((entry) => {
        const text = entry.answer?.text || "Not answered";
        const status = entry.answer?.status || "unanswered";
        return `<li><strong>${escapeHtml(entry.prompt)}</strong><br />${escapeHtml(text)} <span class="status-pill">${escapeHtml(status)}</span></li>`;
      })
      .join("");
    return `<h3>${escapeHtml(system[1])}</h3><ul>${rows}</ul>`;
  }).join("");

  const patterns = nonEmptyPatterns();
  const patternRows = patterns.length
    ? patterns
        .map(
          (pattern) =>
            `<li><strong>${escapeHtml(pattern.statement)}</strong><br />Prediction: ${escapeHtml(pattern.prediction || "Not specified")}<br />Implication: ${escapeHtml(pattern.implication || "Not specified")}</li>`
        )
        .join("")
    : "<li>No patterns captured yet.</li>";
  const observationRows = (state.p2.observations || []).length
    ? state.p2.observations
        .map((observation) => {
          const response = observationResponse(observation.id);
          return `<li><strong>${escapeHtml(observation.text)}</strong><br />Source: ${escapeHtml(observation.systems.join(" and "))}<br />Response: ${escapeHtml(response.choice || "Not reviewed")}${response.detail ? `<br />Detail: ${escapeHtml(response.detail)}` : ""}</li>`;
        })
        .join("")
    : "<li>No observations generated yet.</li>";

  const failureRows = patterns.length
    ? patterns
        .map((pattern) => {
          const analysis = state.p3.analyses[pattern.id] || {};
          return `<li><strong>${escapeHtml(pattern.statement)}</strong><br />Catastrophic: ${escapeHtml(analysis.catastrophic || "Not specified")}<br />Acceptable: ${escapeHtml(analysis.acceptable || "Not specified")}<br />Trade-off: ${escapeHtml(analysis.tradeoff || "Not specified")}</li>`;
        })
        .join("")
    : "<li>No failure analysis yet.</li>";

  const tools = state.p5.tools.filter((tool) => tool.name.trim());
  const toolRows = tools.length
    ? tools
        .map(
          (tool) =>
            `<li><strong>${escapeHtml(tool.name)}</strong> (${escapeHtml(tool.context || "No context")}) - ${escapeHtml(tool.alignment)}<br />Why: ${escapeHtml(tool.notes || "Not specified")}<br />Action: ${escapeHtml(tool.action || "Not specified")}</li>`
        )
        .join("")
    : "<li>No alignment entries yet.</li>";

  const counts = { aligned: 0, mixed: 0, misaligned: 0, unclear: 0 };
  tools.forEach((tool) => {
    const key = counts[tool.alignment] !== undefined ? tool.alignment : "unclear";
    counts[key] += 1;
  });

  return `
    <h2>Cognitive Architecture Document</h2>
    <p class="doc-meta">Generated ${escapeHtml(new Date().toLocaleString())} | The Discovery Journal</p>
    <h3>Summary Doctrine</h3>
    <p><strong>Primary directive:</strong> ${escapeHtml(state.p4.directive || "Not specified")}</p>
    <p><strong>Meta-rule:</strong> ${escapeHtml(state.p4.meta || "Not specified")}</p>
    <p><strong>Rationale:</strong> ${escapeHtml(state.p4.notes || "Not specified")}</p>
    <h3>Phase 1: Systems Mapping</h3>
    ${phase1}
    <h3>Phase 2: Extracted Patterns</h3>
    <p><strong>Cross-system reflection:</strong> ${escapeHtml(state.p2.themes || "Not specified")}</p>
    <h4>Observations</h4>
    <ul>${observationRows}</ul>
    <ul>${patternRows}</ul>
    <h3>Phase 3: Failure Modes</h3>
    <ul>${failureRows}</ul>
    <h3>Phase 5: Alignment</h3>
    <p><strong>Aligned:</strong> ${counts.aligned} | <strong>Mixed:</strong> ${counts.mixed} | <strong>Misaligned:</strong> ${counts.misaligned} | <strong>Unclear:</strong> ${counts.unclear}</p>
    <ul>${toolRows}</ul>
    <h3>Actionable Synthesis</h3>
    <p>${escapeHtml(state.p5.synthesis || "Not specified")}</p>
    <h3>Doctrine Scaffolding Notes</h3>
    <p><strong>Common thread:</strong> ${escapeHtml(state.p4.scaffold?.commonThread || "Not specified")}</p>
    <p><strong>Protect condition:</strong> ${escapeHtml(state.p4.scaffold?.protect || "Not specified")}</p>
    <p><strong>My capacity depends on:</strong> ${escapeHtml(state.p4.scaffold?.depends || "Not specified")}</p>
  `;
}
function renderPhase5() {
  const tools = state.p5.tools
    .map((tool, index) => {
      return `
      <article class="record">
        <h3>System/Environment ${index + 1}</h3>
        <div class="grid cols-2">
          <div class="field">
            <label for="tool-name-${tool.id}">Name</label>
            <input id="tool-name-${tool.id}" data-kind="tool" data-id="${tool.id}" data-field="name" value="${escapeHtml(tool.name)}" placeholder="e.g., Your workspace layout, your morning routine, your calendar, your communication style, the way you learn new things, your primary work tool..." />
          </div>
          <div class="field">
            <label for="tool-context-${tool.id}">Context</label>
            <input id="tool-context-${tool.id}" data-kind="tool" data-id="${tool.id}" data-field="context" value="${escapeHtml(tool.context)}" placeholder="What this tool or system is for" />
          </div>
        </div>
        <div class="grid cols-2">
          <div class="field">
            <label for="tool-alignment-${tool.id}">Alignment</label>
            <select id="tool-alignment-${tool.id}" data-kind="tool" data-id="${tool.id}" data-field="alignment">
              <option value="aligned" ${tool.alignment === "aligned" ? "selected" : ""}>Works with me</option>
              <option value="mixed" ${tool.alignment === "mixed" ? "selected" : ""}>Mixed - some friction</option>
              <option value="misaligned" ${tool.alignment === "misaligned" ? "selected" : ""}>Works against me</option>
              <option value="unclear" ${tool.alignment === "unclear" ? "selected" : ""}>Haven't examined yet</option>
            </select>
          </div>
          <div class="field">
            <label for="tool-action-${tool.id}">What would you change?</label>
            <input id="tool-action-${tool.id}" data-kind="tool" data-id="${tool.id}" data-field="action" value="${escapeHtml(tool.action)}" placeholder="Keep as-is, modify, replace, or accept the friction?" />
          </div>
        </div>
        <div class="field">
          <label for="tool-notes-${tool.id}">Why this rating?</label>
          <textarea id="tool-notes-${tool.id}" data-kind="tool" data-id="${tool.id}" data-field="notes">${escapeHtml(tool.notes)}</textarea>
        </div>
        <button data-action="remove-tool" data-id="${tool.id}">Remove</button>
      </article>
    `;
    })
    .join("");

  return `
    <section class="panel phase-transition">
      <h2>Phase 5: Alignment</h2>
      <p class="lede">Apply your doctrine to the systems and environments you interact with every day.</p>
      <p class="muted">Think beyond software: routines, workspace, communication patterns, learning environments, and day structure.</p>
      <div class="grid">${tools}</div>
      <div class="field">
        <label for="synthesis">Synthesis: what to stop, protect, redesign</label>
        <textarea id="synthesis" data-bind="p5.synthesis">${escapeHtml(state.p5.synthesis)}</textarea>
      </div>
      <div class="actions">
        <button data-action="add-tool">Add System/Environment</button>
        <button class="primary" data-action="save">Save</button>
        <button data-action="jump" data-phase="4">Back to Phase 4</button>
      </div>
      <h3>Generated Cognitive Architecture Document (Preview)</h3>
      <p class="muted">Use Print Document or Download HTML above to keep a copy.</p>
      <section class="report-shell">${reportSections()}</section>
    </section>
  `;
}

function documentHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cognitive Architecture Document</title>
    <style>
      body { margin: 0; background: #f4efe6; color: #201c16; font-family: "Source Serif 4", "Iowan Old Style", serif; }
      main { width: min(920px, 100% - 2rem); margin: 1.2rem auto 2rem; background: #fffdf8; border: 1px solid #d9cec0; border-radius: 16px; padding: 1.2rem; }
      h1, h2, h3 { line-height: 1.2; }
      h1 { margin-top: 0; }
      ul { padding-left: 1.2rem; }
      li { margin: 0.5rem 0; }
      .controls { margin-top: 1rem; }
      button { border: 1px solid #c9bba9; background: #f8f3ea; border-radius: 999px; padding: 0.45rem 0.75rem; cursor: pointer; }
      @media print {
        body { background: #fff; }
        main { border: none; border-radius: 0; width: 100%; margin: 0; padding: 0; }
        .controls { display: none; }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Cognitive Architecture Document</h1>
      <p>Generated ${escapeHtml(new Date().toLocaleString())} with The Discovery Journal</p>
      ${reportSections()}
      <div class="controls"><button onclick="window.print()">Print / Save as PDF</button></div>
    </main>
  </body>
</html>`;
}

function openPrint() {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.open();
  win.document.write(documentHtml());
  win.document.close();
}

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function mainPhaseHtml() {
  if (state.currentPhase === 1) return renderPhase1();
  if (state.currentPhase === 2) return renderPhase2();
  if (state.currentPhase === 3) return renderPhase3();
  if (state.currentPhase === 4) return renderPhase4();
  return renderPhase5();
}

function renderApp() {
  const app = document.getElementById("app");
  if (runtime.mode === "landing") {
    app.innerHTML = renderLanding();
  } else if (runtime.mode === "quick") {
    app.innerHTML = renderQuickAssessment();
  } else {
    app.innerHTML = `${renderProgress()}${mainPhaseHtml()}`;
  }

  applyAccessibleNames(app);
  autoGrowAll(app);
  renderSessionInfoPanel();
}

function applyAccessibleNames(root) {
  const fields = root.querySelectorAll("input, textarea, select");
  fields.forEach((field) => {
    if (field.getAttribute("aria-label") || field.getAttribute("aria-labelledby")) return;
    let label = "";
    if (field.id) {
      const explicit = root.querySelector(`label[for="${field.id}"]`);
      if (explicit) label = explicit.textContent || "";
    }
    if (!label) {
      const wrapper = field.closest(".field");
      const inline = wrapper ? wrapper.querySelector("label") : null;
      if (inline) label = inline.textContent || "";
    }
    if (!label) label = field.getAttribute("placeholder") || "Input";
    field.setAttribute("aria-label", label.trim());
  });
}

function autoGrow(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`;
}

function autoGrowAll(root) {
  root.querySelectorAll("textarea").forEach((textarea) => autoGrow(textarea));
}

function nextPhase1Question() {
  const questions = SYSTEMS[state.p1.s][4];
  if (state.p1.q < questions.length - 1) {
    state.p1.q += 1;
    return;
  }
  if (state.p1.s < SYSTEMS.length - 1) {
    state.p1.s += 1;
    state.p1.q = 0;
    return;
  }
  state.currentPhase = Math.max(state.currentPhase, 2);
}

function previousPhase1Question() {
  if (state.p1.q > 0) {
    state.p1.q -= 1;
    return;
  }
  if (state.p1.s > 0) {
    state.p1.s -= 1;
    state.p1.q = SYSTEMS[state.p1.s][4].length - 1;
  }
}

function startMainDiscovery() {
  if (!state.startedAt) state.startedAt = new Date().toISOString();
  runtime.mode = "main";
  saveMain({ flash: true });
  renderApp();
}

function importQuickToMain() {
  const map = [
    { quickIndex: 0, phaseQuestionId: "attention-2", status: "answered" },
    { quickIndex: 1, phaseQuestionId: "learning-0", status: "answered" },
    { quickIndex: 3, phaseQuestionId: "environment-1", status: "answered" },
    { quickIndex: 4, phaseQuestionId: "learning-3", status: "answered" },
  ];

  map.forEach((entry) => {
    const answer = (quickState.answers[entry.quickIndex] || "").trim();
    if (!answer) return;
    if (state.p1.answers[entry.phaseQuestionId]) return;
    state.p1.answers[entry.phaseQuestionId] = {
      text: `${answer} (Imported from quick assessment)`,
      status: entry.status,
      updatedAt: new Date().toISOString(),
    };
  });
}
async function copyDoctrineAsText() {
  try {
    await navigator.clipboard.writeText(doctrineCardText());
    runtime.doctrineStatus = "Doctrine copied as text.";
  } catch {
    runtime.doctrineStatus = "Clipboard not available in this browser context.";
  }
  renderApp();
}

async function copyDoctrineAsImage() {
  const card = document.getElementById("doctrine-card");
  if (!card) return;

  if (typeof window.html2canvas !== "function") {
    runtime.doctrineStatus = "Image capture is unavailable right now. Use Copy as Text.";
    renderApp();
    return;
  }

  try {
    const canvas = await window.html2canvas(card, { backgroundColor: "#fffdf9", scale: 2 });
    canvas.toBlob(async (blob) => {
      if (!blob) {
        runtime.doctrineStatus = "Could not generate image.";
        renderApp();
        return;
      }

      if (!navigator.clipboard || typeof window.ClipboardItem === "undefined") {
        download(`doctrine-card-${new Date().toISOString().slice(0, 10)}.png`, blob, "image/png");
        runtime.doctrineStatus = "Clipboard image copy unavailable. PNG downloaded instead.";
        renderApp();
        return;
      }

      try {
        await navigator.clipboard.write([new window.ClipboardItem({ "image/png": blob })]);
        runtime.doctrineStatus = "Doctrine card copied as image.";
      } catch {
        download(`doctrine-card-${new Date().toISOString().slice(0, 10)}.png`, blob, "image/png");
        runtime.doctrineStatus = "Clipboard blocked. PNG downloaded instead.";
      }
      renderApp();
    }, "image/png");
  } catch {
    runtime.doctrineStatus = "Could not capture doctrine card image.";
    renderApp();
  }
}

function exportSessionBundle() {
  const payload = {
    exportedAt: new Date().toISOString(),
    main: state,
    quick: quickState,
  };
  download("discovery-journal-session.json", JSON.stringify(payload, null, 2), "application/json");
}

function importSessionBundle(parsed) {
  if (parsed.main || parsed.quick) {
    state = hydrateMain(parsed.main || {});
    quickState = hydrateQuick(parsed.quick || {});
  } else {
    state = hydrateMain(parsed);
  }

  saveMain();
  saveQuick();
  runtime.mode = "landing";
  runtime.landingType = "welcome";
  renderApp();
}

function handleHeaderActions() {
  const exportBtn = document.getElementById("export-session");
  const importInput = document.getElementById("import-session");
  const printBtn = document.getElementById("print-document");
  const downloadBtn = document.getElementById("download-document");
  const resetBtn = document.getElementById("reset-session");

  exportBtn.onclick = () => exportSessionBundle();

  importInput.onchange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      importSessionBundle(parsed);
    } catch {
      window.alert("Could not import this file.");
    }
    event.target.value = "";
  };

  printBtn.onclick = () => openPrint();

  downloadBtn.onclick = () => {
    download(
      `cognitive-architecture-document-${new Date().toISOString().slice(0, 10)}.html`,
      documentHtml(),
      "text/html"
    );
  };

  resetBtn.onclick = () => {
    if (!window.confirm("Reset all saved progress (full process + quick assessment)?")) return;
    resetMain();
    resetQuick();
    runtime.mode = "landing";
    runtime.landingType = "fresh";
    renderApp();
  };
}

function setNested(path, value) {
  const keys = path.split(".").filter(Boolean);
  if (keys.length < 2) return;
  let cursor = state;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    if (!cursor[key] || typeof cursor[key] !== "object") cursor[key] = {};
    cursor = cursor[key];
  }
  cursor[keys[keys.length - 1]] = value;
}

document.getElementById("app").addEventListener("input", (event) => {
  const target = event.target;

  if (target.tagName === "TEXTAREA") autoGrow(target);

  if (target.dataset.bind === "quick.answer") {
    quickState.answers[quickState.currentQuestion] = target.value;
    saveQuick();
    return;
  }

  if (target.dataset.bind) {
    setNested(target.dataset.bind, target.value);
    saveMain();
    return;
  }

  if (target.dataset.kind === "pattern") {
    const pattern = state.p2.patterns.find((item) => item.id === target.dataset.id);
    if (pattern) {
      pattern[target.dataset.field] = target.value;
      saveMain();
    }
    return;
  }

  if (target.dataset.kind === "analysis") {
    if (!state.p3.analyses[target.dataset.id]) {
      state.p3.analyses[target.dataset.id] = {
        catastrophic: "",
        acceptable: "",
        severity: "contextual",
        tradeoff: "",
      };
    }
    state.p3.analyses[target.dataset.id][target.dataset.field] = target.value;
    saveMain();
    return;
  }

  if (target.dataset.kind === "observation-detail") {
    const observationId = target.dataset.id;
    if (!observationId) return;
    if (!state.p2.observationResponses[observationId]) {
      state.p2.observationResponses[observationId] = { choice: "partly", detail: "" };
    }
    state.p2.observationResponses[observationId].detail = target.value;
    saveMain();
    return;
  }

  if (target.dataset.kind === "tool") {
    const tool = state.p5.tools.find((item) => item.id === target.dataset.id);
    if (tool) {
      tool[target.dataset.field] = target.value;
      saveMain();
    }
    return;
  }

  if (target.dataset.check) {
    state.p4.checks[target.dataset.check] = target.checked;
    saveMain();
  }
});

document.getElementById("app").addEventListener("change", (event) => {
  const target = event.target;
  if (target.dataset.kind === "tool" || target.dataset.kind === "analysis") {
    saveMain({ flash: true });
    renderApp();
  }
});

document.getElementById("app").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const action = button.dataset.action;

  if (action === "begin-discovery") {
    runtime.landingType = "welcome";
    startMainDiscovery();
    return;
  }

  if (action === "continue-session") {
    startMainDiscovery();
    return;
  }

  if (action === "start-fresh") {
    if (!window.confirm("Start fresh and replace the current discovery session?")) return;
    resetMain();
    runtime.landingType = "fresh";
    startMainDiscovery();
    return;
  }

  if (action === "start-quick") {
    if (!quickState.startedAt) quickState.startedAt = new Date().toISOString();
    runtime.mode = "quick";
    saveQuick();
    renderApp();
    return;
  }

  if (action === "back-to-landing") {
    runtime.mode = "landing";
    runtime.landingType = localStorage.getItem(STORAGE_KEY) ? "welcome" : "fresh";
    renderApp();
    return;
  }

  if (action === "quick-next") {
    quickState.answers[quickState.currentQuestion] = (
      document.getElementById("quick-answer")?.value || ""
    ).trim();

    if (quickState.currentQuestion < QUICK_QUESTIONS.length - 1) {
      quickState.currentQuestion += 1;
    } else {
      quickState.currentQuestion = QUICK_QUESTIONS.length;
      quickState.completedAt = new Date().toISOString();
      quickState.reflectionSeen = true;
    }
    saveQuick();
    renderApp();
    return;
  }

  if (action === "quick-back") {
    if (quickState.currentQuestion > 0) quickState.currentQuestion -= 1;
    saveQuick();
    renderApp();
    return;
  }

  if (action === "quick-to-full") {
    const shouldImport = document.getElementById("quick-import")?.checked;
    if (shouldImport) importQuickToMain();
    if (!state.startedAt) state.startedAt = new Date().toISOString();
    runtime.mode = "main";
    state.currentPhase = Math.max(1, state.currentPhase);
    saveMain({ flash: true });
    renderApp();
    return;
  }

  if (action === "jump") {
    state.currentPhase = Math.max(1, Math.min(5, Number(button.dataset.phase || "1")));
    saveMain({ flash: true });
    renderApp();
    return;
  }

  if (action === "save") {
    if (state.currentPhase === 2) syncAnalyses();
    saveMain({ flash: true });
    renderApp();
    return;
  }

  if (action === "save-answer" || action === "not-sure" || action === "skip") {
    const [sid] = SYSTEMS[state.p1.s];
    const qid = `${sid}-${state.p1.q}`;
    const text = (document.getElementById("phase1-answer")?.value || "").trim();

    if (action === "save-answer" && !text) {
      window.alert("Add a short reflection or choose Not Sure / Skip.");
      return;
    }

    state.p1.answers[qid] = {
      text: text || (action === "not-sure" ? "I'm not sure yet." : "Skipped for now."),
      status:
        action === "save-answer" ? "answered" : action === "not-sure" ? "not_sure" : "skipped",
      updatedAt: new Date().toISOString(),
    };

    nextPhase1Question();
    saveMain({ flash: true });
    renderApp();
    return;
  }

  if (action === "prev-q") {
    previousPhase1Question();
    saveMain();
    renderApp();
    return;
  }

  if (action === "add-pattern") {
    state.p2.patterns.push(emptyPattern());
    saveMain({ flash: true });
    renderApp();
    return;
  }

  if (action === "observation-choice") {
    const observationId = button.dataset.id;
    const choice = button.dataset.choice;
    if (!observationId || !choice) return;

    if (!state.p2.observationResponses[observationId]) {
      state.p2.observationResponses[observationId] = { choice: "", detail: "" };
    }
    state.p2.observationResponses[observationId].choice = choice;
    if (choice !== "partly") state.p2.observationResponses[observationId].detail = "";

    const observation = (state.p2.observations || []).find((item) => item.id === observationId);
    if (observation && (choice === "yes" || choice === "partly")) {
      upsertPatternFromObservation(observation);
      syncAnalyses();
    }

    saveMain({ flash: true });
    renderApp();
    return;
  }

  if (action === "remove-pattern") {
    if (state.p2.patterns.length > 1) {
      state.p2.patterns = state.p2.patterns.filter((pattern) => pattern.id !== button.dataset.id);
      syncAnalyses();
      saveMain({ flash: true });
      renderApp();
    }
    return;
  }

  if (action === "add-tool") {
    state.p5.tools.push(emptyTool());
    saveMain({ flash: true });
    renderApp();
    return;
  }

  if (action === "remove-tool") {
    if (state.p5.tools.length > 1) {
      state.p5.tools = state.p5.tools.filter((tool) => tool.id !== button.dataset.id);
      saveMain({ flash: true });
      renderApp();
    }
    return;
  }

  if (action === "copy-doctrine-text") {
    copyDoctrineAsText();
    return;
  }

  if (action === "copy-doctrine-image") {
    copyDoctrineAsImage();
  }
});

handleHeaderActions();
syncAnalyses();
renderApp();
