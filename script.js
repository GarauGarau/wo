// script.js

let currentExerciseIndex = 0;
let exercises = []; // Assumi che questa variabile sia popolata con gli esercizi

document.getElementById('finishSetButton').addEventListener('click', finishSet);
document.getElementById('nextExerciseButton').addEventListener('click', nextExercise);
document.getElementById('prevExerciseButton').addEventListener('click', prevExercise);
document.getElementById('endWorkoutButton').addEventListener('click', endWorkout);

document.getElementById('startWorkoutButton').addEventListener('click', startWorkout);
document.getElementById('uploadNewButton').addEventListener('click', () => {
    document.getElementById('workoutSection').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'block';
});
document.getElementById('uploadNewButtonNoWorkout').addEventListener('click', () => {
    document.getElementById('noWorkoutSection').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'block';
});
document.getElementById('fileInput').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            exercises = JSON.parse(e.target.result);
            setupWorkout();
        };
        reader.readAsText(file);
    }
}

function setupWorkout() {
    if (exercises.length > 0) {
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('workoutSection').style.display = 'block';
        document.getElementById('workoutTitle').textContent = "Il tuo allenamento";
        document.getElementById('bodyPart').textContent = "Parte del corpo: " + exercises[0].bodyPart;
        
        const tbody = document.getElementById('workoutTable').getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        exercises.forEach((exercise, index) => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = exercise.name;
            row.insertCell(1).textContent = exercise.sets;
            row.insertCell(2).textContent = exercise.reps;
            row.insertCell(3).textContent = exercise.rest;
        });
    } else {
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('noWorkoutSection').style.display = 'block';
    }
}

function finishSet() {
    // Logica per finire la serie
    alert("Serie completata!");
}

function nextExercise() {
    if (currentExerciseIndex < exercises.length - 1) {
        currentExerciseIndex++;
        showExercise(currentExerciseIndex);
    } else {
        alert("Hai completato l'allenamento!");
        endWorkout();
    }
}

function prevExercise() {
    if (currentExerciseIndex > 0) {
        currentExerciseIndex--;
        showExercise(currentExerciseIndex);
    } else {
        alert("Sei al primo esercizio.");
    }
}

function endWorkout() {
    // Logica per terminare l'allenamento e tornare alla schermata iniziale
    document.getElementById('exerciseSection').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'block';
}

function showExercise(index) {
    const exercise = exercises[index];
    document.getElementById('exerciseName').textContent = exercise.name;
    document.getElementById('setInfo').textContent = `Serie: ${exercise.sets}`;
    document.getElementById('repInfo').textContent = `Ripetizioni: ${exercise.reps}`;
    document.getElementById('nextExerciseInfo').textContent = `Prossimo esercizio: ${exercises[index + 1] ? exercises[index + 1].name : "N/A"}`;
}

function startWorkout() {
    currentExerciseIndex = 0;
    showExercise(currentExerciseIndex);
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('workoutSection').style.display = 'none';
    document.getElementById('exerciseSection').style.display = 'block';
}
