
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyB1tgmfOeA48zbA8GhpMXupRdhKkdzqjNs",
    authDomain: "train-schedule-6d2cd.firebaseapp.com",
    databaseURL: "https://train-schedule-6d2cd.firebaseio.com",
    projectId: "train-schedule-6d2cd",
    storageBucket: "train-schedule-6d2cd.appspot.com",
    messagingSenderId: "180560857636"
  };

firebase.initializeApp(config);

var database = firebase.database();

// Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user inputs
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = $("#start-input").val().trim();
  var trainRate = $("#rate-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    rate: trainRate
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.rate);

  // Alert
  alert("New Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#rate-input").val("");
});

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainRate = childSnapshot.val().rate;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainStart);
  console.log(trainRate + "This is the train rate");

  // Get Train start time

  var trainStartConverted = moment(trainStart, "hh:mm").subtract(1, "years");

  // Get current time to use as a difference with start time
  var currentTime = moment().format("hh:mm");
  console.log("This is the current time " + currentTime);

  // Miliseconds of time difference between entered first train time and current time
  var trainMinutes = moment().diff(moment(trainStartConverted), "minutes");
  console.log(trainMinutes + "This is what we just did");

  // Get the remainder of time difference and the frequency the train enters the station
  var trainRemainder = trainMinutes % trainRate;
   console.log("Remainder " + trainRemainder);

  // Subtract the next time the train is scheduled to arrive by the remainder to know how many minutes to wait until next train.
  var trainMinutesAway = trainRate - trainRemainder; 

  // Get variable to be able to display it on the schedule. 
  var nextArrival = moment().add(trainMinutesAway, 'minutes');

  // Format the next arrival time to display cleaner in schedule
  var arrivalTime = moment(nextArrival).format('LT');

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainRate + "</td><td>" + arrivalTime + "</td><td>" + trainMinutesAway + " min" + "</td><td>" + "</td></tr>");
});


