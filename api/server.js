const { json } = require('express');
const crypto = require("crypto");
const secretSalt ="This is a salt string for md5 hash"

var express = require('express');
var app = express();
const path = require('path');
bodyParser = require("body-parser");
/* var db = require("./database")
 */const sqlite3 = require('sqlite3').verbose();
let dbFile = './MCB-DB.db';

// Body-parser middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


app.use(express.static(path.join(__dirname, '../webapp/dist')));

const items = [];
//const md5hasher = crypto.createHmac("md5",secretSalt)
//const adminpw = md5hasher.update('admin').digest("base64");
var adminpw = crypto.createHash('md5').update('admin').digest('base64');

const sqlDefaultAdmin = `insert into Users (Username, Password) VALUES ('admin','`+ adminpw + `')`;



// --------
app.use(function(req, res, next) {
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
        Tocken TEXT
        )`, (err) => {
         if (err) {
            console.warn(err.message)
         }
        });

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


app.post('/api/login', function (req,res) {
   console.log("got login request: " + JSON.stringify(req.body))
   const credentials = req.body;
   console.log(credentials.Password)
   console.log("dHash: " + adminpw)
   var userpw = crypto.createHash('md5').update(credentials.Password).digest('base64');

   console.log("tHash: " + userpw)

   var sql = 'select * from Users where Username = ? and Password = ?'
   console.log("SQL: " + sql,credentials.Username,userpw )
   db.get(sql,credentials.Username,userpw,(err,row) => {
      if(err){
         console.log("error validating user: " + err.message)
         res.json(err.message)
      } 
      return row
         ? updateUserTocken(res,credentials)   //res.json("authentication success")
         : res.json({Result:"User not authenticated"});
         //res.json("login successfull")
      });
});
   


app.post('/api/addItem', function (req, res) {
   console.log("got post request: " + JSON.stringify(req.body))
   const item = req.body;
   
   //ToDo - Check authentication Key from header

   if( checkauth(req)) {
      var sql ='INSERT INTO items (Name, Text, Status) VALUES (?,?,?)'

      db.run(sql, item.Name, item.Text, item.Status,(err) => {
         if (err) {
            console.log(err.message)
            res.json(err.message)
         } else {
            res.json({Result:"item inserted ..."})
   
         }
      })
   } else {
      res.json({Result:"error - not authenticated. maybe login from other session?"})
   }
   
   
})


app.post('/api/updateItem', function(req,res) {
   console.log("got update request: "+ JSON.stringify(req.body))
   const item = req.body;
   
   if( checkauth(req)) {


   var sql = 'update items set Name = ?, Text = ? ,Status =? where Name = ?'
   db.run(sql,item.Name,item.Text,item.Status,item.Name,(err) => {
      if (err) {
         console.log(err.message)
         res.json({Result:err.message})
      } else {
         res.json({Result:"item updated ..."})

      }
   })
} else {
   res.json({Result:"error - not authenticated. maybe login from other session?"})
}

})

app.post('/api/deleteItem',function(req,res) {
   console.log("got item to delete: "+ JSON.stringify(req.body))
   const item = req.body;

   if( checkauth(req)) {


   var sql = 'delete from items where Name = ?'
   db.run(sql,item.Name,(err) =>{
      if (err) {
         console.log(err.message)
         res.json({Result:err.message})
      } else {
         res.json({Result:"item deleted ..."})
      }
   })
   } else {
   res.json({Result:"error - not authenticated. maybe login from other session?"})
}
})


 app.get('/api/getItems', (req,res) => {
    
   console.log('getItems...');
   db.all (`select * from Items order by Status COLLATE NOCASE desc ,Name COLLATE NOCASE asc`, (err,rows) => {
      //console.log(rows)
      if (err) {
          console.error(err.message);
        }
        res.json(rows)
   });
   //res.json(items)
   //res.json(db.GetItems())
});


app.get('/', function (req, res) {
   console.log("Main Site requested: " + path.join(__dirname, '../client/dist/index.html'))
   res.sendFile(path.join(__dirname, '../client/dist/index.html'));

})

function updateUserTocken(res, credentials){
   console.log("updating usertoken")  
   var newToken = crypto.randomUUID()
   sql = `update Users set Tocken = ? where Username = ?`
   db.run(sql,newToken,credentials.Username,(err) => {
      if (err) {
         console.log(err.message)
         res.json({Result:"error",text:"'+err.message+'"})

      } else {
         console.log("Usertocken updated ...")
         res.json({Result:"User authenticated",Usertocken:newToken})

      }
   })
 
}  


async function checkauth(req){
   
   const authkey = req.get('authkey');
   console.log("authkey: " + authkey)
      const authusr = req.get('authusr');
   console.log("authusr: " + authusr)
   
   var authstatus = false;

   var sql = `select Username, Tocken from Users where Username = ? and Tocken = ?`
   await db.get(sql,authusr,authkey,(err,row) => {
      if(err){
         console.log("error validating user: " + err.message)
         res.json({Result:err.message})
      } 
      return row
         ? this.authstatus = true | console.log("authentication status: auth-ok") 
         : this.authstatus = false | console.log("authentication status: auth-not-ok")
        
      })
      return this.authstatus
}

var server = app.listen(3080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
});