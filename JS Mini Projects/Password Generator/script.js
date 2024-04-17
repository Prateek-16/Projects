const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");
//set strength circle to grey

//Set PasswordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
     
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function genrateRandomNumber(){
    return getRndInteger(0,9);
}

function genrateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function genrateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbol.length);
    return symbol.charAt(randNum);
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    //to make copy wala span invisible
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener("input",(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copybtn.addEventListener("click",()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

//To Randomise the password generated
function shufflePassword(array){
    //Fisher Yates Method 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generatebtn.addEventListener("click",()=>{
    //None of the check box are selected
    if(checkCount === 0)
        return;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    //Remove old password
    password = "";

    //Generate new password
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(genrateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(genrateLowerCase);
    
    if(numbersCheck.checked)
        funcArr.push(genrateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //Now in the Func Arr we have all the checked conditions

    //Now fulfil the neccessary conditions
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }

    //remaining additions
    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    //Shuffle the password
    password = shufflePassword(Array.from(password));

    //Show password
    passwordDisplay.value = password;

    //calc strength
    calcStrength();

})