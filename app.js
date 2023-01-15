const express = require("express");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const request = require("request");
const https = require("https");
const apiKey = "9fbd28a7c66add430e0c1683688c4ff6-us14"
let port = process.env.PORT;

const app = express();

if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", (req, res) => {
    const firtsName = req.body.firtsName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firtsName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/e5b2a72441";

    const options = {

        method: "POST",
        // user:apikey
        auth: `tomiprasetyo:${apiKey}`
    }

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {

            const dataJson = JSON.parse(data);

            if (response.statusCode === 200) {
                if (dataJson.errors[0] == undefined) {
                    res.sendFile(__dirname + "/success.html")
                } else {
                    res.sendFile(__dirname + "/failure.html");
                    // res.send(dataJson.errors[0].error)
                }

            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/")
});


app.post("/success", (req, res) => {
    res.redirect("/")
});

// api key mailchimp
// 9fbd28a7c66add430e0c1683688c4ff6-us14

// unique id
// e5b2a72441