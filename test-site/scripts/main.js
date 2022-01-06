let myHeading = document.querySelector('h1');
myHeading.textContent = 'Hello world!'

if (!localStorage.getItem('name')) {
    setUserName();
} else {
    let localName = localStorage.getItem('name');
    myHeading.textContent = 'Mozilla 酷毙了，' + localName;
}

let myButton = document.querySelector('button');

myButton.onclick = function() {
    setUserName();
}

function setUserName() {
    let myName = prompt('请输入你的名字:');
    if (myName) {
        localStorage.setItem('name', myName);
        myHeading.textContent = 'Mozilla 酷毙了，' + myName;
    }
}