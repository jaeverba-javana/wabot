<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "AuthLayout"
})
</script>

<template>
  <v-main class="AuthLayout">
    <v-card rounded="lg">
      <div class="authWrapper">
        <div class="top">
          <RouterLink class="container elevation-24" replace to="/auth/login">
            <div class="login elevation-5">
              <h2>Iniciar sesi&oacute;n</h2>
            </div>
          </RouterLink>

          <RouterLink class="container elevation-24" replace to="/auth/signup">
            <div class="signup">
              <h2>Registrarse</h2>
            </div>
          </RouterLink>

        </div>

        <div class="body elevation-24">
          <router-view/>
        </div>
      </div>
    </v-card>
  </v-main>
</template>

<style scoped>
.AuthLayout {
height: 100dvh;

  justify-items: start;
  align-content: center;

  background-image: url("/bot.jpg");
  background-position: center;
  background-size: cover;
}

.v-card {
  background-color: rgba(var(--v-theme-primary), .7);

  margin-left: 10%;

  .authWrapper {
    interpolate-size: allow-keywords;
    width: 25em;
    /*height: 30em;*/
    display: flex;
    flex-direction: column;
    height: max-content;
    transition-duration: .2s;
    transition-property: height;

  }
  .top {
    display: flex;
    overflow: hidden;

    /*background-color: rgb(var(--v-theme-primary));*/
    color: rgba(var(--v-theme-onPrimary), .7);

    > * {
      flex: 1;

      > * {

        justify-items: center;
        padding: .5em 0;

      }

      &:not(.router-link-active) {
        /*background-color: rgb(var(--v-theme-surface));*/
        /*border-radius: .5em .5em 0 0;*/

        > * {
        }
      }

      &.router-link-active {
        z-index: 1;

        > * {
          background-color: rgb(var(--v-theme-surface));
          color: rgb(var(--v-theme-onSurface));
          border-bottom-left-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }
      }
    }
  }

  .body {
    background-color: rgb(var(--v-theme-surface));
    flex: 1;
  }
}
</style>
