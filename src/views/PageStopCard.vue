<template>
  <div class="page-stop-card">
    <AppPage
      class="page-stop-card__app-page"
      :pageTitle="pageTitle"
      :breadcrumbsDopName="breadcrumbsDopName"
    >
      <MainSidebar
        class="page-stop-card__main-sidebar"
        :class="{ loading: isLoading }"
      >
        <template #main>
          <Component
            :is="printButtonOptions.component"
            v-if="!breakpoints.phones"
            class="page-stop-card__print-btn primary-btn"
            :class="{
              loading: isPreparationForPrinting,
            }"
            v-bind="printButtonOptions.props"
            v-on="printButtonOptions.handlers"
          >
            <UserIcons :iconName="'print'" /><span>Распечатать Стоп-карту</span>
          </Component>
          <PrintIframe :src="stopCardBlobURL"></PrintIframe>

          <Input
            v-if="isEditor"
            :input="input"
            @onChange="makePotentialWinner"
            class="page-stop-card__potential_winner"
          />

          <ul class="page-stop-card__fields" v-if="stopCardsField">
            <li
              class="page-stop-card__field"
              v-for="(field, i) in fields"
              :key="i"
            >
              <span class="page-stop-card__field-title">{{ field.title }}</span>
              <div
                class="page-stop-card__field-value-file"
                v-if="
                  field.title === 'Прикрепленные файлы' && field.value != ''
                "
              >
                <AppDocument
                  class="page-stop-card__app-document"
                  v-for="file in field.value"
                  :key="file.fileId"
                  :fileTitle="file.originalName"
                  :fileSize="file.fileSize"
                  :fileExtension="file.extension"
                  :fileLink="file.fileLink"
                />
              </div>
              <span v-else class="page-stop-card__field-value">{{
                field.value ? fieldValue(field.value) : "—"
              }}</span>
            </li>
          </ul>
        </template>
      </MainSidebar>
    </AppPage>
  </div>
</template>

<script>
import axios from "axios";
import { Browser, getBlobLinkFromFileLink } from "@utils";

import AppPage from "@UI/page/AppPage.vue";
import MainSidebar from "@UI/page/MainSidebar.vue";
import AppDocument from "@UI/document/AppDocument.vue";
import Input from "@UI/inputTemplate.vue";
import PrintIframe from "@UI/PrintFrame.vue";

