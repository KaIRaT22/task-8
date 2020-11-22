var jokes__setup = document.getElementById("jokes__setup");
var jokes__punchline = document.getElementById("jokes__punchline");
var getJoke = document.getElementById("getJoke");

function addRandomJoke() {
    fetch("https://official-joke-api.appspot.com/jokes/programming/random")
    .then((response) => {return response.json(); })
    .then((resp => {
        jokes__setup.innerText = resp[0].setup
        jokes__punchline.innerText = resp[0].punchline
    }))
    .catch(err => console.log(err));
}

getJoke.onclick = addRandomJoke

// section TRANSLATOE
var en_word = document.getElementById("en_word");
var ru_word = document.getElementById("ru_word");
var translate = document.getElementById("translate");

translate.onclick = translateInput

function translateInput() {
    const data = JSON.stringify([
        {
            "Text": en_word.value
        }
    ]);
    
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            ru_word.value = JSON.parse(this.responseText)[0].translations[0].text;
        }
    });
    
    xhr.open("POST", "https://microsoft-translator-text.p.rapidapi.com/translate?to=ru&api-version=3.0&profanityAction=NoAction&textType=plain");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("x-rapidapi-key", "e92cd3920dmshb92dc0f00a81c8cp1082e7jsn6fb3cf56975e");
    xhr.setRequestHeader("x-rapidapi-host", "microsoft-translator-text.p.rapidapi.com");
    
    xhr.send(data);

}