<template>
  <AppModal class="add-task" @onClose="closePopup" :maxWidth="'715'">
    <div class="add-project__conent" :class="{ loading: isLoading }">
      <div class="add-project__title">
        Редактировать проект "{{ data.NAME }}"
      </div>
      <Form class="add-project__form" ref="form" @onValidate="onValid">
        <Input
          :input="{
            type: 'file',
            name: '[PREVIEW_PICTURE]',
            placeholder: 'Изображение проекта',
            multiple: false,
            singleFile: true,
            maxSize: 10485760,
            required: !this.imageAdded,
            accept: this.fileAcc,
          }"
          @onChange="uploadFile"
          ref="input-image"
        />
        <template v-if="data.PREVIEW_PICTURE">
          <AppDocument
            class="task-editing__files"
            v-for="file in defaultFilesData"
            :key="file.ID"
            :fileTitle="file.NAME"
            :fileSize="file.SIZEINBITES"
            :fileExtension="file.EXT"
            :fileLink="file.LINK"
            :hasButtonCross="true"
            @clickCross="deleteFile"
          />
        </template>
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
            @onChange="validateUsers(input.name)"
          />
          <button
            class="delete"
            @click="DeleteProjectMember($event, i, inputPair[0].name)"
            :class="{ hide: projectMembers.length === 1 && i === 0 }"
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
import AppModal from "@/components/modals/AppModal.vue";
import axios from "axios";
import ProjectModalErrorModal from "@/components/pages/projects-showcase/ProjectModalErrorModal.vue";
import Form from "@/components/UI/formTemplate.vue";
import Input from "@/components/UI/inputTemplate.vue";
import AppDocument from "@/components/UI/document/AppDocument.vue";
//import { dateConverter } from "@/assets/scripts/scripts.js";
import { methodsMixin } from "./assets/methodsMixin";

