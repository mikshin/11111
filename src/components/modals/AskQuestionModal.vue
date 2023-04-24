<template>
  <AppModal class="ask-question__modal" @onClose="closePopup" :maxWidth="'600'">
    <div v-if="!editMode">
      <div v-show="!isSended">
        <h3 class="ask-question__header">Задать свой вопрос</h3>
        <p class="ask-question__header-description">
          Выберите адресата, напишите свой вопрос и прикрепите файлы, если
          необходимо
        </p>
      </div>
      <div v-show="isSended">
        <h3 class="ask-question__header-description ask-question__tac">
          Ваш вопрос
        </h3>
        <p class="ask-question__header-description ask-question__tac">
          <strong>"{{ questionDescription }}"</strong>
        </p>
        <h3 class="ask-question__header-description ask-question__tac">
          успешно опубликован.
        </h3>
        <button
          class="secondary-btn ask-question__close_success_modal"
          @click="reset()"
        >
          Закрыть
        </button>
      </div>
    </div>
    <div v-else>
      <h3 v-show="!isSended" class="ask-question__header">
        Редактировать свой вопрос
      </h3>
      <h3 class="ask-question__header" v-show="isSended">
        Спасибо, Ваш вопрос обновлён!
      </h3>
    </div>
    <Form
      ref="askQuestionForm"
      v-if="!isSended"
      @onValidate="onValid"
      :key="componentKey"
    >
      <Input :input="categoriesSelect" :key="categoriesKey" />
      <Input
        v-if="!recipient"
        :input="companiesSelect"
        :key="companyKey"
        ref="company"
        @onChange="companyChange"
        :disabled="isCompanyLocked"
      />
      <Input
        v-if="!recipient"
        :input="departmentsSelect"
        :key="departmentKey"
        ref="department"
        @onChange="departmentChange"
        :disabled="isDepartamentLocked"
      />
      <Input
        :input="recipientsSelect"
        :key="recipientKey"
        @onChange="managerChange"
        ref="recipient"
        :disabled="isManagerLocked"
      />
      <Input v-for="(input, i) in filesList" :key="i" :input="input" />
      <div v-if="editMode" :key="filesListKey">
        <div
          v-for="file in editableFiles"
          :key="file.fileId"
          class="ask-question__files"
        >
          <AppDocument
            :fileTitle="file.originalName"
            :fileSize="file.fileSize"
            :fileExtension="file.extension"
            :fileDate="editableContent.DATE_CREATE"
            :fileLink="file.fileLink"
            :fileId="file.fileId"
            :hasButtonCross="true"
            @clickCross="removeFile(file.fileId)"
          />
        </div>
      </div>
      <Input :input="checkboxInput" class="ask-question__checkbox-edit_mode" />
      <p v-if="errorDescription.length > 0">{{ errorDescription }}</p>
      <div class="ask-question__actions">
        <button
          class="primary-btn"
          v-bind:class="{ 'primary-btn--disabled': !isFormValid }"
          :disabled="!isFormValid"
          @click="sendForm"
        >
          Отправить
        </button>
        <button class="secondary-btn" type="reset" @click="reset">
          Отменить
        </button>
      </div>
    </Form>
  </AppModal>
</template>

<script>
// import { isEmpty } from "lodash";

