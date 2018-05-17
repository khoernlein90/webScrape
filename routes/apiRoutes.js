const db = require("../models")
const cheerio = require("cheerio");
const axios = require("axios");
const router = require("express").Router()

router.get("/scrape", function (req, res) {
    axios
        .get("https://www.reddit.com/r/leagueoflegends/")
        .then(function (response) {
            const $ = cheerio.load(response.data);
            $("div.thing").each(function (i, element) {
                const result = {};

                let img = $(element).find("a.thumbnail img").attr("src")
                if (img === undefined) {
                    img = "http://b.thumbs.redditmedia.com/c8VaJu4eagiHqV7okaZDzu6A-KDA4QT5WNdmeFqMkec.png"
                }
                result.img = img;
                result.likes = parseInt($(element).find("div.likes").text())
                result.title = $(element)
                    .find("a.title")
                    .text();
                result.link = $(element)
                    .find("a.title")
                    .attr("href");
                console.log(result)
                db
                    .Article
                    .create(result)
                    .catch(function (err) {
                        res.json(err);
                    });
            });
        });
});

router.get("/api/articles", function (req, res) {
    db
        .Article
        .find({
            saved: false
        }).sort({
            _id: 1
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/api/articles/:id", function (req, res) {
    db
        .Article
        .findOne({
            _id: req.params.id
        })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/api/saved", function (req, res) {
    db
        .Article
        .find({
            saved: true
        })
        .then(function (data) {
            res.json(data)
        })
        .catch(function (err) {
            res.json(err)
        })
})
router.put("/api/saved/:id", function (req, res) {
    db.Article.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: req.body
    }, {
        new: true
    }).then(function (dbHeadline) {
        res.json(dbHeadline);
    });
})

router.delete("/api/saved/:id", function (req, res) {
    db.Article.findByIdAndRemove(req.params.id).then(function (data) {
        res.json(data)
    })
})

router.post("/api/articles/:id", function (req, res) {
    db
        .Note
        .create(req.body)
        .then(function (dbNote) {
            return db
                .Article
                .findOneAndUpdate({
                    _id: req.params.id
                }, {
                    note: dbNote._id
                }, {
                    new: true
                });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.delete("/api/articles/:id", function (req, res) {
    db.Note.findByIdAndRemove(req.params.id).then(function (data) {
        res.json(data)
    }).catch(function (err) {
        res.json(err)
    })
})
module.exports = router;