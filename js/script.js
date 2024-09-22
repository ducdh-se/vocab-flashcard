document.addEventListener('DOMContentLoaded', function() {
    const lessonList = document.getElementById('lesson-list');
    const flashcard = document.getElementById('flashcard');
    const wordInfo = document.getElementById('word-info');
    const wordInput = document.getElementById('word-input');
    const hintInfo = document.getElementById('hint-info');
    const resultSection = document.getElementById('result');
    const resultWord = document.getElementById('result-word');
    const exampleSentences = document.getElementById('example-sentences');
    const scoreDisplay = document.getElementById('score');
    
    let currentLesson, currentWord, score = 0, incorrectWords = [];

    // Load vocabulary data from JSON file
    fetch('json/vocabulary.json')
        .then(response => response.json())
        .then(data => {
            loadLessons(data);
        })
        .catch(error => console.error('Error loading vocabulary data:', error));

    function loadLessons(data) {
        lessonList.innerHTML = ''; // Clear previous list if any
        for (let lesson in data) {
            let listItem = document.createElement('li');
            listItem.textContent = lesson;
            listItem.addEventListener('click', () => startLesson(data[lesson]));
            lessonList.appendChild(listItem);
        }
    }

    function startLesson(lesson) {
        currentLesson = lesson;
        document.getElementById('lesson-selection').style.display = 'none';
        flashcard.style.display = 'block';
        nextWord();
    }

    function nextWord() {
        currentWord = currentLesson[Math.floor(Math.random() * currentLesson.length)];
        wordInfo.querySelector('#word').textContent = '???';
        wordInput.value = '';
        hintInfo.textContent = '';
        resultSection.style.display = 'none';
        wordInfo.style.display = 'block';
    }

    document.getElementById('play-audio').addEventListener('click', function() {
        new Audio(currentWord.audio).play();
    });

    document.getElementById('hint').addEventListener('click', function() {
        hintInfo.textContent = `${currentWord.meaning} (${currentWord.type})`;
    });

    document.getElementById('check-answer').addEventListener('click', function() {
        if (wordInput.value.toLowerCase() === currentWord.word.toLowerCase()) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            showResult(true);
        } else {
            incorrectWords.push(currentWord);
            showResult(false);
        }
    });

    function showResult(isCorrect) {
        wordInfo.style.display = 'none';
        resultSection.style.display = 'block';
        resultWord.textContent = currentWord.word;
        exampleSentences.innerHTML = currentWord.examples.map(e => `<p>${e}</p>`).join('');
    }

    document.getElementById('learn-again').addEventListener('click', nextWord);
    document.getElementById('next-word').addEventListener('click', nextWord);
    document.getElementById('reset').addEventListener('click', reset);
    document.getElementById('home').addEventListener('click', goHome);

    function reset() {
        score = 0;
        incorrectWords = [];
        scoreDisplay.textContent = `Score: ${score}`;
        goHome();
    }

    function goHome() {
        flashcard.style.display = 'none';
        resultSection.style.display = 'none';
        document.getElementById('lesson-selection').style.display = 'block';
    }
});
