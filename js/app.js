// ==========================
//   CONSTANTES GÉNÉRALES
// ==========================

const ANIM_MS     = 700; // ralenti pour suivre les transitions CSS
const AI_THINK_MS = 400; // délai "réflexion IA"
const DIE_SIDES   = 6;   // nombre de faces du dé utilisé dans les calculs de duel

// ==========================
//   RÈGLES & CONFIG GLOBALES
// ==========================

const GAME_RULES = {
    MAX_TURNS: 30
};

// Bonus / malus des duels
const DUEL_RULES = {
    GOOD_COUNTER_BONUS: 2,                // bonus pour la "bonne" défense (intercept, tackle, block...)
    GENERIC_ATTACK_BONUS: 2,              // petit bonus pour l'attaque si la défense n'est pas optimale
    SHOT_DISTANCE_PENALTY_PER_LINE: 2     // malus par ligne de distance sur les tirs de loin
};

// Seuils d'endurance (affichage & calculs)
const STAMINA_THRESHOLDS = {
    HIGH: 75,
    MID:  50,
    LOW:  25
};

const STAMINA_FACTORS = {
    HIGH:      1.0,
    MID:       0.9,
    LOW:       0.8,
    CRIT:      0.7,
    EXHAUSTED: 0.6
};

// Règles de placement terrain (but / face au gardien)
const FIELD_RULES = {
    GOAL_X:     { internal: 97, external: 3 },
    GOAL_Y:     50,
    GK_FRONT_X: { internal: 88, external: 12 }
};

// Règles IA (probabilités de choix)
const AI_RULES = {
    ATTACK: {
        EARLY_PASS_PROB:   0.7,  // zones 0–1 : prob de passe
        MID_DRIBBLE_PROB:  0.4,  // zone 2 : proba dribble
        MID_PASS_PROB:     0.8,  // zone 2 : si > DRIBBLE, on passe, sinon tir
        LATE_SHOT_PROB:    0.6,  // zone 3 : proba tir
        LATE_DRIBBLE_PROB: 0.85  // zone 3 : si > SHOT, dribble, sinon passe
    },
    DEFENSE: {
        MAIN_CHOICE_PROB:   0.6, // prob de prendre le 1er choix
        SECOND_CHOICE_PROB: 0.85 // prob de prendre le 2e choix
    }
};

// ==========================
//   TEXTES CENTRALISÉS
// ==========================

const TEXTS = {
    teams: {
        internal: "Domicile",
        external: "Exterieur"
    },

    ui: {
        gameStartMain: "Le match commence !",
        gameStartSub:  "Internal a la balle. Remise en jeu : passe obligatoire.",
        chooseAttackSub: "Choisis Pass / Dribble / Shot.",
        dribbleForbiddenMain: "Face au gardien !",
        dribbleForbiddenSub:  "Tu dois tirer, plus de dribble possible.",
        aiAttackTurn:  "Tour de l'IA (attaque)",
        aiDefenseTurn: "Tour de l'IA (défense)",
        aiThinkingDefault: "Tour de l'IA…",
        matchEndMain: "Fin du match !",
        matchEndPrefix: "Score final "
    },

    logs: {
        kickoffTitle:  "Coup d'envoi",
        kickoffDetail: "Internal engage (pass obligatoire)",

        kickoffPassSuccessTitle: "Coup d'envoi – passe courte",
        kickoffPassFailTitle:    "Remise en jeu ratée",

        passSuccessTitle: "Passe réussie",
        passFailTitle:    "Passe interceptée",

        dribbleRefusedTitle:      "Dribble refusé (face au gardien)",
        dribbleRefusedDetail:     "Action non autorisée",
        dribbleSuccessTitle:      "Dribble réussi",
        dribbleSuccessGKTitle:    "Dribble réussi – face au gardien",
        dribbleFailTitle:         "Dribble raté",

        shotGoalTitle:            "Tir – BUT",
        shotGoalSpecialTitle:     "Tir spécial – BUT",
        shotSavedTitle:           "Tir – arrêté",
        shotSavedSpecialTitle:    "Tir spécial – arrêté",
        shotBlockedTitle:         "Tir contré par la défense",
        shotThroughDefenseTitle:  "Tir cadré – passe la défense",

        longShotGoalTitle:        "Tir de loin – BUT",
        longShotGoalSpecialTitle: "Tir spécial de loin – BUT",
        longShotSavedTitle:       "Tir de loin – arrêté par le gardien",

        longShotKeeperSaveTitle:  "Arrêt du gardien !",
        matchEndTitle:            "Fin du match"
    },

    cards: {
        attack: {
            shot: {
                icon: "⚽️",
                title: "Shot",
                sub: "Puissant tir"
            },
            pass: {
                icon: "➡️",
                title: "Pass",
                sub: "Passe avant"
            },
            dribble: {
                icon: "🌀",
                title: "Dribble",
                sub: "Dribble un adversaire"
            },
            special: {
                icon: "🔥",
                title: "Special",
                sub: "Action spéciale"
            }
        },
        defenseField: {
            block: {
                icon: "🧱",
                title: "Block",
                sub: "Contre de tir"
            },
            intercept: {
                icon: "✋",
                title: "Intercept",
                sub: "Couper une passe"
            },
            tackle: {
                icon: "⚔️",
                title: "Tackle",
                sub: "Intervenir un dribble"
            },
            "field-special": {
                icon: "🔥",
                title: "Special",
                sub: "Action spéciale"
            }
        },
        defenseGK: {
            hands: {
                icon: "🧤",
                title: "Arrêt main",
                sub: "Capte le tir proprement"
            },
            punch: {
                icon: "👊",
                title: "Dégagement poing",
                sub: "Repousse le ballon au loin"
            },
            "gk-special": {
                icon: "🔥",
                title: "Special",
                sub: "Action spéciale"
            }
        }
    }
};

// ==========================
//   CONSTANTES & STRUCTURE
// ==========================

const TEAMS = {
    internal: { id: "internal", label: TEXTS.teams.internal },
    external: { id: "external", label: TEXTS.teams.external }
};

// Bornes des zones (en % de largeur terrain, côté Internal)
const ZONE_BOUNDS_INTERNAL = [5, 25, 45, 65, 85];

// Centres calculés automatiquement à partir des bornes
const zoneXInternal = ZONE_BOUNDS_INTERNAL.slice(0, -1).map(
    (left, i) => (left + ZONE_BOUNDS_INTERNAL[i + 1]) / 2
);

// 3 lignes (haut, centre, bas)
const laneY = [25, 50, 75];

let ball = {
    team: "internal",
    zoneIndex: 1,
    laneIndex: 1,
    number: 8,
    frontOfKeeper: false
};

let currentTeam        = "internal";
let score              = { internal: 0, external: 0 };
let turns              = 0;

let phase              = "attack";     // 'attack' ou 'defense'
let pendingAttack      = null;         // 'pass' | 'dribble' | 'shot' | 'special'
let isAnimating        = false;
let isKickoff          = true;
let isGameOver         = false;
let pendingShotContext = null;

// positions de base de chaque joueur (pour revenir après dribbles / kickoff)
const basePositions = {};         // { "I6": {x:%, y:%}, ... }
let lastDribblerId  = null;

// Endurance
const ENDURANCE_MAX  = 100;
const stamina        = {};        // { "I8": 100, "E3": 100, ... }

// Mode 1 joueur
let onePlayerMode  = false;
let controlledTeam = "internal";

