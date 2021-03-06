const { json } = require('express');
const crypto = require("crypto");
const secretSalt = "This is a salt string for md5 hash"
const fileUpload = require('express-fileupload');


var express = require('express');
var app = express();
// enable files upload
app.use(fileUpload({
   createParentPath: true
}));
const controller = require("./controller/file.controller.js");


const path = require('path');
const { JavascriptModulesPlugin } = require('webpack');
bodyParser = require("body-parser");
/* var db = require("./database")
 */const sqlite3 = require('sqlite3').verbose();
let dbFile = '../data/db/MCB-DB.db';

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



const items = [];
//const md5hasher = crypto.createHmac("md5",secretSalt)
//const adminpw = md5hasher.update('admin').digest("base64");
var adminpw = crypto.createHash('md5').update('admin').digest('base64');

const sqlDefaultAdmin = `insert into Users (Username, Password) VALUES ('admin','` + adminpw + `')`;



// --------
app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authkey,authusr");
   next();
});



//--------- Database
db = new sqlite3.Database(dbFile, (err) => {
   if (err) {
      console.error(err.message);
   }
   console.log('Constructor : Connected to the MCB-DB database to init Database.');
});

db.serialize(() => {
   db.exec(`create table if not exists Items ( 
       Name TEXT primary key,
       Text TEXT not Null,
       Status TEXT not Null
     )`, (err) => {
      if (err) {
         console.warn(err.message)
      }
   });
   db.exec(`create table if not exists Users (
      Username TEXT primary key,
      Password TEXT not Null,
      Token TEXT
      )`, (err) => {
      if (err) {
         console.warn(err.message)
      }
   });
   db.exec(`create table if not exists Motd (
   id integer primary key autoincrement,
   datum TEXT not Null,
   text TEXT not null
   )`, (err) => {
      if (err) {
         console.warn(err.message)
      }
   });
   // insert example
   /*  db.exec(`insert into Motd 
    ('datum','text')
    values (
       '01.01.2022',
       'test-text :  hier kommt alles rein'
       )`, (err) => {
       if (err) {
          console.warn(err.message)
       }
    }); */

   db.exec(sqlDefaultAdmin, (err) => {
      if (err) {
         console.warn(err.message)
      }
   });

   //TEST
   let sql = `SELECT * FROM Users`;

   db.all(sql, [], (err, rows) => {
      if (err) {
         throw err;
      }
      rows.forEach((row) => {
         console.log(row.Username + " : " + row.Password);
      });
   });

})


app.post('/api/login', function (req, res) {
   console.log("got login request: " + JSON.stringify(req.body))
   const credentials = req.body;
   console.log(credentials.Password)
   console.log("dHash: " + adminpw)
   var userpw = crypto.createHash('md5').update(credentials.Password).digest('base64');

   console.log("tHash: " + userpw)

   var sql = 'select * from Users where Username = ? and Password = ?'
   console.log("SQL: " + sql, credentials.Username, userpw)
   db.get(sql, credentials.Username, userpw, (err, row) => {
      if (err) {
         console.log("error validating user: " + err.message)
         res.json(err.message)
      }
      return row
         ? updateUserToken(res, credentials)   //res.json("authentication success")
         : res.json({ Result: "User not authenticated" });
      //res.json("login successfull")
   });
});



app.post('/api/addItem', async function (req, res) {
   console.log("got post request: " + JSON.stringify(req.body))
   const item = req.body;

   var authresult = await checkauth(req)
   if (!authresult) {

      console.log("Authentication not ok - no action")
      res.json({ Result: "error", text: "user not authenticated" })

   } else {
      var sql = 'INSERT INTO items (Name, Text, Status) VALUES (?,?,?)'

      db.run(sql, item.Name, item.Text, item.Status, (err) => {
         if (err) {
            console.log(err.message)
            res.json(err.message)
         } else {
            res.json({ Result: "item inserted ..." })

         }
      })
   }

})

app.post('/api/delMotd', async function (req, res) {
   const item = req.body;
   var authresult = await checkauth(req)
   ///todo   if (!authresult) {
   //     console.log("Authentication not ok - no action")
   //     res.json({ Result: "error", text: "user not authenticated" })

   //   } else {

   console.log("delete Motd-ID: " + item.id)

   var sql = `delete from  motd where  id =  ?`
   db.run(sql, item.id, (err) => {
      if (err) {
         console.log(err.message)
         res.json({ Result: err.message })
      } else {
         console.log("deleted Motd-ID: " + sql)
         res.json({ Result: "motd deleted ..." })

      }
   })

   //   }
});

