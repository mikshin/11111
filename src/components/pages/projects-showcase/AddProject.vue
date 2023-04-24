<template>
  <AppModal
    class="add-task"
    v-if="isVisible"
    @onClose="closePopup"
    :maxWidth="'715'"
  >
    <div class="add-project__conent" :class="{ loading: isLoading }">
      <div class="add-project__title">Новый проект</div>
      <Form class="add-project__form" ref="form" @onValidate="onValid">
        <Input v-for="input in inputList" :key="input.name" :input="input" />
        <div class="devider"></div>

        <!-- СРОКИ ПРОЕКТА -->
        <h4 class="caption">Сроки проекта</h4>
        <div class="input_container-wrapper">
          <Input
            v-for="input in dateControls"
            :key="input.name"
            :ref="input.name"
            :input="input"
            @onChange="validateDate(input.name)"
          />
        </div>

        <h5 class="caption-key-point">Контрольные точки проекта</h5>

        <div
          class="input_container-wrapper"
          v-for="(inputPair, i) in controlPoints"
          :key="inputPair[0].name"
        >
          <Input
            v-for="input in inputPair"
            :key="input.name"
            :input="input"
            :ref="input.name"
            @onChange="validateDate(input.name)"
            :class="{ disabled: keyIntervarError }"
          />

          <button
            class="delete"
            @click="DeleteControlPoint($event, i, inputPair[0].name)"
            :class="{ hide: i === 0 }"
          >
            <user-icons :iconName="'cross'" />
          </button>
        </div>

        <button
          class="text-btn add-key-point"
          @click="AddControlPoint"
          :disabled="this.startFinishErrors.length > 0 || keyIntervarError"
        >
          <user-icons :iconName="'plus-1'" />
          <span>Добавить контрольную точку</span>
        </button>

        <ul class="date-errors">
          <li
            class="error"
            v-for="(dateError, i) in startFinishErrors"
            :key="i"
          >
            {{ dateError }}
          </li>
        </ul>
        <div class="devider"></div>

        <!-- УЧАСТНИКИ ПРОЕКТА -->
        <h4 class="caption">Участники проекта</h4>
        <div
          class="input_container-wrapper"
          v-for="(inputPair, i) in projectMembers"
          :key="inputPair[0].name"
        >
          <Input
            v-for="input in inputPair"
            :key="input.name"
            :input="input"
            :ref="input.name"
            @onChange="roleInputChangeHandler($event, input)"
          />
          <button
            class="delete"
            @click="DeleteProjectMember($event, i, inputPair[0].name)"
            :class="{ hide: i === 0 }"
          >
            <user-icons :iconName="'cross'" />
          </button>
        </div>

        <button
          class="text-btn add-participant"
          @click="AddProjectMember"
          :disabled="this.usersErrors.length > 0"
        >
          <user-icons :iconName="'plus-1'" />
          <span>Добавить участника</span>
        </button>

        <ul class="date-errors">
          <li class="error" v-for="(userError, i) in usersErrors" :key="i">
            {{ userError }}
          </li>
        </ul>

        <div class="add-project__form-btns">
          <button
            class="primary-btn"
            @click="sendForm"
            :disabled="
              !isFormValid ||
              startFinishErrors.length != 0 ||
              usersErrors.length != 0
            "
          >
            Сохранить
          </button>
          <button class="secondary-btn" type="reset" @click="closePopup()">
            Отменить
          </button>
        </div>
      </Form>
    </div>

    <transition name="fade">
      <ProjectModalErrorModal
        class="task-modal__error-modal"
        v-if="errorModalIsVisible"
        @onClose="errorModalIsVisible = false"
        @repeatSave="sendForm"
      />
    </transition>
  </AppModal>
</template>

<script>
import AppModal from "@components/modals/AppModal.vue";
import axios from "axios";
import ProjectModalErrorModal from "@components/pages/projects-showcase/ProjectModalErrorModal.vue";
import Form from "@UI/formTemplate.vue";
import Input from "@UI/inputTemplate.vue";
import { methodsMixin } from "./assets/methodsMixin";

