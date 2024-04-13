let user_counter = 0;
let comp_counter = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const per_score = document.querySelector("#per_score");
const comp_score = document.querySelector("#comp_score");

const genCompChoice = () => {
    const options = ["Rock","Paper","Scissor"];
    let randomSelector = Math.floor(Math.random() * 3);
    return options[randomSelector];
}

const drawGame = () => {
    console.log("drawing game");
    msg.innerText = "It's a Draw :o";
    msg.style.backgroundColor = "#081b31";
}

const showWinner = (userWin,userChoice,compChoice) => {
    if(userWin){
        console.log("you win");
        msg.innerText = `You Win ! Your ${userChoice} beats Comp's ${compChoice}`;
        msg.style.backgroundColor = "green";
        user_counter++;
        per_score.innerText = user_counter;

    }
    else{
        console.log("you lose");
        msg.innerText = `You Lose ! Comp's ${compChoice} beats your ${userChoice}`;
        msg.style.backgroundColor = "red";
        comp_counter++;
        comp_score.innerText = comp_counter;
    }
}

const playGames = (userChoice) => {
    console.log("user choice =",userChoice);
    const compChoice = genCompChoice();
    console.log("computer choice =",compChoice);

    if(userChoice === compChoice) {
        drawGame();
    }
    else {
        let userWin = true;
        if(userChoice === "Rock"){
            userWin = compChoice === "Paper" ? false : true;
        }
        else if(userChoice === "Paper"){
            userWin = compChoice === "Scissor" ? false : true;
        }
        else{
            userWin = compChoice === "Rock" ? false : true;
        }
        showWinner(userWin,userChoice,compChoice);
    }
}

choices.forEach((choice)=>{
    choice.addEventListener("click",()=>{
        const userChoice=choice.getAttribute("id");
        playGames(userChoice);
    })
})