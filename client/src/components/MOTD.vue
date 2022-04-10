<template>
  <div id="maindiv">
    <h1><b>Aktuelle Informationen</b></h1>

    <div id="MOTD" class="motd">
      <table class="motdtable">
        <tr v-for="item in this.motd" :key="item.id">
          <td>
            <small>{{ item.datum }} </small><br />
            {{ item.text }}
          </td>
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
    };
  },
  created() {
    this.basepath = this.$parent.APIURL;
    this.GetMotd();
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
  height: 450px;
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