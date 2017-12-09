// Grab the articles as a json
$("#scrapeButton").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).done(function() {
        $.getJSON("/articles", function(data) {
            // For each one
            for (var i = 0; i < data.length; i++) {
                // Display the apropos information on the page
                $("#articles").append("<div class='card'>" + '<div class="card-header bg-primary text-white">' +
                    "<div class='row'><div class='col-md-10'><h5>" + data[i].title + "</div></h5>" + '<div class="col-md-2 text-right"><button type="button" data-id=' + data[i]._id + ' id="saveArticle" class="btn btn-success">ADD NOTE</button></div>' + "</div></div>" +
                    '<div class="card-body">' + '<p class="card-text">' + data[i].link + "</p></div>" + "</div>");
            }
        });
    })
})

//CHNAGE THE CSS OF THE SAVE ARTICLE BUTTON ON CLICK
$(document).on("click", ".btn-success", function() {
        var thisId = $(this).attr("data-id");
        console.log(this)
        $(this).removeClass("btn-success");
        $(this).addClass("btn-danger");
        $(this).text("EDIT NOTE");
    })
    // Whenever someone clicks a p tag
$(document).on("click", "#saveArticle", function() {
    $("#exampleModal").modal("show");
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the note information to the page
        .done(function(data) {
            console.log(data);
            // The title of the article
            $(".modal-header").html("<h4>" + data.title + "</h4>");

            // An input to enter a new title
            // A textarea to add a new note body
            // $(".modal-body").html('<div class="form-group"><label for="titleinput">Title</label><input type="text" name="title" class="form-control" id="titleinput"></div><div class="form-group"><label for="bodyinput">Add Note</label><textarea class="form-control" id="bodyinput" name="body" rows="3"></textarea></div>');
            // A button to submit a new note, with the id of the article saved to it
            $(".modal-footer").html('<button type="button" class="btn btn-primary" data-id=' + data._id + ' id="savenote">Save Note</button>');

            $("#savenote").on("click", function() {
                $("#exampleModal").modal("hide");
            })
                // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .done(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});