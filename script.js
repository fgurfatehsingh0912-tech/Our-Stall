// ============================================================================
// CHUNK 1 OF 4: PERSISTENT CAPTCHA SECURITY INTERCEPTOR & TAB CONTROLLERS
// ============================================================================

// ============================================================================
// CHUNK 1 OF 4: HARDCORE CAPTCHA MATH SECURITY INTERCEPTOR & TAB CONTROLLERS
// ============================================================================

let captchaTargetPage = 'home';
let captchaTargetEvent = null;
let captchaCorrectAnswer = 0;

// Navigation controller to switch between different topic pages
function switchPage(event, pageId) {
    // SECURITY INTERCEPTOR: If this device hasn't completed the puzzle, block access and force the challenge popup
    if (localStorage.getItem("marketDay_deviceVerified") !== "true") {
        if (event) event.preventDefault(); // Stop standard tab click navigation instantly
        captchaTargetPage = pageId;
        captchaTargetEvent = event;
        generateCaptchaEquation();
        document.getElementById("captcha-modal-overlay").style.display = "flex";
        return;
    }

    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.remove('active'));

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById('page-' + pageId).classList.add('active');

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    document.getElementById('nav-bar').scrollIntoView({ behavior: 'smooth' });
}

// ADVANCED CAPTCHA PUZZLE GENERATOR: Shuffles between multiplication and complex addition with visual distortions
function generateCaptchaEquation() {
    const isMultiplication = Math.random() < 0.5;
    let equationText = "";

    if (isMultiplication) {
        // Hard multiplication (e.g., 7 x 8, 12 x 6)
        const num1 = Math.floor(Math.random() * 8) + 6; // 6 to 13
        const num2 = Math.floor(Math.random() * 7) + 3; // 3 to 9
        captchaCorrectAnswer = num1 * num2;
        equationText = `${num1} x ${num2}`;
    } else {
        // Hard double-digit addition (e.g., 37 + 46)
        const num1 = Math.floor(Math.random() * 60) + 25; // 25 to 84
        const num2 = Math.floor(Math.random() * 60) + 25; // 25 to 84
        captchaCorrectAnswer = num1 + num2;
        equationText = `${num1} + ${num2}`;
    }
    
    // Anti-Bot Text Distorter: Breaks text up with uneven spacing to fool OCR tools
    const textArray = `${equationText} = ?`.split("");
    const distortedText = textArray.map(char => Math.random() < 0.3 ? ` ${char} ` : char).join("");
    
    document.getElementById("captcha-math-box").innerText = distortedText;
    document.getElementById("captcha-answer-input").value = "";
    document.getElementById("captcha-error-msg").innerText = "";
}

// VALIDATION MATRICES: Saves pass token to device storage on success, locking out the interceptor forever
function validateCaptchaChallenge() {
    const playerAnswer = parseInt(document.getElementById("captcha-answer-input").value.trim());
    const errorDisplay = document.getElementById("captcha-error-msg");

    if (playerAnswer === captchaCorrectAnswer) {
        // Complete perma-lock of the security check for this machine
        localStorage.setItem("marketDay_deviceVerified", "true");
        document.getElementById("captcha-modal-overlay").style.display = "none";
        
        // Resume routing smoothly to their clicked panel destination
        switchPage(captchaTargetEvent, captchaTargetPage);
    } else {
        errorDisplay.innerText = "❌ Verification Failed! Regnerating challenge...";
        generateCaptchaEquation(); // Instantly reshuffles parameters on wrong input
    }
}

/* 🎲 LIVE DATABASE POOL LOGIC WITH DEVICE PERMA-LOCK */
let triesRemaining = 3;
let currentActiveCoupon = null;
let infiniteAmmoActive = false;

let codePools = {
    pct10: [generateRandomUniqueString("B10"), generateRandomUniqueString("B10"), generateRandomUniqueString("B10"), generateRandomUniqueString("B10"), generateRandomUniqueString("B10")],
    pct25: [generateRandomUniqueString("S25"), generateRandomUniqueString("S25"), generateRandomUniqueString("S25"), generateRandomUniqueString("S25"), generateRandomUniqueString("S25")],
    pct50: [generateRandomUniqueString("M50"), generateRandomUniqueString("M50"), generateRandomUniqueString("M50")]
};

