var addButton = document.getElementById('input_word');
var random_word = document.getElementById('random_word');
var inputWord = document.getElementById('new-word');
var unfinishedWords = document.getElementById('unfinished-words');

function createNewElement(task, word_definition) {
    var listItem = document.createElement('div');
    listItem.className = "display-block";

    var definition = document.createElement('div');
    definition.className = "definition";
    definition.innerText = word_definition;

    var label = document.createElement('label');
    label.className = "self_word";
    label.innerText = task;

    var deleteButton = document.createElement('button');
    deleteButton.className = "delete";
    deleteButton.innerHTML = "<i class='material-icons'>delete</i>";

    listItem.appendChild(label);
    listItem.appendChild(definition);
    listItem.appendChild(deleteButton);

    return listItem;
}

function addWord(word, definition_word) {
        var listItem = createNewElement(word, definition_word);
        unfinishedWords.appendChild(listItem);
        bindTaskEvents(listItem);
        inputWord.value = "";
        save();
}

function addRandomWord() {
        fetch("https://wordsapiv1.p.rapidapi.com/words/?random=true", {
	        "method": "GET",
	        "headers": {
		        "x-rapidapi-key": "e92cd3920dmshb92dc0f00a81c8cp1082e7jsn6fb3cf56975e",
		        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
        	}
        })
        .then((response) => {return response.json(); })
        .then((resp => {
            if(resp.results === undefined) {
                addRandomWord();
            }
            else {
                console.log(resp);
                addWord(resp.word, resp.results[0].definition);
            }
        }))
        .catch(err => console.log(err));
}

function getInputWord() {
    if (inputWord.value) {
        const searchTerm = inputWord.value;
        fetch(`https://wordsapiv1.p.rapidapi.com/words/${searchTerm}/definitions`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "e92cd3920dmshb92dc0f00a81c8cp1082e7jsn6fb3cf56975e",
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
            }
        })
        .then((response) => {return response.json(); })
        .then((resp => {
            addWord(resp.word, resp.definitions[0].definition);
        }))
        .catch(err => console.log(err));
    }
}

addButton.onclick = getInputWord;
random_word.onclick = addRandomWord;

function deleteTask() {
    var listItem = this.parentNode;
    var ul = listItem.parentNode;
    ul.removeChild(listItem);
    save();
}

function unfinishTask() {
    var listItem = this.parentNode;

    unfinishedWords.appendChild(listItem);
    bindTaskEvents(listItem);
    save();
}

function bindTaskEvents(listItem) {
    var deleteButton = listItem.querySelector('.delete');

    deleteButton.onclick = deleteTask;
}

function save() {

    var unfinishedWordsArr = [];
    for (let i = 0; i < unfinishedWords.children.length; i++) {
        unfinishedWordsArr.push(unfinishedWords.children[i].getElementsByTagName('label')[0].innerText);
    }

    var definitionWordArr = [];
    for (let i = 0; i < unfinishedWords.children.length; i++) {
        definitionWordArr.push(unfinishedWords.children[i].getElementsByClassName('definition')[0].innerText);
    }

    localStorage.removeItem('learnWord');
    localStorage.setItem('learnWord', JSON.stringify({ unfinishedWords: unfinishedWordsArr, def_word: definitionWordArr}));
}

function load() {
    if(JSON.parse(localStorage.getItem('learnWord')) === null) {
        return 0;
    }
    return JSON.parse(localStorage.getItem('learnWord'));
}

var data = load();

for (let i = 0; i < data.unfinishedWords.length; i++) {
    var listItem = createNewElement(data.unfinishedWords[i], data.def_word[i]);
    unfinishedWords.appendChild(listItem);
    bindTaskEvents(listItem);
}