<script>
import ChatItem from "@Components/ChatItem.vue";
import {useChatStore} from "../../stores/chat.store.ts";
import NoChats from "../components/NoChats.vue";
import ChatViewer from "../components/ChatViewer.vue";

export default {
  name: 'ConsoleView',
  data: () => ({
    items: [
      {type: 'subheader', title: 'Chats'},

      {type: 'divider', inset: true},
      {type: 'divider', inset: true},
      {type: 'divider', inset: true},
    ]
  }),
  components: {ChatItem, NoChats, ChatViewer},
	setup() {
		const chatStore = useChatStore();

		return {
			chatStore
		}
	}
}
</script>

<template>
  <div class="ConsoleView">
    <v-navigation-drawer
        permanent
        width="300"
				elevation=2
    >
      <ul>
				<li v-for="chat in chatStore.chats" :key="chat._id"
						@click="chatStore.selectChat(chat._id)" :class="{selected: chat._id
						=== chatStore.actualChatId}">
					<div>
						<h3>{{chat.userPhone}}</h3>
						<span>{{chat.lastMessagePreview}}</span>
					</div>
				</li>
			</ul>
    </v-navigation-drawer>

		<div class="chat-wrapper">
			<div class="chat">
				<template v-if="chatStore.isEmpty">
					<NoChats />
				</template>

				<template v-else-if="chatStore.actualChatId !== undefined">
					<ChatViewer />
				</template>

				<template v-else>
				</template>
			</div>
		</div>

  </div>
</template>

<style>
.ConsoleView {
  display: flex;
  height: 100%;

  ul {
		li {
			padding: .25rem 1rem;
			cursor: pointer;

			&:hover {
				background-color: rgb(var(--v-theme-surface-variant), .06);
			}

			&.selected {
				background-color: rgb(var(--v-theme-surface-variant), .11);
			}

			& + & {
				border-top: rgb(var(--v-theme-outline)) 1px solid;
			}

			span {
				font-size: .8rem;
				margin-top: -.25rem;
			}
		}
	}

  .v-card {
    display: flex;
    gap: .5rem;

    &.selected {
      background-color: rgb(var(--v-theme-surface-variant));
    }
  }

	.chat-wrapper {

		flex: 1;
		display: flex;


		padding-left: 4px;
	}

  .chat {
	  flex: 1;
	  display: flex;

	  flex-direction: column;


	  box-shadow: var(--elevation2);

		overflow: hidden;

		position: relative;

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
  }
}
</style>