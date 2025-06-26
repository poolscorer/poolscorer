setInterval(function () {
    document.getElementById("time").innerHTML = new Date().toLocaleTimeString();
}, 500);
document.getElementById("switchPlayers").addEventListener("click", function () {
    let p1 = document.getElementById("player1");
    let p2 = document.getElementById("player2");
    let tmp = p1.value;
    p1.value = p2.value;
    p2.value = tmp;

});
document.getElementById("clock").addEventListener("click", function (e) {
    if (e.target.id !== "endGame") {
        document.getElementById("qr-full").classList.remove("hidden");
    }
});
document.getElementById("qr-full").addEventListener("click", function () {
    document.getElementById("qr-full").classList.add("hidden");
});
document.getElementById("start").addEventListener("click", function () {
    // document.getElementById("turnToBreak").querySelector(".name").innerHTML=document.getElementById("player1").value;
    let p1 = document.getElementById("player1Score");
    let p2 = document.getElementById("player2Score");

    document.body.classList.add("playing");
    p1.querySelector(".player-name").innerHTML = document.getElementById("player1").value;
    p2.querySelector(".player-name").innerHTML = document.getElementById("player2").value;

    let scores = document.querySelectorAll(".score");
    for (let s of scores) {
        s.innerHTML = "0";
    }
    let toBreak = document.getElementById("turnToBreak").querySelector(".name");
    toBreak.dataset.player = "player1";
    toBreak.innerHTML = document.getElementById("player1").value;
    p1.classList.add("nextToBreak");
    p2.classList.remove("nextToBreak");

    if (document.getElementById("fullScreen").checked) {
        let el = document.documentElement;
        let rfs = el.requestFullscreen;
        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        }
    }
    document.getElementById("setup").style.display = "none";
    document.getElementById("score").style.display = "flex";
    save();
    positionTurnToBreak();
});
document.getElementById("endGame").addEventListener("click", function () {
    let p1 = document.getElementById("player1").value;
    let p1Score = parseInt(document.getElementById("player1Score").querySelector(".score").innerHTML);
    let p2 = document.getElementById("player2").value;
    let p2Score = parseInt(document.getElementById("player2Score").querySelector(".score").innerHTML);
    document.getElementById("finalScoreText").innerHTML = p1 + " " + p1Score + " - " + p2Score + " " + p2;
    document.getElementById("score").style.display = "none";
    document.getElementById("finalScore").style.display = "flex";

});
document.getElementById("endGameForReal").addEventListener("click", function () {
    endGame();
});
document.getElementById("cancelEndGame").addEventListener("click", function () {
    document.getElementById("finalScore").style.display = "none";
    document.getElementById("score").style.display = "flex";

});

document.getElementById("player1Score").addEventListener("click", function () {
    updateBreak();
    incrementScore("player1");
});

document.getElementById("player2Score").addEventListener("click", function () {
    updateBreak();
    incrementScore("player2");
});

let undos = document.querySelectorAll(".undo");
for (let undo of undos) {
    undo.addEventListener("click", function (e) {

        e.stopPropagation();
        if (e.target.classList.contains("button")) {
            updateBreak();
            decrementScore(this.dataset.player);
        }
    });
}

function updateBreak() {
    let name = document.getElementById("turnToBreak").querySelector(".name");
    let curr = name.dataset.player;
    let last = curr;
    if (curr === "player1") {
        curr = "player2";
    } else {
        curr = "player1";
    }
    name.dataset.player = curr;
    name.innerHTML = document.getElementById(curr).value;
    document.getElementById(curr + "Score").classList.add("nextToBreak");
    document.getElementById(last + "Score").classList.remove("nextToBreak");
    positionTurnToBreak();
}

function decrementScore(player) {
    let curr = parseInt(document.getElementById(player + "Score").querySelector(".score").innerHTML);
    if (curr === 1) {
        document.getElementById(player + "Score").querySelector(".undo").classList.add("undo-hidden");
        document.getElementById(player + "Score").querySelector(".balance").classList.add("balance-hidden");
    }
    document.getElementById(player + "Score").querySelector(".score").innerHTML = curr - 1;
    save();
}

function incrementScore(player) {
    let curr = parseInt(document.getElementById(player + "Score").querySelector(".score").innerHTML);
    document.getElementById(player + "Score").querySelector(".score").innerHTML = curr + 1;
    let scores = document.getElementById("score").querySelectorAll(".undo");
    for (let score of scores) {
        score.classList.add("undo-hidden");
    }
    let balances = document.getElementById("score").querySelectorAll(".balance");
    for (let balance of balances) {
        balance.classList.add("balance-hidden");
    }
    document.getElementById(player + "Score").querySelector(".undo").classList.remove("undo-hidden");
    document.getElementById(player + "Score").querySelector(".balance").classList.remove("balance-hidden");
    setTimeout(function () {
        console.log("hide undo");
        document.getElementById(player + "Score").querySelector(".undo").classList.add("undo-hidden");
        document.getElementById(player + "Score").querySelector(".balance").classList.add("balance-hidden");
    }, 60000)
    save();
}

