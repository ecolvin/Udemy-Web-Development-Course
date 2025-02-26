function rollDice()
{
    console.log("Rolling Dice");

    var rand1 = Math.floor(Math.random() * 6) + 1;
    var rand2 = Math.floor(Math.random() * 6) + 1;
    console.log("rand1 = " + rand1 + "; rand2 = " + rand2);

    var image1 = "images/dice" + rand1 + ".png";
    var image2 = "images/dice" + rand2 + ".png";
    console.log(image1);
    console.log(image2);

    document.querySelector(".img1").setAttribute("src", image1);
    document.querySelector(".img2").setAttribute("src", image2);

    if(rand1 > rand2)
    {
        document.querySelector("h1").textContent = "🚩Player 1 Wins!";
    }
    else if(rand1 < rand2)
    {
        document.querySelector("h1").textContent = "Player 2 Wins!🚩";
    }
    else
    {
        document.querySelector("h1").textContent = "Draw";
    }
}

rollDice();