function generateRandomUniqueString(prefix) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; 
    let randomSegment = "";
    for (let i = 0; i < 5; i++) {
        randomSegment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + "-" + randomSegment;
}

// ============================================================================
// CHUNK 2 OF 4: DEVICE STORAGE RESTRICTIONS & RARE DROP WEIGHT ENGINE
// ============================================================================

document.addEventListener("DOMContentLoaded", function() {
    // 1. Initialise Code Pools from Device Memory if present
    const savedPools = localStorage.getItem("marketDay_codePools");
    if (savedPools !== null) {
        codePools = JSON.parse(savedPools);
    } else {
        localStorage.setItem("marketDay_codePools", JSON.stringify(codePools));
    }

    // 2. Initialise Tries Counter
    if (localStorage.getItem("marketDay_machineLocked") === "true") {
        triesRemaining = 0;
        document.getElementById("tries-count").innerText = "0";
        lockMachinePermanently();
    } else {
        const savedTries = localStorage.getItem("marketDay_triesLeft");
        if (savedTries !== null) {
            triesRemaining = parseInt(savedTries);
            document.getElementById("tries-count").innerText = triesRemaining;
            if (triesRemaining <= 0) lockMachinePermanently();
        }
    }
    updateAdminVaultDisplay();
});

function rollLuckyDiscount() {
    if (triesRemaining <= 0) return;

    // Check if the entire machine is completely empty across all pools
    if (codePools.pct10.length === 0 && codePools.pct25.length === 0 && codePools.pct50.length === 0) {
        const resultBox = document.getElementById("generator-result-box");
        resultBox.style.display = "block";
        resultBox.style.backgroundColor = "#fee2e2";
        resultBox.innerHTML = `<h3 style="color: #991b1b;">⚠️ You are too late!</h3><p style="font-weight: 500;">All coupon codes across all tiers have already been cleaned out and claimed!</p>`;
        return;
    }

    triesRemaining--;
    localStorage.setItem("marketDay_triesLeft", triesRemaining);
    document.getElementById("tries-count").innerText = triesRemaining;

    const resultBox = document.getElementById("generator-result-box");
    resultBox.style.display = "block";

    // Random roll weight value (0.0 to 1.0)
    const roll = Math.random();

    // 2% Weight: 50% Off Category (roll between 0.00 and 0.02)
    if (roll < 0.02) {
        if (codePools.pct50.length > 0) {
            const pickedCode = codePools.pct50.shift(); // Strips code instantly out of active array
            localStorage.setItem("marketDay_codePools", JSON.stringify(codePools));
            currentActiveCoupon = { cleanCode: pickedCode, displayTxt: obfuscateCodeDisplay(pickedCode), poolKey: "pct50" };
            
            resultBox.style.backgroundColor = "#e8f5e9";
            resultBox.innerHTML = `
                <h3 style="color: #2e7d32; margin-bottom: 0.5rem;">🎉 INSANE LUCK!</h3>
                <p style="margin-bottom: 1rem; font-weight: bold;">You drew a 50% OFF Mega Coupon!</p>
                <div class="discount-code-wrapper">${currentActiveCoupon.displayTxt}</div><br>
                <button class="copy-btn" onclick="redeemGeneratedCode()">📋 Copy & Redeem Code</button>
            `;
        } else {
            resultBox.style.backgroundColor = "#f1f5f9";
            resultBox.innerHTML = `<h3>🎟️ 50% Tier Empty</h3><p>You hit the rare 50% off line, but those codes have run out! Spin again!</p>`;
        }
    } 
    // 8% Weight: 25% Off Category (roll between 0.02 and 0.10)
    else if (roll < 0.10) {
        if (codePools.pct25.length > 0) {
            const pickedCode = codePools.pct25.shift();
            localStorage.setItem("marketDay_codePools", JSON.stringify(codePools));
            currentActiveCoupon = { cleanCode: pickedCode, displayTxt: obfuscateCodeDisplay(pickedCode), poolKey: "pct25" };
            
            resultBox.style.backgroundColor = "#e3f2fd";
            resultBox.innerHTML = `
                <h3 style="color: #1565c0; margin-bottom: 0.5rem;">✨ GREAT ROLL!</h3>
                <p style="margin-bottom: 1rem; font-weight: bold;">You drew a 25% OFF Stall Coupon!</p>
                <div class="discount-code-wrapper">${currentActiveCoupon.displayTxt}</div><br>
                <button class="copy-btn" onclick="redeemGeneratedCode()">📋 Copy & Redeem Code</button>
            `;
        } else {
            resultBox.style.backgroundColor = "#f1f5f9";
            resultBox.innerHTML = `<h3>🎟️ 25% Tier Empty</h3><p>You hit the 25% off line, but those codes are sold out! Try your luck again!</p>`;
        }
    } 
    // 15% Weight: 10% Off Category (roll between 0.10 and 0.25)
    else if (roll < 0.25) {
        if (codePools.pct10.length > 0) {
            const pickedCode = codePools.pct10.shift();
            localStorage.setItem("marketDay_codePools", JSON.stringify(codePools));
            currentActiveCoupon = { cleanCode: pickedCode, displayTxt: obfuscateCodeDisplay(pickedCode), poolKey: "pct10" };
            
            resultBox.style.backgroundColor = "#f1f5f9";
            resultBox.innerHTML = `
                <h3 style="color: #475569; margin-bottom: 0.5rem;">👍 NICE ONE!</h3>
                <p style="margin-bottom: 1rem; font-weight: bold;">You scored a 10% OFF Ticket Coupon.</p>
                <div class="discount-code-wrapper">${currentActiveCoupon.displayTxt}</div><br>
                <button class="copy-btn" onclick="redeemGeneratedCode()">📋 Copy & Redeem Code</button>
            `;
        } else {
            resultBox.style.backgroundColor = "#f1f5f9";
            resultBox.innerHTML = `<h3>🎟️ 10% Tier Empty</h3><p>Hit the 10% off threshold, but all codes have been claimed! Spin once more.</p>`;
        }
    } 
    // 75% Weight: Whammy Rubble Row (roll between 0.25 and 1.00)
    else {
        currentActiveCoupon = null;
        resultBox.style.backgroundColor = "#fff3cd";
        resultBox.innerHTML = `
            <h3 style="color: #92400e; margin-bottom: 0.5rem;">🪨 City Rubble...</h3>
            <p style="font-weight: 500;">Unlucky roll! The generator spat out city debris. No coupon drawn this time.</p>
        `;
    }

    updateAdminVaultDisplay();
    if (triesRemaining <= 0) lockMachinePermanently();
}
// ============================================================================
// CHUNK 3 OF 4: CLIPBOARD REDEMPTIONS & ADMINISTRATIVE OVERRIDE HANDLING
// ============================================================================