// ==========================
//   CONFIG STATS
// ==========================

const STATS = {
    attack: {
        shot:    { power: 10, cost: 10 },
        pass:    { power: 10, cost: 5  },
        dribble: { power: 10, cost: 5  },
        special: { power: 12, cost: 20 }
    },
    defenseField: {
        block:           { power: 10, cost: 5  },
        intercept:       { power: 10, cost: 5  },
        tackle:          { power: 10, cost: 5  },
        "field-special": { power: 12, cost: 20 }
    },
    defenseGK: {
        hands:        { power: 10, cost: 10 },
        punch:        { power: 8,  cost: 5  },
        "gk-special": { power: 12, cost: 20 }
    }
};

// ==========================
//   DOM
// ==========================

const ballEl          = document.getElementById("ball");
const scoreInternalEl = document.getElementById("score-internal");
const scoreExternalEl = document.getElementById("score-external");
const turnsDisplayEl  = document.getElementById("turns-display");
const turnIndicatorEl = document.getElementById("turn-indicator");
const msgMainEl       = document.getElementById("message-main");
const msgSubEl        = document.getElementById("message-sub");
const teamLabelEl     = document.getElementById("player-team-label");
const playerNumberEl  = document.getElementById("player-number-label");
const actionBarEl     = document.getElementById("action-bar");

// Log visuel (carte "Dernière action" + historique)
const currentActionTitleEl  = document.getElementById("current-action-title");
const currentActionDetailEl = document.getElementById("current-action-detail");
const duelDiceEl            = document.getElementById("duel-dice-display");
const historyListEl         = document.getElementById("history-list");

// Endurance fiche joueur
const energyFillEl = document.getElementById("energy-fill");

// Mode 1 joueur
const modeOnePlayerBtn     = document.getElementById("mode-one-player");
const controlledTeamSelect = document.getElementById("controlled-team-select");

// Overlay IA
const aiOverlayEl = document.getElementById("ai-turn-overlay");

// Historique des actions
const actionHistory = [];
const MAX_HISTORY   = 8;

// ==========================
//   BUILDERS DE CARTES
// ==========================

// Construit le HTML d'une carte d'action offensive
function buildSkillCard(actionKey, cfg) {
    return `
    <button class="skill-card" data-action="${actionKey}">
      <div class="skill-icon">${cfg.icon}</div>
      <div class="skill-title">${cfg.title}</div>
      <div class="skill-sub">${cfg.sub}</div>
      <div class="skill-bottom">
        <div class="skill-power"></div>
        <div class="skill-cost">Énergie <span></span></div>
      </div>
    </button>
  `;
}

// Construit le HTML d'une carte d'action défensive
function buildDefCard(defKey, cfg) {
    return `
    <button class="def-card" data-defense="${defKey}">
      <div class="def-icon">${cfg.icon}</div>
      <div class="def-title">${cfg.title}</div>
      <div class="def-sub">${cfg.sub}</div>
      <div class="def-bottom">
        <div class="def-power"></div>
        <div class="def-cost">Énergie <span></span></div>
      </div>
    </button>
  `;
}

// Construit le strip des actions d'attaque
function buildAttackActionsHTML() {
    const cfg = TEXTS.cards.attack;
    return `
    <div id="attack-strip">
      ${buildSkillCard("shot",    cfg.shot)}
      ${buildSkillCard("pass",    cfg.pass)}
      ${buildSkillCard("dribble", cfg.dribble)}
      ${buildSkillCard("special", cfg.special)}
    </div>
  `;
}

// Construit le strip des actions défensives terrain
function buildDefenseFieldHTML() {
    const cfg = TEXTS.cards.defenseField;
    return `
    <div id="defense-strip">
      ${buildDefCard("block",          cfg.block)}
      ${buildDefCard("intercept",      cfg.intercept)}
      ${buildDefCard("tackle",         cfg.tackle)}
      ${buildDefCard("field-special",  cfg["field-special"])}
    </div>
  `;
}

// Construit le strip des actions défensives gardien
function buildDefenseGKHTML() {
    const cfg = TEXTS.cards.defenseGK;
    return `
    <div id="defense-strip">
      ${buildDefCard("hands",       cfg.hands)}
      ${buildDefCard("punch",       cfg.punch)}
      ${buildDefCard("gk-special",  cfg["gk-special"])}
    </div>
  `;
}

// ==========================
//   HELPERS GÉNÉRAUX
// ==========================

// Retourne l'équipe adverse
const otherTeam = t => (t === "internal" ? "external" : "internal");

// Indique si une équipe est contrôlée par l'IA
function isAITeam(team) {
    return onePlayerMode && team !== controlledTeam;
}

// Lance un dé virtuel de DIE_SIDES faces
function rollD6() {
    return 1 + Math.floor(Math.random() * DIE_SIDES);
}

// Met à jour les messages principaux / secondaires
function setMessage(main, sub) {
    if (main) msgMainEl.textContent = main;
    if (sub !== undefined) msgSubEl.textContent = sub;
}

// Affiche ou masque le panneau "tour de l'IA"
function setAIOverlay(visible, text) {
    if (!aiOverlayEl) return;
    if (visible) {
        aiOverlayEl.classList.add("visible");
        aiOverlayEl.textContent = text || TEXTS.ui.aiThinkingDefault;
    } else {
        aiOverlayEl.classList.remove("visible");
    }
}

// Ajoute une entrée au log (carte + historique)
function pushLogEntry(main, detailsLines = []) {
    currentActionTitleEl.textContent = main || "–";
    currentActionDetailEl.textContent =
        detailsLines.length ? detailsLines.join(" | ") : "";

    const turnLabel = `T${String(turns + 1).padStart(2,"0")}`;
    const shortLine = `${turnLabel} – ${main}`;

    actionHistory.push(shortLine);
    if (actionHistory.length > MAX_HISTORY) {
        actionHistory.shift();
    }

    historyListEl.innerHTML = actionHistory
        .map(line => `<li>${line}</li>`)
        .join("");
}

// Affiche la ligne de résultat du duel de dés
function showDuelDice(attackScore, defenseScore) {
    if (!duelDiceEl) return;

    const a = attackScore.toFixed(1);
    const d = defenseScore.toFixed(1);

    duelDiceEl.textContent = `🎲 ${a} - ${d}`;
    duelDiceEl.classList.add("visible");

    duelDiceEl.classList.remove("pop");
    void duelDiceEl.offsetWidth;
    duelDiceEl.classList.add("pop");
}

// Efface l'affichage du duel de dés
function clearDuelDice() {
    if (!duelDiceEl) return;
    duelDiceEl.classList.remove("visible", "pop");
}

// Met à jour l'affichage du score et du numéro de tour
function updateScoreUI() {
    scoreInternalEl.textContent = score.internal;
    scoreExternalEl.textContent = score.external;
    const t = String(turns).padStart(2, "0");
    turnsDisplayEl.textContent  = t;
    turnIndicatorEl.textContent = t;
}

// Met à jour la carte joueur pour une équipe + numéro
function updatePlayerCard(team, number) {
    if (!teamLabelEl || !playerNumberEl) return;

    teamLabelEl.textContent    = TEAMS[team].label;
    playerNumberEl.textContent = number;

    const playerId = getPlayerId(team, number);
    const value    = getStamina(playerId);
    const ratio    = value / ENDURANCE_MAX;

    if (energyFillEl) {
        energyFillEl.style.width = `${ratio * 100}%`;
        energyFillEl.classList.remove("e-high","e-mid","e-low","e-crit");

        if (value >= STAMINA_THRESHOLDS.HIGH) {
            energyFillEl.classList.add("e-high");
        } else if (value >= STAMINA_THRESHOLDS.MID) {
            energyFillEl.classList.add("e-mid");
        } else if (value >= STAMINA_THRESHOLDS.LOW) {
            energyFillEl.classList.add("e-low");
        } else {
            energyFillEl.classList.add("e-crit");
        }
    }
}

