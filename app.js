// =======================================
// POMPOMPURIN BIRTHDAY QUEST
// app.js
// PARTE 1/2 (UNIFICADO Y CORREGIDO)
// =======================================

// =======================================
// ELEMENTOS DEL DOM
// =======================================
const landing = document.querySelector(".landing");
const dialog = document.getElementById("dialogOverlay");
const gameScene = document.getElementById("gameScene");
const finalScene = document.getElementById("finalScene");
const letterScene = document.getElementById("letterScene");
const giftGrid = document.getElementById("giftGrid");
const message = document.getElementById("dialogMessage");
const startButton = document.getElementById("start");
const nextButton = document.getElementById("nextDialog");

// =======================================
// CONTADOR
// =======================================
const starsCounter = document.getElementById("stars");
const starsBox = document.getElementById("starsCounter");

// =======================================
// MODAL
// =======================================
const rewardModal = document.getElementById("rewardModal");
const rewardIcon = document.getElementById("rewardIcon");
const rewardTitle = document.getElementById("rewardTitle");
const rewardText = document.getElementById("rewardText");
const closeReward = document.getElementById("closeReward");

// =======================================
// CARTA
// =======================================
const openLetter = document.getElementById("openLetter");
const closeLetter = document.getElementById("closeLetter");

// =======================================
// TEXTOS
// =======================================
const texts = [
    "¡Hola! 😊",
    "Hoy alguien muy especial cumple 19 años...",
    "Y preparé un regalo con muchísimo cariño.",
    "Pero... creo que Muffin lo escondió. 🐾",
    "¿Me ayudas a encontrarlo?"
];

// =======================================
// RECOMPENSAS
// =======================================
const baseRewards = [
    { type: "star", amount: 3 },
    { type: "star", amount: 4 },
    { type: "star", amount: 5 },
    { type: "star", amount: 7 },
    { type: "cookie" },
    { type: "cookie" },
    { type: "paw" },
    { type: "key" },
    { type: "gift" }
];

// =======================================
// VARIABLES
// =======================================
let rewards = [];
let currentDialog = 0;
let stars = 0;
let displayedStars = 0;
let hasKey = false;
let giftUnlocked = false;
let gameFinished = false;

// =======================================
// EVENTOS
// =======================================
if (startButton) {
    startButton.addEventListener("click", startGame);
}

if (nextButton) {
    nextButton.addEventListener("click", nextDialog);
}

if (closeReward) {
    closeReward.addEventListener("click", closeModal);
}

if (openLetter) {
    openLetter.addEventListener("click", showLetter);
}

if (closeLetter) {
    closeLetter.addEventListener("click", hideLetter);
}

// =======================================
// INICIAR JUEGO
// =======================================
function startGame() {
    currentDialog = 0;
    stars = 0;
    displayedStars = 0;
    hasKey = false;
    giftUnlocked = false;
    gameFinished = false;

    if (starsCounter) {
        starsCounter.textContent = "0";
    }

    if (starsBox) {
        starsBox.classList.remove("full");
    }

    rewards = [...baseRewards];
    createBoard();

    if (message) {
        message.textContent = texts[currentDialog];
    }

    if (dialog) {
        dialog.classList.remove("hidden");
    }

    if (gameScene) {
        gameScene.classList.add("hidden");
    }

    if (finalScene) {
        finalScene.classList.add("hidden");
    }

    if (letterScene) {
        letterScene.classList.add("hidden");
    }
}

// =======================================
// DIÁLOGO
// =======================================
function nextDialog() {
    currentDialog++;

    if (currentDialog < texts.length) {
        message.textContent = texts[currentDialog];
        return;
    }

    dialog.classList.add("hidden");
    landing.classList.add("hidden");
    gameScene.classList.remove("hidden");
}

// =======================================
// CREAR TABLERO
// =======================================
function createBoard() {
    shuffle(rewards);
    giftGrid.innerHTML = "";

    rewards.forEach((reward) => {
        const gift = document.createElement("div");
        gift.className = "gift";
        gift.reward = reward;

        gift.innerHTML = `
            <div class="lid"></div>
            <div class="box"></div>
            <div class="ribbon vertical"></div>
            <div class="ribbon horizontal"></div>
            <div class="bow"></div>
            <div class="reward"></div>
        `;

        gift.addEventListener("click", openGift);
        giftGrid.appendChild(gift);
    });
}

