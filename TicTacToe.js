//some variables 
var cell,originalBoard;
var playerType = "AI";
var level = "easy";
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]
var player2 = "X";
var player1 = (player2=="X")?"O":"X";
var user,sym1,res1,sym2,res2;
var temp = player2 ;
var resultBoard ;    


//Main function that will start the game
function startGame() {

//initializing level
level = document.getElementById("level").value;
document.getElementById("levelView").innerHTML = "Level : " + level;
res1 = 0;  res2 = 0; sym1 = player2 ;
sym2 = player1 ;
user = (playerType == "AI")?"AI":"Friend";


//Initializing the array
originalBoard = [0,1,2,3,4,5,6,7,8];
        //each box
         cell = document.getElementsByClassName("pad");  
 //event for on click
     for(let i=0;i<cell.length;i++) {
    cell[i].innerText = "";
    cell[i].style.backgroundColor = "#00C4C4";              cell[i].addEventListener("click",turnClick,false);
     
    } updateScore();
resultBoard = document.getElementById("resultBoard");    
resultBoard.style.visibility = "hidden";
resultBoard.style.animation = "";    
}


//to fill the the boxes
function turnClick(box) {

 if(typeof(originalBoard [box.target.id])=="number") { 
    turn(box.target.id,temp);
 
//to give Turn to the AI as per level
  if(playerType == "AI") {
     if(isWinning(originalBoard,player2)===false) {
     if(level=="easy") {
        simpleAi();
    } else if(level=="hard")  {
        complexAi();
    } else if(level=="medium"){
        mediumAi();
    }
  }} else {
     swapPlayer() ;
  }
 }  
}

//function to change color of cells and simple number
function turn(num,val) {
    
    if(num!=undefined) {
    originalBoard[num] = val;
    cell[num].innerText = val;
    cell[num].style.backgroundColor = "#1C252E";   
    }
    
    //to check if player is wininning
    var isWon = isWinning(originalBoard,val);
    if(isWon != false) {
       
       if(val==player1) {
           res2++; updateScore();
       }else {
           res1++; updateScore();
       }
       endGame(val,isWon);
     }  
     
    //in case if draw
    if(emptySquares(originalBoard).length==0&&!isWon) {
        endGame("none",null);
    }
}
    

//A simple AI to play with
function simpleAi() {
    let empty = emptySquares(originalBoard) ;
    let ran = Math.floor(Math.random()*(empty.length-1));

        turn(empty[ran],player1);    
}

//medium Ai
function mediumAi() {
    
    let check,num;
      for(var i=0;i<winCombos.length;i++) {    let check,num;
        check = 0 ;
        for(var j=0;j<3;j++) {
            if(originalBoard [winCombos[i][j]]==player1){
                check++;
            } else {
                num = j;
            } 
        }
        if(check==2&&typeof(originalBoard [winCombos[i][num]])=="number"){
        turn(winCombos[i][num],player1);  
        return null;
        }
    }
    
    for(var i=0;i<winCombos.length;i++) {    let check,num;
        check = 0 ;
        for(var j=0;j<3;j++) {
            if(originalBoard [winCombos[i][j]]==player2){
                check++;
            } else {
                num = j;
            } 
        }
        if(check==2&&typeof(originalBoard [winCombos[i][num]])=="number"){
        turn(winCombos[i][num],player1);  
        return null;
        }
    } simpleAi()  ;
    
}

//compled AI i.e minmax method
function complexAi() {
     turn(minimax(originalBoard, player1).index,player1); 
}

//to check if any box is empty
function emptySquares(board) {
    let emptySquares = [] ;
    for(let i=0;i<board.length;i++) {
       if(typeof(board[i])=="number"){        
          emptySquares.push(i);
        }
    } 
    return emptySquares;
    
}

//check win combos
function isWinning (board,player) {
    var check;
    for(let i=0;i<winCombos.length;i++) {   check = 0 ;
        for(let j=0;j<3;j++) {
            if(board[winCombos[i][j]]==player){
                check++;
            } 
        }
        if(check==3){
            return winCombos[i];
        }
    } return false;
}