// Met à jour la carte joueur à partir du porteur de balle
function updateTeamCard() {
    updatePlayerCard(ball.team, ball.number);
}

// Initialise le texte de puissance / coût sur les cartes
function initUIFromStats() {
    const attackStrip = document.querySelector("#attack-strip");
    if (attackStrip) {
        attackStrip.querySelectorAll(".skill-card").forEach(btn => {
            const action = btn.dataset.action;
            const cfg    = STATS.attack[action];
            if (!cfg) return;
            const powerEl = btn.querySelector(".skill-power");
            const costEl  = btn.querySelector(".skill-cost span");
            if (powerEl) powerEl.textContent = cfg.power;
            if (costEl)  costEl.textContent  = cfg.cost;
        });
    }

    const defenseStrip = document.querySelector("#defense-strip");
    if (defenseStrip) {
        defenseStrip.querySelectorAll(".def-card").forEach(btn => {
            const def = btn.dataset.defense;
            const cfgField = STATS.defenseField[def];
            const cfgGk    = STATS.defenseGK[def];
            const cfg      = cfgField || cfgGk;
            if (!cfg) return;
            const powerEl = btn.querySelector(".def-power");
            const costEl  = btn.querySelector(".def-cost span");
            if (powerEl) powerEl.textContent = cfg.power;
            if (costEl)  costEl.textContent  = cfg.cost;
        });
    }
}

// Rafraîchit l'ensemble de l'UI (score + carte joueur porteur)
function refreshUI() {
    updateScoreUI();
    updateTeamCard();
}

// ==========================
//   ENDURANCE
// ==========================

// Retourne l'ID technique d'un joueur ("I8" / "E3")
function getPlayerId(team, number) {
    const prefix = team === "internal" ? "I" : "E";
    return prefix + String(number);
}

// Renvoie l'endurance actuelle d'un joueur (et initialise si nécessaire)
function getStamina(playerId) {
    if (!(playerId in stamina)) {
        stamina[playerId] = ENDURANCE_MAX;
    }
    return stamina[playerId];
}

// Calcule le facteur de performance en fonction de l'endurance
function staminaFactor(playerId) {
    const value = getStamina(playerId);
    if (value >= STAMINA_THRESHOLDS.HIGH) return STAMINA_FACTORS.HIGH;
    if (value >= STAMINA_THRESHOLDS.MID)  return STAMINA_FACTORS.MID;
    if (value >= STAMINA_THRESHOLDS.LOW)  return STAMINA_FACTORS.LOW;
    if (value > 0)                        return STAMINA_FACTORS.CRIT;
    return STAMINA_FACTORS.EXHAUSTED;
}

// Diminue l'endurance d'un joueur en fonction de l'action effectuée
function applyStaminaCost(playerId, category, actionKey) {
    if (!playerId) return;
    const cfgCategory = STATS[category];
    const cfg   = cfgCategory && cfgCategory[actionKey];
    const cost  = cfg ? cfg.cost : 0;
    const curr  = getStamina(playerId);
    const next  = Math.max(0, curr - cost);
    stamina[playerId] = next;
    updateStaminaUI(playerId);
}

// Met à jour l'affichage d'endurance sur le pion du joueur
function updateStaminaUI(playerId) {
    const value = getStamina(playerId);
    const ratio = value / ENDURANCE_MAX;

    const el = document.querySelector(`.player[data-player="${playerId}"]`);
    if (el) {
        el.classList.add("show-endurance");
        const shell = el.querySelector(".endurance-shell");
        if (shell) {
            const bar = shell.querySelector(".endurance-bar");
            if (bar) bar.style.width = `${Math.max(10, ratio * 100)}%`;
        }
        el.classList.remove("e-high","e-mid","e-low","e-crit");

        if (value >= STAMINA_THRESHOLDS.HIGH) {
            el.classList.add("e-high");
        } else if (value >= STAMINA_THRESHOLDS.MID) {
            el.classList.add("e-mid");
        } else if (value >= STAMINA_THRESHOLDS.LOW) {
            el.classList.add("e-low");
        } else {
            el.classList.add("e-crit");
        }
    }

    const ballId = getPlayerId(ball.team, ball.number);
    if (ballId === playerId) {
        updateTeamCard();
    }
}

// Initialise l'endurance de tous les joueurs présents sur le terrain
function initStamina() {
    document.querySelectorAll(".player").forEach(el => {
        const id = el.dataset.player;
        stamina[id] = ENDURANCE_MAX;

        const shell = document.createElement("div");
        shell.className = "endurance-shell";
        const bar = document.createElement("div");
        bar.className = "endurance-bar";
        shell.appendChild(bar);
        el.appendChild(shell);

        updateStaminaUI(id);
    });
}

// ==========================
//   GRILLE & POSITIONS
// ==========================

// Donne les coordonnées du centre d'une cellule (zone, ligne) pour une équipe
function getCellCenter(team, zoneIndex, laneIndex) {
    const left  = ZONE_BOUNDS_INTERNAL[zoneIndex];
    const right = ZONE_BOUNDS_INTERNAL[zoneIndex + 1];
    const xInternal = (left + right) / 2;

    const x = team === "internal" ? xInternal : 100 - xInternal;
    const y = laneY[laneIndex];
    return { x, y };
}

// Retourne l'index de zone "en face" sur l'axe horizontal
function getFacingZoneIndex(zoneIndex) {
    return Math.max(0, Math.min(3, 3 - zoneIndex));
}

// Récupère l'élément DOM correspondant au porteur d'équipe/numéro
function getCarrierElement(team, number) {
    const prefix = team === "internal" ? "I" : "E";
    const id = prefix + String(number);
    return document.querySelector(`[data-player="${id}"]`);
}

// Renvoie la puissance défensive d'une action de champ
function getFieldDefensePower(defenseAction) {
    const cfg = STATS.defenseField[defenseAction];
    return cfg ? cfg.power : 10;
}

// Renvoie la puissance défensive d'une action de gardien
function getKeeperDefensePower(defenseAction) {
    const cfg = STATS.defenseGK[defenseAction];
    return cfg ? cfg.power : 10;
}

// Renvoie le joueur le plus proche du centre d'une cellule
function getClosestPlayerInCell(team, zoneIndex, laneIndex) {
    const selector = team === "internal" ? ".player.internal" : ".player.external";
    const center   = getCellCenter(team, zoneIndex, laneIndex);

    let bestDist       = Infinity;
    let bestCandidates = []; // on stocke toutes les égalités

    document.querySelectorAll(selector).forEach(el => {
        const x = parseFloat(el.style.left);
        const y = parseFloat(el.style.top);
        if (isNaN(x) || isNaN(y)) return;

        const dx = x - center.x;
        const dy = y - center.y;
        const d2 = dx*dx + dy*dy;

        if (d2 < bestDist - 1e-6) {
            bestDist       = d2;
            bestCandidates = [el.dataset.player];
        } else if (Math.abs(d2 - bestDist) <= 1e-6) {
            bestCandidates.push(el.dataset.player);
        }
    });

    if (!bestCandidates.length) return null;
    const randIdx = Math.floor(Math.random() * bestCandidates.length);
    return bestCandidates[randIdx]; // ex: "I8"
}

