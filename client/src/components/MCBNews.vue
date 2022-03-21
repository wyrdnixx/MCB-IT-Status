<template >
  <div>
    <div>
      <div id="pdfview" class="pdfview">
        <h2>MCB-News</h2>
        <!--
      <iframe src="http://localhost:3080/files/test%20Kopie%204.pdf" height='100%' width='100%' name='test'/>      
      -->
        <iframe
          :src="basepath + '/../files/' + curFile"
          height="90%"
          width="80%"
          name="test"
        />
      </div>
      <div id="upload" v-if="IsLoggedIn">
        <input type="file" @change="uploadFile" ref="file" accept=".pdf" />
        <button @click="submitFile">Upload!</button>
      </div>

      <div
        id="files"
        class="FileView rounded-bottom rounded-top rounded-left rounded-right"
      >
        <a
          v-for="f in this.files"
          :key="f.name"
          v-on:click="curFile = f.name"
          class="FileView"
        >
          {{ f.name }} <br
        /></a>

        <!--
        <p v-for="f in this.files" :key="f.name">
        <button  v-on:click="curFile=f.name" class = "btn btn-primary " >{{f.name}}</button>
        </p>
       
       
                  -->
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "MCBNews",

  data() {
    return {
      files: [
        {
          name: "",
          url: "",
        },
      ],
      curFile: "",
      basepath: "",
      selectedUploadFile: undefined,
    };
  },

  created() {
    console.log("created MCBNews...");
    this.basepath = this.$parent.APIURL;
    this.GetFiles();
  },
  computed: {
    IsLoggedIn() {
      return this.$parent.loggedin;
    },
  },
  methods: {
    async GetFiles() {
      console.log("GetFiles: " + this.$parent.APIURL + "/files");
      this.toEdit = "";
      await axios
        .get(this.$parent.APIURL + "/files")
        .then((res) => {
          //console.log('Result: ' + JSON.stringify(res.data))
          //this.$toast.success("aktualisiert")
          this.files = res.data;
          //display first file per default
          this.curFile = this.files[this.files.length - 1].name;
        })
        .catch((error) => {
          console.log("error: " + error);
          this.$toast.error(error);
        });
    },
    OLDsubmitFile() {
      axios
        .post(
          this.$parent.APIURL + "/fileupload",
          this.currentUploadFile.files[0],
          {
            headers: {
              //"Content-Type": "multipart/form-data",
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(function () {
          console.log("SUCCESS!!");
        })
        .catch(function () {
          console.log("FAILURE!!");
        });
    },
    uploadFile() {
      this.selectedUploadFile = this.$refs.file.files[0];
      console.warn("File: " + this.selectedUploadFile);
    },
    submitFile() {
      const formData = new FormData();
      formData.append("file", this.selectedUploadFile);
      const headers = { "Content-Type": "multipart/form-data" };
      axios
        .post(this.$parent.APIURL + "/fileupload", formData, { headers })
        .then((res) => {
          //res.data.files; // binary representation of the file
          res.status; // HTTP status
          this.GetFiles();
          this.$toast.success("Upload OK");
        })
        .catch(function () {
          console.log("FAILURE!!");
        });
    },
  },
};
</script>
<style scoped>
.FileView {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  color: rgb(113, 133, 177);
  background-color: aliceblue;

  /* margin: 0 auto;
  overflow-y: auto;
  max-height: 40%;
    width: 60%;
  */
}

.pdfview {
  height: 700px;
  width: 100%;
  padding: 10px;
}
</style>