import axios from "axios";
import AppModal from "@/components/modals/AppModal.vue";
import Form from "@/components/UI/formTemplate.vue";
import Input from "@/components/UI/inputTemplate.vue";
// import AppFile from "@/components/UI/document/AppFile.vue";
// import UserIcons from "@/components/global/UserIcons.vue";
import AppDocument from "@/components/UI/document/AppDocument.vue";
export default {
  name: "AskQuestionModal",

  components: {
    AppModal,
    Input,
    Form,
    // AppFile,
    // UserIcons,
    AppDocument,
  },
  //  readme
  //  company, department, recipient может быть один из пропсов либо без
  //  editMode - проп отвечающий за редактирование вопроса
  //  если editMode - то необходимо пропросить recipient { value: {code: id, label: fullname}}
  //  а так-же questionID - ID редактируемого вопроса !
  //  ЭМИТЫ - refreshQuestionList - выполняется после отправки формы, через 3 секунды (там senTimeout)
  // closeModal - выполняется, когда нажата кнопка закрыть (Х) либо клик-снаружи
  props: {
    company: {
      type: Object,
    },
    department: {
      type: Object,
    },
    recipient: {
      type: Object,
    },
    questionCategory: {
      type: Object,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    questionID: {
      type: String,
    },
  },

  data() {
    return {
      editableContent: null,
      editableFiles: [],
      isEditFieldsReady: false,
      filesListKey: 10001,
      filesToDelete: [],
      modalKey: Date.now(),
      componentKey: Date.now() + 9999,
      isModalVisible: false,
      isFormValid: false,
      isSended: false,
      isLoading: true,
      filledForm: [],
      filledFormData: [],
      isFormFilled: false,

      simpleInputs: [],

      checkboxInput: {},
      selectInputs: [],
      // в попап отправляем краткое описание вопроса
      questionDescription: "",
      // текст ошибки
      errorDescription: "",

      categoriesSelect: {},
      categoriesKey: 11,

      companiesSelect: {},
      companyKey: Date.now(),
      selectedCompanyId: null,

      departmentsSelect: {},
      departmentKey: Date.now() + 1000,
      selectedDepartmentId: null,

      recipientsSelect: {},
      recipientKey: Date.now() + 2000,
      selectedManagerId: null,

      firstLoadReady: false,

      // форма по умолчанию
      defaultJSON: [
        {
          name: "NAME",
          placeholder: "Краткое наименование вопроса",
          required: true,
          type: "text",
        },
        {
          name: "DETAIL_TEXT",
          placeholder: "Текст вопроса",
          required: true,
          type: "textarea",
        },
        {
          name: "CATEGORY",
          placeholder: "Категория вопроса",
          required: true,
          type: "select",
          selectValue: [],
          disabled: this.editMode,
        },
        {
          name: "COMPANY",
          placeholder: "Компания",
          required: false,
          type: "select",
          defaultValue: this.company ? this.company.value : null,
          selectValue: [],
          disabled: Boolean(this.editMode || this.recipient),
        },
        {
          name: "DEPARTMENT",
          placeholder: "Подразделение",
          required: false,
          type: "select",
          defaultValue: this.department ? this.department.value : null,
          selectValue: [],
          disabled: Boolean(this.editMode || this.recipient),
        },
        {
          name: "RECIPIENT_ID",
          placeholder: "ФИО руководителя",
          required: true,
          type: "select",
          defaultValue: this.recipient ? this.recipient.value : null,
          selectValue: [],
          disabled: Boolean(this.editMode || this.recipient),
        },
        {
          name: "FILES",
          placeholder: "Приложение",
          required: false,
          type: "file",
          maxSize: 5242880,
        },
        {
          name: "ANONIME",
          placeholder: "Отправить анонимно",
          required: false,
          type: "checkbox",
          disabled: this.editMode,
        },
      ],
    };
  },
  methods: {
    // удаляем файлы и помещаем в массив удалённые ID
    removeFile(id) {
      this.editableFiles = this.editableFiles.filter((file) => {
        return file.fileId !== id;
      });
      this.filesToDelete.push(id);
      this.filesListKey += 100;
    },
    // в режиме редактирования заполняем поля для которые можем редактировать. Заполняем категорию
    async getQuestionData() {
      if (this.questionID) {
        this.isEditFieldsReady = false;
        try {
          const response = await axios.get(`/mobileapp/api/question/info`, {
            params: {
              questionId: this.questionID,
            },
          });

          if (response) {
            this.editableContent = response.data;
            this.editableFiles = response.data.FILES;
            this.simpleInputs.forEach((input) => {
              if (input.name === "NAME") {
                input.defaultValue = response.data.NAME;
              }
              if (input.name === "DETAIL_TEXT") {
                input.defaultValue = response.data.DETAIL_TEXT;
              }
              if (input.name === "ANONIME") {
                input.defaultValue = response.data.ANONIME;
              }
            });
            // const tempCategory = this.categoriesSelect.selectValue.filter(
            //   (cat) => {
            //     return cat.label === this.editableContent.CATEGORY;
            //   }
            // );
            // setTimeout(() => {
            //   this.categoriesSelect.defaultValue = tempCategory[0];
            // }, 0);
            this.categoriesSelect.defaultValue = this.questionCategory;

            // this.categoriesKey += 1;

            this.isEditFieldsReady = true;
            this.componentKey += 1;
          }
        } catch (e) {
          console.log(e);
        }
      }
    },

    // получаем компании и категории(они идут всегда)
    async fetchCompanies() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/question/getField`,
        });
        const values = Object.values(response.data);
        values.forEach((value) => {
          if (value.name === "COMPANY") {
            this.companiesSelect.selectValue = value.selectValue;
          }
          if (value.name === "CATEGORY") {
            this.categoriesSelect.selectValue = value.selectValue;
          }
        });
        this.firstLoadReady = true;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    // получаем подразделение/компанию
    async fetchDepartments(companyId, headId) {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/question/getField/`,
          params: {
            companyId,
            headId,
          },
        });
        const values = Object.values(response.data);

        values.forEach((value) => {
          if (value.name === "DEPARTMENT") {
            if (value.selectValue) {
              if (Array.isArray(value.selectValue)) {
                this.departmentsSelect.selectValue = value.selectValue;
              } else {
                this.departmentsSelect.selectValue = [value.selectValue];
              }
            }
            if (value.defaultValue) {
              this.departmentsSelect.defaultValue = value.defaultValue;
            }
            this.departmentKey += 1;
          }
        });
        this.firstLoadReady = true;
      } catch (error) {
        return [];
      }
    },

    // получаем руководителя/подразделение/компанию
    async fetchManagers(departmentId) {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/question/getField/`,
          params: {
            departmentId,
            companyId: this.selectedCompanyId,
          },
        });
        const values = Object.values(response.data);
        values.forEach((value) => {
          if (value.name === "RECIPIENT_ID") {
            // проверяем один или нет руководитель. Передать в селект нужно массив!
            if (!Array.isArray(value.selectValue)) {
              this.recipientsSelect.selectValue = [value.selectValue];
            } else {
              this.recipientsSelect.selectValue = value.selectValue;
            }
            if (value.defaultValue) {
              this.recipientsSelect.defaultValue = value.defaultValue;
              this.recipientKey += 1;
            }
          }
        });
        return values;
      } catch (error) {
        return [];
      }
    },

    // получаем всё от параметра
    async fetchAll(Id, parametr) {
      try {
        const response = await axios
          .get(`/mobileapp/api/question/getField/`, {
            params: {
              [parametr]: Id,
            },
          })
          .then((resp) => {
            const values = Object.values(resp.data);

            values.forEach((value) => {
              if (value.name === "DEPARTMENT") {
                if (value.selectValue) {
                  if (Array.isArray(value.selectValue)) {
                    this.departmentsSelect.selectValue = value.selectValue;
                  } else {
                    this.departmentsSelect.selectValue = [value.selectValue];
                  }
                }
                if (value.defaultValue) {
                  this.departmentsSelect.defaultValue = value.defaultValue;
                }
                this.departmentKey += 1;
              }
              if (value.name === "COMPANY") {
                if (Array.isArray(value.selectValue)) {
                  this.companiesSelect.selectValue = value.selectValue;
                } else {
                  this.companiesSelect.selectValue = [value.selectValue];
                }
                this.companiesSelect.defaultValue = value.defaultValue;
                this.companyKey += 1;
              }
              if (value.name === "RECIPIENT_ID") {
                if (Array.isArray(value.selectValue)) {
                  this.recipientsSelect.selectValue = value.selectValue;
                } else {
                  this.recipientsSelect.selectValue = [value.selectValue];
                }
                this.recipientKey += 1;
              }
              if (value.name === "CATEGORY") {
                if (
                  !this.categoriesSelect.selectValue.length &&
                  value.selectValue
                ) {
                  if (Array.isArray(value.selectValue)) {
                    this.categoriesSelect.selectValue = value.selectValue;
                  } else {
                    this.categoriesSelect.selectValue = [value.selectValue];
                  }
                  this.categoriesKey++;
                }
              }
            });
          });
        this.firstLoadReady = true;
        const values = Object.values(response.data);
        return values;
      } catch (e) {
        return [];
      }
    },

    // делим на селекты и остальные типы
    splitData(json) {
      this.simpleInputs = json.filter((item) => {
        if (item.type === "checkbox") {
          this.checkboxInput = item;
        }
        return item.type !== "select";
      });
      this.simpleInputs = this.simpleInputs.filter((i) => {
        return i.type !== "checkbox";
      });
      this.simpleInputs.forEach((inp) => {
        inp.type === "text" ? (inp.maxLength = 100) : "";
        inp.type === "textarea" ? (inp.maxLength = 1000) : "";
      });
      this.selectInputs = json.filter((item) => {
        return item.type === "select";
      });
      //
      this.selectInputs.forEach((input) => {
        input.name === "CATEGORY" ? (this.categoriesSelect = input) : "";
        input.name === "COMPANY" ? (this.companiesSelect = input) : "";
        input.name === "DEPARTMENT" ? (this.departmentsSelect = input) : "";
        input.name === "RECIPIENT_ID" ? (this.recipientsSelect = input) : "";
      });
    },

    // изменилась компания - отдаём в переменную новый код и следим через watch
    async companyChange() {
      this.selectedCompanyId = this.$refs.company?.newValue?.code;
    },

    // изменилось подразделение - отдаём в переменную новый код и следим через watch
    async departmentChange() {
      this.selectedDepartmentId = this.$refs.department?.newValue?.code;
    },

    // изменился манагер - отдаём в переменную новый код и следим через watch
    async managerChange() {
      this.selectedManagerId = this.$refs.recipient?.newValue?.code;
    },

    // показываем модалку
    showModal() {
      this.isModalVisible = true;
    },

    // закрываем модалку (кнопкой или клик-аутсайд)
    closePopup() {
      this.isSended = false;
      this.isModalVisible = !this.isModalVisible;
      this.modalKey += 1;
      this.$emit("closeModal");
    },

    // очищаем модалку и закрываем
    reset() {
      this.isFormValid = false;
      this.componentKey = Date.now();
      this.closePopup();
    },

    // получаем валидность формы
    onValid(data) {
      this.isFormValid = data.data;
    },

    // отправка формы
    async sendForm() {
      let form = new FormData();
      this.filledForm = [];
      this.filledFormData = [];
      for (let child in this.$refs.askQuestionForm.$children) {
        let item = this.$refs.askQuestionForm.$children[child];
        if (item.files) {
          if (item.input.type === "file") {
            const filesArr = [];
            item._data.files.forEach((i) => {
              const newName = /\s/g.test(i.name)
                ? i.name.trim().replace(/\s/g, "_")
                : i.name;
              filesArr.push(new File([i], newName, { type: i.type }));
            });
            if (!this.editMode) {
              for (let k = 0; k < filesArr.length; k++) {
                form.append(item.input.name + "[]", filesArr[k]);
              }
            } else {
              // Если редактируем вопрос
              for (let k = 0; k < filesArr.length; k++) {
                form.append("FILES_ADD[]", filesArr[k]);
              }
            }
          }
        }
        if (item.newValue) {
          if (item.input.type === "select" || item.input.type === "radio") {
            form.append(item.input.name, item.newValue.code);
          } else {
            if (typeof item.newValue === "object") {
              for (let val in item.newValue) {
                form.append(item.input.name + "[]", item.newValue[val]);
              }
            } else {
              form.append(item.input.name, item.newValue);
            }
          }
        }
      }
      for (let item of form) {
        this.filledForm.push(this.createObjectForm(item));
        this.filledFormData.push(item);
      }
      // отправка для нового вопроса
      if (!this.editMode) {
        try {
          this.isSended = false;
          await axios
            .post("/mobileapp/api/question/addQuestion", form)
            .then((response) => {
              if (response.data.status === 200) {
                this.isSended = true;
                setTimeout(() => {
                  this.closePopup();
                  this.$emit("refreshQuestionList");
                }, 5000);
              }
            });
        } catch (e) {
          this.errorDescription = `Ошибка добавления вопроса ${e.errorMessage}`;
        }
      } else {
        // отправка отредактированного вопроса
        this.filesToDelete.forEach((file, i) => {
          form.append(`FILES_DELETE[${i}]`, file);
        });
        form.delete("CATEGORY");
        form.delete("COMPANY");
        form.delete("DEPARTMENT");
        form.delete("RECIPIENT_ID");
        try {
          this.isSended = false;
          await axios
            .post(
              `/mobileapp/api/question/update?questionId=${this.questionID}`,
              form
            )
            .then((response) => {
              if (response.data.status === "success") {
                this.isSended = true;
                setTimeout(() => {
                  this.closePopup();
                  this.$emit("refreshQuestionList");
                }, 3000);
              }
            });
        } catch (e) {
          this.errorDescription = `Ошибка добавления вопроса ${e.errorMessage}`;
        }
      }
      this.isFormFilled = true;
    },

    // для попапа при успешной отправке
    createObjectForm(arr) {
      const obj = {};
      obj[arr[0]] = arr[1];
      if (arr[0] === "NAME") {
        this.questionDescription = arr[1];
      }
      return obj;
    },
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
    // список файлов в режиме редактирования
    filesList() {
      return this.simpleInputs;
    },
    isCompanyLocked() {
      return (
        !(this.selectedCompanyId || this.selectedDepartmentId) &&
        Boolean(this.selectedManagerId)
      );
    },
    isDepartamentLocked() {
      return Boolean(
        this.isCompanyLocked ||
          !this.selectedCompanyId ||
          this.departmentsSelect.defaultValue
      );
    },
    isManagerLocked() {
      return Boolean(this.editMode || this.recipientsSelect.defaultValue);
    },
  },
  watch: {
    // следим за именением компании
    selectedCompanyId(newVal, oldVal) {
      if (this.firstLoadReady) {
        if (newVal !== oldVal) {
          if (this.selectedDepartmentId) {
            this.departmentsSelect.defaultValue = null;
            this.departmentsSelect.selectValue = [];
            this.departmentKey += 1;
          }
          if (this.selectedManagerId) {
            this.recipientsSelect.defaultValue = null;
            this.recipientsSelect.selectValue = [];
            this.recipientKey += 1;
          }
          if (newVal) {
            this.fetchDepartments(newVal);
            this.fetchManagers();
          } else {
            this.fetchAll();
          }
        }
      }
    },

    //следим за изменением департамента
    selectedDepartmentId(newVal, oldVal) {
      if (this.firstLoadReady && newVal !== oldVal) {
        if (newVal && !this.selectedManagerId) {
          this.fetchManagers(newVal);
        } else if (!this.departmentsSelect.defaultValue) {
          this.recipientsSelect.defaultValue = null;
          this.recipientsSelect.selectValue = [];
          this.recipientKey += 1;
          this.fetchManagers(newVal);
        }
      }
    },
    selectedManagerId(newVal, oldVal) {
      if (this.firstLoadReady && newVal !== oldVal) {
        if (newVal && !this.selectedDepartmentId && this.selectedCompanyId) {
          this.fetchDepartments(null, newVal);
        } else if (!newVal && this.departmentsSelect.defaultValue) {
          this.departmentsSelect.defaultValue = null;
          this.departmentsSelect.selectValue = [];
          this.departmentKey += 1;
          this.fetchDepartments(this.selectedCompanyId);
        } else if (newVal && this.departmentsSelect.defaultValue) {
          this.fetchDepartments(null, newVal);
        }
      }
    },
  },

  mounted() {
    // получаем данные вопроса (если режим редактирования)
    if (this.editMode) {
      this.getQuestionData();
    }
    this.splitData(this.defaultJSON);

    if (this.recipient) {
      this.fetchAll(this.recipient.value.code, "headId");
    } else if (this.department) {
      this.fetchAll(this.department.value.code, "departmentId");
    } else if (this.company) {
      this.fetchCompanies(this.company.value.code);
    } else {
      this.fetchAll();
    }
  },
};
</script>
<style scoped lang="scss">
.ask-question {
  &__button {
    width: 100%;
    margin-bottom: var(--v-rhythm-3);
  }
  &__header {
    @extend .h3;
    margin-bottom: 12px;
    &-description {
      @extend .body-2;
      margin-bottom: var(--v-rhythm-8);
    }
  }
  &__files {
    margin-top: var(--v-rhythm-8);
    display: flex;
    align-items: center;
  }
  &__checkbox-edit_mode {
    margin-top: var(--v-rhythm-2);
  }
  &__remove_icon {
    margin-left: var(--v-rhythm-2);
    cursor: pointer;
  }
  &__actions {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    margin-top: var(--v-rhythm-8);
  }
  &__tac {
    text-align: center;
    margin-bottom: var(--v-rhythm-0);
  }
  &__close_success_modal {
    margin-top: var(--v-rhythm-2);
  }
}
</style>