// Choisit un receveur dans une cellule (ou fallback) en excluant éventuellement un numéro
function pickReceiverInCell(team, zoneIndex, laneIndex, fallbackNumber, excludeNumber = null) {
    let receiverId = getClosestPlayerInCell(team, zoneIndex, laneIndex);

    if (receiverId) {
        const num = parseInt(receiverId.slice(1), 10);
        if (excludeNumber !== null && num === excludeNumber) {
            receiverId = null;
        }
    }

    if (!receiverId) {
        const selector = team === "internal" ? ".player.internal" : ".player.external";
        const all = Array.from(document.querySelectorAll(selector))
            .filter(el => !el.classList.contains("goalkeeper"));

        if (!all.length) return fallbackNumber;

        const filtered = excludeNumber === null
            ? all
            : all.filter(el => parseInt(el.dataset.player.slice(1), 10) !== excludeNumber);

        const pool = filtered.length ? filtered : all;
        const rand = pool[Math.floor(Math.random() * pool.length)];
        return parseInt(rand.dataset.player.slice(1), 10);
    }

    return parseInt(receiverId.slice(1), 10);
}

// Déplace physiquement le ballon sur un joueur donné et met à jour sa zone/ligne
function moveBallToPlayer(team, number) {
    const el = getCarrierElement(team, number);
    if (!el) return;

    const x = parseFloat(el.style.left);
    const y = parseFloat(el.style.top);

    ballEl.style.left  = x + "%";
    ballEl.style.top   = y + "%";
    ballEl.textContent = number;

    ball.team          = team;
    ball.number        = number;
    ball.frontOfKeeper = false;

    const xInternal = team === "internal" ? x : 100 - x;
    let zoneIndex = 0;

    for (let i = 0; i < ZONE_BOUNDS_INTERNAL.length - 1; i++) {
        const left  = ZONE_BOUNDS_INTERNAL[i];
        const right = ZONE_BOUNDS_INTERNAL[i + 1];
        if (xInternal >= left && xInternal <= right) {
            zoneIndex = i;
            break;
        }
    }

    let bestLane = 0, bestLaneDist = Infinity;
    laneY.forEach((vy, i) => {
        const d = Math.abs(vy - y);
        if (d < bestLaneDist) { bestLaneDist = d; bestLane = i; }
    });

    ball.zoneIndex = zoneIndex;
    ball.laneIndex = bestLane;

    updateTeamCard();
}

// ==========================
//   ACTION BAR DYNAMIQUE
// ==========================

// Attache les events de clic aux boutons d'attaque / défense
function bindActionButtons() {
    actionBarEl.querySelectorAll(".skill-card").forEach(btn => {
        btn.addEventListener("click", () => {
            handleAttackClick(btn.dataset.action);
        });
    });

    actionBarEl.querySelectorAll(".def-card").forEach(btn => {
        btn.addEventListener("click", () => {
            handleDefenseClick(btn.dataset.defense);
        });
    });
}

// Met à jour le contenu de la barre d'action (avec animation)
function setActionBar(html, modeClass) {
    actionBarEl.classList.add("fade-out");
    setTimeout(() => {
        actionBarEl.innerHTML = html;

        actionBarEl.className = actionBarEl.className
            .replace(/\bmode-[^\s]+/g, "");
        if (modeClass) {
            actionBarEl.classList.add(modeClass);
        }

        initUIFromStats();

        // Kickoff : on ne laisse visible que le bouton "Pass"
        if (isKickoff && html.includes("attack-strip")) {
            const cards = actionBarEl.querySelectorAll(".skill-card");
            cards.forEach(btn => {
                if (btn.dataset.action !== "pass") {
                    btn.style.display = "none";
                }
            });
        }

        actionBarEl.classList.remove("fade-out");
        actionBarEl.classList.add("fade-in");

        bindActionButtons();
    }, 200);
}

// Affiche la barre d'attaque pour l'équipe qui a la balle
function showAttackBarForCurrentTeam() {
    if (isGameOver) return;
    const mode = `mode-attack-${currentTeam}`;
    setActionBar(buildAttackActionsHTML(), mode);

    if (isAITeam(currentTeam)) {
        scheduleAIAttack();
    }
}

// ==========================
//   ANIM & TOURS
// ==========================

// Joue l'animation de tir puis exécute un callback
function animateAndThen(cb) {
    isAnimating = true;
    ballEl.classList.add("ball-kick");
    setTimeout(() => {
        ballEl.classList.remove("ball-kick");
        isAnimating = false;
        if (cb) cb();
    }, ANIM_MS);
}

// Passe au tour suivant (changement éventuel d'équipe ou fin de match)
function advanceTurn(newTeam) {
    if (isGameOver) return;

    currentTeam = newTeam;
    turns++;

    if (turns >= GAME_RULES.MAX_TURNS) {
        isGameOver = true;

        setMessage(
            TEXTS.ui.matchEndMain,
            `${TEXTS.ui.matchEndPrefix}${score.internal} - ${score.external}`
        );
        pushLogEntry(
            TEXTS.logs.matchEndTitle,
            [`Score final ${score.internal} - ${score.external}`]
        );

        actionBarEl.classList.remove("fade-in");
        actionBarEl.classList.add("fade-out");
        setTimeout(() => {
            actionBarEl.innerHTML = "";
        }, 200);

        refreshUI();
        return;
    }

    setMessage(
        `${TEAMS[currentTeam].label} a la balle`,
        TEXTS.ui.chooseAttackSub
    );
    phase         = "attack";
    pendingAttack = null;
}

// ==========================
//   DIVERS ÉTAT JOUEURS
// ==========================

// Replace le dernier dribbleur à sa position initiale
function resetLastDribbler() {
    if (!lastDribblerId) return;
    const pos = basePositions[lastDribblerId];
    const el  = document.querySelector(`[data-player="${lastDribblerId}"]`);
    if (pos && el) {
        el.style.left = pos.x + "%";
        el.style.top  = pos.y + "%";
    }
    lastDribblerId = null;
}

// ==========================
//   KICKOFF / FORMATIONS
// ==========================

// Sauvegarde les positions de base de tous les joueurs
function initBasePositions() {
    document.querySelectorAll(".player").forEach(el => {
        basePositions[el.dataset.player] = {
            x: parseFloat(el.style.left),
            y: parseFloat(el.style.top)
        };
    });
}

// Applique la formation de coup d'envoi (joueurs reculés/avancés)
function applyKickoffPositions() {
    document.querySelectorAll(".player").forEach(el => {
        const base = basePositions[el.dataset.player];
        if (!base) return;
        let x = base.x, y = base.y;

        if (el.classList.contains("internal")) {
            if (x > 50) x = 48;
        } else {
            if (x < 50) x = 52;
        }
        el.style.left = x + "%";
        el.style.top  = y + "%";
    });
}

// Restaure les positions de base de tous les joueurs
function restoreBasePositions() {
    document.querySelectorAll(".player").forEach(el => {
        const base = basePositions[el.dataset.player];
        if (!base) return;
        el.style.left = base.x + "%";
        el.style.top  = base.y + "%";
    });
}

// ==========================
//   HELPERS RANDOM JOUEUR
// ==========================