//ending the game
function endGame (val,isWon) {

let finalResult = document.getElementById("finalResult");
    
//removing eventlistener from cells
 for(let i=0;i<cell.length;i++) {
        cell[i].removeEventListener("click",turnClick,false);
  }
   if(val == player2 ) {
       finalResult.innerText = "You Won !";
       finalResult.style.color ="lime";
       resultBoard.style.visibility = "visible";
       resultBoard.style.animation = "pop .7s linear";
              
   } else if(val == player1 ) {
       finalResult.innerText = "You Lost !";
       finalResult.style.color ="tomato";
       resultBoard.style.visibility = "visible";
       resultBoard.style.animation = "pop .7s linear";
   } else if(isWon == null ) {
       finalResult.innerText = "Draw !!";
       finalResult.style.color ="cyan";
       resultBoard.style.visibility = "visible";
       resultBoard.style.animation = "pop .7s linear";
   }
//coloring winning combo cell    
    let color = (val==player2)?"lightgreen":"white";

    if(isWon != null)  {
       for(let i=0;i<isWon.length;i++)  
       {
  cell[isWon[i]].style.backgroundColor =color;
       }
    } 
}

function minimax(newBoard, player) {

    var availSpots = emptySquares(originalBoard);

    if (isWinning(newBoard,player2)!=false){
    
        return {score: -10};
    } else if (isWinning(newBoard, player1)!=false) {

        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};   }
        
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {

        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == player1) {

            var result = minimax(newBoard, player2);
            move.score = result.score;

        } else {
            var result = minimax(newBoard, player1);
            move.score = result.score;
        }
        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }


    var bestMove;
    if(player === player1) {

        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++) {

            if (moves[i].score < bestScore) {
               bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function swapPlayer() {
    if(temp==player1) {
        temp = player2 ;
    } else {
        temp = player1 ;
    }
}

//to update score
function updateScore() {
 document.getElementById("res1").innerText = res1; document.getElementById("res2").innerText = res2; document.getElementById("sym1").innerText = sym1;
document.getElementById("sym2").innerText = sym2; document.getElementById("user").innerText = user;
}

//for playing again
function playAgain() {

resultBoard.style.visibility = "hidden";
resultBoard.style.animation = "";
    //Initializing the array
originalBoard = [0,1,2,3,4,5,6,7,8];
        //each box
         cell = document.getElementsByClassName("pad");  
 //event for on click
     for(let i=0;i<cell.length;i++) {
    cell[i].innerText = "";
    cell[i].style.backgroundColor = "#00C4C4";              cell[i].addEventListener("click",turnClick,false);
     
    } updateScore();
}


/*
Every thing related to setting and stuff below
*/

function setPlayer(a) {
    player2 = a;
    temp = a;
    player1 = (player2=="X")?"O":"X";
    let x = document.getElementById("x");
    let o = document.getElementById("o");
    if(a=="X") {
        x.style.backgroundColor = "#00C4C4";
       x.style.color = "white"; 
        o.style.backgroundColor = "white";
        o.style.color = "#FF0066";
    } else {
        o.style.backgroundColor = "#00C4C4";
        o.style.color = "white"; 
        x.style.backgroundColor = "white";
        x.style.color = "#FF0066";
    } startGame(); updateScore();
}

function setType() {
    
    playerType = document.getElementById("player").value;   
   let a = document.getElementById("level") ;
   let b = document.getElementById("level0") ;
    if(playerType =="AI") {
       a.style.display = "block";
       b.style.display = "block";
    }else {
      a.style.display = "none";
       b.style.display = "none";
    }
    startGame(); updateScore();
}

function settGame() {
        var HOME = document.getElementById("HOME");
    fillColor(home,HOME);
    document.getElementsByTagName("h1")[0]
.innerHTML = 'Tic Tac Toe';

document.body.scrollTop = 0; 
document.documentElement.scrollTop = 0; 
    
startGame();
}
/*
Every thing related to menu and animation stuff below
*/

var span,close,holder,home,inst,about,sett;
var tab;


window.onload = function() {

//for menu bar
 span = document.getElementsByTagName("span");
 close = document.getElementById("closeMenu");
 holder = document.getElementById("menuHolder");
 home = document.getElementById("home");
 inst = document.getElementById("inst");
 about = document.getElementById("about");
 sett = document.getElementById("sett"); 
    home.onclick = function () {
    var HOME = document.getElementById("HOME");
    fillColor(home,HOME);
    document.getElementsByTagName("h1")[0]
.innerHTML = 'Tic Tac Toe';

if( emptySquares(originalBoard).length < 8 ) {
    resultBoard.style.visibility = "visible";
}
closeMenu();
    }
    inst.onclick = function (){ 
    var INST = document.getElementById("INST");
    fillColor(inst,INST);
    document.getElementsByTagName("h1")[0]
.innerHTML = 'Guide <i class="fas fa-book"></i>';

closeMenu();
    }
    about.onclick = function (){ 
        var ABOUT = document.getElementById("ABOUT");
    fillColor(about,ABOUT);
    document.getElementsByTagName("h1")[0]
.innerHTML = 'About <i class="fas fa-info-circle"></i>';

closeMenu();
    }  
    sett.onclick = function (){ 
        var SETT = document.getElementById("SETT");
    fillColor(sett,SETT);
    document.getElementsByTagName("h1")[0]
.innerHTML = 'Setting <i class="fas fa-cog"></i>';

closeMenu();
    }    

//To start the Game onload
startGame() ;
    
}


/* function to control menu bar */
function openMenu() {

//to control animation     span[0].style.transformOrigin="18px";
     span[0].style.transform = "translateY(10px)rotate(-45deg)";
     span[1].style.transformOrigin="18px";
     span[1].style.transform = "rotate(45deg)";
    
     span[2].style.opacity = "0";
     span[2].style.transform = "translateY(10px)";
     
     close.style.zIndex= "1";
     holder.style.left = "0";
     
    }
function closeMenu() {

//to control animation
span[0].style.transformOrigin="18px";
     span[0].style.transform = "translateY(0)rotate(0)";
     span[1].style.transformOrigin="18px";
     span[1].style.transform = "rotate(0)";
    
     span[2].style.opacity = "1";
     span[2].style.transform = "translateY(0)";
     
     close.style.zIndex= "-1";   
     holder.style.left = "-100%";
        
}

function fillColor(a,b) {
    
    home.style.backgroundColor = "transparent";
    inst.style.backgroundColor = "transparent";
    about.style.backgroundColor = "transparent";
    sett.style.backgroundColor = "transparent";
    HOME.style.visibility= "hidden";
INST.style.visibility= "hidden";
ABOUT.style.visibility= "hidden";
SETT.style.visibility= "hidden";

b.style.visibility= "visible";
    a.style.backgroundColor = "#1C252E";
    
    
resultBoard.style.visibility = "hidden";
resultBoard.style.animation = "";     
}

//for swiping actions
window.addEventListener('touchstart', handleTouchStart, false);

window.addEventListener('touchmove', handleTouchMove, false); 

var xDown = null, yDown = null;
 
function getTouches(evt) { 
    return evt.touches  ||  
    evt.originalEvent.touches;
    } 

function handleTouchStart(evt) { 
    const firstTouch = getTouches(evt)[0]; 
    xDown = firstTouch.clientX; 
    yDown = firstTouch.clientY; 
    }
    
function handleTouchMove(evt)   { 
    
    if ( ! xDown || ! yDown ) 
    {  return;  } 
        
    var xUp = evt.touches[0].clientX; 
    var yUp = evt.touches[0].clientY; 
    var xDiff = xDown - xUp; 
    var yDiff = yDown - yUp; 
    
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) )     {
    
    /*Response part*/ 
    
        if ( xDiff>0) {
            /* left swipe */ 
            document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
           closeMenu();
       } else if ( xDiff<0) { 
           /* right swipe */ 
          document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;  
          openMenu();
       } 
    } 
    
 /* reset values */ 
 xDown = null; yDown = null; 
}    
