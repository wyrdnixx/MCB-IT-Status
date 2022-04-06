<template>
  <div id="maindiv">
    <div id="MOTD" class="motd">
      <p>MOTD</p>
      <table class="motdtable">
        <th></th>
        <tr>
          <td>04.04.2022</td>
          <td>
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
          </td>
        </tr>
        <tr>
          <td>05.04.2022</td>
          <td>
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
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
    };
  },
  created() {
    this.basepath = this.$parent.APIURL;
  },
  methods: {
    empty() {
      axios.get();
    },
  },
};
</script>

<style scoped>
.motd {
  background-color: bisque;
}
.motdtable,
th,
td {
  padding: 5px;
  text-align: left;
  vertical-align: top;
}
</style>