const gTTS = require('gtts');
const fs = require('fs');

const express = require('express')
const bodyparser = require('body-parser')

const app = express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
  extended: true
}))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

let badwords;
fs.readFile("familyFriendly.csv", function(error, data) {
  /* Check to make sure there are no errors */
  if (error) {
    console.log("Problem with file.");
  } else {
    /* Change data to string so we can read it */
    badwords = data.toString().split(",");
  }
});

app.post('/', (req, res) => {
  var phrase = req.body.text

  badwords.forEach((word, i) => {
    while (phrase.includes(word)) {
      phrase = phrase.replace(word, "badword")
    }
  });

  console.log(phrase);

  var gtts = new gTTS(phrase, 'en');

  gtts.save(__dirname + '/hello.mp3', function(err, result) {
    if (err) {
      throw new Error(err)
    } else {
      res.sendFile(__dirname + '/hello.mp3')
    }
    console.log('Success! Open file /tmp/hello.mp3 to hear result.');
  });
})

app.listen(5000, function() {
  console.log("listening on port 5000");
})
