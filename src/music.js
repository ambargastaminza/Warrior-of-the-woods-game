let buttonSound = new Audio("Assets/Sounds/Button click.mp3");

function playSound(){
    event.preventDefault();
    buttonSound.play();
    setTimeout(() => {
        window.location.href = document.getElementById("link").href;
    }, 2000);
};