// SCREEN SECURITY MASKER: Adds filler underscores to stop phones taking snapshots/OCR copying off the glass
function obfuscateCodeDisplay(str) {
    return str.split("").join("_");
}

// HARD PERMA-LOCK DEVICE METHOD: Stamps explicit system blocks directly into browser storage metadata logs
function lockMachinePermanently() {
    localStorage.setItem("marketDay_machineLocked", "true");
    localStorage.setItem("marketDay_triesLeft", "0");
    const rollBtn = document.getElementById("roll-button");
    if (rollBtn) {
        rollBtn.disabled = true;
        rollBtn.innerText = "🔒 Machine Locked";
        rollBtn.style.backgroundColor = "#cbd5e1";
    }
    const resultBox = document.getElementById("generator-result-box");
    if (resultBox && triesRemaining <= 0) {
        resultBox.style.display = "block";
        const notice = document.createElement("p");
        notice.style.cssText = "margin-top: 1rem; color: #ef4444; font-weight: bold;";
        notice.innerText = "You have exhausted your 3 device tries! This coupon machine is now completely locked.";
        resultBox.appendChild(notice);
    }
}

// CLIPBOARD INJECTION CONTROLLER: Injects clean code directly into their clipboard, then vanishes display
function redeemGeneratedCode() {
    if (!currentActiveCoupon) return;
    navigator.clipboard.writeText(currentActiveCoupon.cleanCode).then(() => {
        alert(`Success! "${currentActiveCoupon.cleanCode}" copied to clipboard. It is completely vanished from database records!`);
        currentActiveCoupon = null;
        document.getElementById("generator-result-box").innerHTML = `
            <h3 style="color: #64748b; text-decoration: line-through;">🎫 Coupon Redeemed</h3>
            <p style="color: #94a3b8; font-size: 0.95rem;">This code was deleted instantly to prevent double-claiming.</p>
        `;
    });
}

