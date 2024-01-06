document.getElementById("start").addEventListener("click", function() {
   document.getElementById("turnToBreak").querySelector(".name").innerHTML=document.getElementById("player1").value;
   let p1=document.getElementById("player1Score");
   let p2=document.getElementById("player2Score");
   
   p1.querySelector(".player-name").innerHTML=document.getElementById("player1").value;
   p2.querySelector(".player-name").innerHTML=document.getElementById("player2").value;

   let scores=document.querySelectorAll(".score");
   for (let s of scores) {
      s.innerHTML="0";
   }
   let toBreak=document.getElementById("turnToBreak").querySelector(".name");
   toBreak.dataset.player="player1";
   toBreak.innerHTML=document.getElementById("player1").value;
   document.getElementById("setup").style.display="none";
   document.getElementById("score").style.display="flex";
   save();
});

document.getElementById("endGame").addEventListener("click", function() {
   let p1=document.getElementById("player1").value;
   let p1Score=parseInt(document.getElementById("player1Score").querySelector(".score").innerHTML);
   let p2=document.getElementById("player2").value;
   let p2Score=parseInt(document.getElementById("player2Score").querySelector(".score").innerHTML);
   document.getElementById("finalScoreText").innerHTML=p1+" "+p1Score+" - "+p2Score+" "+p2;
   document.getElementById("score").style.display="none";
   document.getElementById("finalScore").style.display="flex";

});
document.getElementById("endGameForReal").addEventListener("click", function() {

   let current=JSON.parse(window.localStorage.getItem("poolScoreStore"));
   if (current==="null") {
      window.localStorage.setItem("poolScoreStore", false);
      window.localStorage.removeItem("poolScoreStore");
   }
   else {
      current.status="ended";
      window.localStorage.setItem("poolScoreStore", JSON.stringify(current));

   }

   let p1=document.getElementById("player1").value;

   document.getElementById("player1").value=document.getElementById("player2").value;
   document.getElementById("player2").value=p1;

   document.getElementById("finalScore").style.display="none";
   document.getElementById("setup").style.display="flex";

});
document.getElementById("cancelEndGame").addEventListener("click", function() {
   document.getElementById("finalScore").style.display="none";
   document.getElementById("score").style.display="flex";

});
document.getElementById("player1Score").addEventListener("click", function() {
   updateBreak();
   incrementScore("player1");
});

document.getElementById("player2Score").addEventListener("click", function() {
   updateBreak();
   incrementScore("player2");
});

let undos=document.querySelectorAll(".undo");
for (let undo of undos) {
   undo.addEventListener("click", function(e) {
      e.stopPropagation();
      updateBreak();
      decrementScore(this.dataset.player);
   });
}

function updateBreak() {
   let name=document.getElementById("turnToBreak").querySelector(".name");
   let curr=name.dataset.player;
   if (curr==="player1") {
      curr="player2";
   }
   else {
      curr="player1";
   }
   name.dataset.player=curr;
   name.innerHTML=document.getElementById(curr).value;
}

function decrementScore(player) {
   let curr=parseInt(document.getElementById(player+"Score").querySelector(".score").innerHTML);
   if (curr===1) {
      document.getElementById(player+"Score").querySelector(".undo").style.opacity="0";
   }
   document.getElementById(player+"Score").querySelector(".score").innerHTML=curr-1;
   save();
}
function incrementScore(player) {
   let curr=parseInt(document.getElementById(player+"Score").querySelector(".score").innerHTML);
   document.getElementById(player+"Score").querySelector(".score").innerHTML=curr+1;
   let scores=document.getElementById("score").querySelectorAll(".undo");
   for (let score of scores) {
      score.style.opacity="0";
   }
   document.getElementById(player+"Score").querySelector(".undo").style.opacity="1";
   save();
}

function save() {
   let currentGame={};
   currentGame.player1={};
   currentGame.toBreak=document.getElementById("turnToBreak").querySelector(".name").dataset.player;
   currentGame.player1.name=document.getElementById("player1").value;
   currentGame.player1.score=document.getElementById("player1Score").querySelector(".score").innerHTML;
   currentGame.player2={};
   currentGame.player2.name=document.getElementById("player2").value;
   currentGame.player2.score=document.getElementById("player2Score").querySelector(".score").innerHTML;
   currentGame.status="playing";
   window.localStorage.setItem("poolScoreStore", JSON.stringify(currentGame));
}

function load() {
   try {
      let current= JSON.parse(window.localStorage.getItem("poolScoreStore"));
      if (current !== null) {
         console.log("Current is ",current);

         if (current.status === "playing") {
            document.getElementById("player1").value=current.player1.name;
            document.getElementById("player2").value=current.player2.name;

            document.getElementById("turnToBreak").querySelector(".name").dataset.player=current.toBreak;
            document.getElementById("turnToBreak").querySelector(".name").innerHTML=current.toBreak==="player1"?current.player1.name:current.player2.name;
            let p1=document.getElementById("player1Score");
            let p2=document.getElementById("player2Score");

            p1.querySelector(".player-name").innerHTML=current.player1.name;
            p2.querySelector(".player-name").innerHTML=current.player2.name;

            p1.querySelector(".score").innerHTML=current.player1.score;
            p2.querySelector(".score").innerHTML=current.player2.score;
            document.getElementById("setup").style.display="none";
            document.getElementById("score").style.display="flex";
         }
         else {
            console.log("Game is ended");
            document.getElementById("player1").value=current.player2.name;
            document.getElementById("player2").value=current.player1.name;
         }
      }
   }
   catch (e) {

   }
}

load();
