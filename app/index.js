const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://ElUssy99:hola123456@cluster0-377gj.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri);

var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var users = [];

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Hola');
});

// Forumlario
app.get('/login', function(req, res) {
    res.render('index');
});

app.post('/login', function(req, res){
  console.log(req.body.name, req.body.pass);

  var correcto = false;

  for (var i = 0; i < users.length; i++) {
    console.log(users[i]);
    if(users[i].name == req.body.name && users[i].pass == req.body.pass){
      correcto = true;
      break;
    }
  }
  if (correcto == true) {
    res.send("El usuario es correcto. Hola " + req.body.name + ".");
  }
  if (correcto == false) {
    res.send("El usuario es incorrecto.");
  }
});

// Conectar a la Base de Datos
async function main(){
    try {
        await client.connect();
        await listUsers();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

MongoClient.connect(uri, function(err, db) {
  //console.log("");
  //console.log("Collection:");
  if (err) throw err;
    var dbo = db.db("NodeJS");
    dbo.collection("users").find({}).toArray(function(err, result) {
      if (err) throw err;
        //console.log(result);
        users = result;
        db.close();
    });
});

async function listUsers() {
  console.log("");
  console.log("Users:");
  for (var i = 0; i < users.length; i++) {
    console.log(users[i]);
  }
  console.log("");
}

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});
