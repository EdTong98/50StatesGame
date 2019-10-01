// This is a subset of the states.
// Use this to actually run the game
// (assume this is the full set of states.
// This will make it easier to test.
var states = ["Idaho", "South Dakota", "Hawaii", "Alaska", "Alabama", "New York"];

// These are all the states. It maps the state name to the number which you'll
// want to use in your API call.
var abvMap = {
    "Alabama": "01",
    "Alaska": "02",
    "Arizona": "04",
    "Arkansas": "05",
    "California": "06",
    "Colorado": "08",
    "Connecticut": "09",
    "Delaware": "10",
    "District Of Columbia": "11",
    "Florida": "12",
    "Georgia": "13",
    "Hawaii": "15",
    "Idaho": "16",
    "Illinois": "17",
    "Indiana": "18",
    "Iowa": "19",
    "Kansas": "20",
    "Kentucky": "21",
    "Louisiana": "22",
    "Maine": "23",
    "Maryland": "24",
    "Massachusetts": "25",
    "Michigan": "26",
    "Minnesota": "27",
    "Mississippi": "28",
    "Missouri": "29",
    "Montana": "30",
    "Nebraska": "31",
    "Nevada": "32",
    "New Hampshire": "33",
    "New Jersey": "34",
    "New Mexico": "35",
    "New York": "36",
    "North Carolina": "37",
    "North Dakota": "38",
    "Ohio": "39",
    "Oklahoma": "40",
    "Oregon": "41",
    "Pennsylvania": "42",
    "Rhode Island": "44",
    "South Carolina": "45",
    "South Dakota": "46",
    "Tennessee": "47",
    "Texas": "48",
    "Utah": "49",
    "Vermont": "50",
    "Virginia": "51",
    "Washington": "53",
    "West Virginia": "54",
    "Wisconsin": "55",
    "Wyoming": "56",
}
var secs = 60;
var score = 0;
var is_timer_on = false;
var empty_str = "";
var interval;
var keys = Object.keys(abvMap);
var correct = [];
var error = [];


document.getElementById("state_field").readOnly = true;
document.getElementById("cd_circle").innerHTML = secs;
$("#state_field").val("");
$("#seconds").val("");

$("#set_timer").on("click", function(){
    if(is_timer_on == true){
      document.getElementById("intro_txt").innerHTML = empty_str;
      $("intro_txt").append("<article><h2> Cannot Change Time </h2></article>");
    }else{
        secs = $("#seconds").val();
        if(secs){
            document.getElementById("intro_txt").innerHTML = "";
            $("#intro_txt").append("<article><h2>Time : " + secs + " secs. </h2></article>");
            document.getElementById("cd_circle").innerHTML = secs;
        }else{
            document.getElementById("intro_txt").innerHTML = "";
            $("#intro_txt").append("<article><h2> Please enter a Time. </h2></article>");
            secs = 60;
        }

    }
});

function reset_func (){
  clearInterval(interval);
  secs = 60;
  correct = [];
  error = [];
  is_timer_on = false;
  score = 0;
  document.getElementById("cd_circle").innerHTML = secs;
  document.getElementById("intro_txt").innerHTML = empty_str;
  document.getElementById("article-container").innerHTML = "";
  document.getElementById("state_field").readOnly = true;
  document.getElementById("spanish_speakers").innerHTML = "";
  document.getElementById("score").innerHTML = "";
  $("#state_field").val("");
  $("#seconds").val("");
  $("#spanish_speakers").val("");
  $("#spanish_speakers").append("<h2>0</h2>");
  $("#score").append("<article><h2>" + "0/" + keys.length + "</h2></article>");
  document.getElementById('states_Pic').style.visibility = "visible";
}
$("#reset").on("click", reset_func);

