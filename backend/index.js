const express = require('express')
const app = express()

const db = require("./models");




app.get("/api", (req, res) => {
    res.json({ "users" : ["userOne", "userTwo", "userThree"]})
})

// db.sequelize.sync().then(() => {
//     app.listen(5000, () => {console.log("Server started on port 5000")})
// })

const { users } = require("./models")
app.get("/users", (req, res) => {
    users.findAll().then((users) => {
        res.send(users)
    }).catch((err) => {
        console.log(err)
    })
})

app.listen(5000, () => {console.log("Server started on port 5000")})
