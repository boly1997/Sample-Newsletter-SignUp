const express = require("express");
const bodyParser = require("body-parser");
//const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function (req,res){

    const firstName  = req.body.FirstName;
    const lastName = req.body.LastName;
    const email = req.body.Email;

    const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/aa09894c88";

    const options = {
      method: "POST",
      auth: "boly1:f87e7a1b7463890500b9f76801b9d1c6-us10"
    }

   const request =  https.request(url, options, function(response) {

     if (response.statusCode === 200) {
       res.sendFile(__dirname + "/success.html")
     } else {
       res.sendFile(__dirname + "/failure.html")
     }
      response.on("data", function(data){
        console.log(JSON.parse(data));
      })
    })
    request.write(jsonData);
    request.end ();

});

app.post("/failure", function(req, res){
  res.redirect("/");
})

//--data '{"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}' \

app.listen(process.env.PORT || 3000, function(){
  console.log ("Server started on port 3000");
});

//API KEY f87e7a1b7463890500b9f76801b9d1c6-us10
// list ID aa09894c88
