<template >
    <div >
              <h1>MCB-News</h1>   

      <div id="files" class="FileView rounded-bottom rounded-top rounded-left rounded-right">
        <h3>
        <a v-for="f in this.files" :key="f.name" v-bind:href="basepath  + f.url" class="FileView"> {{ f.name }} <br></a>
        </h3>
      </div>
    </div>
</template>


<script>
import axios from 'axios';

export default {
    name: 'MCBNews',
 
  data() {
    return{
        files:[{
            name:"",
            url:""
        }],
        basepath:""
    }
  },

  created() {
    console.log("created MCBNews...")      
    this.basepath =   this.$parent.APIURL 
    this.GetFiles();
  },
  methods: {
    async GetFiles() {
      console.log("GetFiles: " + this.$parent.APIURL + '/files')
      this.toEdit =""
      await axios.get(this.$parent.APIURL + '/files') 
      .then ((res) => {
        //console.log('Result: ' + JSON.stringify(res.data))
        //this.$toast.success("aktualisiert")
        this.files = res.data;
      })
      .catch((error) => {
        console.log("error: " + error)
        this.$toast.error(error)
      }) 
    },
  }
}
</script>
<style scoped>

.FileView {
  background-color:rgb(46, 46, 46);
  color: rgb(113, 133, 177);
  width: 60%;
  text-align: center;
  margin: 0 auto;
}
</style>