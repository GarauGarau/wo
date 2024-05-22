let currentWorkout = [];
let currentExerciseIndex = 0;
let currentSetIndex = 0; // New variable to track the current set
let restTimer;
let restTimeRemaining;

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const workouts = JSON.parse(e.target.result);
        displayTodayWorkout(workouts);
    };
    reader.readAsText(file);
});

function displayTodayWorkout(workouts) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const todayDay = daysOfWeek[today.getDay()];

    const todayWorkout = workouts.find(workout => workout.day === todayDay);
    
    if (todayWorkout) {
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('workoutSection').style.display = 'block';
        
        document.getElementById('workoutTitle').innerText = `Allenamento del giorno: ${todayWorkout.day}`;
        document.getElementById('bodyPart').innerText = `Parte del corpo: ${todayWorkout.bodyPart}`;

        const tbody = document.getElementById('workoutTable').querySelector('tbody');
        tbody.innerHTML = ''; // Clear previous workout data

        todayWorkout.workout.forEach(exercise => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${exercise.name}</td>
                <td>${exercise.sets}</td>
                <td>${exercise.reps}</td>
                <td>${exercise.rest}</td>
            `;
            tbody.appendChild(tr);
        });

        currentWorkout = todayWorkout.workout;
    } else {
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('noWorkoutSection').style.display = 'block';
    }
}

document.getElementById('uploadNewButton').addEventListener('click', function() {
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('workoutSection').style.display = 'none';
});

document.getElementById('uploadNewButtonNoWorkout').addEventListener('click', function() {
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('noWorkoutSection').style.display = 'none';
});

// Event listener for the start workout button
document.getElementById('startWorkoutButton').addEventListener('click', function() {
    document.getElementById('workoutSection').style.display = 'none';
    document.getElementById('exerciseSection').style.display = 'block';
    currentExerciseIndex = 0;
    currentSetIndex = 0; // Initialize set index
    displayCurrentExercise();
});

// Function to display the current exercise
function displayCurrentExercise() {
    const exercise = currentWorkout[currentExerciseIndex];
    document.getElementById('exerciseName').innerText = exercise.name;
    document.getElementById('setInfo').innerText = `Serie: ${currentSetIndex + 1} di ${exercise.sets}`; // Display current set
    document.getElementById('repInfo').innerText = `Ripetizioni: ${exercise.reps}`;
    const nextExercise = currentWorkout[currentExerciseIndex + 1];
    document.getElementById('nextExerciseInfo').innerText = nextExercise ? `Prossimo esercizio: ${nextExercise.name}` : 'Ultimo esercizio';

    document.getElementById('exerciseDetails').style.display = 'block';
    document.getElementById('restSection').style.display = 'none';
}

// Function to start rest timer
function startRestTimer(restTime) {
    document.getElementById('exerciseDetails').style.display = 'none';
    document.getElementById('restSection').style.display = 'block';
    restTimeRemaining = restTime;
    updateRestTime();
    restTimer = setInterval(updateRestTime, 1000);
}

function updateRestTime() {
    if (restTimeRemaining > 0) {
        document.getElementById('restTime').innerText = restTimeRemaining;
        restTimeRemaining--;
    } else {
        clearInterval(restTimer);
        playBeepSound();
        if (currentSetIndex < currentWorkout[currentExerciseIndex].sets - 1) {
            currentSetIndex++;
            displayCurrentExercise();
        } else if (currentExerciseIndex < currentWorkout.length - 1) {
            currentSetIndex = 0; // Reset set index for the new exercise
            currentExerciseIndex++;
            displayCurrentExercise();
        } else {
            endWorkout();
        }
    }
}

function playBeepSound() {
    const beepSound = document.getElementById('beepSound');
    beepSound.play();
}

function endWorkout() {
    document.getElementById('exerciseSection').style.display = 'none';
    document.getElementById('noWorkoutSection').style.display = 'block';
    document.getElementById('noWorkoutSection').innerHTML = '<h2>Allenamento completato!</h2>';
}

// Event listeners for the exercise section buttons
document.getElementById('finishSetButton').addEventListener('click', function() {
    const exercise = currentWorkout[currentExerciseIndex];
    startRestTimer(exercise.rest);
});

document.getElementById('prevExerciseButton').addEventListener('click', function() {
    if (currentExerciseIndex > 0) {
        currentExerciseIndex--;
        currentSetIndex = 0; // Reset set index when moving to previous exercise
        displayCurrentExercise();
    }
});

document.getElementById('nextExerciseButton').addEventListener('click', function() {
    if (currentExerciseIndex < currentWorkout.length - 1) {
        currentExerciseIndex++;
        currentSetIndex = 0; // Reset set index when moving to next exercise
        displayCurrentExercise();
    }
});

document.getElementById('endWorkoutButton').addEventListener('click', function() {
    endWorkout();
});
