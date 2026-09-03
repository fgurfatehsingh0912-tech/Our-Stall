// CHUNK 1 OF 3: CORE COUPON VARIABLES & DEVICE ATTEMPT COUNTERS
window.triesRemaining = 3;
window.currentActiveCoupon = null;
window.infiniteAmmoActive = false;

window.codePools = {
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

document.addEventListener("DOMContentLoaded", function() {
    const savedPools = localStorage.getItem("marketDay_codePools");
    if (savedPools !== null) {
        window.codePools = JSON.parse(savedPools);
    } else {
        localStorage.setItem("marketDay_codePools", JSON.stringify(window.codePools));
    }

    if (localStorage.getItem("marketDay_machineLocked") === "true") {
        window.triesRemaining = 0;
        document.getElementById("tries-count").innerText = "0";
        lockMachinePermanently();
    } else {
        const savedTries = localStorage.getItem("marketDay_triesLeft");
        if (savedTries !== null) {
            window.triesRemaining = parseInt(savedTries);
            document.getElementById("tries-count").innerText = window.triesRemaining;
            if (window.triesRemaining <= 0) lockMachinePermanently();
        }
    }
    updateAdminVaultDisplay();
});
// LUCKY WHEEL ENGINE: Processes RNG probabilities and handles coupon code reductions
window.rollLuckyDiscount = function() {
    if (window.triesRemaining <= 0) return;
    if (window.codePools.pct10.length === 0 && window.codePools.pct25.length === 0 && window.codePools.pct50.length === 0) {
        const resultBox = document.getElementById("generator-result-box");
        resultBox.style.display = "block";
        resultBox.style.backgroundColor = "#fee2e2";
        resultBox.innerHTML = `<h3 style="color: #991b1b;">⚠️ You are too late!</h3><p>All coupon codes have already been claimed!</p>`;
        return;
    }

    window.triesRemaining--;
    localStorage.setItem("marketDay_triesLeft", window.triesRemaining);
    document.getElementById("tries-count").innerText = window.triesRemaining;
    const resultBox = document.getElementById("generator-result-box");
    resultBox.style.display = "block";
    const roll = Math.random();

    if (roll < 0.02) {
        if (window.codePools.pct50.length > 0) {
            const pickedCode = window.codePools.pct50.shift();
            localStorage.setItem("marketDay_codePools", JSON.stringify(window.codePools));
            window.currentActiveCoupon = { cleanCode: pickedCode, displayTxt: obfuscateCodeDisplay(pickedCode), poolKey: "pct50" };
            resultBox.style.backgroundColor = "#e8f5e9";
            resultBox.innerHTML = `<h3 style="color: #2e7d32; margin-bottom: 0.5rem;">🎉 INSANE LUCK!</h3><p style="margin-bottom: 1rem; font-weight: bold;">You drew a 50% OFF Mega Coupon!</p><div class="discount-code-wrapper">${window.currentActiveCoupon.displayTxt}</div><br><button class="copy-btn" onclick="redeemGeneratedCode()">📋 Copy & Redeem Code</button>`;
        } else {
            resultBox.style.backgroundColor = "#f1f5f9";
            resultBox.innerHTML = `<h3>🎟️ 50% Tier Empty</h3><p>You hit the rare 50% off line, but those codes have run out! Spin again!</p>`;
        }
    } 
    else if (roll < 0.10) {
        if (window.codePools.pct25.length > 0) {
            const pickedCode = window.codePools.pct25.shift();
            localStorage.setItem("marketDay_codePools", JSON.stringify(window.codePools));
            window.currentActiveCoupon = { cleanCode: pickedCode, displayTxt: obfuscateCodeDisplay(pickedCode), poolKey: "pct25" };
            resultBox.style.backgroundColor = "#e3f2fd";
            resultBox.innerHTML = `<h3 style="color: #1565c0; margin-bottom: 0.5rem;">✨ GREAT ROLL!</h3><p style="margin-bottom: 1rem; font-weight: bold;">You drew a 25% OFF Stall Coupon!</p><div class="discount-code-wrapper">${window.currentActiveCoupon.displayTxt}</div><br><button class="copy-btn" onclick="redeemGeneratedCode()">📋 Copy & Redeem Code</button>`;
        } else {
            resultBox.style.backgroundColor = "#f1f5f9";
            resultBox.innerHTML = `<h3>🎟️ 25% Tier Empty</h3><p>You hit the 25% off line, but those codes are sold out! Try your luck again!</p>`;
        }
    } 
    else if (roll < 0.25) {
        if (window.codePools.pct10.length > 0) {
            const pickedCode = window.codePools.pct10.shift();
            localStorage.setItem("marketDay_codePools", JSON.stringify(window.codePools));
            window.currentActiveCoupon = { cleanCode: pickedCode, displayTxt: obfuscateCodeDisplay(pickedCode), poolKey: "pct10" };
            resultBox.style.backgroundColor = "#f1f5f9";
            resultBox.innerHTML = `<h3 style="color: #475569; margin-bottom: 0.5rem;">👍 NICE ONE!</h3><p style="margin-bottom: 1rem; font-weight: bold;">You scored a 10% OFF Ticket Coupon.</p><div class="discount-code-wrapper">${window.currentActiveCoupon.displayTxt}</div><br><button class="copy-btn" onclick="redeemGeneratedCode()">📋 Copy & Redeem Code</button>`;
        } else {
            resultBox.style.backgroundColor = "#f1f5f9";
            resultBox.innerHTML = `<h3>🎟️ 10% Tier Empty</h3><p>Hit the 10% off threshold, but all codes have been claimed! Spin once more.</p>`;
        }
    } 
    else {
        window.currentActiveCoupon = null;
        resultBox.style.backgroundColor = "#fff3cd";
        resultBox.innerHTML = `<h3 style="color: #92400e; margin-bottom: 0.5rem;">🪨 City Rubble...</h3><p style="font-weight: 500;">Unlucky roll! The generator spat out city debris. No coupon drawn this time.</p>`;
    }
    updateAdminVaultDisplay();
    if (window.triesRemaining <= 0) lockMachinePermanently();
};

function obfuscateCodeDisplay(str) { return str.split("").join("_"); }

function lockMachinePermanently() {
    localStorage.setItem("marketDay_machineLocked", "true");
    localStorage.setItem("marketDay_triesLeft", "0");
    const rollBtn = document.getElementById("roll-button");
    if (rollBtn) { rollBtn.disabled = true; rollBtn.innerText = "🔒 Machine Locked"; rollBtn.style.backgroundColor = "#cbd5e1"; }
    const resultBox = document.getElementById("generator-result-box");
    if (resultBox && window.triesRemaining <= 0) {
        resultBox.style.display = "block";
        const notice = document.createElement("p");
        notice.style.cssText = "margin-top: 1rem; color: #ef4444; font-weight: bold;";
        notice.innerText = "You have exhausted your 3 device tries! This coupon machine is now completely locked.";
        resultBox.appendChild(notice);
    }
}
// SECURITY & STAFF VERIFICATION MODULE: Manages clipboard operations and administrative dashboard lists
window.redeemGeneratedCode = function() {
    if (!window.currentActiveCoupon) return;
    navigator.clipboard.writeText(window.currentActiveCoupon.cleanCode).then(() => {
        alert(`Success! "${window.currentActiveCoupon.cleanCode}" copied to clipboard. It is completely vanished from records!`);
        window.currentActiveCoupon = null;
        document.getElementById("generator-result-box").innerHTML = `<h3 style="color: #64748b; text-decoration: line-through;">🎫 Coupon Redeemed</h3><p style="color: #94a3b8; font-size: 0.95rem;">This code was deleted instantly.</p>`;
    });
};

window.verifyAdminLogin = function() {
    if (document.getElementById("admin-password").value.trim() === "6DSTAFF") {
        document.getElementById("admin-login-box").style.display = "none";
        document.getElementById("admin-dashboard-box").style.display = "block";
        updateAdminVaultDisplay();
    } else { alert("Incorrect Staff Password!"); }
};

function updateAdminVaultDisplay() {
    if(!document.getElementById("vault-count-10")) return;
    document.getElementById("vault-count-10").innerText = window.codePools.pct10.length;
    document.getElementById("vault-count-25").innerText = window.codePools.pct25.length;
    document.getElementById("vault-count-50").innerText = window.codePools.pct50.length;
    renderAdminCodeList("admin-list-10", "pct10");
    renderAdminCodeList("admin-list-25", "pct25");
    renderAdminCodeList("admin-list-50", "pct50");
}

function renderAdminCodeList(elementId, poolKey) {
    const listContainer = document.getElementById(elementId);
    if (!listContainer) return;
    if (window.codePools[poolKey].length === 0) { listContainer.innerHTML = `<span style="color: #94a3b8; font-style: italic;">None left!</span>`; return; }
    listContainer.innerHTML = ""; 
    window.codePools[poolKey].forEach((code, index) => {
        const capsule = document.createElement("span");
        capsule.style.cssText = "display: inline-flex; align-items: center; background: #ffffff; border: 1px solid #cbd5e1; padding: 2px 8px; border-radius: 6px; margin: 3px; font-family: monospace; font-weight: bold;";
        capsule.innerHTML = `<span>${code}</span><span style="color: #ef4444; margin-left: 6px; cursor: pointer; font-size: 0.8rem;" onclick="adminDeleteSpecificCode('${poolKey}', ${index})">❌</span>`;
        listContainer.appendChild(capsule);
    });
}

window.adminDeleteSpecificCode = function(poolKey, index) {
    if (confirm("Delete this code?")) {
        window.codePools[poolKey].splice(index, 1); 
        localStorage.setItem("marketDay_codePools", JSON.stringify(window.codePools));
        updateAdminVaultDisplay();
    }
};

window.adminResetTries = function() {
    window.triesRemaining = 3;
    localStorage.removeItem("marketDay_machineLocked");
    localStorage.setItem("marketDay_triesLeft", "3");
    document.getElementById("tries-count").innerText = "3";
    const rollBtn = document.getElementById("roll-button");
    if (rollBtn) { rollBtn.disabled = false; rollBtn.innerText = "🎰 Spin Generator Wheel"; rollBtn.style.backgroundColor = "#10b981"; }
    document.getElementById("generator-result-box").style.display = "none";
    alert("Machine reset to 3 attempts!");
};

window.adminToggleInfAmmo = function() { window.infiniteAmmoActive = !window.infiniteAmmoActive; alert(`Infinite Ammo Override: ${window.infiniteAmmoActive ? "ENABLED" : "DISABLED"}`); };

window.adminRestockVault = function() {
    for(let i=0; i<5; i++) { window.codePools.pct10.push(generateRandomUniqueString("B10")); window.codePools.pct25.push(generateRandomUniqueString("S25")); window.codePools.pct50.push(generateRandomUniqueString("M50")); }
    localStorage.setItem("marketDay_codePools", JSON.stringify(window.codePools));
    updateAdminVaultDisplay();
    alert("Injected 15 fresh codes!");
};

window.adminAddCustomCode = function() {
    const codeInput = document.getElementById("admin-custom-code-input");
    const tierSelect = document.getElementById("admin-custom-tier-select");
    const codeValue = codeInput.value.trim().toUpperCase().replace(/\s+/g, "");
    const selectedTier = tierSelect.value;
    if (!codeValue) { alert("Type a code first!"); return; }
    if (window.codePools.pct10.includes(codeValue) || window.codePools.pct25.includes(codeValue) || window.codePools.pct50.includes(codeValue)) { alert("Code already exists!"); return; }
    window.codePools[selectedTier].push(codeValue);
    localStorage.setItem("marketDay_codePools", JSON.stringify(window.codePools));
    updateAdminVaultDisplay();
    codeInput.value = "";
    alert("Added custom code!");
};
// CHUNK 3A OF 3: LOCAL TICKETS CALCULATOR & REAL-TIME LOCAL SCORES ENGINE

let canvas, ctx, gameInterval, playerName = "Guest", score = 0, dartsLeft = 3, cupsGrid = [], gameActive = false, mouseX = 300, mouseY = 200, crosshairX = 300, crosshairY = 200, activeDarts = []; 
const cupTiers = { front: { prize: "🍬 Candy Box / Sticker Pack Tier!", points: 50, color: "#E63946" }, mid: { prize: "🧩 Custom Fidget Toy / Keychain Tier!", points: 150, color: "#C1121F" }, back: { prize: "✨ GRAND PRIZE: Mystery Toy Bundle!", points: 400, color: "#780000" }, rubble: { prize: "🪨 City Rubble... No Prize!", points: 0 } };

// Live Local Leaderboard Loader: Automatically draws from browser storage on screen updates
function updateLocalLeaderboardUI() {
    const listBody = document.getElementById("leaderboard-rows");
    if(!listBody) return;
    
    // Default decorative seed leaderboard scores
    let localScores = JSON.parse(localStorage.getItem("nerfStall_scores")) || [
        { name: "Ace", score: 600 },
        { name: "Dash", score: 450 },
        { name: "Hunter", score: 200 }
    ];
    
    localScores.sort((a, b) => b.score - a.score);
    listBody.innerHTML = "";
    
    localScores.slice(0, 5).forEach((item, idx) => {
        listBody.innerHTML += `
            <tr>
                <td style="padding: 0.4rem 1rem; font-weight: bold; color: #64748b;">#${idx + 1}</td>
                <td style="padding: 0.4rem 1rem;">${item.name}</td>
                <td style="padding: 0.4rem 1rem; text-align: right; font-weight: bold; color: var(--primary);">${item.score}</td>
            </tr>
        `;
    });
}

// Initialise the local board instantly on startup lifecycle
document.addEventListener("DOMContentLoaded", function() {
    updateLocalLeaderboardUI();
});

window.calculateStallPriceSavings = function() {
    const basePrice = parseFloat(document.getElementById("calc-package-select").value), couponTyped = document.getElementById("calc-coupon-input").value.trim().toUpperCase(), resultsBox = document.getElementById("calc-results-box");
    resultsBox.style.display = "block"; let discountPercent = 0, rateLabel = "None";
    if (window.codePools.pct10.includes(couponTyped)) { discountPercent = 10; rateLabel = "10% OFF Ticket Coupon"; } else if (window.codePools.pct25.includes(couponTyped)) { discountPercent = 25; rateLabel = "25% OFF Stall Coupon"; } else if (window.codePools.pct50.includes(couponTyped)) { discountPercent = 50; rateLabel = "🔥 50% OFF Mega Coupon!"; } else if (couponTyped !== "") { resultsBox.innerHTML = `<h4 style="color:#ef4444;margin-bottom:0.5rem;">❌ Code Not Found</h4><p style="font-size:0.95rem;">The coupon code you entered is invalid or expired.</p>`; return; }
    const totalSavings = basePrice * (discountPercent / 100), finalCost = basePrice - totalSavings;
    resultsBox.innerHTML = `<h4 style="color:#2a9d8f;margin-bottom:0.75rem;">🧮 Cost Breakdown:</h4><p>• Base Price: <strong>$${basePrice.toFixed(2)}</strong></p><p>• Applied Coupon: <span style="font-family:monospace;font-weight:bold;color:#1565c0;">${couponTyped || "NONE"}</span> (${rateLabel})</p><p>• Total Savings: <strong style="color:#2e7d32;">$${totalSavings.toFixed(2)}</strong></p><hr style="border:none;border-top:1px dashed #cbd5e1;margin:0.75rem 0;"><p style="font-size:1.15rem;font-weight:bold;color:var(--dark);">• Final Discounted Cost: <span style="color:var(--primary);font-size:1.3rem;">$${finalCost.toFixed(2)}</span></p>`;
};

window.startGame = function() {
    const inputName = document.getElementById("player-name-input").value.trim(); if(inputName) playerName = inputName;
    document.getElementById("game-setup-panel").style.display = "none"; document.getElementById("game-hud").style.display = "flex"; document.getElementById("canvas-container").style.display = "block"; document.getElementById("leaderboard-container").style.display = "none";
    canvas = document.getElementById("gameCanvas"); ctx = canvas.getContext("2d");
    canvas.addEventListener("mousemove", function(e) { const rect = canvas.getBoundingClientRect(); mouseX = (e.clientX - rect.left) * (canvas.width / rect.width); mouseY = (e.clientY - rect.top) * (canvas.height / rect.height); });
    canvas.removeEventListener("mousedown", handleCanvasClick); canvas.addEventListener("mousedown", handleCanvasClick);
    resetGameMatch();
};
// CHUNK 3B OF 3: GRAPHICS ANIMATION LOOPS, 3D NERF PARABOLAS & LOCAL STORAGE COMPILING

function resetGameMatch() {
    score = 0; dartsLeft = 3; cupsGrid = []; activeDarts = []; gameActive = true;
    document.getElementById("hud-name").innerText = playerName; document.getElementById("hud-score").innerText = score; document.getElementById("hud-darts").innerText = window.infiniteAmmoActive ? "♾️" : dartsLeft; document.getElementById("game-overlay").style.display = "none";
    for (let i = 0; i < 4; i++) cupsGrid.push({ x: 90 + i * 130, y: 155, width: 22, height: 28, hit: false, row: "back", isDecoy: Math.random() < 0.4 });
    for (let i = 0; i < 4; i++) cupsGrid.push({ x: 70 + i * 140, y: 225, width: 30, height: 38, hit: false, row: "mid", isDecoy: Math.random() < 0.5 });
    for (let i = 0; i < 3; i++) cupsGrid.push({ x: 120 + i * 160, y: 310, width: 42, height: 52, hit: false, row: "front", isDecoy: Math.random() < 0.5 });
    clearInterval(gameInterval); gameInterval = setInterval(updateGameFrame, 1000 / 30);
}

function updateGameFrame() {
    if(!ctx) return; ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "#1e293b"; ctx.fillRect(0, 0, canvas.width, 120);
    let tableGrad = ctx.createLinearGradient(0, 120, 0, canvas.height); tableGrad.addColorStop(0, "#3b1e08"); tableGrad.addColorStop(0.1, "#54260c"); tableGrad.addColorStop(1, "#7c2d12"); ctx.fillStyle = tableGrad; ctx.fillRect(0, 120, canvas.width, canvas.height - 120);
    drawCardboardBuilding(40, 90, 60, 80, "#6c200c"); drawCardboardBuilding(480, 80, 65, 95, "#6c200c"); renderCupRow("back");
    drawCardboardBuilding(200, 140, 85, 120, "#7c2d12"); drawCardboardBuilding(340, 160, 95, 100, "#7c2d12"); renderCupRow("mid");
    drawCardboardBuilding(15, 240, 80, 60, "#9a3412"); drawCardboardBuilding(460, 250, 95, 65, "#9a3412"); renderCupRow("front");
    for (let i = activeDarts.length - 1; i >= 0; i--) { let d = activeDarts[i]; d.framesLeft--; let pct = (d.totalFrames - d.framesLeft) / d.totalFrames; d.currentX = d.startX + (d.targetX - d.startX) * pct; d.currentY = d.startY + (d.targetY - d.startY) * pct; d.currentY -= Math.sin(pct * Math.PI) * 45; d.size = d.startSize + (d.targetSize - d.startSize) * pct; ctx.fillStyle = "#3b82f6"; ctx.beginPath(); ctx.arc(d.currentX, d.currentY, d.size, 0, 2 * Math.PI); ctx.fill(); ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.arc(d.currentX, d.currentY, d.size * 0.4, 0, 2 * Math.PI); ctx.fill(); if (d.framesLeft <= 0) { processDartImpact(d.targetX, d.targetY); activeDarts.splice(i, 1); } }
    if (gameActive) { crosshairX += (mouseX - crosshairX) * 0.22; crosshairY += (mouseY - crosshairY) * 0.22; ctx.strokeStyle = (!window.infiniteAmmoActive && dartsLeft === 0 && activeDarts.length === 0) ? "#f43f5e" : "#10b981"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(crosshairX, crosshairY, 16, 0, 2 * Math.PI); ctx.moveTo(crosshairX - 24, crosshairY); ctx.lineTo(crosshairX + 24, crosshairY); ctx.moveTo(crosshairX, crosshairY - 24); ctx.lineTo(crosshairX, crosshairY + 24); ctx.stroke(); }
}

function drawCardboardBuilding(x, y, w, h, baseColor) { ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fillRect(x + 5, y + 5, w, h); ctx.fillStyle = baseColor; ctx.fillRect(x, y, w, h); ctx.strokeStyle = "#fed7aa"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h); }
function renderCupRow(rowName) { cupsGrid.forEach(cup => { if (cup.row !== rowName) return; if (cup.hit) { ctx.fillStyle = "#475569"; ctx.fillRect(cup.x, cup.y + cup.height - 8, cup.height * 1.2, 8); return; } let currentTier = cupTiers[cup.row]; ctx.fillStyle = "rgba(0, 0, 0, 0.25)"; ctx.beginPath(); ctx.ellipse(cup.x + cup.width/2, cup.y + cup.height, cup.width/2, 6, 0, 0, 2 * Math.PI); ctx.fill(); ctx.fillStyle = currentTier.color; ctx.beginPath(); ctx.moveTo(cup.x, cup.y); ctx.lineTo(cup.x + cup.width, cup.y); ctx.lineTo(cup.x + cup.width - (cup.width * 0.12), cup.y + cup.height); ctx.lineTo(cup.x + (cup.width * 0.12), cup.y + cup.height); ctx.closePath(); ctx.fill(); }); }
function handleCanvasClick() { if(!gameActive || (!window.infiniteAmmoActive && dartsLeft <= 0)) return; activeDarts.push({ startX: canvas.width / 2, startY: canvas.height + 20, targetX: crosshairX, targetY: crosshairY, currentX: canvas.width / 2, currentY: canvas.height + 20, startSize: 22, targetSize: 4, size: 22, totalFrames: 12, framesLeft: 12 }); if(!window.infiniteAmmoActive) { dartsLeft--; document.getElementById("hud-darts").innerText = dartsLeft; } }

