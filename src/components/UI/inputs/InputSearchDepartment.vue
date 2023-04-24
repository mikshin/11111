<template>
  <div class="input-search-department">
    <!-- !Имя класс используется в checkClickZone -->
    <div
      class="input-search-department__input-wrapper"
      v-click-outside="clickOutside"
    >
      <InputLabelWrapper
        :input="input"
        :isValid="isValid"
        class="input-search-department__input-label"
      >
        <input
          class="input-search-department__input"
          placeholder=" "
          :name="input.name"
          :required="false"
          type="search"
          v-model="searchValue"
          @focus="openPeopleList"
        />
        <UserIcons
          class="input-search-department__input-icon"
          :iconName="'search'"
        />
        <InputPlaceholder
          class="input-search-department__input-placeholder"
          :input="input"
        />
        <InputErrors
          class="input-search-department__input-errors"
          :errors="this.errors"
        />
      </InputLabelWrapper>

      <transition name="dropdown">
        <div
          class="input-search-department__department-list department-list"
          :class="{ loading: depListIsLoading }"
          v-if="depListIsOpen"
        >
          <template v-if="depList.length > 0">
            <div
              class="department-list__link"
              v-for="item in depList"
              :key="item.ID"
              @click="selectDep(item)"
            >
              {{ item.NAME }}
            </div>
          </template>
          <div class="department-list__default" v-else>Ничего не найдено</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import InputLabelWrapper from "./assets/InputLabelWrapper.vue";
import InputErrors from "./assets/InputErrors.vue";
import InputPlaceholder from "./assets/InputPlaceholder.vue";
import { inputMixin } from "./assets/inputMixin";

export default {
  name: "InputSearchDepartment",

  mixins: [inputMixin],

  components: {
    InputLabelWrapper,
    InputErrors,
    InputPlaceholder,
  },

  props: {
    input: {
      type: Object,
      required: true,
    },

    depId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      depListIsLoading: false,
      depList: [],
      depListIsOpen: false,
      searchValue: "",
      wait: true,
      newValue: this.input.defaultValue ? this.input.defaultValue : "",
      isClickedInto: false,
    };
  },

  computed: {},

  methods: {
    // Нужно для того, что бы поиск не закрывался, когда пользователь выделил текс и отпустил кнопку мыши за пределами поля ввода
    checkClickZone(e) {
      if (e.target.closest(".input-search-department__input-wrapper")) {
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

    selectDep(item) {
      this.searchValue = item.NAME;
      this.newValue = item.ID;
      this.$emit("selectDep", this.newValue);
      this.closePeopleList();
    },

    openPeopleList() {
      this.depListIsOpen = true;
    },

    closePeopleList() {
      this.depListIsOpen = false;
    },

    async getUsers() {
      try {
        this.depListIsLoading = true;
        this.depList = [];
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/searchDep/?depId=${this.depId}&query=${this.searchValue}`,
        });
        const values = Object.values(response.data);
        values.forEach((value) => {
          this.depList.push(value);
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.depListIsLoading = false;
      }
    },
  },

  watch: {
    depListIsOpen() {
      if (this.depListIsOpen) {
        this.getUsers();
      } else {
        this.depList = [];
      }
    },

    searchValue() {
      if (this.wait) {
        setTimeout(() => {
          this.getUsers();
          this.wait = true;
        }, 1500);
      }
      this.wait = false;
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

.input-search-department {
  position: relative;

  &__input-wrapper {
    position: relative;
  }

  &__input {
    width: 100%;
    padding-right: 40px;

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

  &__department-list {
    position: absolute;
    left: 2px;
    bottom: -4px;
    transform: translateY(100%);
    z-index: 10;

    width: calc(100% - 4px);
  }
}

.department-list {
  padding: var(--v-rhythm-2) 0;
  max-height: 296px;
  overflow-y: auto;

  background-color: var(--white900);
  box-shadow: var(--boxShadowList), 0 0 0 2px var(--red500);

  &__link {
    padding: var(--v-rhythm-2) var(--v-rhythm-4);

    @extend .body-1;
    color: var(--gray900);

    cursor: pointer;
    @include transition();

    @include hover {
      background-color: var(--gray100);
    }

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__default {
    padding: var(--v-rhythm-2) var(--v-rhythm-4);

    @extend .body-2;
    color: var(--gray900);
  }
}
</style>