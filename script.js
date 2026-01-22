const IMG_HERO = "img/tvujluchador.png"; 
const IMG_ARENA = "img/arena.png";
const IMG_TITLE = "img/titul.png";
const IMG_GAMEOVER = "img/konec.png";

const IMG_OPPONENTS = [
    "img/mascara.png", 
    "img/diablo.png", 
    "img/capitan.png", 
    "img/sangre.png", 
    "img/campeon.png"
];

let fighterName = "";
let currentRank = 5; 
let momentum = 0;
let losses = 0;
const MAX_LOSSES = 10;


const gongSound = new Audio("https://youtu.be/2ic7OEuC_bU?si=KCzhV3s7LeCPCbB5");

const moveLibrary = {
    high: ["Moonsault", "450 Splash", "Hurricanrana", "Shooting Star Press", "Mexican Destroyer"],
    power: ["Powerbomb", "Spinebuster", "Lariat", "Piledriver", "Suplex"],
    dirty: ["Low Blow", "Mask Pull", "Eye Poke", "Chair Shot","Distract Ref."]
};


function updateUI(title, text, buttonsHtml, imgSrc) {
    document.getElementById("scene-title").innerText = title;
    document.getElementById("story-text").innerHTML = text;
    document.getElementById("interaction-menu").innerHTML = buttonsHtml;
    
    const mainImg = document.getElementById("main-image");
    mainImg.style.animation = 'none';
    mainImg.offsetHeight;
    mainImg.style.animation = null; 
    
    mainImg.src = imgSrc;
    

   let progress = (5 - currentRank) * 20;
    if (currentRank === 0) progress = 100;
    document.getElementById("rank-bar").style.width = progress + "%";
    document.getElementById("rank-label").innerText = currentRank === 0 ? "¡CAMPEÓN MUNDIAL!" : `RANK: #${currentRank}`;

    const lossElement = document.getElementById("loss-counter");
    if (lossElement) {
        lossElement.innerText = (MAX_LOSSES - losses);
        // Pokud zbývají poslední 3 životy, obarvíme text na červeno
        lossElement.style.color = (MAX_LOSSES - losses) <= 3 ? "#ef4135" : "#ffcc00";
    }
}

function startGame() {
    let input = prompt("Zadej jméno svého luchadora:");
    fighterName = (input ? input : "Misterio") + ".";
    
    gongSound.play();

    updateUI("BIENVENIDO", 
        `Vítej, hrdino jménem <strong>${fighterName}</strong>. Světla Arény Mexico se rozsvěcují právě pro tebe!`, 
        `<button class="btn-main" onclick="announceMatch()">NAJÍT PRVNÍHO SOUPEŘE</button>`, 
        IMG_HERO);
}

function announceMatch() {
    momentum = 0;
    const opponentNames = ["Mascara Ligero", "Diablo Rojo", "Capitán Muerte", "Sangre Fría", "El Campeón Supremo"];
    const opponentIndex = 5 - currentRank; 
    const opponent = opponentNames[opponentIndex];
    const opponentImg = IMG_OPPONENTS[opponentIndex];

    updateUI("VYZYVATEL", 
        `Tvým dnešním soupeřem je obávaný <strong>${opponent}</strong>! Dav bučí, je čas mu ukázat tvou sílu.`, 
        `<button class="btn-main" onclick="fightStep()">VSTOUPIT DO RINGU</button>`, 
        opponentImg);
}

function fightStep() {
    const moveH = moveLibrary.high[Math.floor(Math.random() * moveLibrary.high.length)];
    const moveP = moveLibrary.power[Math.floor(Math.random() * moveLibrary.power.length)];
    const moveD = moveLibrary.dirty[Math.floor(Math.random() * moveLibrary.dirty.length)];

    updateUI("V RINGU", 
        `Momentum: <strong>${momentum}/3</strong>. Diváci šílí! Jaký chvat zvolíš?`, 
        `<button class="btn-high" onclick="processMove('high')">${moveH}</button>
         <button class="btn-power" onclick="processMove('power')">${moveP}</button>
         <button class="btn-dirty" onclick="processMove('dirty')">${moveD}</button>`, 
        IMG_ARENA);
}

function processMove(type) {
    let roll = Math.random();
    let success = (type === 'high' ? roll > 0.45 : type === 'power' ? roll > 0.25 : roll > 0.6);

    if (success) {
        momentum += (type === 'dirty' ? 2 : 1);
        if (momentum >= 3) {
            gongSound.play();
            currentRank--;
            if (currentRank === 0) {
                updateUI("¡CAMPEÓN!", `NEUVĚŘITELNÉ! ${fighterName} získal Zlatý titul!`, 
                `<button class="btn-main" onclick="location.reload()">RESTART</button>`, IMG_TITLE);
            } else {
                updateUI("VÍTĚZSTVÍ!", `Vyhráváš zápas!`, 
                `<button class="btn-main" onclick="announceMatch()">DALŠÍ ZÁPAS</button>`, IMG_HERO);
            }
        } else {
            updateUI("ZÁSAH!", `Skvělý chvat!`, `<button class="btn-main" onclick="fightStep()">DALŠÍ ÚTOK</button>`, IMG_ARENA);
        }
    } else {
        losses++;
        
        if (losses >= MAX_LOSSES) {
            // KONEC KARIÉRY
            updateUI("FIN DE LA CARRERA", 
                `Tvé tělo už nezvládne další rány. Po ${losses} porážkách tvá kariéra v Lucha Libre končí. Dav mlčí...`, 
                `<button class="btn-main" onclick="location.reload()">Zkusit znovu od nuly</button>`, 
                IMG_GAMEOVER);
        } else {
            // KLASICKÝ RESTART ZÁPASU
            updateUI("KONTRA!", 
                `Soupeř tě srazil! Tato prohra tě bolela. (Zbývá životů: ${MAX_LOSSES - losses})`, 
                `<button class="btn-main" onclick="announceMatch()">ZNOVU DO RINGU</button>`, 
                IMG_ARENA);
        }
    }
}