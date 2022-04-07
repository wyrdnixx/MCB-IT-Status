<template>
  <div id="maindiv">
    <h1><b>Aktuelle Informationen</b></h1>

    <div id="MOTD" class="motd">
      <table class="motdtable">
        <tr>
          <td>
            <small>05.04.2022 </small><br />
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
          </td>
        </tr>
        <tr>
          <td>
            <small>04.04.2022 </small><br />
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
          </td>
        </tr>
        <tr>
          <td>
            <small>03.04.2022 </small><br />

            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
          </td>
        </tr>
        <tr>
          <td>
            <small>02.04.2022 </small><br />

            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
          </td>
        </tr>
        <tr>
          <td>
            <small>02.04.2022 </small><br />

            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
          </td>
        </tr>
        <tr>
          <td>
            <small>02.04.2022 </small><br />

            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
            Dies ist ein Beispieltext. Hier kann z.B. ein Gedicht stehen. Oder
            was anderes. Vielleicht auch eine Abhandlung zu dem Fluxkompensator
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