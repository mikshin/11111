<template>
  <div class="input-search-persons">
    <!-- !Имя класс используется в checkClickZone -->
    <div
      class="input-search-persons__input-wrapper"
      v-click-outside="clickOutside"
    >
      <InputLabelWrapper
        :input="input"
        :isValid="isValid"
        class="input-search-persons__input-label"
      >
        <input
          class="input-search-persons__input"
          placeholder=" "
          :name="input.name"
          :required="false"
          :disabled="isDisabled"
          type="search"
          v-model="searchValue"
          :autocomplete="input.autocomplete"
          @focus="openPeopleList"
          @input="openPeopleList"
        />
        <UserIcons
          class="input-search-persons__input-icon"
          :iconName="'search'"
        />
        <InputPlaceholder
          class="input-search-persons__input-placeholder"
          :input="input"
        />
        <InputErrors
          class="input-search-persons__input-errors"
          :errors="this.errors"
        />
      </InputLabelWrapper>

      <transition name="dropdown">
        <PeopleList
          class="input-search-persons__people-list"
          :class="{ loading: peopleListIsLoading }"
          :updataIsEnd="updataIsEnd"
          :peopleList="peopleList"
          v-if="peopleListIsOpen"
          @selectUser="addUser"
          @upload="updataUsers"
        />
      </transition>
    </div>
    <div
      class="input-search-persons__selected selected"
      v-if="this.newValue.length > 0"
    >
      <div class="selected__item" v-for="user in this.newValue" :key="user.ID">
        <SimplePersonCard
          class="selected__simple-person-card"
          :avatar="{
            alt: user.FULL_NAME,
            src: user.USER_PHOTO,
          }"
          :fullName="user.FULL_NAME"
          :profession="user.UF_WORK_POSITION"
          :link="true"
          :id="user.ID"
          :vacation="user.VACATION"
          :fired="user.FIRED"
        />
        <button class="selected__delete-btn" @click="deleteUser(user.ID)">
          <UserIcons class="selected__delete-btn-icon" :iconName="'X'" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PeopleList from "@/components/UI/PeopleList.vue";
import axios from "axios";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import InputLabelWrapper from "./assets/InputLabelWrapper.vue";
import InputErrors from "./assets/InputErrors.vue";
import InputPlaceholder from "./assets/InputPlaceholder.vue";
import { inputMixin } from "./assets/inputMixin";

export default {
  name: "InputSearchPersons",

  mixins: [inputMixin],

  components: {
    PeopleList,
    SimplePersonCard,
    InputLabelWrapper,
    InputErrors,
    InputPlaceholder,
  },

  props: {
    input: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      peopleListIsLoading: false,
      updataIsEnd: true,
      peopleList: [],
      peopleListIsOpen: false,
      searchValue: "",
      wait: true,
      newValue: this.input.defaultValue ? this.input.defaultValue : [],
      isClickedInto: false,
    };
  },

  computed: {
    isDisabled() {
      if (this.input.multiple != undefined) {
        if (this.input.multiple) {
          return false;
        } else if (this.newValue.length > 0) {
          return true;
        }
      }
      return false;
    },
  },

  methods: {
    // Нужно для того, что бы поиск не закрывался, когда пользователь выделил текс и отпустил кнопку мыши за пределами поля ввода
    checkClickZone(e) {
      if (e.target.closest(".input-search-persons__input-wrapper")) {
        this.isClickedInto = true;
      } else {
        this.isClickedInto = false;
      }
    },

    clickOutside() {
      if (!this.isClickedInto) {
        this.closePeopleList();
      }
    },

    openPeopleList() {
      this.peopleListIsOpen = true;
    },

    closePeopleList() {
      this.peopleListIsOpen = false;
    },

    addUser(user) {
      const findResult = this.newValue.findIndex((item) => item.ID === user.ID);
      if (findResult === -1) {
        if (!this.input.singleSelect) {
          this.newValue.push(user);
        } else {
          this.newValue = [user];
        }

        this.$emit("onAdd", { user });
      }
      this.closePeopleList();
    },

    deleteUser(id) {
      this.newValue = this.newValue.filter((item) => item.ID !== id);
      this.$emit("onDelete", { id });
    },

    async getUsers(startFrom = 0) {
      try {
        this.peopleListIsLoading = true;
        this.updataIsEnd = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/user/findByFIO/?count=10&startFrom=${startFrom}&query=${this.searchValue}`,
        });
        this.updataIsEnd = response.data.end;
        return response.data.employee;
      } catch (error) {
        this.peopleList = [];
      } finally {
        this.peopleListIsLoading = false;
      }
    },

    async fetchUsers() {
      this.peopleList = await this.getUsers();
    },

    async updataUsers() {
      const response = await this.getUsers(this.peopleList.length);
      this.peopleList = [...this.peopleList, ...response];
    },
  },

  watch: {
    peopleListIsOpen() {
      if (this.peopleListIsOpen && this.searchValue.length > 2) {
        this.fetchUsers();
      } else {
        this.peopleList = [];
      }
    },

    searchValue() {
      if (this.wait) {
        setTimeout(() => {
          if (this.searchValue.length > 2) {
            this.fetchUsers();
          } else {
            this.peopleList = [];
          }

          this.wait = true;
        }, 1500);
      }
      this.wait = false;
    },

    newValue() {
      this.validate();
    },
  },

  mounted() {
    window.addEventListener("mousedown", this.checkClickZone);
  },

  destroyed() {
    window.removeEventListener("mousedown", this.checkClickZone);
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/styles/inputTemplate.scss";

.input-search-persons {
  position: relative;

  &__input-wrapper {
    position: relative;
  }

  &__input {
    width: 100%;
    padding-right: 40px;
    border-radius: 0 !important;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__input-icon {
    position: absolute;
    top: 19px;
    right: 19px;

    width: 24px;
    height: 24px;

    fill: var(--gray500);
  }

  &__people-list {
    position: absolute;
    left: 2px;
    bottom: -4px;
    transform: translateY(100%);
    z-index: 10;

    width: calc(100% - 4px);
  }

  &__selected {
    margin-top: var(--v-rhythm-4);
  }
}

.selected {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-6);

  &__item {
    padding: var(--v-rhythm-2) 0;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--v-rhythm-2);

    @include transition();

    @include hover {
      background-color: var(--gray100);

      .selected__delete-btn-icon {
        opacity: 1;
      }
    }

    @include no-hover {
      background-color: var(--gray100);
    }
  }

  &__simple-person-card {
  }

  &__delete-btn {
    padding: 10px;

    flex-shrink: 0;
  }

  &__delete-btn-icon {
    width: 24px;
    height: 24px;

    fill: var(--red900);
    @include transition();
    opacity: 0;

    @include no-hover {
      opacity: 1;
    }
  }
}
</style>