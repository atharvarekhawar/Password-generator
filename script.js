                    // Elements
const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password="";
let passwordLength=10;//default case
let checkCount=0;

// set initially the color of strength div as grey
setIndicator("#ccc");

handleSlider();
// set password length
function handleSlider(){
   inputSlider.value = passwordLength;
   lengthDisplay.innerText=passwordLength;

   const min=inputSlider.min;
   const max=inputSlider.max;

   inputSlider.style.backgroundSize=((passwordLength-min)/(max-min))*100 +"% 100%";

}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color} `;
}

function getRndInteger(min,max){
     return Math.floor(Math.random()*(max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));// fromCharCode
    // converts ascii to character
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
   let len=symbols.length;

   return symbols.charAt(getRndInteger(0, len));
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }

    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
   
}

inputSlider.addEventListener("input",(event) =>{
     passwordLength=event.target.value;
     handleSlider();
});

copyBtn.addEventListener("click",(event) =>{
    if(passwordDisplay.value){
        copyContent(); 
    }
});

function handleCheckboxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{

    checkbox.addEventListener("change",(event)=>{
        handleCheckboxChange(); 
    });
    
});

function shufflePassword(array){
    //Fisher Yates Method for shuffling password

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

generateBtn.addEventListener("click",(event) =>{

    // none of checkbox are selcted
    if(checkCount <= 0 ){
        passwordDisplay.value="";
        return;
    }

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // remove old password at the start

    password="";

    let funcArr=[];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    for(let i=0;i<funcArr.length;i++){ //compulsory add all checked functions
        password+=funcArr[i]();
    }

    // remaining addition

    for(let i=0;i<passwordLength-funcArr.length;i++){

        let randIndex=getRndInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }

    // shuffle the password

    password=shufflePassword(Array.from(password));//sending password 
    // in form of  array

    // show in ui

    passwordDisplay.value=password;

    // calculate strength
    calcStrength();


});





