const WORDS = [
    {
        word: "WHALE SHARK",
        image: "C:/Users/Jancen/Desktop/LEBRON!/download (2).jpg",
        missing: [2, 8] // Both 'A's
    },
    {
        word: "DINOSAUR",
        image: "C:/Users/Jancen/Desktop/LEBRON!/fofinho.jpg",
        missing: [2, 6] // 'N' and 'U'
    },
    {
        word: "BOUQUET",
        image: "C:/Users/Jancen/Desktop/LEBRON!/download (3).jpg",
        missing: [2, 4, 5] // 'U', 'U', and 'E'
    }
];

let curIdx = 0;

// Elements
const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const finalScreen = document.getElementById('final-screen');
const envContainer = document.getElementById('envelope-container');
const playBtn = document.getElementById('play-btn');
const clueImg = document.getElementById('clue-img');
const inputsArea = document.getElementById('inputs-area');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const sndSuccess = document.getElementById('snd-success');
const sndError = document.getElementById('snd-error');

// Initialization
function init() {
    createBG();
    
    // Envelope Open
    envContainer.onclick = () => {
        envContainer.classList.add('open');
        document.getElementById('click-hint').style.display = 'none';
    };

    // Play Button - ROCK SOLID HANDLER
    playBtn.onclick = (e) => {
        e.stopPropagation(); // Don't re-click envelope
        console.log("Play button hit!");
        introScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        loadWord();
    };
}

function createBG() {
    const bg = document.getElementById('bg-hearts');
    const icons = ['💖', '✨', '🌸', '💕'];
    setInterval(() => {
        const h = document.createElement('div');
        h.className = 'floating-h';
        h.innerText = icons[Math.floor(Math.random() * icons.length)];
        h.style.left = Math.random() * 100 + 'vw';
        h.style.fontSize = (Math.random() * 20 + 15) + 'px';
        bg.appendChild(h);
        setTimeout(() => h.remove(), 5000);
    }, 500);
}

function loadWord() {
    const data = WORDS[curIdx];
    if (!data) return;

    clueImg.src = data.image;
    clueImg.onerror = () => { clueImg.src = "https://via.placeholder.com/400?text=Cute+Image"; };
    
    inputsArea.innerHTML = '';
    const fullWord = data.word;

    for (let i = 0; i < fullWord.length; i++) {
        const char = fullWord[i];
        if (char === ' ') {
            const s = document.createElement('div');
            s.style.width = '20px';
            inputsArea.appendChild(s);
        } else if (data.missing.includes(i)) {
            const input = document.createElement('input');
            input.className = 'char-input';
            input.maxLength = 1;
            input.dataset.ans = char;
            input.oninput = () => checkInput(input);
            inputsArea.appendChild(input);
        } else {
            const box = document.createElement('div');
            box.className = 'char-box';
            box.innerText = char;
            inputsArea.appendChild(box);
        }
    }

    // Auto-focus first input
    setTimeout(() => {
        const first = inputsArea.querySelector('.char-input');
        if (first) first.focus();
    }, 300);

    updateProgress();
}

function checkInput(input) {
    const val = input.value.toUpperCase();
    const ans = input.dataset.ans.toUpperCase();

    if (val === '') return;

    if (val === ans) {
        input.classList.add('glow');
        input.disabled = true;
        sndSuccess.currentTime = 0;
        sndSuccess.play().catch(()=>{});
        
        // Focus next
        const all = Array.from(document.querySelectorAll('.char-input'));
        const next = all[all.indexOf(input) + 1];
        if (next) next.focus();

        // Check if word done
        if (all.every(i => i.disabled)) {
            setTimeout(nextWord, 1000);
        }
    } else {
        input.classList.add('shake');
        sndError.currentTime = 0;
        sndError.play().catch(()=>{});
        setTimeout(() => {
            input.value = '';
            input.classList.remove('shake');
        }, 500);
    }
}

function nextWord() {
    curIdx++;
    if (curIdx < WORDS.length) {
        loadWord();
    } else {
        showCelebration();
    }
}

function updateProgress() {
    const p = (curIdx / WORDS.length) * 100;
    progressBar.style.width = p + '%';
    progressText.innerText = `💖 ${curIdx}/${WORDS.length}`;
}

function showCelebration() {
    gameScreen.classList.add('hidden');
    finalScreen.classList.remove('hidden');
    updateProgress(); // 100%
    
    setTimeout(() => {
        window.location.href = "https://www.instagram.com/reel/DQrKdDvDCG6/?igsh=MWVlZzEzbGh4aGp1dQ==";
    }, 3000);
}

// Start
init();
