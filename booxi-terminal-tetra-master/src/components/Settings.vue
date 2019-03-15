<template>
  <div>
    <div id="settings">
      <div class="section">
        <div class="section-head normal">{{$t("settings.languages")}}</div>
        <div class="section-body normal bold">
          <div class="section-body-item" @mousedown="setLanguage(lang.shortCode)" :class="{ active: $i18n.locale === lang.shortCode}" v-for="(lang, key) in languages" :key="key">
            <div class="text">{{lang.name}}</div>
            <div class="bx-icon bx-icon-check-blue" v-if="$i18n.locale === lang.shortCode"></div>
          </div>
        </div>
      </div>
      <div class="sign-out">
        <button class="bx-btn upper bold bx-btn-white" @mousedown="logout">{{$t("settings.signOut")}}</button>
      </div>
      <div class="small center hint">{{$t("settings.signOutInstractions")}}</div>
    </div>
  </div>
</template>

<script>
import cache from '../managers/cacheManager'
import {router} from '../router/index'

export default {
  name: 'Settings',
  computed: {
    languages () {
      return Object.keys(this.$i18n.messages).map((lang, index) => {
        return {shortCode: lang, name: this.$i18n.messages[lang].language}
      })
    }
  },
  methods: {
    logout () {
      cache.clearCache()
      router.push({
        name: 'intro'
      })
    },
    setLanguage (lang) {
      cache.setLanguage(lang)
      this.$i18n.locale = lang
    }
  }
}
</script>

<style scoped lang="scss">
@import "../scss/variables";

#settings {
  .section {
    border-bottom: 1px solid $bx-border;
    .section-head {
      color: $bx-muted;
      padding: 15px 30px;
    }
    .section-body {
      background-color: $bx-white;

      .section-body-item {
        padding: 15px 30px;
        border-top: 1px solid $bx-border;
        position: relative;
        display: flex;
        align-items: center;
        &.active {
          color: $bx-blue;
          background-color: rgba($bx-blue, 0.15);
          &::before {
            content: '';
            position: absolute;
            top: -1px;
            left: 0;
            width: 5px;
            height: calc(100% + 2px);
            background-color: $bx-blue;
          }
        }
        + .section-body-item {
          border-top: 1px dashed $bx-border;
        }
        .text {
          flex-grow: 1;
        }
        .bx-icon {
          position: absolute;
          right: 10px;
        }
      }
    }
  }
  .sign-out {
    padding: 15px 30px 0 30px;
  }
  .hint {
    padding: 10px 15px 30px 15px;
    color: $bx-muted;
  }
  @media screen and (min-width: $bx-wide-screen) {
    .hint {
      padding: 5px 15px;
      color: $bx-muted;
    }
  }
}
</style>