// Choisit un joueur de champ aléatoire d'une équipe
function getRandomFieldPlayer(team) {
    const selector = team === "internal" ? ".player.internal" : ".player.external";
    const candidates = Array.from(document.querySelectorAll(selector))
        .filter(el => !el.classList.contains("goalkeeper"));
    if (!candidates.length) return null;
    const idx = Math.floor(Math.random()*candidates.length);
    return candidates[idx].dataset.player;
}

// Anime le ballon vers le but puis lance un callback (remise en jeu après but)
function animateGoalThenReset(attackTeam, afterGoalCallback) {
    const goalX = FIELD_RULES.GOAL_X[attackTeam];
    const goalY = FIELD_RULES.GOAL_Y;

    ballEl.style.left = goalX + "%";
    ballEl.style.top  = goalY + "%";

    animateAndThen(() => {
        if (afterGoalCallback) afterGoalCallback();
    });
}

// Anime le ballon vers le gardien puis lance un callback
function animateShotToKeeper(defenseTeam, afterAnimation) {
    const keeperEl = document.querySelector(`.player.${defenseTeam}.goalkeeper`);
    if (!keeperEl) {
        if (afterAnimation) afterAnimation();
        return;
    }

    const x = parseFloat(keeperEl.style.left);
    const y = parseFloat(keeperEl.style.top);

    ballEl.style.left = x + "%";
    ballEl.style.top  = y + "%";

    animateAndThen(() => {
        if (afterAnimation) afterAnimation();
    });
}

// ==========================
//   IA – CHOIX ATTAQUE/DEFENSE
// ==========================

// Détermine l'action offensive de l'IA (pass, dribble, shot, special)
function computeAIAttackChoice() {
    if (isKickoff) return "pass";
    if (ball.frontOfKeeper) return "shot";

    const z = ball.zoneIndex;
    const r = Math.random();

    if (z <= 1) {
        if (r < AI_RULES.ATTACK.EARLY_PASS_PROB) return "pass";
        return "dribble";
    }

    if (z === 2) {
        if (r < AI_RULES.ATTACK.MID_DRIBBLE_PROB) return "dribble";
        if (r < AI_RULES.ATTACK.MID_PASS_PROB) return "pass";
        return "shot";
    }

    if (r < AI_RULES.ATTACK.LATE_SHOT_PROB) return "shot";
    if (r < AI_RULES.ATTACK.LATE_DRIBBLE_PROB) return "dribble";
    return "pass";
}

// Programme l'action d'attaque de l'IA après un délai
function scheduleAIAttack() {
    if (!isAITeam(currentTeam) || phase !== "attack" || isGameOver) return;

    setAIOverlay(true, TEXTS.ui.aiAttackTurn);
    const action = computeAIAttackChoice();

    setTimeout(() => {
        setAIOverlay(false);
        handleAttackClick(action);
    }, AI_THINK_MS);
}

// Détermine l'action défensive de l'IA en fonction de l'attaque
function computeAIDefenseChoice(attack) {
    const table = {
        pass:    ["intercept", "block", "tackle", "field-special"],
        dribble: ["tackle", "block", "intercept", "field-special"],
        shot:    ["block", "tackle", "intercept", "field-special"],
        special: ["field-special", "block", "tackle", "intercept"]
    };

    const list = table[attack] || ["block","intercept","tackle","field-special"];
    const r = Math.random();

    if (r < AI_RULES.DEFENSE.MAIN_CHOICE_PROB) return list[0];
    if (r < AI_RULES.DEFENSE.SECOND_CHOICE_PROB && list[1]) return list[1];
    return list[Math.floor(Math.random() * list.length)];
}

// Programme l'action défensive de l'IA après un délai
function scheduleAIDefense(attack, defendingTeam) {
    if (!isAITeam(defendingTeam) || phase !== "defense" || !pendingAttack || isGameOver) return;

    setAIOverlay(true, TEXTS.ui.aiDefenseTurn);
    const defense = computeAIDefenseChoice(attack);

    setTimeout(() => {
        setAIOverlay(false);
        handleDefenseClick(defense);
    }, AI_THINK_MS);
}

// ==========================
//   REMISE EN JEU AUTO
// ==========================

// Résout la passe automatique de coup d'envoi (sans duel)
function resolveKickoffPass(attackTeam) {
    if (!isKickoff) return;
    isKickoff = false;

    const dmNumbers = [5, 6];
    const number    = dmNumbers[Math.floor(Math.random() * dmNumbers.length)];

    const attackerId = getPlayerId(attackTeam, ball.number);
    applyStaminaCost(attackerId, "attack", "pass");

    setMessage(
        "Remise en jeu réussie !",
        `${TEAMS[attackTeam].label} joue court vers le n°${number}.`
    );
    pushLogEntry(
        TEXTS.logs.kickoffPassSuccessTitle,
        [
            `Vers n°${number}`,
            "Remise en jeu automatique (pas de duel)"
        ]
    );

    animateAndThen(() => {
        restoreBasePositions();
        moveBallToPlayer(attackTeam, number);
        advanceTurn(attackTeam);
        showAttackBarForCurrentTeam();
        refreshUI();
    });
}

// ==========================
//   RÉSOLUTION : PASS
// ==========================

