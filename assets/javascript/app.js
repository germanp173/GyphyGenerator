// Globals
var gyphyKey = "jLBBRvjN84XiHjuwDpBhjpLlv03JFrBJ";
var gyphyUrl = "https://api.giphy.com/v1/gifs/";
var topics = ["Dwayne Johnson", "Kevin Hart", "Beyonce", "Eminem", "Drake"];

$(document).on('click', "button.btn", function(){
    // Ensure buttons do not remain focused after pressed.
    $(this).blur();
});

$(document).on('click', "button.btn-celeb", function(){
    // Button listener for celebrity buttons.
    generateGyphs($(this).text());
});

$("#submitBtn").click(function(){
    // Celebrity Submit button listener.
    // Get user input.
    var userInput = $("#userInput").val();

    // Check if user typed something into the text box.
    if (userInput === ""){
        // Invalidate text box if left empty
        $(".d-none").removeClass("d-none");
        $("#userInput").addClass("is-invalid");
    } else{
        // Remove any previously added invalidation.
        $(".invalid-feedback").addClass("d-none");
        $(".is-invalid").removeClass("is-invalid");

        // Create celebrity button.
        $("#celebBtns").append(createCelebButton(userInput));

        // Reset text box.
        $("#userInput").val("");
    } 
});

$(document).on('click', 'img.gif', function(){
    // Get GIF element.
    var gif = $(this);
    if (gif.attr("data-state") === "still"){
        // Animate GIF
        gif.attr({
            "src": gif.attr("data-animate"),
            "data-state": "animate"
        });
    } else {
        // Freeze GIF
        gif.attr({
            "src": gif.attr("data-still"),
            "data-state": "still"
        });
    }
});

function createCelebButton(celebName){
    var btn = $("<button>").addClass("btn btn-info btn-celeb");
    btn.attr("type", "button");
    btn.text(celebName);
    return btn;
}

function generateGyphs(celebrityName) {
    var limit = 10;
    var queryURL = gyphyUrl + "search?q=" + celebrityName + "&api_key=" + gyphyKey + "&limit=" + limit;
    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function (response) {            
            // Extract the data from the results.
            var results = response.data;            

            // Reset Canvas.
            $("#gyphs").html("");
            
            // Iterate through each GIF object to extract data for each GIF. 
            for (var i = 0; i < results.length; i++) {
                // Create celebrity div.
                var celebDiv = $("<div>").addClass("text-center");

                // Create celeb image div with necessary attributes to be able to start/stop the GIF.
                var img = $("<img>").addClass("fluid gif");
                img.attr({
                    "data-still": results[i].images.fixed_height_still.url,
                    "data-animate": results[i].images.fixed_height.url,
                    "data-state": "still",
                    "src": results[i].images.fixed_height_still.url // Still GIF by default
                });

                // Create a paragraph div that will hold the rating.
                var rating = $("<p>").text("Rating: " + results[i].rating.toUpperCase());

                // Append GIF and rating to celeb DIV.
                celebDiv.append(img);
                celebDiv.append(rating);

                // Prepend the celeb divs to the divs container.
                $("#gyphs").prepend(celebDiv);
            }
        });
}

function initializeApp(){
    topics.forEach(function(celeb){
        $("#celebBtns").append(createCelebButton(celeb));
    })
}

initializeApp();

