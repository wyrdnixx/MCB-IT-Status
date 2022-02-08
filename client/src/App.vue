<template>
  <div id="app">
   
    <MainPage msg="Welcome to MainPage"/>
  </div>
</template>

<script>
import MainPage from './components/MainPage.vue'


export default {

name: 'App',
  components: {
    MainPage
  },
  data() {
    return {
      APIURL:""
    }
  },
  created() {
     //this.UserAuthenticated = false    
    this.VUE_APP_NODE_ENV = process.env.VUE_APP_NODE_ENV
    console.log(" .environment : " + this.VUE_APP_NODE_ENV); // OUTPUT: development
    if (this.VUE_APP_NODE_ENV != "production") {      
      console.log("using developement environment")
      this.APIURL= window.location.protocol + "//"+ window.location.hostname +":3080/api"

      
    }else {
      console.log("using production environment")
      //this.APIURL = window.location.protocol + "//"+ window.location.href +":8081/api"
      this.APIURL = window.location.href +"/api"
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
