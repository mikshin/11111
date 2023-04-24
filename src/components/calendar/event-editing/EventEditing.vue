<template>
  <!-- !TODO Необходим рефакторинг. Разнести на две модалки - Создание события и бронирование переговорных -->
  <div class="event-editing__conent" :class="{ loading: isLoading }">
    <div class="event-editing__title">{{ modalTitle }}</div>
    <Form class="event-editing__form" ref="form" @onValidate="onValid">
      <Input
        class="event-editing__form-input"
        v-if="!isBooking"
        :input="companyLevel"
        @onChange="setCompanyLevel"
        :ref="'companyLevel'"
      />

      <Input
        class="event-editing__form-input"
        :key="key"
        v-for="(input, key) in inputs"
        :input="input"
      />

      <Input
        class="event-editing__form-input"
        :input="eventDate"
        @onChange="getDate"
      />
      <div
        class="event-editing__form-input event-editing__form-time"
        v-if="eventDay"
      >
        <Input
          class="event-editing__form-time-input"
          :input="eventTimeFrom"
          @onChange="getTime"
        />
        <Input
          class="event-editing__form-time-input"
          :input="eventTimeTo"
          :key="eventTimeToKey"
          @onChange="getTime"
        />
      </div>

      <Input
        class="event-editing__form-input"
        :input="members"
        @onDelete="deletePerson"
        @onAdd="addPerson"
      />
      <Input class="event-editing__form-input" :input="repite" />

      <Input
        class="event-editing__form-input"
        :class="{ loading: companyInputIsLoading }"
        :input="companies"
        :lazyValidation="eventData ? false : true"
        @onChange="pickCompany"
      />
      <Input
        class="event-editing__form-input"
        :class="{ loading: companyInputIsLoading }"
        :key="depkey"
        :input="departments"
        :ref="'departments'"
        v-if="departments.selectValue.length > 0"
      />

      <Input
        class="event-editing__form-input"
        v-if="!isBooking"
        :input="otherPlaces"
      />

      <template v-if="isBooking">
        <Input
          class="event-editing__form-input"
          :class="{ loading: officeInputIsLoading }"
          :input="office"
          :lazyValidation="eventData ? false : true"
          @onChange="pickOffice"
        />
        <Input
          class="event-editing__form-input"
          :class="{ loading: officeInputIsLoading }"
          :key="roomkey"
          :input="room"
          :ref="'room'"
          v-if="room.selectValue.length > 0"
        />
        <Input
          class="event-editing__form-input"
          :input="service"
          @onChange="pickService"
        />

        <Input
          class="event-editing__form-input"
          v-if="files.isVisible"
          :input="files"
        />
        <!-- Этот блок с файлами появляется при редактировании задачи, если в ней есть файлы -->
        <div
          class="event-editing__form-files"
          v-if="defaultFilesData && defaultFilesData.length"
        >
          <AppDocument
            class="event-editing__form-file"
            v-for="file in defaultFilesData"
            :key="file.ID"
            :fileTitle="file.originalName"
            :fileSize="file.fileSize"
            :fileExtension="file.extension"
            :fileLink="file.fileLink"
            :fileId="file.fileId"
            :hasButtonCross="true"
            @clickCross="deleteFile"
          />
        </div>
        <Input
          class="event-editing__form-input"
          v-if="mailsList.isVisible"
          :input="mailsList"
        />
      </template>

      <div class="event-editing__form-creator">
        <div class="event-editing__form-creator-title">Организатор</div>
        <SimplePersonCard
          class="event-editing__form-creator-person"
          :avatar="{
            alt: creator.FULL_NAME,
            src: creator.USER_PHOTO,
          }"
          :fullName="creator.FULL_NAME"
          :isMiniSize="true"
          :link="true"
          :id="creator.ID"
          :vacation="creator.VACATION"
          :fired="creator.FIRED"
        />
      </div>

      <div class="event-editing__form-btns">
        <button
          class="primary-btn"
          @click="sendForm"
          :disabled="!isFormValid || !isValidInner"
        >
          Сохранить
        </button>
        <button class="secondary-btn" type="reset" @click="$emit('cancel')">
          Отменить
        </button>
      </div>
    </Form>
  </div>
</template>

<script>
import axios from "axios";
import Form from "@/components/UI/formTemplate.vue";
import Input from "@/components/UI/inputTemplate.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import AppDocument from "@/components/UI/document/AppDocument.vue";

