<template>
  <v-layout class="d-flex flex-column">
    <v-app-bar class="px-7">
      <v-row justify="start" align="center">
        <div>
          <v-img src="/logo-minecraft.svg" width="150"></v-img>
        </div>
        <h3 class="ml-5">Server Helper</h3>
      </v-row>
    </v-app-bar>
    <v-container class="container">
      <h1 class="mb-3">Open Server</h1>
      <v-card rounded class="card">
        <v-card-item>
          <v-text-field
            class="mt-3"
            variant="outlined"
            label="server.jar Folder Path"
            bg-color="grey"
            v-model="filePath"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            label="Max Memory"
            bg-color="grey"
            v-model="maxMem"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            label="Min Memory"
            bg-color="grey"
            v-model="minMem"
          ></v-text-field>
          <h3 class="mb-3 mt-3">Linux</h3>
          <v-card
            variant="outlined"
            class="py-2 px-3"
            style="border: 2px solid white"
          >
            <v-card-item class="text-caption pa-1">
              <pre>{{
                getShellScriptContent("linux")
                  ? getShellScriptContent("linux")
                  : "Script will be shown here"
              }}</pre>
            </v-card-item>
          </v-card>
          <v-dialog width="400" close-on-back>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="mt-3" color="secondary"
                >download script.sh</v-btn
              >
            </template>
            <template v-slot:default="{ isActive }">
              <v-card
                :title="validate() ? 'Check Download Path' : 'Validation Check'"
              >
                <v-card-text v-if="validate()">
                  Download this file at your
                  <b class="text-primary">Download</b> folder.
                </v-card-text>
                <v-card-text v-else>
                  Check if <b class="text-primary">all forms are written.</b>
                </v-card-text>
                <v-card-actions class="px-5 pb-3">
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="
                      validate(isActive)
                        ? downloadShellScript(isActive, 'linux')
                        : (alert = false)
                    "
                    color="secondary"
                  >
                    {{ validate() ? "checked" : "close" }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <h3 class="mb-3 mt-7">Windows</h3>
          <v-card
            variant="outlined"
            class="py-2 px-3"
            style="border: 2px solid white"
          >
            <v-card-item class="text-caption pa-1">
              <pre>{{
                getShellScriptContent("windows")
                  ? getShellScriptContent("windows")
                  : "Script will be shown here"
              }}</pre>
            </v-card-item>
          </v-card>
          <v-dialog width="400" close-on-back>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="mt-3" color="secondary"
                >download script.sh</v-btn
              >
            </template>
            <template v-slot:default="{ isActive }">
              <v-card
                :title="validate() ? 'Check Download Path' : 'Validation Check'"
              >
                <v-card-text v-if="validate()">
                  Download this file at your
                  <b class="text-primary">Download</b> folder.
                </v-card-text>
                <v-card-text v-else>
                  Check if <b class="text-primary">all forms are written.</b>
                </v-card-text>
                <v-card-actions class="px-5 pb-3">
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="
                      validate(isActive)
                        ? downloadShellScript(isActive, 'windows')
                        : (alert = false)
                    "
                    color="secondary"
                  >
                    {{ validate() ? "checked" : "close" }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-card-item>
        <v-card-item>
          <h2 class="mb-3 mt-5">Run script</h2>
          Open command line tool with
          <b class="text-primary">administrator</b> and run below command:
          <h3 class="mb-3 mt-5">Linux</h3>
          <v-card
            variant="outlined"
            class="py-2 px-3 mt-3"
            style="border: 2px solid white"
          >
            <v-card-item class="text-caption pa-1">
              <pre>cd ~/Downloads<br />. ./script.sh</pre>
            </v-card-item>
          </v-card>
          <h3 class="mb-3 mt-5">Windows</h3>
          <v-card
            variant="outlined"
            class="py-2 px-3 mt-3"
            style="border: 2px solid white"
          >
            <v-card-item class="text-caption pa-1">
              <pre>Set-ExecutionPolicy RemoteSigned<br />cd ~/Downloads<br />./script.ps1</pre>
            </v-card-item>
          </v-card>
        </v-card-item>
      </v-card>
      <h1 class="mb-3">Check Port Forwarding</h1>
      <v-card rounded class="card">
        <v-card-item>
          <p>
            Your Public IP - <b class="text-primary">{{ publicIP }}</b>
          </p>
          <p class="py-5"></p>
          <v-text-field
            label="Custom IP"
            variant="outlined"
            v-model="customIP"
            bg-color="grey"
          ></v-text-field>
          <v-text-field
            label="Custom Port"
            variant="outlined"
            v-model="customPort"
            bg-color="grey"
          ></v-text-field>
          <v-btn class="mb-3 mr-5" @click="testPortForwarding" color="secondary"
            >Check Port Forwarding</v-btn
          >
          <span :class="connection == 204 ? 'text-success' : 'text-error'">
            {{ connection == 204 ? "Connected" : "Not Connected" }}
          </span>
        </v-card-item>
      </v-card>
    </v-container>
    <v-footer class="d-flex justify-end text-body-2"> @opal2020 </v-footer>
  </v-layout>
  <v-overlay v-model="isLoading" class="d-flex justify-center align-center">
    <v-progress-circular indeterminate color="white" size="60" width="10">
    </v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  methods: {
    async getPublicIP() {
      try {
        const response = await (
          await fetch("http://localhost:3000/api/getip")
        ).text();
        this.publicIP = response;
        this.customIP = response;
      } catch (e) {
        console.log(e);
      }
    },
    async testPortForwarding() {
      this.isLoading = true;
      try {
        const response = await fetch(
          `http://localhost:3000/api/portcheck?ip=${this.customIP}&port=${this.customPort}`
        );
        this.connection = response.status;
      } catch (e) {
        console.log(e);
      }
      this.isLoading = false;
    },
    getShellScriptContent(os) {
      let code;
      switch (os) {
        case "windows":
          code = `Set-Location -Path ${this.filePath}\njava -Xmx${this.maxMem} -Xms${this.minMem} -jar server.jar nogui`;
          break;
        case "linux":
          code = `#!/bin/bash\ncd ${this.filePath.replaceAll(
            "\\",
            "/"
          )}\njava -Xmx${this.maxMem} -Xms${this.minMem} -jar server.jar nogui`;
          break;
        default:
          "";
      }
      return code;
    },
    downloadShellScript(isActive, os) {
      this.isLoading = true;
      isActive.value = false;
      const blob = new Blob([this.getShellScriptContent(os)], {
        type: "text/plain",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "script." + (os == "windows" ? "ps1" : "sh");
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      this.isLoading = false;
    },
    validate(isActive) {
      if (this.filePath == "" || this.minMem == "" || this.maxMem == "") {
        if (isActive) {
          isActive.value = false;
        }
        return false;
      }
      if (isActive) {
        isActive.value = false;
      }
      return true;
    },
  },
  data() {
    return {
      publicIP: "",
      customIP: "",
      customPort: 25565,
      connection: null,
      isLoading: true,
      filePath: "",
      maxMem: "2G",
      minMem: "2G",
      showDialog: false,
    };
  },
  created() {
    this.getPublicIP();
    this.testPortForwarding();
    this.isLoading = false;
  },
};
</script>

<style scoped>
.container {
  /* height: calc(100vh - 40px); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 800px;
  min-width: 500px;
  padding: 100px 50px;
}

.card {
  margin-bottom: 42px;
  padding-bottom: 20px;
}

.card .v-card-item {
  padding: 20px 24px;
}
</style>