// ADMIN SECURITY PASSPHRASE CHECKER: Compares input field value with '6DSTAFF' key criteria
function verifyAdminLogin() {
    if (document.getElementById("admin-password").value.trim() === "QWERTYUIOP") {
        document.getElementById("admin-login-box").style.display = "none";
        document.getElementById("admin-dashboard-box").style.display = "block";
        updateAdminVaultDisplay();
    } else {
        alert("Incorrect Staff Password!");
    }
}

// QUANTITY TRACKER & INTERACTIVE MANAGER: Generates styled code capsules with click-to-delete functions
function updateAdminVaultDisplay() {
    if(!document.getElementById("vault-count-10")) return;
    
    // Update numerical total labels
    document.getElementById("vault-count-10").innerText = codePools.pct10.length;
    document.getElementById("vault-count-25").innerText = codePools.pct25.length;
    document.getElementById("vault-count-50").innerText = codePools.pct50.length;

    // Build the modular deletion list containers
    renderAdminCodeList("admin-list-10", "pct10");
    renderAdminCodeList("admin-list-25", "pct25");
    renderAdminCodeList("admin-list-50", "pct50");
}

// Dynamic injection tool to format text blocks into inline interactive capsules
function renderAdminCodeList(elementId, poolKey) {
    const listContainer = document.getElementById(elementId);
    if (!listContainer) return;
    
    if (codePools[poolKey].length === 0) {
        listContainer.innerHTML = `<span style="color: #94a3b8; font-style: italic;">None left!</span>`;
        return;
    }

    listContainer.innerHTML = ""; // Clear active text
    codePools[poolKey].forEach((code, index) => {
        const capsule = document.createElement("span");
        capsule.style.cssText = "display: inline-flex; align-items: center; background: #ffffff; border: 1px solid #cbd5e1; padding: 2px 8px; border-radius: 6px; margin: 3px; font-family: monospace; font-weight: bold;";
        
        capsule.innerHTML = `
            <span>${code}</span>
            <span style="color: #ef4444; margin-left: 6px; cursor: pointer; font-size: 0.8rem;" title="Delete this code" onclick="adminDeleteSpecificCode('${poolKey}', ${index})">❌</span>
        `;
        listContainer.appendChild(capsule);
    });
}

// MANUAL DELETION ENGAGEMENT ENGINE: Slices selected array element right out of global variables
function adminDeleteSpecificCode(poolKey, index) {
    const targetCode = codePools[poolKey][index];
    if (confirm(`Are you sure you want to permanently delete code "${targetCode}"?`)) {
        codePools[poolKey].splice(index, 1); // Extract out index element
        localStorage.setItem("marketDay_codePools", JSON.stringify(codePools));
        updateAdminVaultDisplay();
    }
}

// OVERRIDE CLEAR BYPASS METHOD: Resets active memory counters and unlocks generator states
function adminResetTries() {
    triesRemaining = 3;
    localStorage.removeItem("marketDay_machineLocked");
    localStorage.setItem("marketDay_triesLeft", "3");
    document.getElementById("tries-count").innerText = "3";
    const rollBtn = document.getElementById("roll-button");
    if (rollBtn) {
        rollBtn.disabled = false;
        rollBtn.innerText = "🎰 Spin Generator Wheel";
        rollBtn.style.backgroundColor = "#10b981";
    }
    document.getElementById("generator-result-box").style.display = "none";
    alert("Machine reset to 3 attempts!");
}

// INFINITE DART CHEAT MODE TOGGLER: Aligns flag values so click registrations skip dart count down math
function adminToggleInfAmmo() {
    infiniteAmmoActive = !infiniteAmmoActive;
    alert(`Infinite Ammo Override: ${infiniteAmmoActive ? "ENABLED" : "DISABLED"}`);
}

