var trainName;
var destination;
var firstTrainTime;
var frequency;
var minutesAway;
var nextArrival;

function gettimeNow(){
  var liveTime = moment().format("h:mm:ss a")
  $("#liveTimer").text(liveTime)
}

setInterval(gettimeNow,1000)

var now = moment().format("X");
//console.log(now);
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBvIPR9dW0wzGQalPO2k4CTVmO-Z-k_dJI",
    authDomain: "gwtrainscheduler.firebaseapp.com",
    databaseURL: "https://gwtrainscheduler.firebaseio.com",
    projectId: "gwtrainscheduler",
    storageBucket: "",
    messagingSenderId: "921815917891"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

//Take the click event and add inputs to the table
$("#addTrain").on("click",function(){
  event.preventDefault();
  trainName = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = moment($("#firstTrainTime").val().trim(), "HH:mm").format("X");
  frequency = $("#frequency").val().trim();


  //Add these values to firebase database
  database.ref().push({
    trainName: trainName,
    destination: destination,
    frequency: frequency,
    firstTrainTime:firstTrainTime
  });


// Figure out how much time until the train arrives
  var timeRemaining = (moment([firstTrainTime]).fromNow()) % frequency;
  var timeUntilNextTrain = timeRemaining - frequency;
  // console.log('trainName ' + trainName);
  // console.log('destination ' + destination);
  // console.log('Time Difference '+ moment(timeUntilNextTrain).format("mm"));
  // console.log('frequency ' + frequency);

});

//The table of train arrivals should reference the firebase databaseURL

database.ref().orderByChild("nextArrival").on("child_added", function(snapshot){

  var frequency = snapshot.val().frequency;
  var firstTrainTime = snapshot.val().firstTrainTime;
  //Need to figure out what time it is now
  var minutesDiff = moment().diff(moment.unix(firstTrainTime), "minutes");

  // get the amount of minutes until firstTrainTime which will be the amount of minutes for next arrival
  function calculation(){
  minutesAway = frequency - (minutesDiff % frequency);
  nextArrival = moment().add(minutesAway, "minutes")
  }
  calculation()
  //Variables to add values to the database
  var train = $("#trainSchedule");

  var tableRow = $("<tr>");
  var nameOfTrain = $("<td class='nameOfTrain'>").text(snapshot.val().trainName);
  var trainDestination = $("<td class='trainDestination'>").text(snapshot.val().destination);
  var trainFrequency = $("<td class='trainFrequency'>").text(snapshot.val().frequency);
  var trainNextArrival = $("<td class='trainNextArrival'>").text(nextArrival.format("hh:mm A"));
  var trainMinutesAway = $("<td class='trainMinutesAway'>").text(minutesAway);

  //Add the values to the table

function updateTrain(){
  train.append(tableRow);
  train.append(nameOfTrain);
  train.append(trainDestination);
  train.append(trainFrequency);
  train.append(trainNextArrival);
  train.append(trainMinutesAway);
}
updateTrain();
setInterval(calculation,1000)
setInterval(updateTrain,60000);

});