// =======================================
// MEZCLAR RECOMPENSAS
// =======================================
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// =======================================
// ABRIR REGALO
// =======================================
function openGift(event) {
    const gift = event.currentTarget;

    if (gift.classList.contains("opened") || gameFinished) {
        return;
    }

    gift.classList.add("opened");

    const reward = gift.reward;
    const rewardElement = gift.querySelector(".reward");

    switch (reward.type) {
        // ===================================
        // ESTRELLAS
        // ===================================
        case "star":
            rewardElement.textContent = "⭐";
            rewardIcon.textContent = "⭐";
            rewardTitle.textContent = `¡Encontraste ${reward.amount} estrellas!`;
            rewardText.textContent = "Nuevas estrellas iluminan el cielo de Ale ✨";
            addStars(reward.amount);
            break;

        // ===================================
        // GALLETA
        // ===================================
        case "cookie":
            rewardElement.textContent = "🍪";
            rewardIcon.textContent = "🍪";
            rewardTitle.textContent = "¡Encontraste una galletita!";
            rewardText.textContent = "Muffin te dejó un pequeño premio para que sigas buscando 🐾";
            checkGift(); // Validamos si es la última caja
            break;

        // ===================================
        // HUELLA
        // ===================================
        case "paw":
            rewardElement.textContent = "🐾";
            rewardIcon.textContent = "🐾";
            rewardTitle.textContent = "¡Una huella de Muffin!";
            rewardText.textContent = "Parece que pasó por aquí... estamos muy cerca sisi 👀";
            checkGift(); // Validamos si es la última caja
            break;

        // ===================================
        // LLAVE
        // ===================================
        case "key":
            rewardElement.textContent = "🔑";
            rewardIcon.textContent = "🔑";
            rewardTitle.textContent = "¡Encontraste la llave!";
            rewardText.textContent = "Esta llave abre algo muy especial 💛";
            hasKey = true;
            checkGift(); // Validamos si es la última caja
            break;

        // ===================================
        // REGALO FINAL
        // ===================================
        case "gift":
            rewardElement.textContent = "🎁";
            rewardIcon.textContent = "🎁";

            if (!giftUnlocked) {
                rewardTitle.textContent = "Todavía no ✨";
                rewardText.textContent = "El cielo necesita sus 19 estrellas primero ⭐";
            } else if (!hasKey) {
                rewardTitle.textContent = "Está cerrado 🔒";
                rewardText.textContent = "Encontramos el regalo, pero falta la llave 🔑";
            } else {
                rewardTitle.textContent = "¡Encontraste el regalo! 🎁";
                rewardText.textContent = "¡Genial! Pero aún quedan rincones por revisar con pompompurin 🐾";
            }
            
            checkGift(); // Validamos si es la última caja
            break;
    }

    setTimeout(() => {
        // Solo mostramos el modal si el juego no ha terminado instantáneamente
        if (!gameFinished || reward.type !== "gift") {
            rewardModal.classList.remove("hidden");
        }
    }, 400);
}

// =======================================
// SUMAR ESTRELLAS
// =======================================
function addStars(amount) {
    stars += amount;

    if (stars > 19) {
        stars = 19;
    }

    animateStars();

    if (stars === 19) {
        giftUnlocked = true;

        setTimeout(() => {
            completeSky();
            checkGift(); // Validamos tras completar el cielo
        }, 800);
    }
}

// =======================================
// ANIMAR CONTADOR
// =======================================
function animateStars() {
    const animation = setInterval(() => {
        if (displayedStars < stars) {
            displayedStars++;
            starsCounter.textContent = displayedStars;
        } else {
            clearInterval(animation);
        }
    }, 120);
}

// =======================================
// CIELO COMPLETO
// =======================================
function completeSky() {
    if (starsBox) {
        starsBox.classList.add("full");
    }
    rewardIcon.textContent = "🌌";
    rewardTitle.textContent = "¡El cielo está completo!";
    rewardText.textContent = "Las 19 estrellas ya están brillando para Ale✨";
}

// =======================================
// VERIFICAR SI YA PUEDE ABRIR REGALO
// =======================================
function checkGift() {
    // Cuenta cuántas cajas tienen la clase "opened" actualmente
    const openedGifts = document.querySelectorAll(".gift.opened").length;
    
    // Compara con el total de recompensas del juego (9 en este caso)
    const allGiftsOpened = (openedGifts === rewards.length);

    // Solo avanza si se cumplen los 3 requisitos fundamentales
    if (giftUnlocked && hasKey && allGiftsOpened) {
        
        // Retrasamos ligeramente el fin del juego para dejar que el modal del último click termine su animación
        setTimeout(() => {
            finishGame();
        }, 1500);
    }
}

// =======================================
// TERMINAR JUEGO
// =======================================
function finishGame() {
    gameFinished = true;

    rewardIcon.textContent = "🎉";
    rewardTitle.textContent = "¡¡Encontraste todo!! 🎉";
    rewardText.textContent = "La sorpresa está lista para descubrirse 💛";

    rewardModal.classList.remove("hidden");

    setTimeout(() => {
        closeModal();
        showFinalScene();
    }, 2500);
}

// =======================================
// ESCENA FINAL
// =======================================
function showFinalScene() {
    if (gameScene) {
        gameScene.classList.add("hidden");
    }

    if (finalScene) {
        finalScene.classList.remove("hidden");
    }
}

// =======================================
// MOSTRAR CARTA
// =======================================
function showLetter() {
    if (finalScene) {
        finalScene.classList.add("hidden");
    }

    if (letterScene) {
        letterScene.classList.remove("hidden");
    }
}

// =======================================
// OCULTAR CARTA
// =======================================
function hideLetter() {
    if (letterScene) {
        letterScene.classList.add("hidden");
    }

    if (finalScene) {
        finalScene.classList.remove("hidden");
    }
}

// =======================================
// CERRAR MODAL
// =======================================
function closeModal() {
    if (rewardModal) {
        rewardModal.classList.add("hidden");
    }
}