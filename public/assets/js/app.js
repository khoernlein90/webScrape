function getArticles() {
    $.get("/api/articles", function (data) {
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
            // const cardHeader = $("<div>").addClass("main-card-header")
            const headerText = $("<div>").text(data[i].title).addClass("title")
            const saveButton = $("<button>").text("SAVE ARTICLE").addClass("save-button").data(data[i])
            const img = $("<img>").attr("src", data[i].img)
            // cardHeader.append(headerText, saveButton)
            // const cardBody = $("<div>").addClass("main-card-body");
            const likes = $("<div>").addClass("likes").html(`Upvotes:<p>${data[i].likes}</p>`)
            const a = $("<a>").attr({
                class: "card-text",
                href: redditHREF,
                target: "_blank"
            }).text(data[i].link)
            // cardBody.append(likes, a)
            card.append(headerText, saveButton, likes, img, a)
            $("#articles").append(card)
        }
    })
}

$("#scrapeButton").on("click", function () {
    $.ajax({
            method: "GET",
            url: "/scrape"
        })
        .done(function () {
            $("#articles").empty()
            getArticles()
            location.reload()
            // $.getJSON("/api/articles", function (data) {
            //     for (var i = 0; i < data.length; i++) {
            //         const card = $("<div>").addClass("card")
            //         const cardHeader = $("<div>").addClass("card-header bg-primary text-white")
            //         const headerText = $("<div>").addClass("col-md-10").html(`<h5>${data[i].title}</h5>`)
            //         const saveButton = $("<button>").text("SAVE ARTICLE").addClass("save-button").data(data[i])
            //         cardHeader.append(headerText, saveButton)
            //         const cardBody = $("<div>").addClass("card-body");
            //         const a = $("<a>").attr({
            //             class: "card-text",
            //             href: data[i].link,
            //             target: "_blank"
            //         }).text(data[i].link)
            //         cardBody.append(a)
            //         card.append(cardHeader, cardBody)
            //         $("#articles").append(card)
            //     }
            // });
        })
})

$(document).on("click", ".note-button", function () {
    const id = $(this).attr("data-id")
    $.get(`/api/articles/${id}`).then(function (data) {
        console.log(data)
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
    console.log(savedArticle)
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