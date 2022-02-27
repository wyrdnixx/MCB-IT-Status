<template>
  <div id="app">
    <MCBNews />
    <MainPage msg="Status MCB-IT Systeme" />
  </div>
</template>

<script>
import MainPage from "./components/MainPage.vue";
import MCBNews from "./components/MCBNews.vue";

export default {
  name: "App",
  components: {
    MainPage,
    MCBNews,
  },
  data() {
    return {
      APIURL: "",
    };
  },
  created() {
    console.log("created App...");
    //this.UserAuthenticated = false
    this.VUE_APP_NODE_ENV = process.env.VUE_APP_NODE_ENV;
    console.log(" .environment : " + this.VUE_APP_NODE_ENV); // OUTPUT: development
    if (this.VUE_APP_NODE_ENV != "production") {
      console.log("using developement environment");
      this.APIURL =
        window.location.protocol +
        "//" +
        window.location.hostname +
        ":3080/api";
    } else {
      console.log("using production environment");
      //this.APIURL = window.location.protocol + "//"+ window.location.href +":8081/api"
      this.APIURL = window.location.href + "/api";
    }
  },
};
</script>

<style>
#app-orginal {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #3b83ca;
  background-color: rgb(20, 82, 110);
  margin-top: 60px;
}
#app {
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
  background-color: rgb(29, 29, 29);

  min-height: calc(100vh - 10px);
}
h1 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: rgb(63, 153, 212);
}
</style>
