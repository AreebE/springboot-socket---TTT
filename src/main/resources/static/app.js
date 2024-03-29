var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
      $("#conversation").show();
    }
    else {
      $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
  var socket = new SockJS('/websocket');
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/ttt', function (greeting) {
        showGreeting(JSON.parse(greeting.body).content);
    });
    console.log('create game...');
    doGame();
  });
}

function disconnect() {
  if (stompClient !== null) {
      stompClient.disconnect();
  }
  setConnected(false);
  console.log("Disconnected");
}
function doGame(){
  stompClient.send("/app/start",{},JSON.stringify({}));
}
function sendName() {
  stompClient.send("/app/game", {}, JSON.stringify({'name': $("#name").val()}));
}

function showGreeting(message) {
  $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
  $("form").on('submit', function (e) {
      e.preventDefault();
  });
  $( "#connect" ).click(function() { connect(); });
  $( "#disconnect" ).click(function() { disconnect(); });
  $( "#send" ).click(function() { sendName(); });
});