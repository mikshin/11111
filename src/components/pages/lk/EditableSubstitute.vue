<template>
  <div
    class="editable-substitute"
    :class="{ loading: isLoading }"
    v-click-outside="closeEdit"
  >
    <EditableInput
      class="editable-substitute__editable-input"
      :placeholder="'ФИО сотрудника'"
      :editingIsOpen="editing"
      @inputChange="(e) => (searchValue = e)"
      @changeEditing="(e) => (editing = e)"
      @saveChange="deleteSubstitute"
    >
      <SimplePersonCard
        class="editable-substitute__value"
        v-if="substitute"
        :avatar="{
          src: substitute.USER_PHOTO,
          alt: substitute.FULL_NAME,
        }"
        :fullName="substitute.FULL_NAME"
        :profession="substitute.UF_WORK_POSITION"
        :vacation="substitute.VACATION"
        :fired="substitute.FIRED"
      />
      <span v-else class="editable-substitute__value">Не назначен</span>
    </EditableInput>

    <div class="editable-substitute__popup">
      <PeopleList
        class="editable-substitute__people-list"
        :class="{ loading: peopleListIsLoading }"
        :updataIsEnd="updataIsEnd"
        :peopleList="peopleList"
        v-if="editing"
        @selectUser="selectUser"
        @upload="updataUsers"
      />
      <span
        class="editable-substitute__error-message"
        v-if="!isValid && editing"
        >Нельзя выбрать себя замещающим</span
      >
    </div>
  </div>
</template>

<script>
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import EditableInput from "@/components/UI/inputs/EditableInput.vue";
import PeopleList from "@/components/UI/PeopleList.vue";
import axios from "axios";

export default {
  name: "EditableSubstitute",

  components: { SimplePersonCard, EditableInput, PeopleList },

  props: {
    substituteObj: {
      type: Object,
      required: false,
    },
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      peopleList: [],

      editing: false,

      isLoading: false,

      searchValue: "",

      updataIsEnd: false,

      peopleListIsLoading: false,

      wait: true,

      substitute: null,

      isValid: true,
    };
  },

  computed: {},

  methods: {
    closeEdit() {
      this.editing = false;
      this.isValid = true;
    },

    async fetchUsers() {
      if (this.searchValue.length > 2) {
        try {
          const response = await axios({
            method: "get",
            url: `mobileapp/api/user/findByFIO/?count=10&startFrom=0&query=${this.searchValue}`,
          });
          this.peopleList = response.data.employee;
          this.updataIsEnd = response.data.end;
        } catch (error) {
          console.log(error);
        } finally {
          this.peopleListIsLoading = false;
        }
      } else {
        this.isValid = true;
        this.peopleList = [];
        this.peopleListIsLoading = false;
      }
    },

    async updataUsers() {
      try {
        const response = await axios({
          method: "get",
          url: `mobileapp/api/user/findByFIO/?count=10&startFrom=${this.peopleList.length}&query=${this.searchValue}`,
        });
        this.peopleList = [...this.peopleList, ...response.data.employee];
        this.updataIsEnd = response.data.end;
      } catch (error) {
        console.log(error);
      }
    },

    async saveChange(selectedUser) {
      try {
        this.isLoading = true;
        await axios({
          method: "post",
          url: `mobileapp/api/user/update`,
          data: {
            UF_SUBSTITUTE: selectedUser.ID,
          },
        });
        this.substitute = selectedUser;
        this.closeEdit();
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    selectUser(e) {
      e.ID === this.id ? (this.isValid = false) : this.saveChange(e);
    },

    async deleteSubstitute() {
      try {
        await axios({
          method: "post",
          url: `mobileapp/api/user/update`,
          data: {
            UF_SUBSTITUTE: null,
          },
        });
        this.substitute = null;
        this.closeEdit();
      } catch (error) {
        alert(
          "Произошла ошибка! Повторите запрос через некоторое время. Если ошибка повторится, обратитесь к системному администратору."
        );
      }
    },
  },

  watch: {
    searchValue() {
      this.peopleListIsLoading = true;

      if (this.wait) {
        setTimeout(() => {
          this.fetchUsers();
          this.wait = true;
        }, 1500);
      }
      this.wait = false;
    },

    editing() {
      !this.editing ? (this.peopleList = []) : null;
    },

    substituteObj() {
      this.substitute = this.substituteObj;
    },
  },

  mounted() {},
};
</script>

<style scoped lang="scss">
.editable-substitute {
  position: relative;

  &__editable-input {
  }

  &__value {
  }

  &__popup {
    position: absolute;
    left: 0;
    bottom: -4px;
    transform: translateY(100%);
    z-index: 10;

    width: calc(100% - 40px);
  }

  &__people-list {
  }

  &__error-message {
    display: block;
    margin-top: var(--v-rhythm-1);

    color: var(--red900);
    @extend .caption-2;
  }

  @include phones {
    &__error-message {
      margin-top: 2px;
    }
  }
}
</style>
