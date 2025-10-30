document.addEventListener('DOMContentLoaded', () => {

    const screens = {
        start: document.getElementById('start-screen'),
        rules: document.getElementById('rules-screen'),
        game: document.getElementById('game-screen'),
        win: document.getElementById('win-screen')
    };

    const gameSounds = {
        correct: new Audio('sounds/correct.mp3'),
        wrong: new Audio('sounds/wrong.mp3'),
        suspense: new Audio('sounds/suspense.mp3'),
        win: new Audio('sounds/win.mp3'),
        start: new Audio('sounds/start_game.mp3')
    };

    const allGameSoundFiles = Object.values(gameSounds);
    let audioUnlocked = false;


    const trackList = [
        'musica/pista-tecnologica-1.mp3',
    ];
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.volume = 0.4;
    }


    const buttons = {
        start: document.getElementById('start-btn'),
        showRules: document.getElementById('rules-btn'),
        backToStart: document.getElementById('back-to-start-btn'),
        startFromRules: document.getElementById('start-from-rules-btn'),
        reveal: document.getElementById('reveal-btn'),
        next: document.getElementById('next-btn'),
        hint: document.getElementById('wildcard-50-50'),
        audience: document.getElementById('wildcard-audience'),
        phone: document.getElementById('wildcard-call'),

        toggleRounds: document.getElementById('toggle-rounds-btn'),

        restartFail: document.getElementById('restart-fail-btn'),
        backToStartFail: document.getElementById('back-to-start-fail-btn'),
        restartWin: document.getElementById('restart-win-btn'),
        backToStartWin: document.getElementById('back-to-start-win-btn'),
    };

    const gameElements = {
        playerNameInput: document.getElementById('player-name'),
        question: document.getElementById('question'),
        answers: document.getElementById('answer-options'),
        roundsList: document.getElementById('rounds-list'),
        roundsContainer: document.getElementById('rounds-container'),
        audiencePoll: document.getElementById('audience-poll'),
        phoneTimer: document.getElementById('phone-timer'),
        timerDisplay: document.getElementById('timer-display'),
        finalScoreDisplay: document.getElementById('final-score-display'),
        winTitle: document.getElementById('win-title'),
        fireworksContainer: document.getElementById('fireworks-container'),
        rotatingCircle: document.getElementById('rotating-circle'),
        startScreenContent: document.querySelector('#start-screen .screen-content')
    };


    let phoneTimerInterval = null;
    let isPhoneUsed = false;
    let isAudienceUsed = false;
    let isHintUsed = false;
    let currentQuestionIndex = 0;
    let selectedAnswer = null;
    let playerName = '';

    // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 1: Banco completo de 60 preguntas
    // =========================================================
    const allAvailableQuestions = [
        // Nuevas preguntas del Capítulo 3 - Liderazgo al estilo de Simei
        {
            question: "Según el cap 3, ¿cuál de los siguientes sentimientos alberga el 'espíritu de Simei' que le impide amar y respetar al líder que Dios puso sobre él para la temporada actual?",
            answers: ["Falta de experiencia y desconocimiento de la historia de David.", "Pereza y falta de disposición para el servicio ministerial.", "Envidia, amargura y un lazo emocional con líderes pasados (como Saúl).", "Deseo de ocupar el trono de David y obtener el poder para sí mismo."],
            correctAnswer: 2
        },
        {
            question: "¿Qué acción específica emprendió Simei contra el Rey David y sus hombres al percibir que el Rey estaba débil o en crisis?",
            answers: ["Lo traicionó abiertamente con su hijo Absalón.", "Le robó parte de su botín de guerra y esparció rumores de su debilidad.", "Le aconsejó ir a Gat, a donde el Rey Aquis, para huir de sus enemigos.", "Maldecir y arrojarles piedras a él y a los hombres que lo acompañaban."],
            correctAnswer: 3
        },
        {
            question: "¿Cuál fue la actitud que tomó el Rey David ante las maldiciones y las piedras arrojadas por Simei, según el pasaje bíblico de 2 Samuel 16:9-12?",
            answers: ["Ordenó inmediatamente a Abisai que le cortara la cabeza como castigo ejemplar.", "Decretó el exilio de Simei y lo despojó de todas sus posesiones.", "Humildad, no tomar venganza y dejar el juicio en manos de Dios.", "Guardó el dolor en su corazón y juró que se vengaría tan pronto como retomara el trono."],
            correctAnswer: 2
        },
        {
            question: "Simei albergó un profundo resentimiento basado en la creencia falsa de que David había asesinado a personas de la casa de Saúl. ¿Cuál fue la causa de que Simei mantuviera esa 'otra verdad' en su corazón?",
            answers: ["Una profecía de un líder importante de la época que confirmaba sus temores.", "Nunca preguntó ni averiguó, sino que se quedó con la versión de los hechos que la casa de Saúl le había dicho.", "David se negó a hablar con Simei o a darle su versión de la historia.", "Vio a David matar a uno de los descendientes de Saúl con sus propios ojos."],
            correctAnswer: 1
        },
        {
            question: "¿Cómo describe el texto el arrepentimiento de Simei cuando se apresuró a recibir a David en su regreso al reino, postrándose ante él?",
            answers: ["Un arrepentimiento genuino que se evidenció en su completa obediencia posterior.", "Una muestra de su hipocresía, actuando por conveniencia y miedo a la consecuencia.", "Un acto de desesperación, pero sincero, provocado por la justicia divina.", "Una señal de que había superado el pasado y estaba listo para un corazón limpio."],
            correctAnswer: 1
        },
        {
            question: "¿Cuál fue el mandamiento o prueba que el Rey Salomón impuso a Simei para poner a prueba su lealtad y verdadero arrepentimiento?",
            answers: ["Permanecer bajo la cobertura del sumo sacerdote en el templo.", "Edificarse una casa en Jerusalén y no salir de la ciudad (pasando el torrente de Cedrón), bajo pena de muerte.", "Hacer un pacto de lealtad con el Rey Aquis de Gat, como muestra de su cambio.", "Servir a David en el palacio durante tres años para demostrar su fidelidad."],
            correctAnswer: 1
        },
        {
            question: "¿Cuál fue el evento que hizo que Simei rompiera el juramento de lealtad a Salomón, y que demostró que nunca superó los dolores del pasado?",
            answers: ["Intentar asesinar al rey Salomón en un complot con Joab.", "Hablar mal de Salomón ante el pueblo, promoviendo una nueva rebelión.", "Recibir a dos líderes que habían sido expulsados por David, volviéndose desleal.", "Huir a Gat (territorio del Rey Aquis) para buscar a dos siervos fugitivos."],
            correctAnswer: 3
        },
        // Nuevas preguntas del Capítulo 4 - Liderazgo al estilo de Adonías
    {
        question: "cap 4 ¿Qué significado tiene el nombre de Adonías?",
        answers: ["Príncipe de David", "El Ungido de Dios", "Yahveh es mi Señor", "La Amargura de la Ambición"],
        correctAnswer: 2
    },
    {
        question: "¿Qué fenómeno oscuro asoma la nariz en la historia del liderazgo de David, según el autor, y está acompañado de menosprecio?",
        answers: ["La desconfianza en el ejército", "La oscura cara de la familiaridad", "La guerra entre casas reales", "El vacío de la excelencia"],
        correctAnswer: 1
    },
    {
        question: "Al momento de su nacimiento, Adonías era el cuarto hijo de David. ¿Quién era su hermano mayor inmediato, mencionado justo antes que él?",
        answers: ["Amnón", "Quileab", "Sefatías", "Absalón"],
        correctAnswer: 3
    },
    {
        question: "¿Cuál fue la carencia en la crianza de Adonías que contribuyó a su desorden y ambición, según el texto bíblico y la explicación del autor?",
        answers: ["David le dio todo lo que quiso y lo malcrió.", "David nunca lo había entristecido con corrección, diciéndole: '¿Por qué haces esto?'", "David lo había marginado y nunca le permitió participar en la guerra.", "David siempre lo comparó con su hermano Absalón."],
        correctAnswer: 1
    },
    {
        question: "¿Qué acción específica tomó Adonías por sí mismo para autoproclamarse Rey, demostrando su ambición desordenada?",
        answers: ["Se enalteció, diciendo: 'Yo reinaré'.", "Se alió con Joab para derrocar a David.", "Prometió la paz a los enemigos de Israel.", "Compró carros y gente de a caballo para su escolta."],
        correctAnswer: 0
    },
    {
        question: "¿Qué posible consecuencia de un 'vacío de ambición' advierte el autor a aquellos líderes con un puntaje bajo en esa área?",
        answers: ["Que no serán tomados en cuenta en el servicio", "Volverse demasiado transparente y bondadoso", "Posicionarse en una comodidad y un terrible desorden", "No ser visto en la iglesia ni por los demás líderes"],
        correctAnswer: 2
    },
    {
        question: "¿Cuál es la principal razón por la que el texto indica que es importante que existan 'posiciones' en la iglesia, aun si 'nadie es más que nadie'?",
        answers: ["Para asegurar que los más capaces tomen el liderazgo", "Para incentivar la ambición de servicio", "Por una cuestión de orden", "Para que se reconozca el llamado de cada persona"],
        correctAnswer: 2
    },
    {
        question: "¿Cuál es el concepto clave que se presenta como fundamental para que el líder provoque una 'revolución', según la introducción al capítulo?",
        answers: ["Tener una ambición equilibrada", "La transparencia y la bondad", "La posición que Dios le dio", "El conocimiento viciado y resentido"],
        correctAnswer: 2
    }

    ];

    // ⭐ NUEVA VARIABLE: Contendrá el set de 15 preguntas para la partida actual
    let currentRoundQuestions = [];


    const roundPoints = [
        100, 200, 300, 500, 1000,
        2000, 4000, 8000, 16000, 32000,
        64000, 125000, 250000, 500000, 1000000
    ];


    function unlockAudio() {
        if (audioUnlocked) return;

        allGameSoundFiles.forEach(sound => {
            sound.volume = 0;
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
                sound.volume = 1.0;
                audioUnlocked = true;
                console.log("Audio desbloqueado por interacción del usuario.");
            }).catch(e => {
                // Posible error si el navegador aún bloquea.
            });
        });
    }
    function typeWriterEffect(element, text) {
        if (!element) return;
        element.textContent = text;
        element.classList.remove('typewriter-anim');
        void element.offsetWidth;
        element.classList.add('typewriter-anim');
    }

    function showScreen(screenId) {
        for (let key in screens) {
            if (screens[key]) {
                screens[key].classList.remove('active');
            }
        }
        if (screens[screenId]) {
            screens[screenId].classList.add('active');
        }

        if (gameElements.fireworksContainer) gameElements.fireworksContainer.classList.add('hidden');
        if (gameElements.rotatingCircle) gameElements.rotatingCircle.classList.add('hidden');
    }

    function playSound(soundKey, loop = false) {

        if (!audioUnlocked && soundKey !== 'win') return;

        stopAllSounds();
        const sound = gameSounds[soundKey];
        if (sound) {
            sound.loop = loop;
            sound.play().catch(error => console.error("Error al reproducir el audio:", error));
        }
    }

    function stopAllSounds() {
        for (const key in gameSounds) {
            if (gameSounds[key]) {
                gameSounds[key].pause();
                gameSounds[key].currentTime = 0;
            }
        }
    }

    function playRandomTrack() {
        if (!backgroundMusic || trackList.length === 0) return;
        const randomIndex = Math.floor(Math.random() * trackList.length);
        const selectedTrack = trackList[randomIndex];
        backgroundMusic.src = selectedTrack;
        backgroundMusic.play().catch(error => {
            console.warn("Música de fondo no se reprodujo automáticamente.");
        });
    }

    function stopBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            backgroundMusic.removeEventListener('ended', playRandomTrack);
        }
    }

    function startBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.removeEventListener('ended', playRandomTrack);
            backgroundMusic.addEventListener('ended', playRandomTrack);
            playRandomTrack();
        }
    }

   // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 2: Ahora toma las primeras 15 preguntas en orden
    // =========================================================
    function resetGameState() {
        currentQuestionIndex = 0;
        isPhoneUsed = false;
        isAudienceUsed = false;
        isHintUsed = false;
        selectedAnswer = null;

        // AHORA SIMPLEMENTE TOMAMOS LAS PRIMERAS 15 PREGUNTAS EN ORDEN DEL ARRAY COMPLETO
        currentRoundQuestions = allAvailableQuestions.slice(0, 15);
        
        // El resto de tu función...
        if (phoneTimerInterval !== null) {
            clearInterval(phoneTimerInterval);
            // ... (resto de la función)
        }
        // ...
        stopBackgroundMusic();
        stopAllSounds();
    }

    function showFinalScreen() {
        resetGameState();
        stopBackgroundMusic();

        showScreen('win');

        playSound('win');

        const winText = "¡FELICIDADES!";
        const finalPrize = roundPoints[14].toLocaleString();

        if (gameElements.winTitle) {
            typeWriterEffect(gameElements.winTitle, winText);
        }
        if (gameElements.fireworksContainer) {
            gameElements.fireworksContainer.classList.remove('hidden');
        }
        if (gameElements.rotatingCircle) {
            gameElements.rotatingCircle.classList.remove('hidden');
        }

        setTimeout(() => {
            if (gameElements.finalScoreDisplay) {
                gameElements.finalScoreDisplay.textContent = `¡Has ganado el gran premio de ${finalPrize} Pts, ${playerName}!`;
                gameElements.finalScoreDisplay.classList.add('visible');
            }
        }, 1500);

        setTimeout(() => {
            if(buttons.restartWin) buttons.restartWin.style.display = 'inline-block';
            if(buttons.backToStartWin) buttons.backToStartWin.style.display = 'inline-block';
        }, 2500);


        if (buttons.restartWin) buttons.restartWin.style.display = 'none';
        if (buttons.backToStartWin) buttons.backToStartWin.style.display = 'none';


        history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    function startGame() {
        const inputName = gameElements.playerNameInput ? gameElements.playerNameInput.value.trim() : 'Jugador Anónimo';

        if (inputName.length === 0) {
            alert("Por favor, introduce tu nombre para empezar.");
            gameElements.playerNameInput.focus();
            return;
        }

        playerName = inputName;
        resetGameState();
        playSound('start');

        if (gameElements.startScreenContent) {
            gameElements.startScreenContent.classList.add('fade-out');

            setTimeout(() => {
                showScreen('game');
                loadQuestion();
                gameElements.startScreenContent.classList.remove('fade-out');
            }, 500);
        } else {
            showScreen('game');
            loadQuestion();
        }
    }

    function toggleRounds() {
        if (!gameElements.roundsContainer || !buttons.toggleRounds) return;

        gameElements.roundsContainer.classList.toggle('minimized');

        const isMinimized = gameElements.roundsContainer.classList.contains('minimized');
        buttons.toggleRounds.textContent = isMinimized ? 'Mostrar Rondas ➡️' : 'Ocultar Rondas ⬅️';
    }

    function generateRoundsList() {
        if (!gameElements.roundsList) return;

        gameElements.roundsList.innerHTML = '';
        roundPoints.slice().reverse().forEach((points, index) => {
            const roundNumber = 15 - index;
            const li = document.createElement('li');
            li.dataset.round = roundNumber - 1;
            li.innerHTML = `<span>Ronda ${roundNumber}</span><span>${points.toLocaleString()} Pts</span>`;
            gameElements.roundsList.appendChild(li);
        });
    }

    function updateRoundsHighlight() {
        if (!gameElements.roundsList) return;

        const rounds = gameElements.roundsList.querySelectorAll('li');
        rounds.forEach(li => li.classList.remove('current-round'));

        const currentRoundLi = gameElements.roundsList.querySelector(`li[data-round="${currentQuestionIndex}"]`);
        if (currentRoundLi) {
            currentRoundLi.classList.add('current-round');
            currentRoundLi.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function loadQuestion() {
        selectedAnswer = null;
        gameElements.answers.innerHTML = '';
        buttons.reveal.style.display = 'inline-block';
        buttons.next.style.display = 'none';

        if (gameElements.audiencePoll) gameElements.audiencePoll.classList.add('hidden');
        if (gameElements.phoneTimer) {
            gameElements.phoneTimer.classList.add('hidden');
            gameElements.timerDisplay.classList.remove('timer-urgent');
        }

        if (phoneTimerInterval !== null) {
            clearInterval(phoneTimerInterval);
            phoneTimerInterval = null;
        }

        if (buttons.restartFail) buttons.restartFail.style.display = 'none';
        if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none';

        if (buttons.hint) {
            buttons.hint.style.display = 'inline-block';
            buttons.hint.disabled = isHintUsed;
            if(isHintUsed) buttons.hint.classList.add('used'); else buttons.hint.classList.remove('used');
        }
        if (buttons.audience) {
            buttons.audience.style.display = 'inline-block';
            buttons.audience.disabled = isAudienceUsed;
            if(isAudienceUsed) buttons.audience.classList.add('used'); else buttons.audience.classList.remove('used');
        }
        if (buttons.phone) {
            buttons.phone.style.display = 'inline-block';
            buttons.phone.disabled = isPhoneUsed;
            if(isPhoneUsed) buttons.phone.classList.add('used'); else buttons.phone.classList.remove('used');
        }

        playSound('suspense', true);


        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
        gameElements.question.textContent = currentQuestion.question;

        currentQuestion.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = String.fromCharCode(65 + index) + ": " + answer;
            button.classList.add('answer-btn');
            button.dataset.index = index;
            button.style.visibility = 'visible';
            button.addEventListener('click', selectAnswer);
            gameElements.answers.appendChild(button);
        });

        updateRoundsHighlight();
    }

    function selectAnswer(event) {
        const previouslySelected = document.querySelector('.answer-btn.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        const selectedButton = event.target;
        selectedAnswer = parseInt(selectedButton.dataset.index);
        selectedButton.classList.add('selected');
    }

// =========================================================
// =========================================================
/**
 * Envía el progreso del juego a FormSubmit en momentos clave.
 * @param {string} player - Nombre del jugador.
 * @param {number} roundIndex - Índice de la ronda actual (0 a 14).
 * @param {number} points - Puntos ganados en esa ronda o totales.
 * @param {string} status - 'VICTORIA' o 'PERDIDA'.
 */
function sendGameProgress(player, roundIndex, points, status) {
    if (roundIndex < 0) return;

    const finalPrize = points.toLocaleString();
    const roundNumber = roundIndex + 1;
    let safeScoreText = "0 Pts";
    
    // ... (Lógica de puntuación segura, no necesita cambio)
    if (roundIndex > 0) {
        const safetyIndex = (roundIndex >= 10) ? 9 : (roundIndex >= 5) ? 4 : -1;
        if (status === 'PERDIDA') {
             safeScoreText = (safetyIndex >= 0) ? roundPoints[safetyIndex].toLocaleString() + " Pts" : "0 Pts";
        } else {
             safeScoreText = finalPrize + " Pts";
        }
    }


    const formUrl = 'https://formsubmit.co/elias230012@gmail.com'; 

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = formUrl;
    form.style.display = 'none';

    const currentUrlBase = window.location.href.split('#')[0];
    const nextUrl = (status === 'VICTORIA') 
        ? currentUrlBase + '#win'
        : currentUrlBase; // Redirige de vuelta a la página principal del juego.
    
    // 2. Definir los campos
    const fields = {
        '_subject': `Juego Bíblico: ${status}`,
        'Nombre': player,
        'Ronda_Finalizada': `${roundNumber} / ${currentRoundQuestions.length}`,
        'Puntuación_Alcanzada': `${finalPrize} Pts`,
        'Puntuación_Segura_Ganada': safeScoreText,
        'Estado_Partida': status,
        '_captcha': 'false',
        // ⭐ CAMBIO CLAVE: Incluimos _next en todos los casos
        '_next': nextUrl 
    };
    
    // 3. Crear los inputs y añadirlos al formulario
    for (const name in fields) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = fields[name];
        form.appendChild(input);
    }

    // 4. Enviar
    document.body.appendChild(form);
    form.submit();

    console.log(`Resultado enviado a FormSubmit: ${status} en Ronda ${roundNumber}. Redireccionando a: ${nextUrl}`);
}

    function nextQuestion() {
        // currentQuestionIndex es el índice de la pregunta que acaba de responder (0-14)
        if (currentQuestionIndex === currentRoundQuestions.length - 1) {
            
            // El jugador acaba de responder la última pregunta (índice 14, ronda 15)
            // ⭐ ENVÍO CLAVE: Solo enviamos si gana la última pregunta
            sendGameProgress(playerName, 14, roundPoints[14], 'VICTORIA');

            showScreen('win');
            stopAllSounds();
            stopBackgroundMusic();

        } else {
            // Ya NO se envía el formulario en los checkpoints (Rondas 5 y 10).
            
            currentQuestionIndex++;
            loadQuestion();
        }
    }

    function revealAnswer() {
        if (selectedAnswer === null) {
            alert("Por favor, selecciona una respuesta.");
            return;
        }

        // Uso de currentRoundQuestions
        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
        const correctIndex = currentQuestion.correctAnswer;
        const answerButtons = document.querySelectorAll('.answer-btn');
        if (phoneTimerInterval !== null) {
            clearInterval(phoneTimerInterval);
            phoneTimerInterval = null;
        }
        if (gameElements.phoneTimer) {
            gameElements.phoneTimer.classList.add('hidden');
            gameElements.timerDisplay.classList.remove('timer-urgent');
        }

        if (buttons.hint) buttons.hint.disabled = true;
        if (buttons.audience) buttons.audience.disabled = true;
        if (buttons.phone) buttons.phone.disabled = true;

        stopAllSounds();

        let isCorrect = (selectedAnswer === correctIndex);

        if (isCorrect) {
            playSound('correct');
        } else {
            playSound('wrong');
        }

        answerButtons.forEach(button => {
            button.disabled = true;
            const buttonIndex = parseInt(button.dataset.index);
            if (buttonIndex === correctIndex) {
                button.classList.add('correct');
            } else if (buttonIndex === selectedAnswer) {
                button.classList.add('wrong');
            }
        });

        buttons.reveal.style.display = 'none';

        if (isCorrect) {
            // Uso de currentRoundQuestions.length
            if (currentQuestionIndex === currentRoundQuestions.length - 1) {
                buttons.next.textContent = "Ver Resultado Final";
            }
            buttons.next.style.display = 'inline-block';
        } else {
            // El jugador perdió. Calculamos la puntuación segura.
            const roundLostIndex = currentQuestionIndex;
            const winAmountIndex = (roundLostIndex >= 10) ? 9 : (roundLostIndex >= 5) ? 4 : -1;
            const finalScore = winAmountIndex >= 0 ? roundPoints[winAmountIndex] : 0;
            
            // ⭐ ENVÍO CLAVE: Enviar datos al perder.
            sendGameProgress(playerName, roundLostIndex, finalScore, 'PERDIDA');


            gameElements.question.textContent = "¡Respuesta Incorrecta! El juego ha terminado.";
            gameElements.answers.innerHTML = `<p style="font-size: 1.6em; color: #ff536aff;">Perdiste esta vez, pero la biblia dice en Filipenses 4:9 En cuanto a lo que habéis aprendido, recibido y oído de mí, y visto en mí, eso haced; y el Dios de la paz estará con vosotros... tu puntuacion es.: ${finalScore.toLocaleString()} Pts</p>`;
            buttons.next.style.display = 'none';

            if (buttons.restartFail) {
                buttons.restartFail.style.display = 'inline-block';
                buttons.restartFail.textContent = "Volver a Intentarlo";
                buttons.restartFail.classList.add('restart-btn-fail');
            }
            if (buttons.backToStartFail) {
                buttons.backToStartFail.style.display = 'inline-block';
                buttons.backToStartFail.textContent = "Ir a Inicio";
                buttons.backToStartFail.classList.add('back-to-start-fail-btn');
            }
        }
    }


    function useHint() {
        if (isHintUsed) return;
        isHintUsed = true;
        buttons.hint.disabled = true;
        if (buttons.hint) buttons.hint.classList.add('used');

        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
        const correctIndex = currentQuestion.correctAnswer;
        const answerButtons = document.querySelectorAll('.answer-btn');

        const incorrectIndices = [];
        answerButtons.forEach((btn, index) => {
            if (index !== correctIndex && btn.style.visibility !== 'hidden') {
                incorrectIndices.push(index);
            }
        });

        while (incorrectIndices.length > 1) {
            const randomIndex = Math.floor(Math.random() * incorrectIndices.length);
            const indexToRemove = incorrectIndices.splice(randomIndex, 1)[0];
            answerButtons[indexToRemove].style.visibility = 'hidden';
            answerButtons[indexToRemove].disabled = true;
        }
    }

    function useAudience() {
        if (isAudienceUsed) return;
        isAudienceUsed = true;
        buttons.audience.disabled = true;
        if (buttons.audience) buttons.audience.classList.add('used');

        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
        const correctIndex = currentQuestion.correctAnswer;
        const percentages = [0, 0, 0, 0];
        let remaining = 100;

        const correctPercentage = Math.floor(Math.random() * 40) + 50;
        percentages[correctIndex] = correctPercentage;
        remaining -= correctPercentage;

        const incorrectIndices = [0, 1, 2, 3].filter(i => i !== correctIndex);

        for (let i = 0; i < incorrectIndices.length; i++) {
            const index = incorrectIndices[i];

            if (i === incorrectIndices.length - 1) {
                percentages[index] = remaining;
            } else {
                const maxAllocation = Math.min(remaining, Math.floor(remaining / (incorrectIndices.length - i)) * 2 || 1);
                let randomPart = Math.floor(Math.random() * maxAllocation);
                if (randomPart === 0 && remaining > 0) randomPart = 1;

                percentages[index] = randomPart;
                remaining -= randomPart;
            }
        }

        if (!gameElements.audiencePoll) return;
        gameElements.audiencePoll.classList.remove('hidden');

        document.querySelectorAll('.poll-bar').forEach((bar, index) => {
            const pollPercentage = bar.querySelector('.poll-percentage');
            if (pollPercentage) {
                pollPercentage.style.height = percentages[index] + '%';
                pollPercentage.textContent = percentages[index] + '%';
            }
        });
    }

    function usePhone() {
        if (isPhoneUsed) return;
        isPhoneUsed = true;
        buttons.phone.disabled = true;
        if (buttons.phone) buttons.phone.classList.add('used');

        if (!gameElements.phoneTimer || !gameElements.timerDisplay) return;

        gameElements.phoneTimer.classList.remove('hidden');
        let timeLeft = 60;
        gameElements.timerDisplay.textContent = timeLeft;

        if (phoneTimerInterval !== null) clearInterval(phoneTimerInterval);

        phoneTimerInterval = setInterval(() => {
            timeLeft--;
            gameElements.timerDisplay.textContent = timeLeft;
            if (timeLeft <= 10) {
                gameElements.timerDisplay.classList.add('timer-urgent');
            } else {
                gameElements.timerDisplay.classList.remove('timer-urgent');
            }

            if (timeLeft <= 0) {
                clearInterval(phoneTimerInterval);
                phoneTimerInterval = null;
                gameElements.phoneTimer.classList.add('hidden');
                gameElements.timerDisplay.classList.remove('timer-urgent');
                alert("Tiempo de llamada agotado.");
            }
        }, 1000);

        setTimeout(() => {
            const currentQuestion = currentRoundQuestions[currentQuestionIndex];
            const correctText = String.fromCharCode(65 + currentQuestion.correctAnswer);
            alert(`Tu amigo dice: 'Estoy 90% seguro de que la respuesta correcta es la ${correctText}.'`);
        }, 10000);
    }
    
    if (buttons.start) buttons.start.addEventListener('click', () => {
        unlockAudio();
        startGame();
    });
    if (buttons.startFromRules) buttons.startFromRules.addEventListener('click', () => {
        unlockAudio();
        startGame();
    });

    if (buttons.toggleRounds) buttons.toggleRounds.addEventListener('click', toggleRounds);

    if (buttons.showRules) buttons.showRules.addEventListener('click', () => {
        showScreen('rules');
        startBackgroundMusic();
    });

    if (buttons.backToStart) buttons.backToStart.addEventListener('click', () => { showScreen('start'); startBackgroundMusic(); });

    if (buttons.reveal) buttons.reveal.addEventListener('click', revealAnswer);
    if (buttons.next) buttons.next.addEventListener('click', nextQuestion);
    if (buttons.hint) buttons.hint.addEventListener('click', useHint);
    if (buttons.audience) buttons.audience.addEventListener('click', useAudience);
    if (buttons.phone) buttons.phone.addEventListener('click', usePhone);
    if (buttons.restartFail) buttons.restartFail.addEventListener('click', () => {
        startGame();
        buttons.restartFail.style.display = 'none';
        if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none';
    });
    if (buttons.backToStartFail) buttons.backToStartFail.addEventListener('click', () => {
        resetGameState();
        showScreen('start');
        startBackgroundMusic();

        if (buttons.restartFail) buttons.restartFail.style.display = 'none';
        if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none';
    });
    if (buttons.restartWin) buttons.restartWin.addEventListener('click', () => {
        startGame();
    });

    if (buttons.backToStartWin) buttons.backToStartWin.addEventListener('click', () => {
        resetGameState();
        showScreen('start');
        startBackgroundMusic();
    });
    generateRoundsList();

    const hash = window.location.hash;

    if (hash === '#win') {
        audioUnlocked = true;
        playerName = 'Campeón';
        setTimeout(() => {
            showFinalScreen();
        }, 100);

    } else {
        showScreen('start');
        startBackgroundMusic();
    }
});