<template>
  <div class="hello">

    <div align="right"> 
      <button class="btn btn-info" v-on:click="authentication()" > {{loggedin ? 'Logout' : 'Login'}} </button>
    </div>
    <h1>{{ msg }}</h1>
    <div id="loginForm" v-if="showLogin && !loggedin">
      <h3>Login</h3>
      <input v-model="credentials.Username" placeholder="Name">
      <input v-model="credentials.Password" placeholder="Password" type="password">
      <button v-on:click="login()">Login</button>
    </div>
    Key: {{headers.authkey}}
    <div id="items">
      <button class="btn btn-warning" v-on:click="GetItems()">aktualisieren</button>
      <br>
      <input type="text" placeholder="suche" v-model="searchtext" /> <button v-on:click="searchtext=''">x</button>
      <br>
    
      <table class="table table-dark">
      <thead>
          <th>Funktion</th>
          <th>Beschreibung</th>
          <th>Status</th>
          <th v-if="loggedin"> Edit</th>
      </thead>
      <tbody   >
        <!--  v-if="toEdit!= item.Name" --->
        <!-- <tr v-for="item in this.items" :key="item.name" v-bind:class="item.state"  > -->
          <tr v-if="loggedin">
            <td> <input v-model="NewItem.Name" placeholder="Item-Name" /></td>
            <td> <input v-model="NewItem.Text" placeholder="Item-Text"/></td>
           <!-- <td> <input v-model="NewItem.Status" placeholder="Item-Status"/></td>-->
           <td> <select v-model="NewItem.Status"><option>In-Betrieb</option><option>Außer-Funktion</option> </select></td>
            <td><button v-on:click="AddItem()">Add</button></td>
          </tr>
          <tr v-for="item in filteredElements" :key="item.Name" v-bind:class="item.Status"  >
          <td v-if="toEdit===item.Name"> <input v-model="UpdateItem.Name"  /> </td> <td v-else> {{item.Name}}</td>
          <td v-if="toEdit===item.Name"> <input v-model="UpdateItem.Text"  /> </td> <td v-else> {{item.Text}}</td>
          <td v-if="toEdit===item.Name"> <select v-model="UpdateItem.Status"><option>In-Betrieb</option><option>Außer-Funktion</option> </select></td> <td v-else> {{item.Status}}</td>
          <td v-if="loggedin"> <button v-on:click="SetUpdateItem(item)" v-if="toEdit!=item.Name">edit</button> <button v-on:click="DeleteItem(item)" v-if="toEdit!=item.Name">del</button> <button v-else v-on:click="DoUpdateItem()">save</button></td>
        </tr>
      </tbody>
 
      </table>

    </div>
      
    </div>

</template>

<script>
import axios from 'axios';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return{
   
      headers:{
            'content-type': 'application/json',
            'authkey':'',
            'authusr':''
      },
      items:[{
        Name:"",
        Text:"",
        Status:""
      }],
      UpdateItem:{
        Name:"",
        Text:"",
        Status:""
      },
      NewItem:{
        Name:"",
        Text:"",
        Status:""
      },
      searchtext:"",
      loggedin:"",
      showLogin:false,
      credentials: {
        Username:"",
        Password:"",
      },
      toEdit:"",
      NewName:""
    }
  },
  created(){
    this.GetItems()
    var myauthcookie =  this.$cookies.get('myauthcookie')
    console.log('cookie username: ' + myauthcookie.authusr)
    if (!myauthcookie) {
      console.log("created: No valid cookie found")
    }else {
      this.headers.authusr = myauthcookie.authusr
      this.headers.authkey = myauthcookie.authkey
      this.loggedin = true
    }
    
  },
  computed: {
    filteredElements() {
    return this.items.filter(item =>  item.Name.toLowerCase().includes(this.searchtext.toLowerCase()) || item.Text.toLowerCase().includes(this.searchtext.toLowerCase()))
    }

  },
  methods: {
       authentication() {
         if (this.loggedin) {
           this.headers.authkey=""
           this.loggedin=false
           this.toEdit=""
         } else {
           this.showLogin=true
           //Test--sdfdsf
           //this.loggedin=true 

         }
       },
       async login() {
         await axios.post(this.$parent.APIURL + '/login',this.credentials)
         .then ((res) => {
            console.log("authentication result: " + res.data)
            var status = res.data
            console.log("result: " + status.Result)

           if (res.data.Result === "User authenticated"){
             this.loggedin = true;
              //this.Usertoken = res.data.Usertoken;
              this.headers.authkey = res.data.Usertoken
              this.headers.authusr = this.credentials.Username
              this.$toast.success("Login Ok")
              this.$cookies.set('myauthcookie',this.headers,'1h')
              console.log('cookie: '+ this.$cookies.get('myauthcookie').authusr)
           }else {
            this.$toast.error(res.data.Result)
           }
         })
       },
    async GetItems() {
      console.log("GetItems: " + this.$parent.APIURL + '/getItems')
      this.toEdit =""
      await axios.get(this.$parent.APIURL + '/getItems') 
      .then ((res) => {
        console.log('Result: ' + JSON.stringify(res.data))
        //this.$toast.success("aktualisiert")
        this.items = res.data;
      })
      .catch((error) => {
        console.log("error: " + error)
        this.$toast.error(error)
      }) 
    },

    SetUpdateItem(item) {
      this.toEdit = item.Name
      this.UpdateItem.Name  = item.Name
      this.UpdateItem.Oldname = item.Name
      this.UpdateItem.Text  = item.Text
      this.UpdateItem.Status  = item.Status
    },
    async DoUpdateItem() {

      console.log("Updating Item " + JSON.stringify(this.UpdateItem))
      await axios.post(this.$parent.APIURL + '/updateItem', this.UpdateItem ,{headers:this.headers})
      .then ((res) => {
        console.log('Result: ' + JSON.stringify(res.data))
               this.$toast.success("aktualisiert")

         if (res.data.Result === "item updated ...") {
          this.toEdit=null
          this.GetItems()
         } else {
                   this.$toast.error(res.data )
         }
      })
      //.then(this.GetItems())
      .catch((error) => {
        this.$toast.error(error)
      })
    },
    async AddItem() {

      console.log("Adding Item " + JSON.stringify(this.NewItem))
      await axios.post(this.$parent.APIURL + '/addItem', this.NewItem,{headers:this.headers})
      .then ((res) => {
        console.log('Result: ' + JSON.stringify(res.data))
        
         if (res.data.Result === "item inserted ...") {
           this.NewItem.Name = null
           this.NewItem.Text = null
           this.NewItem.Status = null
           this.$toast.success(res.data.Result )


         } else {
                   this.$toast.error(res.data.Result )
         }
      })
      .then(this.GetItems())
    },
    async DeleteItem(toDelete) {
      console.log("Deleting Item " + toDelete)
      await axios.post(this.$parent.APIURL + '/deleteItem', toDelete,{headers:this.headers})
      .then ((res) => {
        console.log('Result: ' + JSON.stringify(res.data))
        this.$toast.success(res.data.Result )
         if (res.data.Result === "item deleted ...") {
          this.GetItems()
        } else {
          this.$toast.error(res.data.Result )

        }
      })
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
tr.Außer-Funktion td{
  background-color: rgb(129, 60, 3);
}
tr.In-Betrieb{
    background-color: rgb(5, 156, 5);

}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