$("#start_button").on("click", function() {
    var count = secs;
    document.getElementById("score").innerHTML = "";
    document.getElementById("cd_circle").innerHTML = count;
    $("#score").append("<article><h2>" + "0/" + keys.length + "</h2></article>");
    clearInterval(interval);
    is_timer_on = true;
    error = [];
    correct = [];
    document.getElementById("state_field").readOnly = false;
    $("#state_field").focus();
    document.getElementById("article-container").innerHTML = "";

    interval = setInterval(function() {
            document.getElementById("cd_circle").innerHTML = count;
            count--;


            if(game_win() == true) {
                clearInterval(interval);
                document.getElementById("intro_txt").innerHTML = "";
                $("#intro_txt").append("<article><h2>You win!</h2></article>");
                document.getElementById("states_Pic").innerHTML = "";
                document.getElementById("score").innerHTML = "";
                $("#score").append("<article><h2 style=\"color:#38BA50;\">" + score + "/" + keys.length + "</h2></article>");
                document.getElementById("cd_circle").innerHTML = "<div style=\"color:#38BA50;\">" + count + "</div>";
            }
            if (count < 0) {

                clearInterval(interval);
                document.getElementById("cd_circle").innerHTML = "<div style=\"color:#EC3C3C;\">X</div>";
                document.getElementById("state_field").readOnly = true;
                is_timer_on = false;
                if(game_win() == false) {
                    document.getElementById("intro_txt").innerHTML = "";
                    $("#intro_txt").append("<article><h2 style=\"color:#EC3C3C;\">You lose!</h2></article>");
                    document.getElementById('states_Pic').style.visibility = "hidden";
                    $("#article-container").append("<h3 style=\"text-align:center;\">Missed States</h3>");
                    var j = 0;
                    for ( j = 0; j < keys.length; j++){
                        var lower = keys[j].toLowerCase();
                        if(correct.includes(lower) == false) {
                            error.push(keys[j]);
                        }
                    }
                    var k = 0;
                    for(k = 0; k < error.length; k++) {
                        $("#article-container").append("<div class=\"search_city missed\">" + error[k] + "</div>");
                    }

                }
                else {
                  document.getElementById("intro_txt").innerHTML = "";
                  $("#intro_txt").append("<article><h2 style=\"color:#38BA50;\">You win!</h2></article>");
                  document.getElementById("score").innerHTML = empty_str;
                  $("#score").append("<article><h2 style=\"color:#38BA50;\">" + score + "/" + keys.length + "</h2></article>");
                  document.getElementById("cd_circle").innerHTML = "<div style=\"color:#38BA50;\">" + count + "</div>";
                }
            }
        }, 1000);

});

  function state_helper (event){
      if (is_timer_on == true){
          var state = $("#state_field").val();
          if(ifValid(state)){
              var temp = state.toLowerCase();
              correct.push(temp);
              $("#article-container").append("<div class=\"search_city\">" + formatString(state) + "</div>");
              $("#state_field").val(empty_str);
              document.getElementById("score").innerHTML = "";
              score = score + 1;
              $("#score").append("<article><h2>" + score + "/" + keys.length + "</h2></article>");
          }
      }
  }

  $("#state_field").keyup(state_helper);

  $(document).on('mouseenter','.search_city', function () {
    var stateName = $(this).text();
    $.get("https://api.census.gov/data/2013/language?get=EST,LANLABEL,NAME&for=state:" + abvMap[stateName] +"&LAN=625", function(data) {
            if (data.length == (data.length - data.length)) {
                $("#spanish_speakers").append("<article><h2>OOPS, not found</h2></article>");
                return;
            }
            current = data[1];
            document.getElementById("spanish_speakers").innerHTML = "";
            $("#spanish_speakers").append("<article><h2>" + commas(current[0]) +
            "</h2></article>");
    });
}).on('mouseleave','.search_city',  function(){

});

function ifValid(state) {
        for(var y in keys) {
                if(keys[y].toLowerCase() == state.toLowerCase()) {
                        if(checkifExists(state) == false){
                            return true;
                        }
                        else {
                            return false;
                        }
                }
        }
        return false;
}

function checkifExists(state) {
    var index = 0;
    var bool1 = false;
    for(index = 0; index < correct.length; index++){
      if(correct[index].toLowerCase() == state.toLowerCase()) {
          bool1 = true;
      }
    }

    return bool1;
}

function formatString(str) {
     return str.replace(/\w\S*/g, function(txt){
     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
   });
}
function game_win() {
  var i = 0;
  var bool1 = true;
  for(i = 0; i < keys.length; i++){
      if(correct.includes(keys[i].toLowerCase()) == false){
          bool1 = false;
      }
  }
  return bool1;

  for(var i in keys) {
        if(correct.includes(keys[i].toLowerCase()) == false) {
            return false;
        }
    }
    return true;

}
function commas(str) {
  return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}






/*
 * The majority of this project is done in JavaScript.
 *
 * 1. Start the timer when the click button is hit. Also, you must worry about
 *    how it will decrement (hint: setInterval).
 * 2. Check the input text with the group of states that has not already been
 *    entered. Note that this should only work if the game is currently in
 * 3. Realize when the user has entered all of the states, and let him/her know
 *    that he/she has won (also must handle the lose scenario). The timer must
 *    be stopped as well.
 *
 * There may be other tasks that must be completed, and everyone's implementation
 * will be different. Make sure you Google! We urge you to post in Piazza if
 * you are stuck.
 */
