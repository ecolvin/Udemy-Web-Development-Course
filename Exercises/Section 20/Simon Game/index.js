$(document).on("keydown", e => {    
    if(level === 0){
        $("body").removeClass("game-over");
        resetGame();
        nextSequence();
    }
});
$(".btn").on("click", buttonHandler);

var BUTTON_COLORS = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userPattern = [];
var level = 0;
var takingUserInput = false;

function resetGame()
{
    gamePattern = [];
    userPattern = [];
    level = 0;
    takingUserInput = false;
}

function nextSequence()
{
    userPattern = [];
    level++;
    $("#level-title").text("Level " + level);
    var rand = Math.floor(Math.random()*4);
    gamePattern.push(BUTTON_COLORS[rand]);

    showPattern(0);
}

function showPattern(i)
{
    if(i === level)
    {
        takingUserInput = true;
        return;
    }
    var color = gamePattern[i];
    pressButton(color);
    setTimeout(() => { showPattern(i+1); }, 500);
}

function buttonHandler()
{
    if(takingUserInput)
    {
        var btnColor = $(this).attr("id");
        userPattern.push(btnColor);

        pressButton(btnColor);

        checkAnswer(userPattern.length - 1);
    }
}

function pressButton(color)
{
    playSound(color);
    animateButton(color);
}

function playSound(color)
{
    var sound = new Audio("sounds/" + color + ".mp3");
    sound.play();
}

function animateButton(color)
{
    var buttonId = "#" + color;
    $(buttonId).addClass("pressed");
    setTimeout(() => $(buttonId).removeClass("pressed"), 100);
}

function checkAnswer(index)
{
    if(userPattern[index] !== gamePattern[index])
    {
        gameOver();
        return;
    }
    
    if(index === gamePattern.length - 1)
    {        
        takingUserInput = false;
        setTimeout(nextSequence, 1000);
    }
}

function gameOver()
{
    var wrongSound = new Audio("sounds/wrong.mp3");
    wrongSound.play();
    $("#level-title").text("Game Over! Press Any Key to Restart!");
    $("body").addClass("game-over");
    resetGame();
}