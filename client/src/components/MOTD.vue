<template>
  <div id="maindiv">
    <h1><b>Aktuelle Informationen</b></h1>

    <div id="addMotd" v-if="IsLoggedIn">
      <input v-model="NewMotd.datum" alt="datum" type="date" />
      <input v-model="NewMotd.text" alt="Text" type=" text" />
      <button v-on:click="AddMotd()">eintragen</button>
    </div>
    <div id="MOTD" class="motd">
      <table class="motdtable">
        <tr v-for="item in this.motd" :key="item.id">
          <td>
            <small>{{ item.datum }} </small><br />
            {{ item.text }}
          </td>
          <td v-if="IsLoggedIn" v-on:click="delMotd(item.id)">x</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MOTD",
  data() {
    return {
      basepath: "",
      motd: [
        {
          id: "",
          datum: "",
          text: "",
        },
      ],
      NewMotd: {
        datum: "",
        text: "",
      },
    };
  },
  created() {
    this.basepath = this.$parent.APIURL;
    this.GetMotd();
  },
  computed: {
    IsLoggedIn() {
      return this.$parent.loggedin;
    },
  },
  methods: {
    async GetMotd() {
      console.log("GetMotd: " + this.$parent.APIURL + "/motd");
      this.toEdit = "";
      await axios
        .get(this.$parent.APIURL + "/motd")
        .then((res) => {
          //console.log('Result: ' + JSON.stringify(res.data))
          //this.$toast.success("aktualisiert")
          this.motd = res.data;
        })
        .catch((error) => {
          console.log("error: " + error);
          this.$toast.error(error);
        });
    },
    async AddMotd() {
      //this.$toast.success(this.NewMotd.datum);
      await axios
        .post(this.$parent.APIURL + "/AddMotd", this.NewMotd, {
          /// ToDo - Muss in main verscoben werden : headers: this.headers,
        })
        .then((res) => {
          console.log("res: " + JSON.stringify(res.data));
          if (res.data.Result === "Motd updated ...") {
            this.$toast.success("Motd aktualisiert.");
            this.GetMotd();
          } else {
            //this.$toast.error(res.data.text);
          }
        })
        .catch((error) => {
          this.$toast.error("Err:" + error);
        });
    },
    async delMotd(_id) {
      console.log("delete motd id: " + _id);
      var toDel = {
        id: _id,
      };
      await axios
        .post(this.$parent.APIURL + "/delMotd", toDel, {
          /// ToDo:  Auth-header noch nicht richtig implementiert
          headers: this.headers,
        })
        .then((res) => {
          console.log("Result: " + JSON.stringify(res.data));

          if (res.data.Result === "motd deleted ...") {
            this.$toast.success("aktualisiert");

            this.toEdit = null;
            this.GetMotd();
          } else {
            this.$toast.error("Err: " + res.data.text);
          }
        })
        //.then(this.GetItems())
        .catch((error) => {
          this.$toast.error("Err:" + error);
        });
    },
  },
};
</script>

<style scoped>
.motd {
  position: inherit;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 90%;
  height: 350px;
  background-color: rgb(208, 237, 249);
  opacity: 0.8;

  border-radius: 20px;
  overflow: scroll;
}
.motdtable,
th,
td {
  padding: 5px;
  text-align: left;
  vertical-align: top;
}
</style>