// Résout une action de passe (avec duel contre la défense)
function resolvePass(attackTeam, defenseTeam, defenseAction) {
    const wasKickoff = isKickoff;
    isKickoff = false;

    const attackerId = getPlayerId(attackTeam, ball.number);

    let attackScore  = STATS.attack.pass.power * staminaFactor(attackerId);
    let defenseScore = getFieldDefensePower(defenseAction);

    const isGoodCounter = (defenseAction === "intercept");
    if (isGoodCounter) {
        defenseScore += DUEL_RULES.GOOD_COUNTER_BONUS;
    } else {
        attackScore  += DUEL_RULES.GENERIC_ATTACK_BONUS;
    }

    attackScore  += rollD6();
    defenseScore += rollD6();

    showDuelDice(attackScore, defenseScore);

    const diff     = attackScore - defenseScore;
    const ok       = diff > 0;
    const duelText = `Duel stats : ${attackScore.toFixed(1)} - ${defenseScore.toFixed(1)} (${diff > 0 ? "+"+diff.toFixed(1) : diff.toFixed(1)})`;

    applyStaminaCost(attackerId, "attack", "pass");

    const originZone = ball.zoneIndex;
    const originLane = ball.laneIndex;

    // === REMISE EN JEU (kickoff) ===
    if (wasKickoff) {
        if (ok) {
            const dmNumbers = [5, 6];
            const number = dmNumbers[Math.floor(Math.random() * dmNumbers.length)];

            moveBallToPlayer(attackTeam, number);
            setMessage(
                "Remise en jeu réussie !",
                `${TEAMS[attackTeam].label} joue court vers le n°${number}.`
            );
            pushLogEntry(
                "Remise en jeu réussie",
                [
                    `Attaque: pass`,
                    `Défense: ${defenseAction}`,
                    duelText
                ]
            );

            animateAndThen(() => {
                restoreBasePositions();
                moveBallToPlayer(attackTeam, number);
                advanceTurn(attackTeam);
                showAttackBarForCurrentTeam();
                refreshUI();
            });

        } else {
            const dmNumbersDef = [5, 6];
            const number = dmNumbersDef[Math.floor(Math.random() * dmNumbersDef.length)];

            moveBallToPlayer(defenseTeam, number);
            setMessage(
                "Remise en jeu ratée !",
                `${TEAMS[defenseTeam].label} intercepte avec le n°${number}.`
            );
            pushLogEntry(
                TEXTS.logs.kickoffPassFailTitle,
                [
                    `Attaque: pass`,
                    `Défense: ${defenseAction}`,
                    duelText
                ]
            );

            animateAndThen(() => {
                restoreBasePositions();
                moveBallToPlayer(defenseTeam, number);
                advanceTurn(defenseTeam);
                showAttackBarForCurrentTeam();
                refreshUI();
            });
        }
        return;
    }

    // === CAS STANDARD ===

    let targetZone = ball.zoneIndex;
    let targetLane = ball.laneIndex;

    if (ball.zoneIndex < 3) {
        targetZone = ball.zoneIndex + 1;
    } else {
        const lanes = [0, 1, 2].filter(l => l !== ball.laneIndex);
        targetLane = lanes[Math.floor(Math.random() * lanes.length)];
    }

    if (ok) {
        resetLastDribbler();

        const receiverNumber = pickReceiverInCell(
            attackTeam,
            targetZone,
            targetLane,
            ball.number,
            ball.number
        );

        moveBallToPlayer(attackTeam, receiverNumber);
        setMessage(
            "Passe réussie !",
            `${TEAMS[attackTeam].label} trouve le n°${receiverNumber} en zone ${targetZone + 1}, ligne ${targetLane + 1}.`
        );
        pushLogEntry(
            TEXTS.logs.passSuccessTitle,
            [
                `Vers n°${receiverNumber} (zone ${targetZone+1}, ligne ${targetLane+1})`,
                `Défense: ${defenseAction}`,
                duelText
            ]
        );

        animateAndThen(() => {
            advanceTurn(attackTeam);
            showAttackBarForCurrentTeam();
            refreshUI();
        });

    } else {
        resetLastDribbler();

        const defZone = getFacingZoneIndex(originZone);
        const defLane = originLane;

        const number = pickReceiverInCell(
            defenseTeam,
            defZone,
            defLane,
            6,
            null
        );

        moveBallToPlayer(defenseTeam, number);
        setMessage(
            "Passe interceptée !",
            `${TEAMS[defenseTeam].label} récupère en zone ${defZone + 1}, ligne ${defLane + 1}.`
        );
        pushLogEntry(
            TEXTS.logs.passFailTitle,
            [
                `Attaque: pass depuis zone ${originZone+1}`,
                `Défense: ${defenseAction}`,
                duelText
            ]
        );

        animateAndThen(() => {
            advanceTurn(defenseTeam);
            showAttackBarForCurrentTeam();
            refreshUI();
        });
    }
}

// ==========================
//   RÉSOLUTION : DRIBBLE
// ==========================

// Résout une action de dribble (avec gestion face-à-face gardien)
function resolveDribble(attackTeam, defenseTeam, defenseAction) {
    if (ball.frontOfKeeper) {
        setMessage(
            TEXTS.ui.dribbleForbiddenMain,
            TEXTS.ui.dribbleForbiddenSub
        );
        pushLogEntry(
            TEXTS.logs.dribbleRefusedTitle,
            [TEXTS.logs.dribbleRefusedDetail]
        );
        phase         = "attack";
        pendingAttack = null;
        return;
    }

    const attackerId = getPlayerId(attackTeam, ball.number);

    let attackScore  = STATS.attack.dribble.power * staminaFactor(attackerId);
    let defenseScore = getFieldDefensePower(defenseAction);
    const isGoodCounter = (defenseAction === "tackle");

    if (isGoodCounter) {
        defenseScore += DUEL_RULES.GOOD_COUNTER_BONUS;
    } else {
        attackScore  += DUEL_RULES.GENERIC_ATTACK_BONUS;
    }

    attackScore  += rollD6();
    defenseScore += rollD6();

    showDuelDice(attackScore, defenseScore);

    const diff     = attackScore - defenseScore;
    const ok       = diff > 0;
    const duelText = `Duel stats : ${attackScore.toFixed(1)} - ${defenseScore.toFixed(1)} (${diff > 0 ? "+" + diff.toFixed(1) : diff.toFixed(1)})`;

    applyStaminaCost(attackerId, "attack", "dribble");

    const oldZone   = ball.zoneIndex;
    const lane      = ball.laneIndex;
    let newZone     = oldZone;

    const prefix     = attackTeam === "internal" ? "I" : "E";
    const carrierId  = prefix + String(ball.number);
    const carrierEl  = document.querySelector(`[data-player="${carrierId}"]`);

    if (ok) {
        if (oldZone < 3) {
            newZone = Math.min(3, oldZone + 1);
            lastDribblerId = carrierId;

            if (carrierEl) {
                const currentY = parseFloat(carrierEl.style.top);

                // centre logique de la nouvelle zone pour cette lane
                const center = getCellCenter(attackTeam, newZone, lane);
                const newX   = center.x;   // avance d'une zone
                const newY   = currentY;   // garde sa ligne actuelle

                carrierEl.style.left = newX + "%";
                carrierEl.style.top  = newY + "%";

                ballEl.style.left    = newX + "%";
                ballEl.style.top     = newY + "%";
            }

            // logiquement : +1 zone, même lane
            ball.zoneIndex = newZone;
            ball.laneIndex = lane;

            setMessage(
                "Dribble réussi !",
                `${TEAMS[attackTeam].label} avance en zone ${newZone+1} sur la même ligne.`
            );
            pushLogEntry(
                "Dribble réussi",
                [
                    `Vers zone ${newZone+1}`,
                    `Défense: ${defenseAction}`,
                    duelText
                ]
            );

            animateAndThen(() => {
                advanceTurn(attackTeam);
                showAttackBarForCurrentTeam();
                refreshUI();
            });

        } else {
            // FACE-À-FACE GARDIEN
            lastDribblerId = carrierId;

            const y      = laneY[lane];
            const xFront = FIELD_RULES.GK_FRONT_X[attackTeam];

            if (carrierEl) {
                carrierEl.style.left = xFront + "%";
                carrierEl.style.top  = y + "%";
            }
            ballEl.style.left   = xFront + "%";
            ballEl.style.top    = y + "%";
            ball.frontOfKeeper  = true; // BUG FIX

            setMessage(
                "Dribble réussi !",
                `Face au gardien ! Prochaine action : tir ou tir spécial.`
            );
            pushLogEntry(
                TEXTS.logs.dribbleSuccessGKTitle,
                [
                    `Défense: ${defenseAction}`,
                    duelText
                ]
            );
        }

        animateAndThen(() => {
            advanceTurn(attackTeam);
            showAttackBarForCurrentTeam();
            refreshUI();
        });

    } else {
        // DRIBBLE RATÉ
        resetLastDribbler();

        const defZone    = getFacingZoneIndex(oldZone);
        const defLane    = lane;
        const receiverId = getClosestPlayerInCell(defenseTeam, defZone, defLane);
        const number     = receiverId ? parseInt(receiverId.slice(1),10) : 6;

        moveBallToPlayer(defenseTeam, number);

        setMessage(
            "Dribble raté !",
            `${TEAMS[defenseTeam].label} récupère en zone ${defZone+1}.`
        );
        pushLogEntry(
            TEXTS.logs.dribbleFailTitle,
            [
                `Attaque depuis zone ${oldZone+1}`,
                `Défense: ${defenseAction}`,
                duelText
            ]
        );

        animateAndThen(() => {
            advanceTurn(defenseTeam);
            showAttackBarForCurrentTeam();
            refreshUI();
        });
    }
}

