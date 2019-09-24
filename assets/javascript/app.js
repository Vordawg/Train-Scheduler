var firebaseConfig = {
    apiKey: "AIzaSyDTxAbKtJwEVM9WjuBxxwLTdEvNSPHp4yc",
    authDomain: "inclassproject-5cf12.firebaseapp.com",
    databaseURL: "https://inclassproject-5cf12.firebaseio.com",
    projectId: "inclassproject-5cf12",
    storageBucket: "",
    messagingSenderId: "969061997951",
    appId: "1:969061997951:web:a0ab12a3235176629dce4a"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var path = "TrainTime/";

var nextArrival;
var minutesAway;


$("#submit").on("click", function (event) {
    debugger;
    event.preventDefault();

    var trainName = $("#trainNameInput").val();
    var destination = $("#trainDestinationInput").val();
    var frequency = $("#trainFrequencyInput").val();
    var firstTrainTime = $("#trainFristTimeInput").val();

    frequency = parseInt(frequency);

    database.ref(path).push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        firstTrain: firstTrainTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

database.ref(path).on("child_added", function (snapshot) {
    var sv = snapshot.val();

    getNextArrivalTime(sv.firstTrain, sv.frequency);

    var newColumn;
    var $newRow = $("<tr>");
    newColumn = "<td>" + sv.trainName + "</td>";
    $newRow.append(newColumn);
    newColumn = "<td>" + sv.destination + "</td>";
    $newRow.append(newColumn);
    newColumn = "<td>" + sv.frequency + "</td>";
    $newRow.append(newColumn);

    newColumn = "<td>" + nextArrival + "</td>";
    $newRow.append(newColumn);

    newColumn = "<td>" + minutesAway + "</td>";
    $newRow.append(newColumn);

    $("#trainTable").append($newRow);

}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

function getNextArrivalTime(firstTrainTime, frequency) {

    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();
    today = month + "/" + day + "/" + year + " " + firstTrainTime;

    var myFormat = "MM/DD/YYYY hh:mm";
    var convertedDate = moment(today, myFormat);

    if (convertedDate.diff(moment(), "minutes") < 0) {
        while (convertedDate.diff(moment(), "minutes") < 0) {
            convertedDate = convertedDate.add(moment.duration(frequency, "minutes"));
        }
    }

    nextArrival = convertedDate.format("LT");
    minutesAway = convertedDate.diff(moment(), "minutes");
}