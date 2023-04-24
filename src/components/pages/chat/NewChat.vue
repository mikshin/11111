<template>
  <div class="chat__new" :class="{ loading: isLoading }">
    <span class="chat__headline"
      >Выберите пользователя для личного общения или нескольких для группового
      чата</span
    >
    <div class="people__wrapper">
      <div class="people__person-picker" v-show="!secondStep">
        <div class="people__selected">
          <span v-show="selectedPeople.length" class="people__selected-count"
            >Выбрано: {{ selectedPeople.length }}</span
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
            />
            <UserIcons :iconName="'X'" class="chat__search-icon" />
          </div>
        </div>
        <Input
          :input="{
            type: 'text',
            placeholder: 'Поиск',
            name: 'searchPeople',
          }"
          @onChange="searchPeople"
          ref="searchInput"
        />
        <div class="people" v-show="searchText.length > 2">
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
      <div class="chat__media-picker" v-show="secondStep">
        <div class="chat__avatar">
          <AppAvatar
            @onLoad="changeAvatar"
            src="../img/person/driller/defaultChatAvatar.svg"
          />
        </div>
        <Input
          class="chat__groupname"
          :input="{
            type: 'text',
            placeholder: 'Название группы',
            name: 'groupname',
          }"
          @onChange="changeGroupName"
        />
      </div>
    </div>
    <div class="chat__actions">
      <button
        class="primary-btn"
        type="submit"
        :disabled="selectedPeople.length === 0"
        v-if="selectedPeople.length <= 1"
        @click="createPrivateChat"
      >
        Создать чат</button
      ><button
        class="primary-btn"
        type="submit"
        :disabled="!isFormReady"
        @click="createGroupChat"
        v-else-if="selectedPeople.length > 1"
      >
        {{ this.secondStep ? "Создать группу" : "Далее" }}
      </button>
      <button class="secondary-btn" type="reset" @click="reset">Отмена</button>
    </div>
  </div>
</template>
<script>
import AppAvatar from "@/components/UI/AppAvatar.vue";
import Input from "@/components/UI/inputTemplate.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import axios from "axios";

export default {
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
      isLoading: false,
    };
  },
  components: {
    Input,
    SimplePersonCard,
    AppAvatar,
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
      if (data.data.newValue.length > 2) {
        this.searchText = data.data.newValue;
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
      this.selectedPeople.push(user);
      this.groupIds.push(user.ID);
      this.searchResult = [];
      this.searchText = "";
      this.$refs.searchInput.$children[0].newValue = "";
    },
    removeUser(user) {
      let index = this.groupIds.indexOf(user.ID);
      this.selectedPeople.splice(index, 1);
      this.groupIds.splice(index, 1);
    },
    changeGroupName(data) {
      this.groupName = data.data.newValue;
    },
    changeAvatar(data) {
      this.groupAvatar = data.data;
    },
    createPrivateChat() {
      this.isLoading = true;
      let formData = new FormData();

      formData.append("type", "P");
      formData.append("members[]", this.groupIds);
      formData.append("name", this.selectedPeople[0].FULL_NAME);

      axios
        .post("/mobileapp/api/chat/add", formData)
        .then((response) => {
          this.$emit("onClose", response.data.chatId);
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.$emit("onClose", error.response.data.errors.chatId);
          }
        });
    },
    createGroupChat() {
      if (!this.secondStep) {
        this.secondStep = true;
        this;
      } else {
        let formData = new FormData();

        formData.append("type", "G");

        // formData.append("members[]", this.groupIds);
        // console.log(this.groupName);
        // if (this.groupName === undefined) {
        //   console.log(this.groupIds);
        // }
        formData.append(
          "name",
          this.groupName === undefined ? "" : this.groupName
        );
        formData.append("image", this.groupAvatar);
        // console.log(this.groupIds);
        for (let i = 0; i < this.groupIds.length; i++) {
          formData.append("members[]", this.groupIds[i]);
        }
        axios.post("/mobileapp/api/chat/add", formData).then((response) => {
          this.$emit("onClose", response.data.chatId);
        });
      }
    },
    reset() {
      this.$emit("onClose");
    },
  },
};
</script>

<style lang="scss" scoped>
.app-avatar {
  height: 320px;
  max-width: 400px;
  margin: 0 auto;
  @include phones {
    height: 200px;
    max-width: 200px;
  }
}
.chat {
  &__new {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 16px 20px;
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
  padding-left: 4px;
  padding-top: 8px;
  &__item {
    padding-top: 4px;
    padding-left: 4px;
    margin-top: -4px;
    margin-left: -4px;
  }
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
    padding-top: 4px;
    padding-left: 4px;
    margin-top: -4px;
    margin-left: -4px;

    &-item {
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      transition: 0.3s background ease;
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