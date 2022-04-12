<template>
  <div>
    <h1><b>Status MCB-IT Systeme</b></h1>

    <button class="btn btn-info btn-right" v-on:click="authentication()">
      {{ IsLoggedIn ? "Logout" : "Login" }}
    </button>
    <div id="loginForm" v-if="showLogin && !IsLoggedIn">
      <h3>Login</h3>
      <input
        id="inputUsername"
        v-model="credentials.Username"
        placeholder="Name"
      />
      <input
        id="inputPassword"
        v-model="credentials.Password"
        placeholder="Password"
        type="password"
        v-on:keyup.enter="login()"
      />
      <button id="btnLogin" v-on:click="login()">Login</button>
    </div>
    <div v-if="IsLoggedIn">Angemeldet: {{ headers.authusr }}</div>
    <p></p>
    <div id="items" class="items">
      <!-- <button class="uk-button uk-button-primary" v-on:click="GetItems()">
        aktualisieren
      </button> -->
      <p></p>
      <input type="text" placeholder="suche" v-model="searchtext" />
      <button
        v-on:click="searchtext = ''"
        class="btn btn-outline-danger btn-sm"
      >
        x
      </button>
      <br />

      <table class="table table-sm table-dark">
        <thead>
          <th>Funktion</th>
          <th>Beschreibung</th>
          <th>Status</th>
          <th v-if="IsLoggedIn">Edit</th>
        </thead>
        <tbody>
          <!--  v-if="toEdit!= item.Name" --->
          <!-- <tr v-for="item in this.items" :key="item.name" v-bind:class="item.state"  > -->
          <tr v-if="IsLoggedIn">
            <td><input v-model="NewItem.Name" placeholder="Item-Name" /></td>
            <td><input v-model="NewItem.Text" placeholder="Item-Text" /></td>
            <!-- <td> <input v-model="NewItem.Status" placeholder="Item-Status"/></td>-->
            <td>
              <select v-model="NewItem.Status">
                <option>In-Betrieb</option>
                <option>In-Bearbeitung</option>
                <!--<option>Außer-Funktion</option> -->
              </select>
            </td>
            <td>
              <button v-on:click="AddItem()" class="btn btn-success btn-sm">
                Add
              </button>
            </td>
          </tr>
          <tr
            v-for="item in filteredElements"
            :key="item.Name"
            v-bind:class="item.Status"
          >
            <td v-if="toEdit === item.Name">
              <input v-model="UpdateItem.Name" />
            </td>
            <td v-else>{{ item.Name }}</td>
            <td v-if="toEdit === item.Name">
              <input v-model="UpdateItem.Text" />
            </td>
            <td v-else>{{ item.Text }}</td>
            <td v-if="toEdit === item.Name">
              <select v-model="UpdateItem.Status">
                <option>In-Betrieb</option>
                <option>In-Bearbeitung</option>
                <!-- <option>Außer-Funktion</option> -->
              </select>
            </td>
            <td v-else>{{ item.Status }}</td>
            <td v-if="IsLoggedIn">
              <button
                v-on:click="SetUpdateItem(item)"
                v-if="toEdit != item.Name"
                class="btn btn-primary btn-sm"
              >
                edit
              </button>
              <button
                v-on:click="DeleteItem(item)"
                v-if="toEdit != item.Name"
                class="btn btn-danger btn-sm"
              >
                x
              </button>
              <button v-else v-on:click="DoUpdateItem()">save</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      headers: {
        "content-type": "application/json",
        authkey: "",
        authusr: "",
      },
      items: [
        {
          Name: "",
          Text: "",
          Status: "",
        },
      ],
      UpdateItem: {
        Name: "",
        Text: "",
        Status: "",
      },
      NewItem: {
        Name: "",
        Text: "",
        Status: "",
      },
      searchtext: "",
      showLogin: false,
      credentials: {
        Username: "",
        Password: "",
      },
      toEdit: "",
      NewName: "",
    };
  },
  created() {
    console.log("created MainPage...");
    this.GetItems();
    var myauthcookie = this.$cookies.get("myauthcookie");
    //console.log('cookie username: ' + myauthcookie.authusr)
    if (!myauthcookie) {
      console.log("created: No valid cookie found");
    } else {
      this.headers.authusr = myauthcookie.authusr;
      this.headers.authkey = myauthcookie.authkey;
      this.$parent.loggedin = true;
    }
  },
  computed: {
    filteredElements() {
      return this.items.filter(
        (item) =>
          item.Name.toLowerCase().includes(this.searchtext.toLowerCase()) ||
          item.Text.toLowerCase().includes(this.searchtext.toLowerCase())
      );
    },
    IsLoggedIn() {
      return this.$parent.loggedin;
    },
  },
  methods: {
    authentication() {
      if (this.$parent.loggedin) {
        this.headers.authkey = "";
        this.$parent.loggedin = false;
        this.toEdit = "";
        this.$cookies.set("myauthcookie", this.headers, "-0");
      } else {
        this.showLogin = true;
        //Test--sdfdsf
        //this.$parent.loggedin=true
      }
    },
    async login() {
      await axios
        .post(this.$parent.APIURL + "/login", this.credentials)
        .then((res) => {
          console.log("authentication result: " + res.data);
          var status = res.data;
          console.log("result: " + status.Result);

          if (res.data.Result === "User authenticated") {
            this.$parent.loggedin = true;

            //this.Usertoken = res.data.Usertoken;
            this.headers.authkey = res.data.Usertoken;
            this.headers.authusr = this.credentials.Username;
            this.$toast.success("Login Ok");
            this.$cookies.set("myauthcookie", this.headers, "1h");
            console.log("cookie: " + this.$cookies.get("myauthcookie").authusr);
          } else {
            this.$toast.error(res.data.Result);
          }
        });
    },
    async GetItems() {
      console.log("GetItems: " + this.$parent.APIURL + "/getItems");
      this.toEdit = "";
      await axios
        .get(this.$parent.APIURL + "/getItems")
        .then((res) => {
          //console.log('Result: ' + JSON.stringify(res.data))
          //this.$toast.success("aktualisiert")
          this.items = res.data;
        })
        .catch((error) => {
          console.log("error: " + error);
          this.$toast.error(error);
        });
    },

    SetUpdateItem(item) {
      this.toEdit = item.Name;
      this.UpdateItem.Name = item.Name;
      this.UpdateItem.Oldname = item.Name;
      this.UpdateItem.Text = item.Text;
      this.UpdateItem.Status = item.Status;
    },
    async DoUpdateItem() {
      console.log("Updating Item " + JSON.stringify(this.UpdateItem));
      await axios
        .post(this.$parent.APIURL + "/updateItem", this.UpdateItem, {
          headers: this.headers,
        })
        .then((res) => {
          console.log("Result: " + JSON.stringify(res.data));
          this.$toast.success("aktualisiert");

          if (res.data.Result === "item updated ...") {
            this.toEdit = null;
            this.GetItems();
          } else {
            this.$toast.error(res.data);
          }
        })
        //.then(this.GetItems())
        .catch((error) => {
          this.$toast.error(error);
        });
    },
    async AddItem() {
      console.log("Adding Item " + JSON.stringify(this.NewItem));

      if (
        this.NewItem.Name === "" ||
        this.NewItem.Text === "" ||
        this.NewItem.Status === ""
      ) {
        this.$toast.warning("Bitte alle Felder ausfüllen.");
      } else {
        // this.items.forEach(element => {
        //   if(element.Name === this.NewItem.Name) {
        //             this.$toast.warning("Name bereits vorhanden.");
        //   }
        // });

        await axios
          .post(this.$parent.APIURL + "/addItem", this.NewItem, {
            headers: this.headers,
          })
          .then((res) => {
            console.log("Result: " + JSON.stringify(res.data));

            if (res.data.Result === "item inserted ...") {
              this.NewItem.Name = null;
              this.NewItem.Text = null;
              this.NewItem.Status = null;
              this.$toast.success(res.data.Result);
              this.GetItems();
            } else {
              this.$toast.error(res.data.Result);
            }
          })
          .then(this.GetItems());
      }
    },
    async DeleteItem(toDelete) {
      console.log("Deleting Item " + toDelete);
      await axios
        .post(this.$parent.APIURL + "/deleteItem", toDelete, {
          headers: this.headers,
        })
        .then((res) => {
          console.log("Result: " + JSON.stringify(res.data));
          this.$toast.success(res.data.Result);
          if (res.data.Result === "item deleted ...") {
            this.GetItems();
          } else {
            this.$toast.error(res.data.Result);
          }
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.items {
  /* background-color: rgb(220, 235, 253); */
}
table {
  background-color: rgb(52, 147, 202);
}
tr.Außer-Funktion td {
  background-color: rgb(161, 116, 116);
  color: black;
}
tr.In-Betrieb {
  background-color: rgb(109, 158, 112);
  color: black;
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
.btn-right {
  position: absolute;
  left: 95%;
  top: 2%;
}
</style>