export default {
  name: "EventEditing",

  components: {
    Form,
    Input,
    SimplePersonCard,
    AppDocument,
  },

  props: {
    modalTitle: {
      type: String,
      required: false,
      default: "Новое событие",
    },

    eventData: {
      type: Object,
      required: false,
    },

    eventMembers: {
      type: Array,
      required: false,
    },

    isBooking: {
      type: Boolean,
      required: false,
      default: false,
    },

    defaultFiles: {
      type: Array,
      required: false,
    },
  },

  data() {
    return {
      officeInputIsLoading: false,
      companyInputIsLoading: false,
      depkey: Date.now(),
      roomkey: Date.now() + 1,
      memberAdd: [],
      memberDelete: [],
      defaultFilesData: this.defaultFiles,
      deleteFiles: [],
      eventDay: "",
      eventTimeStart: "",
      eventTimeFinish: "",
      eventTimeToKey: Date.now() + 1,

      isLoading: false,
      isFormValid: false,

      companyLevel: {
        name: "company_level",
        placeholder: "Событие уровня компании",
        type: "checkbox",
        defaultValue: this.eventData ? this.eventData.company_level : false,
      },

      inputs: [
        {
          type: "text",
          placeholder: "Название мероприятия",
          required: true,
          name: "name",
          maxLength: 80,
          defaultValue: this.eventData ? this.eventData.name : null,
          autocomplete: "off",
        },
        {
          type: "textarea",
          placeholder: "Описание события",
          required: false,
          name: "description",
          maxLength: 200,
          defaultValue: this.eventData
            ? this.eventData.description?.replaceAll("<br />", "")
            : null,
        },
      ],

      eventDate: {
        type: "date",
        placeholder: "Дата",
        required: true,
        name: "date",
        defaultValue: this.eventData
          ? new Date(this.eventData.active_from * 1000).toLocaleDateString(
              "ru-RU"
            )
          : null,
        fromDate: this.eventData
          ? ""
          : new Date(new Date().setHours(0, 0, 0, 0)),
      },

      eventTimeTo: {
        type: this.isBooking ? "timeInterval" : "time",
        placeholder: "Завершение",
        required: true,
        name: "active_to",
        defaultValue: this.eventData
          ? this.convertTimeTimestampToString(this.eventData.active_to * 1000)
          : null,
        limiter: null,
        disabled: true,
      },

      members: {
        type: "search-persons",
        name: "members",
        placeholder: "Участник",
        required: false,
        autocomplete: "off",
        defaultValue: this.eventMembers ? this.eventMembers : null,
      },

      repite: {
        type: "select",
        placeholder: "Повторяемость события",
        required: true,
        name: "repite",
        multiple: false,
        selectValue: [],
        defaultValue: this.eventData ? this.eventData.repite : null,
        disabled: this.eventData ? true : false,
      },

      companies: {
        type: "select",
        placeholder: "Компания",
        name: "company",
        defaultValue: this.eventData ? this.eventData.company : [],
        selectValue: [],
        multiple: this.eventData ? this.eventData.company_level : false,
        required: this.eventData ? this.eventData.company_level : false,
      },

      departments: {
        type: "select",
        placeholder: "Подразделение",
        name: "department",
        multiple: false,
        selectValue: [],
        defaultValue: this.eventData ? this.eventData.department : null,
      },

      otherPlaces: {
        name: "other_place",
        placeholder: "Место проведения",
        type: "text",
        defaultValue: this.eventData ? this.eventData.other_place : null,
        autocomplete: "off",
        required: false,
      },

      office: {
        type: "select",
        placeholder: "Офис",
        name: "office",
        defaultValue: this.eventData ? this.eventData.office : [],
        selectValue: [],
        multiple: false,
        required: true,
      },

      room: {
        type: "select",
        placeholder: "Переговорная",
        name: "room",
        multiple: false,
        selectValue: [],
        defaultValue: this.eventData ? this.eventData.room : null,
        required: true,
      },

      service: {
        type: "select",
        placeholder: "Дополнительные сервисы",
        name: "service",
        defaultValue: this.eventData ? this.eventData.service : [],
        selectValue: [],
        multiple: true,
        required: false,
      },

      files: {
        type: "file",
        name: "FILES",
        placeholder: "Печать материалов",
        maxSize: 5242880,
        multiple: true,
        required: false,
        defaultValue: this.eventData ? this.eventData.files : [],
        isVisible: false,
        accept:
          ".pdf, .rar, .7z, .zip, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .png, .jpg, .jpeg",
      },

      mailsList: {
        type: "textarea",
        placeholder: "Внешние участники события (электронная почта)",
        required: false,
        name: "external_participient",
        defaultValue: this.eventData
          ? this.eventData.external_participient
          : null,
        isVisible: false,
      },
    };
  },

  computed: {
    isValidInner() {
      if (this.activeFrom?.length === 16 && this.activeTo?.length === 16) {
        return true;
      }
      return false;
    },

    eventTimeFrom() {
      return {
        type: this.isBooking ? "timeInterval" : "time",
        placeholder: "Начало",
        required: true,
        name: "active_from",
        defaultValue: this.eventData
          ? this.convertTimeTimestampToString(this.eventData.active_from * 1000)
          : null,

        limiter:
          this.eventData || !this.eventDayIsToday
            ? null
            : this.convertTimeTimestampToString(),
      };
    },

    eventDayIsToday() {
      const today = new Date().toLocaleDateString("ru-RU");
      return this.eventDay === today;
    },

    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },

    creator() {
      if (this.eventData) {
        return {
          FULL_NAME: this.eventData.creator.fullName,
          ID: this.eventData.creator.id,
          USER_PHOTO: this.eventData.creator.photo,
          VACATION: this.eventData.creator.VACATION,
        };
      } else {
        return this.currentUser;
      }
    },

    activeFrom() {
      if (!this.eventDay || !this.eventTimeStart) {
        return null;
      } else {
        return `${this.eventDay} ${this.eventTimeStart}`;
      }
    },

    activeTo() {
      if (!this.eventDay || !this.eventTimeFinish) {
        return null;
      } else {
        return `${this.eventDay} ${this.eventTimeFinish}`;
      }
    },

    startMoreThanFinish() {
      if (this.eventTimeStart && this.eventTimeFinish) {
        const startHour = +this.eventTimeStart.slice(0, 2);
        const startMinut = +this.eventTimeStart.slice(-2);
        const finisHour = +this.eventTimeFinish.slice(0, 2);
        const finishMinut = +this.eventTimeFinish.slice(-2);

        if (finisHour < startHour) {
          return true;
        } else if (finisHour === startHour && finishMinut <= startMinut) {
          return true;
        }
        return false;
      }
      return false;
    },
  },

  methods: {
    convertTimeTimestampToString(timestamp) {
      const date = timestamp ? new Date(timestamp) : new Date();
      return new Date(date)
        .toLocaleDateString("ru-RU", {
          hour: "numeric",
          minute: "numeric",
        })
        .slice(-5);
    },

    deleteFile(fileID) {
      this.defaultFilesData = this.defaultFilesData.filter(
        (item) => item.fileId !== fileID
      );

      this.deleteFiles.push(fileID);
    },

    getDate(e) {
      this.eventDay = e.data.newValue ? e.data.newValue : "";

      // если удаляем дату, то чистим дефолтные значения у начала и завершения
      if (!e.data.newValue) {
        this.eventTimeFrom.defaultValue = "";
        this.eventTimeTo.defaultValue = "";
      }
    },

    getTime(e) {
      const name = e.data.input.name;
      const value = e.data.newValue ? e.data.newValue : "";
      const type = e.data.input.type;

      // Срабатывает, при изменении времени начала
      if (name === "active_from") {
        this.eventTimeStart = value;

        // если время начала выбрано больше чем время завершения, обнуляем значение времени завершения
        if (this.startMoreThanFinish) {
          this.eventTimeTo.defaultValue = "";
        } else if (this.eventTimeFinish) {
          // иначе сохраняем данные времени завершения
          this.eventTimeTo.defaultValue = this.eventTimeFinish;
        }

        // Если выбрана время начала, то разблокируем выбор времени завершения. И наоборот
        if (value) {
          this.eventTimeTo.disabled = false;
        } else {
          this.eventTimeTo.defaultValue = "";
          this.eventTimeTo.disabled = true;
        }

        // в компонент выбора времени завершения добавляем ограничение по времени
        this.chengeEventTimeToLimiter(value, type);
        // Переинициализируем компонент с выбором времени завершения
        this.eventTimeToKey = Date.now();
      }

      // Срабатывает, при изменении времени завершения
      if (name === "active_to") {
        this.eventTimeFinish = value;
      }
    },

    chengeEventTimeToLimiter(time, typeInput) {
      if (time) {
        let valueHours = time.slice(0, 2);
        let valueMinuts = time.slice(-2);

        if (typeInput === "timeInterval") {
          if (valueMinuts === "00") {
            valueMinuts = "30";
          } else if (valueMinuts === "30") {
            valueHours =
              +valueHours < 9 ? `0${+valueHours + 1}` : `${+valueHours + 1}`;
            valueMinuts = "00";
          }
        }

        this.eventTimeTo.limiter = `${valueHours}:${valueMinuts}`;
      } else {
        this.eventTimeTo.limiter = null;
      }
    },

    async pickCompany(e) {
      // Зануляем дефолтное значение компании, что бы изменение департамента не срабатывало дважды
      this.companies.defaultValue = null;

      // Удаляем выбранное подразделение при изменении компании
      if (this.$refs.departments) {
        this.departments.defaultValue = [];
        this.depkey += 1;
      }

      if (this.$refs.companyLevel) {
        // При создании события
        // Проверяем, что не выбрано событие уровня компании и выбрана компания
        if (
          !this.$refs.companyLevel.newValue &&
          e.data.newValue &&
          (e.data.newValue.code || e.data.newValue[0])
        ) {
          this.departments.selectValue = await this.getDepartments(
            // Проверка, т.к. мультиселекты возвращают массив, а простые объект
            e.data.newValue.code
              ? e.data.newValue.code
              : e.data.newValue[0].code
          );
          this.depkey += 1;
          return;
        }
      } else {
        // При бронировании переговорных
        if (e.data.newValue && (e.data.newValue.code || e.data.newValue[0])) {
          this.departments.selectValue = await this.getDepartments(
            // Проверка, т.к. мультиселекты возвращают массив, а простые объект
            e.data.newValue.code
              ? e.data.newValue.code
              : e.data.newValue[0].code
          );
          this.depkey += 1;
          return;
        }
      }
      // Иначе обнуляем selectValue у департамента, тем самым скрывая его
      this.departments.selectValue = [];
    },

    async pickOffice(e) {
      // Зануляем дефолтное значение офиса, что бы изменение офиса не срабатывало дважды
      this.office.defaultValue = null;

      // Удаляем выбранную переговорку при изменении офиса
      if (this.$refs.room) {
        this.room.defaultValue = [];
        this.roomkey += 1;
      }

      // Проверяем что выбран офис
      if (e.data.newValue && (e.data.newValue.code || e.data.newValue[0])) {
        this.room.selectValue = await this.getRoom(
          // Проверка, т.к. мультиселекты возвращают массив, а простые объект
          e.data.newValue.code ? e.data.newValue.code : e.data.newValue[0].code
        );
        this.roomkey += 1;
        return;
      }
      // Иначе обнуляем selectValue у переговорки, тем самым скрывая его
      this.room.selectValue = [];
    },

    async pickService(e) {
      const value = e.data.newValue;
      if (value && value.length) {
        this.files.isVisible = value.find((item) => item.code === "print")
          ? true
          : false;
        this.mailsList.isVisible = value.find((item) => item.code === "vks")
          ? true
          : false;
      } else {
        this.files.isVisible = false;
        this.mailsList.isVisible = false;
      }
    },

    async setCompanyLevel(e) {
      this.companies.multiple = e.data.newValue;
      this.companies.required = e.data.newValue;
      if (!e.data.newValue) this.departments.selectValue = [];
    },

    onValid(data) {
      this.isFormValid = data.data;
    },

    getDataForm() {
      let form = new FormData();
      for (let child in this.$refs.form.$children) {
        let item = this.$refs.form.$children[child];

        if (item.files) {
          if (item.input.type === "file") {
            const filesArr = [];
            item._data.files.forEach((i) => {
              const newName = /\s/g.test(i.name)
                ? i.name.trim().replace(/\s/g, "_")
                : i.name;
              filesArr.push(new File([i], newName, { type: i.type }));
            });
            for (let k = 0; k < filesArr.length; k++) {
              form.append(`${item.input.name}[]`, filesArr[k]);
            }
          }
        } else if (item.newValue) {
          if (item.input.type === "select") {
            if (Array.isArray(item.newValue)) {
              item.newValue
                .map((i) => i.code)
                .forEach((j) => {
                  form.append(`${item.input.name}[]`, j);
                });
            } else {
              form.append(item.input.name, item.newValue.code);
            }
          } else if (item.input.name === "company_level") {
            item.newValue && form.append(item.input.name, "Y");
          } else if (item.input.type === "search-persons") {
            for (let val in item.newValue) {
              form.append(`${item.input.name}[]`, item.newValue[val].ID);
            }
          } else {
            if (
              typeof item.newValue === "object" ||
              Array.isArray(item.newValue)
            ) {
              if (item.input.name !== "FILES") {
                for (let val in item.newValue) {
                  form.append(`${item.input.name}[]`, item.newValue[val]);
                }
              }
            } else {
              if (
                item.input.name !== "active_from" &&
                item.input.name !== "active_to" &&
                item.input.name !== "date"
              ) {
                form.append(item.input.name, item.newValue);
              }
            }
          }
        }
      }

      // Добавляем новых участников
      if (this.memberAdd) {
        for (let i = 0; i < this.memberAdd.length; i++) {
          form.append("memberAdd[]", this.memberAdd[i]);
        }
      }

      // Удаляем старых участников
      if (this.memberDelete) {
        for (let i = 0; i < this.memberDelete.length; i++) {
          form.append("memberDelete[]", this.memberDelete[i]);
        }
      }

      // Удаляем старые файлы
      if (this.deleteFiles.length) {
        for (let val in this.deleteFiles) {
          form.append(`filesDelete[]`, this.deleteFiles[val]);
        }
      }

      // Добавляем дату начала
      if (this.activeFrom) {
        form.append(`active_from`, this.activeFrom);
      }

      // Добавляем дату завершения
      if (this.activeTo) {
        form.append(`active_to`, this.activeTo);
      }

      return form;
    },

    sendForm() {
      this.$emit("sendForm", this.getDataForm());
    },

    async getEventChangedField() {
      try {
        this.isLoading = true;

        const response = await axios({
          method: "get",
          url: `/mobileapp/api/calendar/eventChangedField`,
        });

        this.repite.selectValue = response.data.repite;
        this.companies.selectValue = response.data.company;
        this.office.selectValue = response.data.office;
        this.service.selectValue = response.data.service;
      } catch (error) {
        alert("Ошибка загрузки данных");
      } finally {
        this.isLoading = false;
      }
    },

    async getDepartments(companyId) {
      try {
        this.companyInputIsLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/calendar/eventDep?companyId=${companyId}`,
        });
        return response.data;
      } catch (error) {
        return [];
      } finally {
        this.companyInputIsLoading = false;
      }
    },

    async getRoom(officeId) {
      try {
        this.officeInputIsLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/calendar/eventRoom?officeId=${officeId}`,
        });
        return response.data;
      } catch (error) {
        return [];
      } finally {
        this.officeInputIsLoading = false;
      }
    },

    deletePerson(data) {
      if (!this.memberDelete.includes(data.id)) {
        this.memberDelete.push(data.id);
      }
      // удаление из списка добавляемых
      this.memberAdd = this.memberAdd.filter((i) => i != data.id);
    },

    addPerson(data) {
      if (!this.memberAdd.includes(data.ID)) {
        this.memberAdd.push(data.ID);
      }
      // удаление из списка удаляемых
      this.memberDelete = this.memberDelete.filter((i) => i != data.ID);
    },
  },

  watch: {},

  mounted() {
    this.getEventChangedField();
  },
};
</script>