export default {
  name: "PageStopCard",

  components: { AppPage, MainSidebar, AppDocument, Input, PrintIframe },

  props: {},

  data() {
    return {
      id: null,
      stopCardsField: null,
      isLoading: false,
      potentialWinner: undefined,
      isEditor: false,
      isPreparationForPrinting: false,
      possibleUsersStopCardActions: null,
      input: {
        name: "POTENTIAL_WINNER",
        placeholder: "Потенциальный победитель",
        type: "checkbox",
      },
      stopCardBlobURL: null,
    };
  },

  computed: {
    breakpoints() {
      return this.$store.getters.breakpoints;
    },

    fields() {
      return [
        {
          title: "Дата инцидента",
          value: this.stopCardsField.INCIDENT_DATE,
        },
        {
          title: "Подразделение",
          value: this.stopCardsField.DEPARTMENT,
        },
        {
          title: "Объект работ",
          value: this.stopCardsField.OBJECT,
        },
        {
          title: "Причина оформления",
          value: this.stopCardsField.REASON,
        },
        {
          title: "Статус решения проблемы",
          value: this.stopCardsField.FIXED,
        },
        {
          title: "Прикрепленные файлы",
          value: this.stopCardsField.FILE,
        },
        {
          title: "Описание места проишествия",
          value: this.stopCardsField.PLACE_DESCRIPTION.TEXT,
        },
        {
          title: "Описание наблюдаемой ситуации",
          value: this.stopCardsField.SITUATION_DESCRIPTION.TEXT,
        },
        {
          title: "Какое действие было предпринято",
          value: this.stopCardsField.DONE_ACTION.TEXT,
        },
        {
          title: "Наблюдение происшествия без последствий",
          value: this.stopCardsField.DESCRIPTION_SITUATION_WITHOUT_DANGER.TEXT,
        },
        {
          title: "Люди",
          value: this.stopCardsField.PEOPLE,
        },
        {
          title: "Окружающая среда",
          value: this.stopCardsField.ENVIRONMENT,
        },
        {
          title: "Инструменты и оборудование",
          value: this.stopCardsField.INSTRUMENTS,
        },
        {
          title: "Процедуры",
          value: this.stopCardsField.PROCEDURE,
        },
        {
          title: "Опасные факторы",
          value: this.stopCardsField.DANGEROUS_FACTOR,
        },
      ];
    },

    isCanPrint() {
      return this.possibleUsersStopCardActions?.includes("export");
    },

    pageTitle() {
      return `${this.$route.name} №${this.id}`;
    },

    breadcrumbsDopName() {
      return ` №${this.$route.params.stopCardId}`;
    },

    printButtonOptions() {
      // Для Сафари открывается отдельная страница печати, так как там на уровне браузера ломается повторная распечатка фрейма в одном и том же окне
      return Browser.isSafari()
        ? {
            component: "router-link",
            props: {
              to: "print",
              append: true,
              target: "_blank",
            },
          }
        : {
            component: "button",
            props: {
              type: "button",
            },
            handlers: {
              click: () => {
                this.getPrintableStopCardPDF();
              },
            },
          };
    },
  },

  methods: {
    fetchStopCardsData() {
      try {
        this.isLoading = true;
        axios({
          method: "get",
          url: `/mobileapp/api/stopCardsDetail/list`,
          params: {
            stopCardId: this.id,
          },
        }).then((response) => {
          this.stopCardsField = response.data.fields.data[0];

          if (
            Object.keys(response.data.fields.data[0]).includes(
              "POTENTIAL_WINNER"
            )
          ) {
            this.isEditor = true;
            this.potentialWinner =
              response.data.fields.data[0].POTENTIAL_WINNER;
            this.input.defaultValue = this.potentialWinner;
          }

          this.possibleUsersStopCardActions = response.data?.action;
        });
      } catch (error) {
        console.log("error");
      } finally {
        this.isLoading = false;
      }
    },

    async getPrintableStopCardPDF() {
      try {
        this.stopCardBlobURL = null;
        this.isPreparationForPrinting = true;
        const response = await axios.get(
          "/mobileapp/api/stopCardsDetail/export",
          {
            params: {
              stopCardId: this.id,
            },
          }
        );

        if (response.data) {
          this.stopCardBlobURL = await getBlobLinkFromFileLink(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isPreparationForPrinting = false;
      }
    },

    fieldValue(field) {
      let value;
      if (typeof field === "object") {
        value = field.length === 0 ? "—" : Object.values(field).join(", ");
      } else {
        value = field;
      }
      return value;
    },

    makePotentialWinner(e) {
      if (this.id && this.isEditor && e.data.newValue != this.potentialWinner) {
        axios
          .post("/mobileapp/api/stopCardsDetail/setPotentionalWinner", {
            type: this.potentialWinner ? "unset" : "set",
            card_id: this.id,
          })
          .then(() => {
            this.potentialWinner = !this.potentialWinner;
          });
      }
    },
  },

  watch: {},

  mounted() {
    this.id = this.$route.params.stopCardId;

    this.fetchStopCardsData();
  },
};
</script>

<style scoped lang="scss">
.page-stop-card {
  &__app-page {
    @media print {
      display: none;
    }
  }

  &__print-btn {
    --loadingSize: 44px;

    width: max-content;
    max-width: 100%;
    margin-bottom: var(--v-rhythm-8);
  }

  &__potential_winner {
    margin-bottom: var(--v-rhythm-11);
    @include phones {
      margin-bottom: var(--v-rhythm-2);
    }
  }

  &__fields {
    width: 100%;

    display: flex;
    flex-direction: column;
  }

  &__field {
    padding: var(--v-rhythm-3) 0;

    display: flex;
    gap: var(--v-rhythm-8);

    border-bottom: 2px solid var(--gray200);
  }

  &__field-title {
    width: 203px;

    flex-shrink: 0;

    @extend .subtitle-1;
    color: var(--gray700);
  }

  &__field-value {
    width: 100%;

    @extend .body-2;
    color: var(--gray900);
    word-break: break-all;
  }

  &__field-value-file {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__app-document {
  }

  @include laptop {
    &__main-sidebar {
      gap: 0;
    }
  }

  @include phones {
    &__field {
      padding: var(--v-rhythm-2) 0;

      flex-direction: column;
      gap: var(--v-rhythm-1);
    }

    &__field-title {
      width: 100%;
    }

    &__field-value-file {
      padding: var(--v-rhythm-1) 0;
    }
  }
}
</style>
