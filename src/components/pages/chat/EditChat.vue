<template>
  <div class="chat__new">
    <span class="chat__headline">{{ activeChat.roomName }}</span>
    <div class="people__wrapper">
      <div class="people__person-picker" v-if="!secondStep">
        <div class="people__selected">
          <span v-show="selectedPeople.length" class="people__selected-count"
            >Текущие участники: {{ selectedPeople.length }}</span
          >
          <div
            class="people__selected-item"
            v-for="(person, i) in selectedPeople"
            :key="i"
            @click="removeUser(person)"
          >
            <SimplePersonCard
              :avatar="{
                alt: person.FULL_NAME,
                src: person.USER_PHOTO,
              }"
              :fullName="person.FULL_NAME"
              :isMiniSize="true"
              :vacation="person.VACATION"
              :fired="person.FIRED"
            />
            <UserIcons :iconName="'X'" class="chat__search-icon" />
          </div>
        </div>
        <Input
          :input="{
            type: 'text',
            placeholder: 'Поиск',
          }"
          @onChange="searchPeople"
          ref="searchInput"
        />
        <div class="people">
          <div
            class="people__item"
            v-for="(person, i) in searchResult"
            :key="i"
            @click="addUser(person)"
          >
            <SimplePersonCard
              :avatar="{
                alt: person.FULL_NAME,
                src: person.USER_PHOTO,
              }"
              :fullName="person.FULL_NAME"
              :profession="person.UF_WORK_POSITION"
              :vacation="person.VACATION"
              v-if="includesUser(person.ID)"
              class="people__card"
            />
          </div>
          <div v-intersection="upload" v-if="!isEnd"></div>
          <span class="chat__search-error" v-show="searchError">{{
            searchError
          }}</span>
        </div>
      </div>
    </div>
    <div class="chat__actions">
      <button class="secondary-btn" type="reset" @click="reset">Отмена</button>
    </div>
    <AppModal
      v-if="isVisible"
      @onClose="isVisible = !isVisible"
      :maxWidth="'600'"
      >{{ modalContent }}</AppModal
    >
  </div>
</template>
<script>
import Input from "@/components/UI/inputTemplate.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import AppModal from "@/components/modals/AppModal.vue";
import axios from "axios";

export default {
  props: {
    activeChat: null,
  },
  data() {
    return {
      groupName: "",
      groupAvatar: undefined,
      groupIds: [],
      selectedPeople: [],
      searchResult: [],
      searchText: "",
      searchCount: 0,
      searchError: "",
      isEnd: true,
      secondStep: false,
      isVisible: false,
      modalContent: "",
    };
  },
  components: {
    Input,
    SimplePersonCard,
    AppModal,
  },
  computed: {
    isFormReady() {
      // if (this.groupName.length === 0) return false;
      // if (this.selectedPeople.length === 0) return false;

      return true;
    },
  },
  methods: {
    includesUser(ID) {
      if (localStorage.getItem("ID") === ID || this.groupIds.includes(ID))
        return false;
      return true;
    },
    searchPeople(data) {
      this.searchText = data.data.newValue;
      if (data.data.newValue.length > 2) {
        axios
          .get(
            "/mobileapp/api/user/findByFIO/?count=20&startFrom=0&query=" +
              data.data.newValue
          )
          .then((response) => {
            this.searchCount = 20;
            if (data.data.newValue.length > 2) {
              this.searchResult = response.data.employee;
            }
            this.isEnd = false;
            if (response.data.employee.length === 0) {
              this.searchError = "Ничего не найдено";
            } else {
              this.searchError = "";
            }
          });
      } else {
        this.searchResult = [];
      }
    },
    upload() {
      axios
        .get(
          "/mobileapp/api/user/findByFIO/?count=20&startFrom=" +
            this.searchCount +
            "&query=" +
            this.searchText
        )
        .then((response) => {
          this.searchCount += 20;
          this.searchResult = [...this.searchResult, ...response.data.employee];
          this.isEnd = response.data.end;
        });
    },
    addUser(user) {
      axios
        .post("/mobileapp/api/chat/member/add", {
          chatId: this.activeChat.roomId,
          memberId: user.ID,
        })
        .then(() => {
          this.selectedPeople.push(user);
          this.groupIds.push(user.ID);
          this.searchResult = [];
          this.searchText = "";
          this.$refs.searchInput.$children[0].newValue = "";

          this.isVisible = true;
          this.modalContent = "Пользователь " + user.FULL_NAME + " добавлен";
          setTimeout(() => {
            this.isVisible = false;
          }, 1000);
        });
    },
    removeUser(user) {
      axios
        .post("/mobileapp/api/chat/member/delete", {
          chatId: this.activeChat.roomId,
          memberId: user.ID,
        })
        .then(() => {
          let index = this.groupIds.indexOf(user.ID);
          this.selectedPeople.splice(index, 1);
          this.groupIds.splice(index, 1);

          this.isVisible = true;
          this.modalContent = "Пользователь " + user.FULL_NAME + " удален";
          setTimeout(() => {
            this.isVisible = false;
          }, 1000);
        });
    },
    reset() {
      this.$emit("onClose");
    },
  },
  mounted() {
    // добавялем пользователей
    for (let i in this.activeChat.users) {
      let user = this.activeChat.users[i];
      // console.log(user);
      this.selectedPeople.push({
        FULL_NAME: user.userName,
        ID: user.id,
        USER_PHOTO: user.avatar,
        FIRED: user.FIRED,
        VACATION: user.VACATION,
      });
      this.groupIds.push(user.id);
    }
  },
};
</script>

<style lang="scss" scoped>
.app-avatar {
  max-height: 320px;
}
.chat {
  &__new {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 16px 20px;
  }
  &__avatar {
    height: 320px;
  }
  &__headline {
    margin-bottom: 18px;
    @extend .subtitle-1;
  }
  &__search {
    &-error {
      margin-top: 12px;
      display: block;
      @extend .subtitle-1;
    }
  }
  &__actions {
    display: flex;
    align-items: flex-start;
    button + button {
      margin-left: 16px;
      margin-bottom: 8px;
    }
  }
  &__groupname {
    margin: 20px 16px;
  }
}
.people {
  max-height: 400px;
  overflow-y: auto;
  &__card {
    padding: 10px 4px;
    border-bottom: 2px solid var(--gray200);
    cursor: pointer;
  }
  &__wrapper {
    flex: 1;
    height: 80%;
  }
  &__person-picker {
    flex: 1;
    height: 80%;
  }
  &__selected {
    margin-bottom: 8px;
    max-height: calc(50%);
    overflow-y: auto;
    margin-left: -8px;
    padding-left: 8px;
    &-item {
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      transition: 0.3s background ease;
      margin-bottom: var(--v-rhythm-1);
      .user-icons {
        opacity: 0;
        transition: 0.3s opacity ease;
        fill: var(--red900);
      }
      &:hover {
        background-color: var(--gray200);
        .user-icons {
          opacity: 1;
        }
      }
    }
    &-count {
      margin-bottom: 14px;
      display: block;
      @extend .subtitle-1;
    }
  }
}
</style>