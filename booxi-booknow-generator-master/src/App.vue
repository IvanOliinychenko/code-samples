<template>
  <div id="app">
    <div class="dashboard">
      <div class="control-buttons">
        <div>
          <button class="bx-btn bx-btn-green control-button" type="button" @click="updateButton">Run</button>
          <button class="bx-btn bx-btn-white control-button" type="button" @click="reset">Reset</button>
        </div>
        <div>
          <button class="bx-btn bx-btn-white control-button" type="button" @click="setAdvanced">{{showAdvanced ? 'Hide' : 'Show'}} advanced</button>
        </div>
      </div>
      <div id="sandbox" v-show="!codeHasChanges"></div>
      <div class="tabs">
        <button class="tab bx-btn" :class="{'active' : activeTab === ''}" @click="activeTab = ''">Global config</button>
        <button class="tab bx-btn" :class="{'active' : activeTab === 'createButtons'}" @click="activeTab = 'createButtons'">Create buttons</button>
        <button class="tab bx-btn" :class="{'active' : activeTab === 'createProfileButtons'}" v-show="showAdvanced" @click="activeTab = 'createProfileButtons'">Create profile buttons</button>
        <button class="tab bx-btn" :class="{'active' : activeTab === 'openWithJs'}" v-show="showAdvanced" @click="activeTab = 'openWithJs'">Open with js</button>
      </div>
      <div class="tabs-content">
        <div v-show="activeTab === 'createButtons' || activeTab === 'createProfileButtons' || activeTab === 'openWithJs'">
          <form @submit.stop.prevent="submitButton" autocomplete="off">
            <div class="action-buttons">
              <button class="bx-btn bx-btn-white action-button" type="submit">Add new</button>
              <button class="bx-btn bx-btn-white action-button" type="button" v-if="activeTab === 'createButtons'" v-for="(btn, key) in createdBookingButtons" @click="removeBookingButtons(key)" :key="key">Delete: {{btn.buttonId}}</button>
              <button class="bx-btn bx-btn-white action-button" type="button" v-if="activeTab === 'createProfileButtons'" v-for="(btn, key) in createdBookingProfileButtons" @click="removeBookingProfileButtons(key)" :key="key">Delete: {{btn.buttonId}}</button>
              <button class="bx-btn bx-btn-white action-button" type="button" v-if="activeTab === 'openWithJs'" v-for="(btn, key) in createdLaunchWithJs" @click="removeLaunchWithJs(key)" :key="key">Delete: {{btn.profileId}}</button>
            </div>
            <div class="bx-input-container" v-if="activeTab === 'createProfileButtons' || activeTab === 'openWithJs'">
              <span class="bx-input-label">Profile id<span v-show="activeTab === 'createProfileButtons'">*</span>:</span>
              <input class="bx-input" :required="activeTab === 'createProfileButtons'" type="text" id="buttonProfileId" name="buttonProfileId" v-model="buttonProfileId" />
              <div class="bx-input-action bx-icon bx-icon-close"></div>
            </div>
            <div class="bx-input-container" v-if="activeTab === 'createProfileButtons' || activeTab === 'createButtons'">
              <span class="bx-input-label">Button id*:</span>
              <input class="bx-input" required type="text" id="createButtonId" name="createButtonId" v-model="createButtonId" />
              <div class="bx-input-action bx-icon bx-icon-close"></div>
            </div>
            <config-parser :model="buttonConfigOptions | advanced(showAdvanced)"></config-parser>
          </form>
        </div>
        <div v-show="!activeTab">
          <config-parser @configInput="bookNowConfigurator.updateCode()" :model="globalConfigOptions | advanced(showAdvanced)"></config-parser>
        </div>
      </div>
    </div>
    <code-viewer class="code-viewer" :model="generatedCode"></code-viewer>
  </div>
</template>

<script>
import ConfigParser from './components/ConfigParser'
import CodeViewer from './components/CodeViewer'
import BookNowConfigurator from './services/bookNowConfigurator'

