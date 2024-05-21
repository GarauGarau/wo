document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('uploadNewButton').addEventListener('click', showUploadSection);

let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
let currentDay = new Date().toLocaleString('en-us', { weekday: 'long' });
let todaysWorkout = [];
let currentExerciseIndex = 0;
let currentSet = 1;
let restInterval;
let beepSound = document.getElementById('beepSound');

// Carica l'allenamento del giorno al caricamento della pagina
document.addEventListener('DOMContentLoaded', loadTodaysWorkout);

function handleFileUpload(event) {
    let files = event.target.files;
    let loadedWorkouts = [];

    Array.from(files).forEach(file => {
        let reader = new FileReader();
        reader.onload = function(e) {
            loadedWorkouts.push(...JSON.parse(e.target.result));
            workouts = loadedWorkouts;
            localStorage.setItem('workouts', JSON.stringify(workouts));
            loadTodaysWorkout();
        };
        reader.readAsText(file);
    });
}

function loadTodaysWorkout() {
    let todayWorkoutData = workouts.find(w => w.day === currentDay);
    if (todayWorkoutData) {
        todaysWorkout = todayWorkoutData.workout;
        document.getElementById('workoutTitle').innerText = `Allenamento del ${currentDay}`;
        document.getElementById('bodyPart').innerText = `Oggi allenerai: ${todayWorkoutData.bodyPart}`;
        populateWorkoutTable();
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('workoutSection').style.display = 'block';
    }
}

function populateWorkoutTable() {
    let tableBody = document.querySelector('#workoutTable tbody');
    tableBody.innerHTML = '';

    todaysWorkout.forEach(workout => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${workout.name}</td>
            <td>${workout.sets}</td>
            <td>${workout.reps}</td>
            <td>${workout.rest}</td>
        `;
        tableBody.appendChild(row);
    });
}

document.getElementById('startWorkoutButton').addEventListener('click', startWorkout);

function startWorkout() {
    document.getElementById('workoutSection').style.display = 'none';
    document.getElementById('exerciseSection').style.display = 'block';
    showExercise();
}

function showExercise() {
    let exercise = todaysWorkout[currentExerciseIndex];
    document.getElementById('exerciseName').innerText = `Nome esercizio: ${exercise.name}`;
    document.getElementById('setInfo').innerText = `Serie: ${currentSet} di ${exercise.sets}`;
    document.getElementById('repInfo').innerText = `Ripetizioni: ${exercise.reps}`;

    let nextExerciseInfo = document.getElementById('nextExerciseInfo');
    if (currentExerciseIndex < todaysWorkout.length - 1) {
        let nextExercise = todaysWorkout[currentExerciseIndex + 1];
        nextExerciseInfo.innerText = `Prossimo esercizio: ${nextExercise.name}`;
    } else {
        nextExerciseInfo.innerText = 'Prossimo esercizio: Nessuno, allenamento completato!';
    }
}

document.getElementById('finishSetButton').addEventListener('click', finishSet);

function finishSet() {
    let exercise = todaysWorkout[currentExerciseIndex];
    if (currentSet < exercise.sets) {
        currentSet++;
        startRest(exercise.rest);
    } else {
        nextExercise();
    }
}

function nextExercise() {
    if (currentExerciseIndex < todaysWorkout.length - 1) {
        currentExerciseIndex++;
        currentSet = 1;
        showExercise();
    } else {
        alert('Allenamento completato!');
        resetWorkout();
    }
}

function startRest(time) {
    document.getElementById('exerciseDetails').style.display = 'none';
    document.getElementById('restSection').style.display = 'block';
    document.getElementById('restTime').innerText = time;
    restInterval = setInterval(() => {
        time--;
        document.getElementById('restTime').innerText = time;
        if (time <= 0) {
            clearInterval(restInterval);
            beepSound.play();  // Riproduce il suono
            document.getElementById('restSection').style.display = 'none';
            document.getElementById('exerciseDetails').style.display = 'block';
            showExercise();
        }
    }, 1000);
}

function resetWorkout() {
    document.getElementById('exerciseSection').style.display = 'none';
    currentExerciseIndex = 0;
    currentSet = 1;
    document.getElementById('uploadSection').style.display = 'block';
}

// Funzione per mostrare la sezione di caricamento
function showUploadSection() {
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('workoutSection').style.display = 'none';
}
