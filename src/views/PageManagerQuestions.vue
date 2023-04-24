<template>
  <AppPage class="page-manager-questions">
    <MainSidebar
      class="page-manager-questions__main_sidebar"
      :class="{ loading: isLoading }"
    >
      <template #main>
        <div
          class="page-manager-questions__cards-wrapper"
          v-if="questionList.length"
        >
          <QuestionCard
            v-for="card in questionList"
            :key="card.id"
            :card="card"
          />

          <div v-if="!isEndLoading" v-intersection="updata"></div>
        </div>

        <div
          v-else
          class="page-manager-questions__no-questions page-text-default"
        >
          Вопросы не найдены
        </div>
      </template>

      <template #sidebar>
        <!-- заменить на кнопку модалки -->
        <!-- <AskQuestionButton @openModalDialog="toggleModal" :isEditBtn="true" /> -->
        <AskQuestionButton
          :title="'Задать свой вопрос'"
          @openModalDialog="toggleModal"
        />
        <QuestionsFilter
          @changingFilter="changeFilter"
          @filtersReset="resetFilters"
        />
      </template>
    </MainSidebar>

    <transition name="fade">
      <AskQuestionModal
        v-if="isModalVisible"
        @closeModal="toggleModal"
        @refreshQuestionList="updateList"
      />
    </transition>
  </AppPage>
</template>

<script>
import AskQuestionModal from "@/components/modals/AskQuestionModal.vue";
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import axios from "axios";
import QuestionCard from "@/components/pages/ManagerQuestions/QuestionCard.vue";
import QuestionsFilter from "@/components/pages/ManagerQuestions/QuestionsFilter.vue";
import AskQuestionButton from "@/components/pages/AskManager/AskQuestionButton.vue";

export default {
  name: "PageManagerQuestions",

  components: {
    MainSidebar,
    AppPage,
    QuestionCard,
    QuestionsFilter,
    AskQuestionButton,
    AskQuestionModal,
  },

  data() {
    return {
      isModalVisible: false,
      isLoading: false,
      isEndLoading: true,
      FILTER: null,
      questionList: [],
      paginationCounter: 0,
      // пример для модалки
      recipient: {
        value: {
          code: "3127",
          label: "Кочнев Сергей Анатольевич",
        },
      },
    };
  },

  methods: {
    testID() {
      let res = null;
      res = "2730";
      return res;
    },
    toggleModal() {
      this.isModalVisible = !this.isModalVisible;
    },
    updateList() {
      if (this.$route.path === "/questions") {
        this.paginationCounter = 0;
        this.fillQuestionList();
      }
    },
    async getQuestions() {
      try {
        this.isLoading = true;
        const response = await axios.post("/mobileapp/api/question/list", {
          filter: this.FILTER,
          startFrom: this.paginationCounter,
        });
        if (response.data !== null) {
          this.isEndLoading = response.data.end;
          this.paginationCounter += response.data.data.length;
          return response.data.data;
        } else {
          return null;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    resetFilters() {
      this.questionList = [];
      this.FILTER = null;
      this.paginationCounter = 0;
      this.fillQuestionList();
    },
    async fillQuestionList() {
      const fetchData = await this.getQuestions();
      if (fetchData) {
        this.questionList = fetchData;
      }
    },
    changeFilter(e) {
      let filter = {};
      this.paginationCounter = 0;
      e.forEach((item) => {
        if (Object.values(item)[0]) {
          let n = Object.keys(item)[0];
          if (n === "ANSWER_REQUIRED") {
            filter[n] = "Y";
          } else if (n === "DEPARTMENT" || n === "CATEGORY") {
            filter[n] = Object.values(item)[0]?.map((i) => {
              return i.code;
            });
          } else {
            filter[n] = Object.values(item)[0].code;
          }
        }
      });
      this.FILTER = filter;
    },
    async updata() {
      const response = await this.getQuestions();
      this.questionList = [...this.questionList, ...response];
    },
  },
  watch: {
    FILTER() {
      this.questionList = [];
      this.fillQuestionList();
    },
  },
  mounted() {
    this.fillQuestionList();
  },
};
</script>

<style scoped lang="scss">
.page-manager-questions {
  &__no-questions {
  }
  &__sidebar-skeleton {
    width: 100%;
    min-height: 300px;
    border-radius: 4px;
    height: 100%;
    background-color: azure;
  }
}
</style>