export default {
  name: "EditProject",

  mixins: [methodsMixin],

  components: {
    AppModal,
    ProjectModalErrorModal,
    Form,
    Input,
    AppDocument,
  },

  props: {
    data: {
      type: Object,
      required: true,
    },
    members: {
      type: Array,
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

      defaultValues: {},
      fileAcc: ".jpg",
      inputList: [
        {
          type: "text",
          placeholder: "Заголовок проекта",
          required: true,
          name: "[NAME]",
          maxLength: 80,
          defaultValue: this.data.NAME,
        },
        {
          type: "select",
          placeholder: "Компания",
          required: true,
          name: "[COMPANY]",
          defaultValue: this.data.SELECT_VALUE.COMPANY,
          selectValue: [],
        },
        {
          type: "select",
          placeholder: "Подразделение",
          required: true,
          name: "[DEPARTMENT]",
          defaultValue: this.data.SELECT_VALUE.DEPARTMENT,
          selectValue: [],
        },
        {
          type: "select",
          placeholder: "Текущий этап проекта",
          required: true,
          name: "[STAGE]",
          defaultValue: this.data.SELECT_VALUE.STAGE,
          selectValue: [],
        },
        // {
        //   type: "textarea",
        //   name: "[PREVIEW_TEXT]",
        //   placeholder: "Описание проекта",
        //   required: true,
        //   maxLength: 200,
        //   defaultValue: this.data.PREVIEW_TEXT,
        // },
        {
          type: "editor",
          name: "[PREVIEW_TEXT]",
          maxLength: 2000,
          editorType: "text",
          uniqId: "edit-project-editor",
          canAttachFile: false,
          defaultValue: this.data.PREVIEW_TEXT,
          placeholder: "Описание проекта",
          noMention: true,
        },
        {
          name: "[CLOSED]",
          type: "radio",
          placeholder: "Закрытый проект?",
          required: true,
          placeholderShown: true,
          defaultValue: {
            name: this.data.SELECT_VALUE.CLOSED.label,
            code: this.data.SELECT_VALUE.CLOSED.code,
          },
          radioValue: [],
        },
      ],

      dateControls: [
        {
          type: "date",
          required: true,
          placeholder: "Дата начала",
          name: "[ACTIVE_FROM]",
          defaultValue: this.data.ACTIVE_FROM,
        },
        {
          type: "date",
          required: true,
          placeholder: "Дата окончания проекта",
          name: "[ACTIVE_TO]",
          defaultValue: this.data.ACTIVE_TO,
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

      projectMembers: [],

      defaultFilesData: [],
      uploadedImage: [],
    };
  },

  methods: {
    deleteFile() {
      setTimeout(() => {
        this.defaultFilesData = [];
      }, 0);
    },

    uploadFile() {
      this.deleteFile();
      this.uploadedImage = this.$refs["input-image"].files;
      this.uploadedImage.length
        ? (this.$refs["input-image"].isValid = true)
        : (this.$refs["input-image"].isValid = false);
    },

    async sendForm() {
      const formData = this.getDataForm();

      try {
        this.isLoading = true;
        const response = await this.updateProjectSend(formData);
        if (response) this.updateProject();
      } finally {
        this.isLoading = false;
      }
    },

    async updateProjectSend(data) {
      try {
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/project/update`,
          data: data,
        });
        return response.data;
      } catch (error) {
        this.errorModalIsVisible = true;
      }
    },

    updateProject() {
      this.closePopup();
      this.$emit("updateProject");
    },
  },

  computed: {
    imageAdded() {
      if (this.defaultFilesData.length || this.uploadedImage.length) {
        return true;
      } else {
        return false;
      }
    },
  },

  mounted() {
    axios.get("/mobileapp/api/project/field/").then((response) => {
      // PREVIEW_PICTURE
      this.fileAcc = response.data.find(
        (x) => x.name === "PREVIEW_PICTURE"
      ).accept;

      // COMPANY
      this.inputList[1].selectValue = response.data.find(
        (x) => x.name === "COMPANY"
      ).selectValue;

      // DEPARTMENT
      this.inputList[2].selectValue = response.data.find(
        (x) => x.name === "DEPARTMENT"
      ).selectValue;

      // STAGE
      this.inputList[3].selectValue = response.data.find(
        (x) => x.name === "STAGE"
      ).selectValue;

      // CLOSED
      this.inputList[5].radioValue = response.data.find(
        (x) => x.name === "CLOSED"
      ).radioValue;

      // ROLE_ID
      this.projectMembersSelect = response.data.find(
        (x) => x.name === "ROLE_ID"
      ).selectValue;

      if (this.data.KEY_POINT.length) {
        this.controlPoints = [];
        this.data.KEY_POINT.forEach((el) => {
          const random = this.getRandomId();
          this.controlPoints.push([
            {
              type: "date",
              placeholder: "Дата контрольной точки",
              name: `[KEY_POINT][${random}][VALUE]`,
              defaultValue: el.value,
            },
            {
              type: "text",
              placeholder: "Название контрольной точки проекта",
              name: `[KEY_POINT][${random}][DESCRIPTION]`,
              maxLength: 80,
              defaultValue: el.description,
            },
          ]);
        });
      }

      this.projectMembers = [];
      this.members.forEach((el) => {
        const random = this.getRandomId();
        this.projectMembers.push([
          {
            defaultValue: { label: `${el.ROLE.NAME}`, code: `${el.ROLE.ID}` },
            type: "select",
            required: true,
            placeholder: "Роль",
            name: `[${random}][ROLE_ID]`,
            selectValue: this.projectMembersSelect,
          },
          {
            defaultValue: [
              {
                FULL_NAME: `${el.USER.FULL_NAME}`,
                ID: `${el.USER.ID}`,
                UF_WORK_POSITION: `${el.USER.UF_WORK_POSITION}`,
                USER_PHOTO: `${el.USER.USER_PHOTO}`,
                VACATION: el.USER.VACATION,
                FIRED: el.USER.FIRED,
              },
            ],
            type: "search-persons",
            required: true,
            placeholder: "Пользователь",
            name: `[${random}][USER_ID]`,
            maxLength: 40,
            singleSelect: true,
          },
        ]);
      });

      this.defaultFilesData = [
        {
          LINK: this.data.PREVIEW_PICTURE[0].fileLink,
          SIZEINBITES: this.data.PREVIEW_PICTURE[0].fileSize,
          NAME: this.data.PREVIEW_PICTURE[0].originalName,
          ID: this.data.PREVIEW_PICTURE[0].fileId,
          EXT: this.data.PREVIEW_PICTURE[0].extension,
        },
      ];
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