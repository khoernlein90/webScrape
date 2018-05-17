function getArticles() {
    $.get("/api/articles", function (data) {
        $("#articles").empty()
        for (var i = 0; i < data.length; i++) {
            let redditHREF;
            if (data[i].link[1] === "r") {
                redditHREF = `https://www.reddit.com${data[i].link}`
            } else {
                redditHREF = data[i].link
            }
            const card = $("<div>").addClass("card")
            const headerText = $("<div>").text(data[i].title).addClass("title")
            const saveButton = $("<button>").text("SAVE ARTICLE").addClass("save-button").data(data[i])
            const img = $("<img>").attr("src", data[i].img)
            const likes = $("<div>").addClass("likes").html(`Upvotes:<p>${data[i].likes}</p>`)
            const a = $("<a>").attr({
                class: "card-text",
                href: redditHREF,
                target: "_blank"
            }).text(data[i].link)
            card.append(headerText, saveButton, likes, img, a)
            $("#articles").append(card)
        }
    })
}

$("#scrapeButton").on("click", function () {
    console.log("hi")
    $.get("/scrape")
        .then(function () {
            // $("#articles").empty()
            getArticles()
            // location.reload()
        })
})

$(document).on("click", ".note-button", function () {
    const id = $(this).attr("data-id")
    $.get(`/api/articles/${id}`).then(function (data) {
        $("#exampleModal").modal("show");
        $(".modal-header").html("<h4>" + data.title + "</h4>");
        $(".modal-footer").html('<button type="button" class="btn btn-primary" data-id=' + data._id + ' id="savenote">Save Note</button>');
        if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    })
})

$(document).on("click", ".save-button", function () {
    const savedArticle = $(this).data()
    savedArticle.saved = true;
    $.ajax({
        method: "put",
        url: `/api/saved/${savedArticle._id}`,
        data: savedArticle
    }).then(data => {}).then(function () {
        getArticles()

    })
})

getArticles()