export default {
  name: "AddProject",

  mixins: [methodsMixin],

  components: {
    AppModal,
    ProjectModalErrorModal,
    Form,
    Input,
  },

  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      errorModalIsVisible: false,
      isSended: false,
      isFormValid: false,
      startFinishErrors: [],
      usersErrors: [],
      keyIntervarError: true,
      dateStart: "",
      dateEnd: "",
      keyArr: [],
      usersArr: [],
      objArr: [],

      inputList: [
        {
          type: "file",
          name: "[PREVIEW_PICTURE]",
          placeholder: "Изображение проекта",
          multiple: false,
          singleFile: true,
          maxSize: 10485760,
          required: true,
          accept: ".jpg, .jpeg, .png, .gif",
        },
        {
          type: "text",
          placeholder: "Заголовок проекта",
          required: true,
          name: "[NAME]",
          maxLength: 80,
        },
        {
          type: "select",
          placeholder: "Компания",
          required: true,
          name: "[COMPANY]",
          selectValue: [],
        },
        {
          type: "select",
          placeholder: "Подразделение",
          required: true,
          name: "[DEPARTMENT]",
          selectValue: [],
        },
        {
          type: "select",
          placeholder: "Текущий этап проекта",
          required: true,
          name: "[STAGE]",
          selectValue: [],
        },
        // {
        //   type: "textarea",
        //   name: "[PREVIEW_TEXT]",
        //   placeholder: "Описание проекта",
        //   required: true,
        //   maxLength: 200,
        // },
        {
          type: "editor",
          name: "[PREVIEW_TEXT]",
          maxLength: 2000,
          editorType: "text",
          uniqId: "add-project-editor",
          canAttachFile: false,
          placeholder: "Описание проекта",
          noMention: true,
        },
        {
          name: "[CLOSED]",
          type: "radio",
          placeholder: "Закрытый проект?",
          required: true,
          placeholderShown: true,
          radioValue: [],
        },
      ],

      dateControls: [
        {
          type: "date",
          required: true,
          placeholder: "Дата начала",
          name: "[ACTIVE_FROM]",
        },
        {
          type: "date",
          required: true,
          placeholder: "Дата окончания проекта",
          name: "[ACTIVE_TO]",
        },
      ],

      controlPoints: [
        // [
        //   {
        //     type: "date",
        //     placeholder: "Дата контрольной точки",
        //     name: "[KEY_POINT][n0][VALUE]",
        //   },
        //   {
        //     type: "text",
        //     placeholder: "Название контрольной точки проекта",
        //     name: "[KEY_POINT][n0][DESCRIPTION]",
        //     maxLength: 80,
        //   },
        // ],
      ],

      projectMembers: [
        [
          {
            name: "[0][ROLE_ID]",
            type: "select",
            required: true,
            placeholder: "Роль",
            selectValue: [
              { code: 1, label: "Руководитель проекта" },
              { code: 2, label: "Участник" },
              { code: 3, label: "Секретарь" },
              { code: 4, label: "Технический писатель" },
            ],
          },
          {
            type: "search-persons",
            required: true,
            placeholder: "Пользователь",
            name: "[0][USER_ID]",
            maxLength: 40,
            singleSelect: true,
          },
        ],
      ],
    };
  },

  computed: {},

  methods: {
    async sendForm() {
      const formData = this.getDataForm();

      try {
        this.isLoading = true;
        const response = await this.createProject(formData);
        if (response) this.updataProjectList();
      } finally {
        this.isLoading = false;
      }
    },

    async createProject(data) {
      try {
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/project/add`,
          data: data,
        });
        return response.data;
      } catch (error) {
        this.errorModalIsVisible = true;
      }
    },

    updataProjectList() {
      this.closePopup();
      this.$emit("updataProjectList");
    },

    roleInputChangeHandler(event, input) {
      if (event.data.isDirty) {
        this.validateUsers(input.name);
      } else {
        return;
      }
    },
  },

  mounted() {
    axios.get("/mobileapp/api/project/field/").then((response) => {
      // PREVIEW_PICTURE
      this.inputList[0].accept = response.data.find(
        (x) => x.name === "PREVIEW_PICTURE"
      ).accept;

      // COMPANY
      this.inputList[2].selectValue = response.data.find(
        (x) => x.name === "COMPANY"
      ).selectValue;

      // DEPARTMENT
      this.inputList[3].selectValue = response.data.find(
        (x) => x.name === "DEPARTMENT"
      ).selectValue;

      // STAGE
      this.inputList[4].selectValue = response.data.find(
        (x) => x.name === "STAGE"
      ).selectValue;

      // CLOSED
      this.inputList[6].radioValue = response.data.find(
        (x) => x.name === "CLOSED"
      ).radioValue;

      // ROLE_ID
      this.projectMembersSelect = response.data.find(
        (x) => x.name === "ROLE_ID"
      ).selectValue;
      this.projectMembers[0][0].selectValue = this.projectMembersSelect;
    });
  },
};
</script>

<style scoped lang="scss">
@import "./assets/modalcss.scss";

.input_container-wrapper {
  @include phones {
    flex-direction: column;
  }
}
</style>