<style scoped lang="scss">
.event-editing {
  &__title {
    margin-bottom: var(--v-rhythm-8);

    @extend .h3;
    color: var(--gray900);
  }

  &__form {
  }

  &__form-input {
    // Правим стили плагина, что бы тултип не вылезал за пределы попапа. !TODO посмотреть плагин, возможно есть настройки.
    ::v-deep {
      .ql-snow .ql-tooltip {
        position: unset;
        transform: unset;
        white-space: unset;
      }
    }
  }

  &__form-time {
    margin: var(--v-rhythm-4) 0;

    display: flex;
    gap: var(--v-rhythm-2);
  }

  &__form-time-input {
    margin-top: unset !important;
    flex-grow: 1;
  }

  &__form-files {
    margin-bottom: var(--v-rhythm-4);
  }

  &__form-file {
    margin-top: var(--v-rhythm-2);
  }

  &__form-creator {
    margin: var(--v-rhythm-6) 0;
    display: flex;
    flex-direction: column;
  }

  &__form-creator-title {
    padding: var(--v-rhythm-1) 0;
    margin-bottom: var(--v-rhythm-2);

    @extend .caption-2;
    color: var(--gray500);
  }

  &__form-creator-person {
    align-self: flex-start;
  }

  &__form-btns {
    margin-top: var(--v-rhythm-8);

    display: flex;
    gap: var(--v-rhythm-4);
  }

  @media screen and (max-width: 500px) {
    &__form-input {
      // Правим стили плагина, что бы тултип не вылезал за пределы попапа. !TODO посмотреть плагин, возможно есть настройки.
      ::v-deep {
        .ql-snow .ql-tooltip[data-mode="link"]::before {
          display: block;
        }
      }
    }
  }
}
</style>