export default {
  name: 'App',
  components: {
    'config-parser': ConfigParser,
    'code-viewer': CodeViewer
  },
  data () {
    return {
      globalConfigOptions: {},
      buttonConfigOptions: {},
      bookNowConfigurator: {},
      generatedCode: '',
      activeTab: '',
      createButtonId: '',
      buttonProfileId: ''
    }
  },
  filters: {
    advanced: function (obj, showAdvanced) {
      if (showAdvanced) return obj
      let newObj = {}
      for (let i in obj) {
        if (!obj[i].advanced) {
          newObj[i] = obj[i]
        }
      }
      return newObj
    }
  },
  computed: {
    createdBookingButtons: function () {
      return this.bookNowConfigurator.createdBookingButtons
    },
    createdBookingProfileButtons: function () {
      return this.bookNowConfigurator.createdBookingProfileButtons
    },
    createdLaunchWithJs: function () {
      return this.bookNowConfigurator.createdLaunchWithJs
    },
    showAdvanced: function () {
      return this.bookNowConfigurator.advanced
    },
    codeHasChanges: function () {
      return this.bookNowConfigurator.hasChanges
    }
  },
  mounted () {
    this.bookNowConfigurator = new BookNowConfigurator(this.$route.query)
    this.bookNowConfigurator.onUpdateCode = (code, query) => {
      if (code) this.generatedCode = code
      if (query) this.$router.push({query: query})
      this.globalConfigOptions = this.bookNowConfigurator.globalConfigOptions
      this.buttonConfigOptions = this.bookNowConfigurator.buttonConfigOptions
    }
    this.bookNowConfigurator.updateCode()
  },
  methods: {
    setAdvanced: function () {
      this.bookNowConfigurator.setAdvanced(!this.showAdvanced)
    },
    reset: function () {
      this.createButtonId = ''
      this.buttonProfileId = ''
      this.bookNowConfigurator.reset()
    },
    submitButton: function () {
      switch (this.activeTab) {
        case 'createButtons':
          this.addButton({buttonId: this.createButtonId, config: this.buttonConfigOptions})
          break
        case 'createProfileButtons':
          this.addProfileButton({profileId: this.buttonProfileId, buttonId: this.createButtonId, config: this.buttonConfigOptions})
          break
        case 'openWithJs':
          this.addOpenWithJs({profileId: this.buttonProfileId, buttonId: this.createButtonId, config: this.buttonConfigOptions})
          break
      }
    },
    updateButton: function () {
      this.bookNowConfigurator.update()
    },
    addButton: function (config) {
      if (new RegExp(`id="${config.buttonId}"`).test(this.generatedCode)) {
        alert('Button with this buttonId already exists')
        return
      }
      this.bookNowConfigurator.createBookingButton(config)
      this.createButtonId = ''
    },
    removeBookingButtons: function (index) {
      this.bookNowConfigurator.removeBookingButtons(index)
    },
    removeBookingProfileButtons: function (index) {
      this.bookNowConfigurator.removeBookingProfileButtons(index)
    },
    removeLaunchWithJs: function (index) {
      this.bookNowConfigurator.removeLaunchWithJs(index)
    },
    addProfileButton: function (config) {
      if (new RegExp(`id="${config.buttonId}"`).test(this.generatedCode)) {
        alert('Button with this buttonId already exists')
        return
      }
      if (new RegExp(`id="${config.profileId}"`).test(this.generatedCode)) {
        alert('Profile with this profile id already exists')
        return
      }
      this.bookNowConfigurator.createBookingProfileButton(config)
      this.createButtonId = ''
      this.buttonProfileId = ''
    },
    addOpenWithJs: function (config) {
      if (config.profileId && new RegExp(`id="${config.profileId}"`).test(this.generatedCode)) {
        alert('Profile with this profile id already exists')
        return
      }
      this.bookNowConfigurator.launchBookNowWithJs(config)
      this.buttonProfileId = ''
    }
  }
}
</script>

<style src="./scss/main.scss" lang="scss"></style>
<style>
  #sandbox > div{
    display: inline-block;
  }
  #sandbox > div + div {
    margin-left: 10px;
  }
</style>

<style lang="scss" scoped>
  @import "./scss/variables";

  #app {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    pre.code-viewer.language-markup {
      margin: 0;
    }
    .code-viewer {
      overflow: auto;
      width: 60%;
      flex-grow: 1;
    }
    .dashboard {
      padding: 15px;
      width: 40%;
      max-width: 600px;
      min-width: 300px;
      flex-grow: 1;
      overflow-y: auto;
      .control-buttons {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding-bottom: 10px;
        .control-button {
          margin: 5px;
        }

      }
      #sandbox {
        padding: 10px 0;
      }
      .action-buttons {
        padding-bottom: 10px;
        .action-button {
          display: inline-block;
          margin: 5px;
        }
      }
      .tabs-content {
        margin-top: -1px;
        border: 1px solid #ccc;
        padding: 10px;
      }
      .tabs {
        display: flex;
        overflow-x: auto;
        .tab {
          border-radius: 0;
          cursor: pointer;
          background-color: $bx-white;
          + .tab {
            border-left: 0;
          }
          &.active {
            border-bottom: 0;
            background-color: $bx-light-grey;
          }
        }
      }
    }
  }
</style>
