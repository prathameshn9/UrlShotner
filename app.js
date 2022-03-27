let express = require('express');
let app = express();
const isUrl = require("is-valid-http-url");
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let schema = mongoose.Schema;
const url = 'mongodb+srv://prathameshn:M67vfeCBsoL4b9hF@cluster0.dzvhc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const port = 4000 ;

//creating schema or template
const URL = new schema({
    uri: String,
    short: Number
});

let Url = mongoose.model('Url', URL);

//sending html file as response
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

//getting data from form
app.post('/api/shorturl', bodyParser.urlencoded({ extended: false }), (req, res) => {
    if (!isUrl(req.body.url)) {
        return res.json({ error: 'invalid url' });
    }
    let shorturi = req.body.url
    let weburl = new Url({ uri: shorturi, short: Math.floor((Math.random() * 100) + 1) });
    weburl.save()
    res.json(
        { "original_url": weburl.uri, "short_url": weburl.short }
    );
});

//redirecting to the original_url from short_url
app.get('/api/shorturl/:id', (req, res) => {
    let g = req.params.id
    let findOneByFood = function (g) {
        Url.findOne({ short: Number(g) }, function (err, data) {
            if (err) return console.log(err);
            res.redirect(data.uri)
        });
    };
    findOneByFood(g)
});


app.listen(port, () => {
    console.log(`localhost: ${port}`)
});