function processDartImpact(tx, ty) {
    let hitCup = null; for (let i = cupsGrid.length - 1; i >= 0; i--) { let cup = cupsGrid[i]; if (!cup.hit && tx >= cup.x && tx <= cup.x + cup.width && ty >= cup.y && ty <= cup.y + cup.height) { hitCup = cup; break; } }
    if (hitCup) { hitCup.hit = true; let finalOutcome = hitCup.isDecoy ? cupTiers.rubble : cupTiers[hitCup.row]; score += finalOutcome.points; document.getElementById("hud-score").innerText = score; }
    
    if (!window.infiniteAmmoActive && dartsLeft <= 0 && activeDarts.length === 0) {
        // Save the match score locally on the device memory instantly
        let offlineScores = JSON.parse(localStorage.getItem("nerfStall_scores")) || [
            { name: "Ace", score: 600 }, { name: "Dash", score: 450 }, { name: "Hunter", score: 200 }
        ];
        offlineScores.push({ name: playerName, score: score });
        localStorage.setItem("nerfStall_scores", JSON.stringify(offlineScores));
        
        updateLocalLeaderboardUI();
        endMatchSequence(`Range session finished! Total Score: ${score} Points.`);
    }
}

function endMatchSequence(message) { gameActive = false; clearInterval(gameInterval); document.getElementById("leaderboard-container").style.display = "block"; document.getElementById("overlay-title").innerText = "MATCH FINISHED"; document.getElementById("overlay-text").innerHTML = `Result: <strong>${message}</strong>`; document.getElementById("game-overlay").style.display = "flex"; }
window.resetGameMatch = resetGameMatch;