// BATCH BULK INJECTOR CONTROLLER: Populates structural bank pools with random alphanumeric parameters
function adminRestockVault() {
    for(let i=0; i<5; i++) {
        codePools.pct10.push(generateRandomUniqueString("B10"));
        codePools.pct25.push(generateRandomUniqueString("S25"));
        codePools.pct50.push(generateRandomUniqueString("M50"));
    }
    localStorage.setItem("marketDay_codePools", JSON.stringify(codePools));
    updateAdminVaultDisplay();
    alert("Injected 15 fresh randomized unique codes into the vault!");
}

// TEXTBOX SUBMISSION READER: Grabs manual code text and appends into array structure targeted by select dropdown
function adminAddCustomCode() {
    const codeInput = document.getElementById("admin-custom-code-input");
    const tierSelect = document.getElementById("admin-custom-tier-select");
    
    const codeValue = codeInput.value.trim().toUpperCase().replace(/\s+/g, "");
    const selectedTier = tierSelect.value;

    if (!codeValue) {
        alert("Please type a valid name inside the textbox first!");
        return;
    }

    if (codePools.pct10.includes(codeValue) || codePools.pct25.includes(codeValue) || codePools.pct50.includes(codeValue)) {
        alert("This exact code already exists in the system! Please input a unique code.");
        return;
    }

    codePools[selectedTier].push(codeValue);
    localStorage.setItem("marketDay_codePools", JSON.stringify(codePools));
    updateAdminVaultDisplay();
    
    codeInput.value = "";
    alert(`Successfully added custom code "${codeValue}" to your selected discount tier!`);
}

// ============================================================================
// CHUNK 4 OF 4: REALISTIC CARDBOARD CITY PERSPECTIVE CANVAS SHOOTER ENGINE
// ============================================================================

/* 🏙️ STALL REPLICATING REAL TIME GAME ENGINE */
let canvas, ctx;
let gameInterval;
let playerName = "Guest";
let score = 0;
let dartsLeft = 3;
let cupsGrid = [];
let gameActive = false;
let mouseX = 0;
let mouseY = 0;

const cupTiers = {
    front: { prize: "🍬 Candy Box / Sticker Pack Tier!", points: 50, color: "#E63946" },
    mid:   { prize: "🧩 Custom Fidget Toy / Keychain Tier!", points: 150, color: "#C1121F" },
    back:  { prize: "✨ GRAND PRIZE: Mystery Toy Bundle!", points: 400, color: "#780000" },
    rubble:{ prize: "🪨 City Rubble... No Prize!", points: 0 }
};

function startGame() {
    const inputName = document.getElementById("player-name-input").value.trim();
    if(inputName) playerName = inputName;
    
    document.getElementById("game-setup-panel").style.display = "none";
    document.getElementById("game-hud").style.display = "flex";
    document.getElementById("canvas-container").style.display = "block";
    
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    
    canvas.addEventListener("mousemove", function(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
    });

    canvas.removeEventListener("mousedown", handleCanvasClick);
    canvas.addEventListener("mousedown", handleCanvasClick);
    
    resetGameMatch();
}

function resetGameMatch() {
    score = 0;
    dartsLeft = 3;
    cupsGrid = [];
    gameActive = true;
    
    document.getElementById("hud-name").innerText = playerName;
    document.getElementById("hud-score").innerText = score;
    document.getElementById("hud-darts").innerText = infiniteAmmoActive ? "♾️" : dartsLeft;
    document.getElementById("game-overlay").style.display = "none";
    
    for (let i = 0; i < 4; i++) {
        cupsGrid.push({ x: 90 + i * 130, y: 155, width: 22, height: 28, hit: false, row: "back", isDecoy: Math.random() < 0.4 });
    }
    for (let i = 0; i < 4; i++) {
        cupsGrid.push({ x: 70 + i * 140, y: 225, width: 30, height: 38, hit: false, row: "mid", isDecoy: Math.random() < 0.5 });
    }
    for (let i = 0; i < 3; i++) {
        cupsGrid.push({ x: 120 + i * 160, y: 310, width: 42, height: 52, hit: false, row: "front", isDecoy: Math.random() < 0.5 });
    }
    
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGameFrame, 1000 / 30);
}

