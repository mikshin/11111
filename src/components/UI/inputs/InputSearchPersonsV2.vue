<template>
  <div class="input-search-persons">
    <!-- !Имя класс используется в checkClickZone -->
    <div class="input-search-persons__search" v-click-outside="clickOutside">
      <label class="input-search-persons__label">
        <input
          class="input-search-persons__input"
          :class="{
            'input-search-persons__input--disabled': input.disabled,
            'input-search-persons__input--error': errors.length > 0,
          }"
          :name="input.name"
          :required="input.required"
          :disabled="input.disabled"
          type="search"
          v-model="searchValue"
          :autocomplete="input.autocomplete ? input.autocomplete : 'off'"
          @focus="openPeopleList"
          @input="openPeopleList"
        />
        <UserIcons
          class="input-search-persons__input-icon"
          :iconName="'search'"
        />

        <div
          class="input-search-persons__placeholder placeholder"
          :class="{
            'placeholder--required': input.required,
            'placeholder--active': searchValue,
          }"
          v-if="input.placeholder"
        >
          {{ input.placeholder }}
        </div>
      </label>

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

    <InputErrors
      class="input-search-persons__input-errors"
      :errors="this.errors"
    />

    <div
      class="input-search-persons__selected selected"
      :class="{
        'selected--disabled': input.disabled,
      }"
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
          :isDisabled="input.disabled"
          :vacation="user.VACATION"
          :fired="user.FIRED"
        />
        <button
          class="selected__delete-btn"
          v-if="!input.disabled"
          @click="deleteUser(user.ID)"
        >
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
import InputErrors from "./assets/InputErrors.vue";

export default {
  name: "InputSearchPersonsV2",

  components: {
    PeopleList,
    SimplePersonCard,
    InputErrors,
  },

  props: {
    input: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      type: "search-persons",
      name: this.input.name,
      deleteName: this.input.deleteName,
      isValid: this.checkValid(),
      errors: [],
      peopleListIsLoading: false,
      updataIsEnd: true,
      peopleList: [],
      peopleListIsOpen: false,
      searchValue: "",
      wait: true,
      newValue:
        this.input.defaultValue && this.input.defaultValue.length > 0
          ? this.input.defaultValue
          : [],
      defaultValue: this.input.defaultValue ? this.input.defaultValue : [],
      deleteValue: [],
      addValue: [],
      isClickedInto: false,
    };
  },

  computed: {},

  methods: {
    // Нужно для того, что бы поиск не закрывался, когда пользователь выделил текс и отпустил кнопку мыши за пределами поля ввода
    checkClickZone(e) {
      if (e.target.closest(".input-search-persons__search")) {
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

    checkValid() {
      if (this.input.required) {
        if (this.input.defaultValue) {
          return this.input.defaultValue.length > 0 ? true : false;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },

    emitThisData() {
      this.$emit("getThisData", this.$data);
    },

    validate() {
      this.errors = [];
      if (this.input.required) {
        if (this.newValue.length === 0) {
          this.isValid = false;
          this.errors.push("Данное поле обязательно для заполнения");
          return;
        }
      }

      this.isValid = true;
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
        // Проверка на мультивыбор
        if (!this.input.multiple) {
          this.deleteValue =
            this.defaultValue.length > 0 ? [...this.defaultValue[0].ID] : [];
          this.addValue = [];
          this.newValue = [];
        }

        this.newValue = [...this.newValue, user];

        // Если этого пользователя не было в дефолтных значениях
        if (this.defaultValue.findIndex((item) => item.ID === user.ID) === -1) {
          // и еще нет в addValue, то добавляем его в addValue
          if (this.addValue.findIndex((item) => item === user.ID) === -1)
            this.addValue.push(user.ID);
        }

        // Проверка, что мы раньше этого пользователя еще не добавляли в удаленные
        const deleteUserIndex = this.deleteValue.findIndex(
          (item) => item === user.ID
        );
        if (deleteUserIndex >= 0) {
          this.deleteValue.splice(deleteUserIndex, 1);
        }

        this.validate();
        this.emitThisData();
      }
      this.closePeopleList();
    },

    deleteUser(id) {
      // Удаляем из списка выбранных пользователей
      this.newValue = this.newValue.filter((item) => item.ID !== id);

      // Если этот пользователь пришел по дефолту, то добавляем его в deleteValue
      if (this.defaultValue.findIndex((item) => item.ID === id) >= 0) {
        this.deleteValue.push(id);
      }

      // Проверка, что мы раньше этого пользователя еще не добавляли в добавленные
      const addUserIndex = this.addValue.findIndex((item) => item === id);
      if (addUserIndex >= 0) {
        this.addValue.splice(addUserIndex, 1);
      }

      this.validate();
      this.emitThisData();
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
    this.emitThisData();
    window.addEventListener("mousedown", this.checkClickZone);
  },

  destroyed() {
    window.removeEventListener("mousedown", this.checkClickZone);
  },
};
</script>

<style scoped lang="scss">
.input-search-persons {
  &__search {
    position: relative;
  }

  &__label {
    position: relative;

    display: block;
    line-height: 0;
  }

  &__input {
    width: 100%;
    padding: {
      top: 23px;
      right: 39px;
      bottom: 7px;
      left: 23px;
    }

    @extend .body-2;
    color: var(--gray900);
    text-overflow: ellipsis;
    white-space: nowrap;

    background-color: var(--white900);
    border: 1px solid var(--gray500);

    @include transition();

    &:not(.input-search-persons__input--error):focus {
      border: 1px solid var(--red500);
    }

    &--disabled {
      cursor: not-allowed;
    }

    &--error {
      border: 1px solid var(--red900);
    }

    @include hover {
      &:not(.input-search-persons__input--disabled):not(.input-search-persons__input--error) {
        border: 1px solid var(--red500);
      }
    }
  }

  &__input:focus ~ .input-search-persons__placeholder {
    top: 7px;
    transform: unset;

    @extend .caption-2;
  }

  &__placeholder {
    position: absolute;
    top: 50%;
    left: 23px;
    transform: translateY(-50%);
  }

  &__input-icon {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);

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

  @include phones {
    &__input {
      padding: {
        top: 19px;
        bottom: 7px;
        left: 11px;
      }
    }

    &__placeholder {
      left: 11px;
    }

    &__input:focus ~ .input-search-persons__placeholder {
      top: 5px;
    }

    &__selected {
      margin-top: var(--v-rhythm-2);
    }
  }
}

.selected {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-6);

  &:not(.selected--disabled) {
    .selected__item {
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
  }

  &__item {
    padding: var(--v-rhythm-2) 0;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--v-rhythm-2);

    @include transition();
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