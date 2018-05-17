const modal = document.getElementById('myModal');
const btn = document.querySelector(".note-button");
const span = document.getElementsByClassName("close")[0];

function getArticles() {
    $.get("/api/saved", function (data) {
        console.log(data)
        $("#articles").empty()
        for (var i = 0; i < data.length; i++) {
            let redditHREF;
            if (data[i].link[1] === "r") {
                redditHREF = `https://www.reddit.com${data[i].link}`
            } else {
                redditHREF = data[i].link
            }
            const card = $("<div>").addClass("card")
            const headerText = $("<div>").html(data[i].title).addClass("title")
            const deleteButton = $("<button>").text("DELETE ARTICLE").addClass("delete-button").attr("data-id", data[i]._id);
            const noteButton = $("<button>").addClass("note-button").text("ADD NOTE").attr("data-id", data[i]._id)
            const img = $("<img>").attr("src", data[i].img)
            const likes = $("<div>").addClass("likes").html(`Upvotes:<p>${data[i].likes}</p>`)
            const a = $("<a>").attr({
                class: "card-text",
                href: redditHREF,
                target: "_blank"
            }).text(data[i].link)
            card.append(headerText,img,likes, deleteButton, noteButton, a)
            $("#articles").append(card)
        }
    })
}
$(document).on("click", ".delete-button", function () {
    const savedArticle = $(this).attr("data-id")
    console.log(savedArticle)
    $.ajax({
        method: "delete",
        url: `/api/saved/${savedArticle}`
    }).then(function () {
        getArticles()
    })
})

getArticles()

$(document).on("click", ".note-button", function () {
    modal.style.display = "block";
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "GET",
            url: `/api/articles/${thisId}`
        })
        .done(function (data) {
            console.log(data);
            let redditHREF;
            if (data.link[1] === "r") {
                redditHREF = `https://www.reddit.com${data.link}`
            } else {
                redditHREF = data.link
            }
            $(".modal-header").html("<h4>" + data.title + "</h4>");
            $(".modal-body a").html(data.link).attr({
                href: redditHREF,
                target: "_blank"
            })
            $(".save-note").attr("data-id", data._id)
            $("#titleInput").val("");
            $("#bodyInput").val("");
            if (data.note) {
                $(".delete-note").attr("data-id", data.note._id)
                $("#titleInput").val(data.note.title);
                $("#bodyInput").val(data.note.body);
            }
        });
})

$(document).on("click", ".save-note", function (event) {
    event.preventDefault()
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "POST",
            url: `/api/articles/${thisId}`,
            data: {
                title: $("#titleInput").val(),
                body: $("#bodyInput").val()
            }
        })
        .done(function () {
            modal.style.display = "none";
        });
})

$(document).on("click", ".delete-note", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: `/api/articles/${thisId}`
    }).done(function () {
        $("#titleInput").val("");
        $("#bodyInput").val("");
    })
})

$(document).on("click", ".close", function () {
    modal.style.display = "none";
})

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}