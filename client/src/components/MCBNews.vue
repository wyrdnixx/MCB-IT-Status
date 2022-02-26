<template >
    <div >
      <h1>MCB-News </h1>   
    <div id="outerDiv" class="outerDiv"> 
    
    <div class="rightDiv"> 
      <!--
      <iframe src="http://localhost:3080/files/test%20Kopie%204.pdf" height='100%' width='100%' name='test'/>      
      -->
      <iframe :src='basepath + "/../files/" + curFile' height='100%' width='100%' name='test'/>
    </div>
    <div id="files" class="leftDiv FileView rounded-bottom rounded-top rounded-left rounded-right">
        <h3>
       <!--
        <a v-for="f in this.files" :key="f.name" v-bind:href="basepath  + f.url" class="FileView" target="_blank" rel="noopener noreferrer"> {{ f.name }} <br></a>
        -->
        <p v-for="f in this.files" :key="f.name">
        <button  v-on:click="curFile=f.name" class = "btn btn-primary " >{{f.name}}</button>
        </p>
        <!--
                  <button v-for="f in this.files" :key="f.name" v-on:click="curFile=f.name" class = "btn btn-primary btn-xs" >{{f.name}}</button>
                  -->
        </h3>
      </div>
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
        curFile:"",
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
        //display first file per default
        this.curFile = this.files[this.files.length -1].name
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
      overflow-y: auto;
    position: relative;
    max-height: 40%;
}

        .outerDiv {
                background-color: #006699;
                color: rgb(140, 194, 255);
                height: 40%;
                width: 100%;
                margin: 0px auto;
                padding: 0px;
            }
            .leftDiv {
            
                height: 400px;
                width: 25%;
                float: left;
            }
            .rightDiv {

                height: 400px;
                width: 75%;
                float: right;
            }
</style>