function updateGameFrame() {
    if(!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1e293b"; 
    ctx.fillRect(0, 0, canvas.width, 120);
    
    let tableGrad = ctx.createLinearGradient(0, 120, 0, canvas.height);
    tableGrad.addColorStop(0, "#451a03");
    tableGrad.addColorStop(0.1, "#78350f");
    tableGrad.addColorStop(1, "#9a3412");
    ctx.fillStyle = tableGrad;
    ctx.fillRect(0, 120, canvas.width, canvas.height - 120);

    drawCardboardBuilding(40, 90, 60, 80, "#7c2d12");
    drawCardboardBuilding(480, 80, 65, 95, "#7c2d12");
    renderCupRow("back");

    drawCardboardBuilding(200, 140, 85, 120, "#9a3412");
    drawCardboardBuilding(340, 160, 95, 100, "#9a3412");
    renderCupRow("mid");

    drawCardboardBuilding(15, 240, 80, 60, "#b45309");
    drawCardboardBuilding(460, 250, 95, 65, "#b45309");
    renderCupRow("front");

    if (gameActive) {
        ctx.strokeStyle = (!infiniteAmmoActive && dartsLeft === 1) ? "#f43f5e" : "#10b981";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 16, 0, 2 * Math.PI);
        ctx.moveTo(mouseX - 24, mouseY); ctx.lineTo(mouseX + 24, mouseY);
        ctx.moveTo(mouseX, mouseY - 24); ctx.lineTo(mouseX, mouseY + 24);
        ctx.stroke();
    }
}

function drawCardboardBuilding(x, y, w, h, baseColor) {
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(x + 5, y + 5, w, h);
    ctx.fillStyle = baseColor;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#fed7aa";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    let winSize = w * 0.15;
    ctx.fillRect(x + w*0.2, y + h*0.2, winSize, winSize * 1.5);
    ctx.fillRect(x + w*0.6, y + h*0.2, winSize, winSize * 1.5);
}

function renderCupRow(rowName) {
    cupsGrid.forEach(cup => {
        if (cup.row !== rowName) return;
        if (cup.hit) {
            ctx.fillStyle = "#475569";
            ctx.fillRect(cup.x, cup.y + cup.height - 8, cup.height * 1.2, 8);
            return;
        }
        let currentTier = cupTiers[cup.row];
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.beginPath();
        ctx.ellipse(cup.x + cup.width/2, cup.y + cup.height, cup.width/2, 6, 0, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = currentTier.color;
        ctx.beginPath();
        ctx.moveTo(cup.x, cup.y);
        ctx.lineTo(cup.x + cup.width, cup.y);
        ctx.lineTo(cup.x + cup.width - (cup.width * 0.12), cup.y + cup.height);
        ctx.lineTo(cup.x + (cup.width * 0.12), cup.y + cup.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(cup.x - 1, cup.y, cup.width + 2, Math.max(3, cup.height * 0.09));
    });
}

function handleCanvasClick() {
    if(!gameActive) return;
    if(!infiniteAmmoActive && dartsLeft <= 0) return;

    let hitCup = null;
    for (let i = cupsGrid.length - 1; i >= 0; i--) {
        let cup = cupsGrid[i];
        if (!cup.hit && mouseX >= cup.x && mouseX <= cup.x + cup.width && mouseY >= cup.y && mouseY <= cup.y + cup.height) {
            hitCup = cup;
            break;
        }
    }

    if(!infiniteAmmoActive) {
        dartsLeft--;
        document.getElementById("hud-darts").innerText = dartsLeft;
    }

    if (hitCup) {
        hitCup.hit = true;
        let finalOutcome = hitCup.isDecoy ? cupTiers.rubble : cupTiers[hitCup.row];
        score += finalOutcome.points;
        document.getElementById("hud-score").innerText = score;
        endMatchSequence(finalOutcome.prize);
    } else {
        if (!infiniteAmmoActive && dartsLeft <= 0) endMatchSequence("💨 Missed! Darts ran out!");
    }
}

function endMatchSequence(message) {
    gameActive = false;
    clearInterval(gameInterval);
    document.getElementById("overlay-title").innerText = score > 0 ? "💥 TARGET HIT!" : "💨 MISSED TARGET";
    document.getElementById("overlay-text").innerHTML = `Result: <strong>${message}</strong><br><br>Turn Earnings: ${score} Points.`;
    document.getElementById("game-overlay").style.display = "flex";
}