// ==========================
//   DUEL GARDIEN (tir de loin)
// ==========================

// Résout le duel gardien sur un tir de loin (après avoir passé la défense)
function resolveShotKeeperDuel(ctx, defenseAction) {
    const {
        attackTeam,
        defenseTeam,
        originZone,
        isSpecial,
        gkAttackBase,
        logParts
    } = ctx;

    const attackerId = getPlayerId(attackTeam, ball.number);

    let attackScore  = gkAttackBase * staminaFactor(attackerId);
    let defenseScore = getKeeperDefensePower(defenseAction);

    attackScore  += rollD6();
    defenseScore += rollD6();

    showDuelDice(attackScore, defenseScore);

    const diff     = attackScore - defenseScore;
    const ok       = diff > 0;
    const duelText = `Duel tir vs gardien : ${attackScore.toFixed(1)}-${defenseScore.toFixed(1)} (${diff > 0 ? "+"+diff.toFixed(1) : diff.toFixed(1)})`;
    logParts.push(duelText);

    ball.frontOfKeeper = false;
    resetLastDribbler();

    applyStaminaCost(attackerId, "attack", isSpecial ? "special" : "shot");

    if (ok) {
        // BUT
        score[attackTeam]++;

        setMessage(
            isSpecial
                ? `BUT SPÉCIAL à distance pour ${TEAMS[attackTeam].label} !`
                : `BUT de loin pour ${TEAMS[attackTeam].label} !`,
            `Le tir bat le gardien. Score : ${score.internal} - ${score.external}.`
        );
        pushLogEntry(
            isSpecial ? TEXTS.logs.longShotGoalSpecialTitle : TEXTS.logs.longShotGoalTitle,
            [
                `Tir depuis zone ${originZone+1}`,
                ...logParts
            ]
        );

        const newTeam   = defenseTeam;
        const newNumber = 8;

        animateGoalThenReset(attackTeam, () => {
            isKickoff = true;
            applyKickoffPositions();
            moveBallToPlayer(newTeam, newNumber);
            advanceTurn(newTeam);
            showAttackBarForCurrentTeam();
            refreshUI();
        });

    } else {
        // Arrêt du gardien → relance
        const receiverId = getRandomFieldPlayer(defenseTeam);
        const number     = receiverId ? parseInt(receiverId.slice(1),10) : 1;

        setMessage(
            TEXTS.logs.longShotKeeperSaveTitle,
            `${TEAMS[defenseTeam].label} finit par contrôler le ballon et relance.`
        );
        pushLogEntry(
            TEXTS.logs.longShotSavedTitle,
            [
                `Tir depuis zone ${originZone+1}`,
                ...logParts
            ]
        );

        animateAndThen(() => {
            moveBallToPlayer(defenseTeam, number);
            advanceTurn(defenseTeam);
            showAttackBarForCurrentTeam();
            refreshUI();
        });
    }

    phase         = "attack";
    pendingAttack = null;
}

// ==========================
//   RÉSOLUTION : TIR
// ==========================

// Résout un tir (proche ou lointain, normal ou spécial)
function resolveShot(attackTeam, defenseTeam, defenseAction, isSpecial = false) {
    const originZone = ball.zoneIndex;
    const originLane = ball.laneIndex;
    const attackerId = getPlayerId(attackTeam, ball.number);
    const attackType = isSpecial ? "special" : "shot";

    // CAS 1 : FACE AU GARDIEN
    if (ball.frontOfKeeper) {
        let attackScore  = STATS.attack[attackType].power * staminaFactor(attackerId);
        let defenseScore = getKeeperDefensePower(defenseAction);

        attackScore  += rollD6();
        defenseScore += rollD6();

        showDuelDice(attackScore, defenseScore);

        const diff     = attackScore - defenseScore;
        const ok       = diff > 0;
        const duelText = `Duel tir vs gardien : ${attackScore.toFixed(1)}-${defenseScore.toFixed(1)} (${diff > 0 ? "+"+diff.toFixed(1) : diff.toFixed(1)})`;

        ball.frontOfKeeper = false;
        resetLastDribbler();
        phase         = "attack";
        pendingAttack = null;

        applyStaminaCost(attackerId, "attack", attackType);

        if (ok) {
            score[attackTeam]++;

            setMessage(
                isSpecial
                    ? `BUT SPÉCIAL pour ${TEAMS[attackTeam].label} !`
                    : `BUT pour ${TEAMS[attackTeam].label} !`,
                `Le tir ${isSpecial ? "spécial " : ""}trompe le gardien. Score : ${score.internal} - ${score.external}.`
            );
            pushLogEntry(
                isSpecial ? TEXTS.logs.shotGoalSpecialTitle : TEXTS.logs.shotGoalTitle,
                [
                    `Zone ${originZone+1}`,
                    duelText
                ]
            );

            const newTeam   = defenseTeam;
            const newNumber = 8;

            animateGoalThenReset(attackTeam, () => {
                isKickoff = true;
                applyKickoffPositions();
                moveBallToPlayer(newTeam, newNumber);
                advanceTurn(newTeam);
                showAttackBarForCurrentTeam();
                refreshUI();
            });

        } else {
            const receiverId = getRandomFieldPlayer(defenseTeam);
            const number     = receiverId ? parseInt(receiverId.slice(1),10) : 1;

            setMessage(
                isSpecial ? "Arrêt sur tir spécial !" : "Arrêt du gardien !",
                `${TEAMS[defenseTeam].label} capte ou repousse le ballon.`
            );
            pushLogEntry(
                isSpecial ? TEXTS.logs.shotSavedSpecialTitle : TEXTS.logs.shotSavedTitle,
                [
                    `Zone ${originZone+1}`,
                    `Défense: ${defenseAction}`,
                    duelText
                ]
            );

            animateShotToKeeper(defenseTeam, () => {
                moveBallToPlayer(defenseTeam, number);
                advanceTurn(defenseTeam);
                showAttackBarForCurrentTeam();
                refreshUI();
            });
        }

        return;
    }

    // CAS 2 : TIR AVEC LIGNES DEVANT
    const logParts   = [];
    const facingZone = getFacingZoneIndex(originZone);

    let fieldAttackScore  = STATS.attack[attackType].power * staminaFactor(attackerId);
    let fieldDefenseScore = getFieldDefensePower(defenseAction);

    const isGoodCounterField =
        (defenseAction === "block" || defenseAction === "field-special");

    if (isGoodCounterField) {
        fieldDefenseScore += DUEL_RULES.GOOD_COUNTER_BONUS;
    } else {
        fieldAttackScore  += DUEL_RULES.GENERIC_ATTACK_BONUS;
    }

    fieldAttackScore  += rollD6();
    fieldDefenseScore += rollD6();

    showDuelDice(fieldAttackScore, fieldDefenseScore);

    const diffField = fieldAttackScore - fieldDefenseScore;
    const passField = diffField > 0;
    const fieldText = `Duel tir vs défense : ${fieldAttackScore.toFixed(1)}-${fieldDefenseScore.toFixed(1)} (${diffField > 0 ? "+"+diffField.toFixed(1) : diffField.toFixed(1)})`;
    logParts.push(fieldText);

    applyStaminaCost(attackerId, "attack", attackType);

    if (!passField) {
        const defZone = facingZone;
        const defLane = originLane;

        const number = pickReceiverInCell(
            defenseTeam,
            defZone,
            defLane,
            6,
            null
        );

        moveBallToPlayer(defenseTeam, number);
        setMessage(
            "Tir contré !",
            `${TEAMS[defenseTeam].label} contre le tir et récupère en zone ${defZone+1}, ligne ${defLane+1}.`
        );
        pushLogEntry(
            TEXTS.logs.shotBlockedTitle,
            [
                `Tir depuis zone ${originZone+1}`,
                `Défense: ${defenseAction}`,
                fieldText
            ]
        );

        phase         = "attack";
        pendingAttack = null;

        animateAndThen(() => {
            advanceTurn(defenseTeam);
            showAttackBarForCurrentTeam();
            refreshUI();
        });

        return;
    }

    // Le tir passe la défense → duel gardien
    pushLogEntry(
        TEXTS.logs.shotThroughDefenseTitle,
        [
            `Tir depuis zone ${originZone+1}`,
            fieldText
        ]
    );
    setMessage(
        "Tir cadré !",
        `${TEAMS[defenseTeam].label} : le gardien va devoir intervenir.`
    );

    const linesBehind  = facingZone;
    const gkAttackBase = STATS.attack[attackType].power * staminaFactor(attackerId)
        - (linesBehind * DUEL_RULES.SHOT_DISTANCE_PENALTY_PER_LINE);

    const targetZone   = 3;
    const center       = getCellCenter(attackTeam, targetZone, originLane);
    ball.zoneIndex     = targetZone;
    ball.laneIndex     = originLane;
    ballEl.style.left  = center.x + "%";
    ballEl.style.top   = center.y + "%";

    pendingShotContext = {
        stage:      "keeper",
        attackTeam,
        defenseTeam,
        originZone,
        originLane,
        isSpecial,
        gkAttackBase,
        logParts
    };

    animateShotToKeeper(defenseTeam, () => {
        const mode = `mode-defense-${defenseTeam}`;
        setActionBar(buildDefenseGKHTML(), mode);
        setMessage(
            "Tir cadré !",
            `${TEAMS[defenseTeam].label} : le gardien choisit Arrêt main / Dégagement poing / Special.`
        );

        // On passe bien en phase de défense gardien
        phase         = "defense";
        pendingAttack = attackType; // "shot" ou "special"

        // Si l'équipe qui défend est contrôlée par l'IA, elle choisit elle-même l'action du gardien
        if (isAITeam(defenseTeam)) {
            scheduleAIDefense(attackType, defenseTeam);
        }
    });
}

