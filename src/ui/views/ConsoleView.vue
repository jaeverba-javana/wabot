<script>
import ChatItem from "@Components/ChatItem.vue";

export default {
  name: 'ConsoleView',
  data: () => ({
    chats: [
      {
        prependAvatar: '/img/chats/img.png',
        title: 'Javier Vergara',
        subtitle: `Vamos a darle caña`,
        messages: [
          {
            from: "d",
            message: 'Hola'
          }, {
            from: "c",
            message: 'Qué tal, ¿Cómo has estado?'
          }, {
            from: "d",
            message: 'Muy bien, gracias. ¿y tú?'
          }
        ]
      },
      {
        prependAvatar: '/img/chats/img_1.png',
        title: 'Daniela León',
        subtitle: `Me gustas`,
      },
      {
        prependAvatar: '/img/chats/img_4.png',
        title: 'Juanito Juarez',
        subtitle: `Oye, sabes dónde está mi mamá?`,
      },
      {
        prependAvatar: '/img/chats/img_3.png',
        title: 'Jaris Salom',
        subtitle: `Tráeme comida, que tengo hambre`,
      },
    ],
    items: [
      {type: 'subheader', title: 'Chats'},

      {type: 'divider', inset: true},
      {type: 'divider', inset: true},
      {type: 'divider', inset: true},
    ],
    selected: undefined
  }),
  components: {ChatItem}
}
</script>

<template>
  <div class="ConsoleView">
    <v-navigation-drawer
        permanent
        width="300"
    >
      <v-list
          lines="three"
      >
        <v-list-item v-for="chat in chats" lines="three">
          <v-card @click="selected = chat" :class="{selected: selected && selected.title === chat.title}">
            <v-avatar :image="chat.prependAvatar"/>
            <div>
              <v-list-item-title>{{ chat.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ chat.subtitle }}</v-list-item-subtitle>

            </div>
          </v-card>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <div v-if="selected" class="chat">
      <div class="top">
        <v-avatar :image="selected.prependAvatar"/>
        <div class="data">
          <h2>{{selected.title}}</h2>
        </div>
      </div>

      <div class="messages-container">
        <div class="messages">
          <div v-for="message in selected.messages" :class="message.from">
            <v-card>
              <p>{{message.message}}</p>

            </v-card>
          </div>
        </div>
      </div>

      <div class="editor">

      </div>
    </div>
  </div>
</template>

<style>
.ConsoleView {
  display: flex;
  height: 100%;

  .v-list-item {
    cursor: pointer;
    padding: 0;
  }

  .v-card {
    display: flex;
    gap: .5rem;

    &.selected {
      background-color: rgb(var(--v-theme-surface-variant));
    }
  }

  .chat {
    flex: 1;

    display: flex;
    flex-direction: column;

    .top {
      border-bottom: rgb(var(--v-theme-outline)) 1px solid;
      height: 60px;
      padding: 10px;
      display: flex;
      gap: .5rem;

      .data {
        h2 {
          font-size: 1rem;
          font-weight: 500;
        }
      }
    }

    .messages-container {
      flex: 1;
      position: relative;

      .messages {
        width: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;

        > div {
          .v-card {
            padding: .5rem;
          }
          &.d {
            justify-items: end;
          }
          &.c {
            justify-items: start;
            .v-card {
              background-color: lightseagreen;
              color: white;
            }
          }
          padding: .5rem;
        }
      }
    }

    .editor {
      border-top: rgb(var(--v-theme-outline)) 1px solid;
      height: 40px;
    }
  }
}
</style>