function endGame() {
    document.body.classList.remove("playing");
    let current = JSON.parse(window.localStorage.getItem("poolScoreStore"));
    if (current === "null") {
        window.localStorage.setItem("poolScoreStore", false);
        window.localStorage.removeItem("poolScoreStore");
    } else {
        current.gameStatus = "ended";
        window.localStorage.setItem("poolScoreStore", JSON.stringify(current));

    }
    let p1 = document.getElementById("player1").value;
    document.getElementById("player1").value = document.getElementById("player2").value;
    document.getElementById("player2").value = p1;

    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    document.getElementById("finalScore").style.display = "none";
    document.getElementById("setup").style.display = "flex";

}

function save() {
    let currentGame = {};
    currentGame.player1 = {};
    currentGame.toBreak = document.getElementById("turnToBreak").querySelector(".name").dataset.player;
    currentGame.player1.name = document.getElementById("player1").value;
    currentGame.player1.score = document.getElementById("player1Score").querySelector(".score").innerHTML;
    currentGame.player2 = {};
    currentGame.player2.name = document.getElementById("player2").value;
    currentGame.player2.score = document.getElementById("player2Score").querySelector(".score").innerHTML;
    currentGame.gameStatus = "playing";
    currentGame.fullScreen = document.getElementById("fullScreen").checked;
    window.localStorage.setItem("poolScoreStore", JSON.stringify(currentGame));
}

function load() {
    try {
        let current = JSON.parse(window.localStorage.getItem("poolScoreStore"));
        if (current !== null) {
            if (current.gameStatus === "playing") {

                document.getElementById("player1").value = current.player1.name;
                document.getElementById("player2").value = current.player2.name;
                document.getElementById("fullScreen").checked = current.fullScreen;

                document.getElementById("turnToBreak").querySelector(".name").dataset.player = current.toBreak;
                document.getElementById("turnToBreak").querySelector(".name").innerHTML = current.toBreak === "player1" ? current.player1.name : current.player2.name;
                let p1 = document.getElementById("player1Score");
                let p2 = document.getElementById("player2Score");

                document.getElementById(current.toBreak + "Score").classList.add("nextToBreak");
                //document.getElementById(last+"Score").classList.remove("nextToBreak");


                p1.querySelector(".player-name").innerHTML = current.player1.name;
                p2.querySelector(".player-name").innerHTML = current.player2.name;

                p1.querySelector(".score").innerHTML = current.player1.score;
                p2.querySelector(".score").innerHTML = current.player2.score;

                document.getElementById("setup").style.display = "none";
                document.body.classList.add("playing");
                if (document.getElementById("fullScreen").checked) {
                    let el = document.documentElement;
                    let rfs = el.requestFullscreen;
                    if (typeof rfs != "undefined" && rfs) {
                        rfs.call(el);
                    }
                }
                document.getElementById("score").style.display = "flex";
                positionTurnToBreak();
            } else {
                document.getElementById("player1").value = current.player2.name;
                document.getElementById("player2").value = current.player1.name;
                document.getElementById("fullScreen").checked = current.fullScreen;

            }
        }
    } catch (e) {

    }
}

function positionTurnToBreak(doubleCheck = true) {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const d = new Date().toLocaleTimeString();
            if (d.toLowerCase().includes("pm") || d.toLowerCase().includes("am")) {
                document.getElementById("clock").classList.add("longtime");
            }
            const t = document.querySelector("#turnToBreak > div");

            if (t.offsetTop > 0 && t.getBoundingClientRect().height > 50) {
                document.getElementById("clock").classList.add("cramped");
            } else {
                document.getElementById("clock").classList.remove("cramped");
                if (doubleCheck) {
                    positionTurnToBreak(false);
                }
            }
            let sab = getComputedStyle(document.documentElement).getPropertyValue("--sab");
            sab = parseInt(sab.substring(0, sab.length-2));
            if (sab===0) {
                document.getElementById("clock").classList.remove("homebar");
            }
            else {
                document.getElementById("clock").classList.add("homebar");
            }
        });
    });

}

if (screen.orientation) { // Property doesn't exist on screen in IE11
    screen.orientation.addEventListener("change", function() {
        positionTurnToBreak();
    });
}
else {
    window.addEventListener("orientationchange", function() {
      positionTurnToBreak();
    }, false);
}

load();
