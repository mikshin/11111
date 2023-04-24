<template>
  <section class="stop_card">
    <FormTemplate
      class="stop__form"
      :class="{ loading: isLoading }"
      ref="form"
      @onSuccess="onSuccess"
      name="stop-card"
      @onValidate="onValid"
      refs="card_form"
      :key="formKey"
    >
      <span class="stop__headline"> Новая Стоп-карта </span>
      <template v-for="(input, key) in inputs">
        <Input :key="key" :input="input" v-if="input.type != 'checkboxList'" />
        <CheckboxList v-else :key="key" :input="input" />
      </template>
      <div class="stop__actions">
        <button
          class="primary-btn"
          type="submit"
          :disabled="!isFormValid"
          @click.prevent="sendForm"
        >
          Отправить
        </button>

        <button class="secondary-btn" type="reset" @click="resetForm">
          Очистить
        </button>
      </div>
    </FormTemplate>
  </section>
</template>
<script>
import Input from "@UI/inputTemplate.vue";
import CheckboxList from "@UI/inputs/CheckboxList.vue";
import FormTemplate from "@UI/formTemplate.vue";
import axios from "axios";
import { db } from "../../db";

export default {
  data() {
    return {
      formKey: 0,
      isLoading: false,
      isContinued: false,
      sequencing: "",
      isFormValid: true,
      isSended: false,
      inputs: [
        {
          type: "date",
          placeholder: "Дата",
          required: true,
          name: "INCIDENT_DATE",
          toDate: new Date(),
        },
        {
          type: "select",
          placeholder: "Подразделение",
          required: true,
          name: "DEPARTMENT",
          multiple: false,
          searchable: false,
          selectValue: [
            {
              label: "АО «НафтаГаз»",
              code: "ZUP_NG",
            },
            {
              label: "ООО «НГ-Бурение»",
              code: "ZUP_NGB",
            },
            {
              label: "ООО «НГ-Сервис»",
              code: "ZUP_NGS",
            },
          ],
        },
        {
          type: "select",
          placeholder: "Объекты работ",
          required: true,
          name: "OBJECT",
          multiple: false,
          searchable: false,
          selectValue: [],
        },
        {
          type: "select",
          placeholder: "Причина оформления",
          required: true,
          name: "REASON",
          multiple: false,
          searchable: false,
          selectValue: [
            {
              label: "Опасное действие",
              code: "dangerous_action",
            },
            {
              label: "Опасное условие",
              code: "dangerous_condition",
            },
            {
              label: "Аварийная ситуация",
              code: "emergency_situation",
            },
            {
              label: "Происшествие без последствий",
              code: "incident_without_conseq",
            },
          ],
        },
        {
          type: "textarea",
          placeholder: "Описание места происшествия",
          required: true,
          name: "PLACE_DESCRIPTION",
          maxLength: 1700,
        },
        {
          type: "radio",
          placeholder: "Смогли ли вы исправить проблему?",
          required: true,
          name: "FIXED",
          placeholderShown: true,
          radioValue: [
            {
              name: "Да",
              code: "Y",
            },
            {
              name: "Нет",
              code: "N",
            },
          ],
        },
        {
          type: "file",
          placeholder: "Файлы",
          name: "FILE",
          multiple: true,
          maxSize: 52428800,
          accept: ".mp3, .mp4, .avi, .wav, .png, .gif, .jpg, .jpeg",
        },
        {
          type: "textarea",
          placeholder: "Опишите наблюдаемую ситуацию",
          name: "SITUATION_DESCRIPTION",
          maxLength: 1700,
        },
        {
          type: "textarea",
          placeholder: "Какого рода действие было предпринято?",
          name: "DONE_ACTION",
          maxLength: 700,
        },
        {
          type: "textarea",
          placeholder: "Наблюдение происшествия без последствий",
          name: "DESCRIPTION_SITUATION_WITHOUT_DANGER",
          maxLength: 700,
        },
        {
          type: "checkboxList",
          placeholder: "Люди",
          name: "PEOPLE",
          checkboxValue: [
            {
              placeholder: "Опасное действие",
              name: "dangerous_action",
            },
            {
              placeholder: "Опасное положение",
              name: "dangerous_position",
            },
            {
              placeholder: "Не использование СИЗ",
              name: "not_use_siz",
            },
          ],
        },
        {
          type: "checkboxList",
          placeholder: "Окружающая среда",
          name: "ENVIRONMENT",
          checkboxValue: [
            {
              placeholder: "Шум",
              name: "noise",
            },
            {
              placeholder: "Холод",
              name: "cold",
            },
            {
              placeholder: "Свет",
              name: "light",
            },
          ],
        },
        {
          type: "checkboxList",
          placeholder: "Опасные факторы",
          name: "DANGEROUS_FACTOR",
          checkboxValue: [
            {
              placeholder: "Химия",
              name: "chemical",
            },
            {
              placeholder: "Электричество",
              name: "electricity",
            },
            {
              placeholder: "Механические дефекты",
              name: "mechanical_defects",
            },
            {
              placeholder: "Движущиеся механизмы без ограждения",
              name: "moving_machines",
            },
            {
              placeholder: "Давление",
              name: "pressure",
            },
          ],
        },
        {
          type: "checkboxList",
          placeholder: "Процедуры",
          name: "PROCEDURE",
          checkboxValue: [
            {
              placeholder: "Невыполнимые",
              name: "impossible",
            },
            {
              placeholder: "Непонятные",
              name: "incomprehensible",
            },
            {
              placeholder: "Неизвестные",
              name: "unknown",
            },
            {
              placeholder: "Неподходящие",
              name: "unsuitable",
            },
          ],
        },
        {
          type: "checkboxList",
          placeholder: "Инструменты и оборудование",
          name: "INSTRUMENTS",
          checkboxValue: [
            {
              placeholder: "Неисправные для работы",
              name: "broken",
            },
            {
              placeholder: "Опасное положение",
              name: "dangerous_position",
            },
            {
              placeholder: "Неподходящие для процесса",
              name: "unsuitable",
            },
            {
              placeholder: "Неправильное использование",
              name: "wrong_usage",
            },
          ],
        },
      ],
      files: [],
      descriptions: [],
    };
  },
  components: {
    Input,
    FormTemplate,
    CheckboxList,
  },
  mounted() {
    this.$nextTick(() => {
      this.$el.scrollIntoView({ behavior: "smooth" });
    });
    axios.get("/mobileapp/api/stopCardsDetail/fields").then(
      (response) => {
        this.inputs[2].selectValue = this.createObjects(
          response.data.OBJECT.values
        );
        this.inputs = this.inputs.map((input) => {
          if (response.data[input.name]) {
            const newInput = {
              ...input,
              required: response.data[input.name].required,
            };
            return newInput;
          } else {
            return input;
          }
        });
        // обновил поля локально
        db.stopCardFields.where("id").equals(1).delete();
        db.stopCardFields.add({ id: 1, data: response.data });
      },
      (error) => {
        console.log(error);
        // В случае ошибки гружу поля из indexedDB
        db.stopCardFields.toArray((response) => {
          this.inputs[2].selectValue = this.createObjects(
            response[0].data.OBJECT.values
          );
        });
      }
    );
    axios.post("/mobileapp/api/statistic/add", {
      ACTION_CODE: "stop.cards.new",
      MODULE: "stop.cards",
      EXTRA_PARAMS: {
        TITLE: "Создание Стоп-карты",
        URL: "/stop_cards/new",
      },
    });
  },
  methods: {
    resetForm() {
      this.formKey++;
    },
    onValid(data) {
      this.isFormValid = data.data;
    },
    createObjects(values) {
      let objectValue = [];
      for (let key in values) {
        objectValue.push({
          label: values[key],
          code: key,
        });
      }
      return objectValue;
    },
    async sendForm() {
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
              this.files.push(new File([i], newName, { type: i.type }));
            });
            for (let k = 0; k < filesArr.length; k++) {
              form.append(item.input.name + "[]", filesArr[k]);
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

      try {
        this.isLoading = true;
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/stopCardsDetail/`,
          data: form,
        });

        if (response.data.status === "success") {
          this.isSended = true;
          this.$router.push("/stop_cards/" + response.data.id);
        }
      } catch (error) {
        console.log(error);
        this.$emit("error", error);
        db.stop.add({
          id: Date.now(),
          data: this.convertFormData(form),
          files: this.files,
        });
        this.files = [];
      } finally {
        this.isLoading = false;
      }
    },
    onSuccess(data) {
      this.isSended = true;
      if (data) {
        this.stopMessage = "Стоп-карта отправлена";
      } else if (window.navigator.onLine) {
        this.stopMessage =
          "Произошла неизвестная ошибка. Обратитесь в поддержку.";
      } else {
        this.stopMessage =
          "Отсутствует подключение к интернету. Стоп-карта сохранена на устройстве и будет отправлена при подключении к интернету.";
      }
    },
    convertFormData(form) {
      let arr = [];
      form.forEach(function (value, key) {
        arr.push({ [key]: value });
      });
      return arr;
    },
  },
};
</script>

<style lang="scss" scoped>
.stop {
  &__container {
  }
  &__breadcrumbs {
  }

  @include laptop {
    &__container {
      padding-right: 0;
      padding-left: 0;
    }

    &__breadcrumbs {
      padding-left: var(--mainPadding);
    }
  }
  &__information {
    display: flex;
    align-items: flex-start;

    @include laptop {
      flex-direction: column-reverse;
    }
  }
  &__wrapper {
    width: 50%;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;

    &:last-child {
      margin-right: 0;
    }

    &:only-child {
      width: 100%;
    }

    h2 {
      font-weight: bold;
      font-size: 24px;
      line-height: 28px;
      margin: 0;
      margin-bottom: 16px;
      color: var(--gray500);
    }

    @include laptop {
      width: 100%;
      padding: var(--mainPadding);
    }
    &--static {
      position: sticky;
      top: calc(var(--headerHeight) + var(--v-rhythm-10));
      // max-height: 200px;
    }
  }
  &__description {
    background-color: #fff;
    word-break: break-all;
    border: 2px solid var(--gray200);
    padding: 40px;
  }
  &__form {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    margin-top: var(--v-rhythm-20);
    @include laptop {
      flex-direction: column;
    }
  }
  &__headline {
    @extend .h2;
    margin-bottom: var(--v-rhythm-8);
    display: block;
  }
  &__actions {
    display: flex;
    margin-top: var(--v-rhythm-8);
    button {
      margin-right: 16px;
    }
  }
  .input_container {
    margin-top: var(--v-rhythm-6);
  }
}
.stop_card {
  width: 100%;
  box-sizing: border-box;

  @include desktop {
    padding: var(--mainPadding) 0;
  }
}

.form_wrapper {
  width: 50%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  h3 {
    width: 100%;
  }

  @include laptop {
    width: 100%;
    border: none !important;
    padding: 0 !important;
  }
}

fieldset {
  padding: 0;
  margin: 0;
  margin-top: var(--v-rhythm-8);
  border: none;
}

.final_information {
  width: 100%;
}
</style>