// ==========================
//   HANDLERS CLICS
// ==========================

// Gère le clic sur une action offensive
function handleAttackClick(action) {
    if (isGameOver || isAnimating) return;
    if (turns >= GAME_RULES.MAX_TURNS || phase !== "attack") return;
    if (!["shot","pass","dribble","special"].includes(action)) return;

    // --- COUP D'ENVOI : passe automatique, pas de défense ---
    if (isKickoff) {
        if (action !== "pass") return;
        resolveKickoffPass(currentTeam);
        return;
    }

    if (ball.frontOfKeeper && action !== "shot" && action !== "special") return;

    pendingAttack = action;
    phase         = "defense";

    const defTeam = otherTeam(currentTeam);
    const mode    = `mode-defense-${defTeam}`;
    let html;

    if (action === "shot" || action === "special") {
        const isCloseRange = ball.frontOfKeeper;

        if (isCloseRange) {
            html = buildDefenseGKHTML();
            setMessage(
                `${TEAMS[currentTeam].label} prépare un ${action === "special" ? "TIR SPÉCIAL" : "TIR"} !`,
                `${TEAMS[defTeam].label} (gardien) : choisis Arrêt main / Dégagement poing / Special.`
            );
        } else {
            html = buildDefenseFieldHTML();
            setMessage(
                `${TEAMS[currentTeam].label} tente un ${action === "special" ? "TIR SPÉCIAL" : "TIR"} !`,
                `${TEAMS[defTeam].label} : choisis Block / Intercept / Tackle / Special.`
            );
        }

    } else {
        html = buildDefenseFieldHTML();
        setMessage(
            `${TEAMS[currentTeam].label} prépare un ${action.toUpperCase()} !`,
            `${TEAMS[defTeam].label} : choisis Block / Intercept / Tackle / Special.`
        );
    }

    setActionBar(html, mode);

    if (isAITeam(defTeam)) {
        scheduleAIDefense(action, defTeam);
    }
}

// Gère le clic sur une action défensive
function handleDefenseClick(defense) {
    if (turns >= GAME_RULES.MAX_TURNS || isAnimating || phase !== "defense" || !pendingAttack) return;

    const attackTeam  = currentTeam;
    const defenseTeam = otherTeam(currentTeam);
    const attack      = pendingAttack;

    if ((attack === "shot" || attack === "special") &&
        pendingShotContext &&
        pendingShotContext.stage === "keeper") {

        resolveShotKeeperDuel(pendingShotContext, defense);
        pendingShotContext = null;
        return;
    }

    if (attack === "pass") {
        phase         = "attack";
        pendingAttack = null;
        resolvePass(attackTeam, defenseTeam, defense);

    } else if (attack === "dribble") {
        phase         = "attack";
        pendingAttack = null;
        resolveDribble(attackTeam, defenseTeam, defense);

    } else if (attack === "shot") {
        resolveShot(attackTeam, defenseTeam, defense, false);

    } else if (attack === "special") {
        resolveShot(attackTeam, defenseTeam, defense, true);
    }
}

// Affiche la carte d'un joueur à partir de son ID "I8"/"E3"
function showPlayerCard(playerId) {
    if (!playerId) return;
    const team   = playerId.startsWith("I") ? "internal" : "external";
    const number = parseInt(playerId.slice(1), 10);
    updatePlayerCard(team, number);
}

// Ajoute les listeners de clic sur tous les pions joueur
function bindPlayerClickHandlers() {
    document.querySelectorAll(".player").forEach(el => {
        el.addEventListener("click", () => {
            const playerId = el.dataset.player;
            showPlayerCard(playerId);
        });
    });
}

// ==========================
//   INIT
// ==========================

// Initialise le jeu (positions, stamina, UI, listeners)
function init() {
    initBasePositions();
    initStamina();
    bindPlayerClickHandlers();

    turns              = 0;
    currentTeam        = "internal";
    score              = { internal: 0, external: 0 };
    phase              = "attack";
    pendingAttack      = null;
    isAnimating        = false;
    lastDribblerId     = null;
    isKickoff          = true;
    isGameOver         = false;
    pendingShotContext = null;

    applyKickoffPositions();
    moveBallToPlayer("internal", 8);

    setMessage(
        TEXTS.ui.gameStartMain,
        TEXTS.ui.gameStartSub
    );
    pushLogEntry(
        TEXTS.logs.kickoffTitle,
        [TEXTS.logs.kickoffDetail]
    );

    showAttackBarForCurrentTeam();
    refreshUI();

    if (modeOnePlayerBtn) {
        modeOnePlayerBtn.addEventListener("click", () => {
            onePlayerMode = !onePlayerMode;
            modeOnePlayerBtn.classList.toggle("active", onePlayerMode);
            modeOnePlayerBtn.textContent = onePlayerMode
                ? "Mode 1 joueur (ON)"
                : "Mode 1 joueur (OFF)";
        });
    }

    if (controlledTeamSelect) {
        controlledTeamSelect.addEventListener("change", () => {
            controlledTeam = controlledTeamSelect.value === "external" ? "external" : "internal";
        });
    }
}

init();