app.post('/api/AddMotd', async function (req, res) {
   const newMotd = req.body;
   var authresult = await checkauth(req)
   ///todo check auth
   /// todo if (!authresult) {
   // if (!authresult) {
   //   console.log("Authentication not ok - no action")
   //   res.json({ Result: "error", text: "user not authenticated" })
   //} else {

   console.log("new Motd: " + JSON.stringify(req.body))

   var sql = `insert into motd ('datum','text') values ( ? ,?)`
   db.run(sql, req.body.datum, req.body.text, (err) => {
      if (err) {
         console.log(err.message)
         res.json({ Result: err.message })
      } else {
         //console.log("updated: "+ sql)
         res.json({ Result: "Motd updated ..." })

      }
   })

   //}
});


app.post('/api/updateItem', async function (req, res) {
   console.log("got update request: " + JSON.stringify(req.body))
   const item = req.body;

   var authresult = await checkauth(req)
   if (!authresult) {

      console.log("Authentication not ok - no action")
      res.json({ Result: "error", text: "user not authenticated" })

   } else {

      var sql = 'update items set Name = ?, Text = ? ,Status =? where Name = ?'
      db.run(sql, item.Name, item.Text, item.Status, item.Oldname, (err) => {
         if (err) {
            console.log(err.message)
            res.json({ Result: err.message })
         } else {
            //console.log("updated: "+ sql)
            res.json({ Result: "item updated ..." })

         }
      })
   }

})

app.post('/api/deleteItem', async function (req, res) {
   console.log("got item to delete: " + JSON.stringify(req.body))
   const item = req.body;

   //console.log ("request: " + JSON.stringify(req.headers))
   var authresult = await checkauth(req)
   if (!authresult) {

      console.log("Authentication not ok - no action")
      res.json({ Result: "error", text: "user not authenticated" })

   } else {
      console.log("deleting item...")
      var sql = 'delete from items where Name = ?'
      db.run(sql, item.Name, (err) => {
         if (err) {
            console.log(err.message)
            res.json({ Result: "error", text: "'" + err.message + "'" })
         } else {
            res.json({ Result: "item deleted ..." })
         }
      })

   }

})


app.get('/api/getItems', (req, res) => {

   console.log('getItems...');
   db.all(`select * from Items order by Status COLLATE NOCASE desc ,Name COLLATE NOCASE asc`, (err, rows) => {
      //console.log(rows)
      if (err) {
         console.error(err.message);
      }
      res.json(rows)
   });
   //res.json(items) 
   //res.json(db.GetItems())
});

app.get('/api/motd', (req, res) => {

   console.log('getMotd...');
   db.all(`select * from Motd order by datum COLLATE NOCASE desc ,text COLLATE NOCASE asc`, (err, rows) => {
      //console.log(rows)
      if (err) {
         console.error(err.message);
      }
      res.json(rows)
   });
   //res.json(items) 
   //res.json(db.GetItems())
});

function updateUserToken(res, credentials) {
   console.log("updating usertoken")
   var newToken = crypto.randomUUID()
   sql = `update Users set Token = ? where Username = ?`
   db.run(sql, newToken, credentials.Username, (err) => {
      if (err) {
         console.log(err.message)
         res.json({ Result: "error", text: "'+err.message+'" })

      } else {
         console.log("Usertoken updated ...")
         res.json({ Result: "User authenticated", Usertoken: newToken })

      }
   })

}


async function checkauth(req) {

   const authkey = req.get('authkey');
   console.log("check auth authkey: " + authkey)
   const authusr = req.get('authusr');
   console.log("checkauth authusr: " + authusr)


   //"71e5feed-cc45-4d89-a6e5-74e48b8398af"
   //var sql = `select Username, Tocken from Users where Username = 'admin' and Tocken = '71e5feed-cc45-4d89-a6e5-74e48b8398af'`
   var sql = `select Username, Token from Users where Username = ? and Token = ?`

   var request = await new Promise((resolve, reject) => {
      db.get(sql, authusr, authkey, function (err, row) {
         if (err || !row) {
            console.log("user / token not found")
            return resolve(false);
         }
         console.log("checkauth got res: " + JSON.stringify(row))
         resolve(true);
      })
   });
   console.log("checkauth returning: " + request)
   return request
}


app.get("/api/files", controller.getListFiles);
app.post("/api/fileupload", controller.fileupload);

//app.get("/api/files/:name", controller.download);


app.use('/files', express.static(path.join(__dirname, '../api/resources/files')));

app.get('/', function (req, res) {
   console.log("Main Site requested: " + path.join(__dirname, '../client/dist/index.html'))
   res.sendFile(path.join(__dirname, '../client/dist/index.html'));

})

app.use(express.static(path.join(__dirname, '../client/dist')));

var server = app.listen(3080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
});