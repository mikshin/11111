<template>
  <AppPage class="page-polls">
    <MainSidebar>
      <template #main>
        <ul class="page-polls__list" v-if="polls.length || fixedPoll">
          <Poll
            class="page-polls__poll page-polls__poll--fixed"
            v-if="fixedPoll"
            :poll="fixedPoll"
            :isFixed="true"
            @onUpdate="loadPolls"
          />

          <template v-for="item in polls">
            <Poll
              class="page-polls__poll"
              :key="item.ID"
              :poll="item"
              @onUpdate="loadPolls"
            />
          </template>
        </ul>

        <div class="page-polls__text-default" v-else>Опросов не найдено</div>

        <div v-intersection="updatePolls" v-if="!isEnd"></div>
      </template>

      <template #sidebar>
        <FilterTemplate
          @onUpdate="updateFilter"
          :filter="filter"
          class="page-polls__filter"
      /></template>
    </MainSidebar>
  </AppPage>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import Poll from "@/components/pages/polls/AppPoll.vue";
import FilterTemplate from "@/components/UI/filter/FilterTemplate.vue";

export default {
  name: "PagePolls",

  components: {
    AppPage,
    MainSidebar,
    Poll,
    FilterTemplate,
  },

  data() {
    return {
      isEnd: true,
      filter: [],
      currentFilter: "",
      polls: [],
      fixedPoll: null,
      startFrom: 0,
      count: 10,
    };
  },

  methods: {
    loadPolls(filter) {
      this.startFrom = 0;
      axios({
        method: "get",
        url: filter
          ? `/mobileapp/api/vote/important/?showQuestions=true${filter}`
          : "/mobileapp/api/vote/important/?showQuestions=true",
      })
        .then((response) => {
          // !TODO попросить бэк присылать объект
          this.fixedPoll = response.data[0];
        })
        .catch(() => {
          this.fixedPoll = null;
        });
      axios({
        method: "get",
        url: filter
          ? `/mobileapp/api/vote/?count=${this.count}&startFrom=0${filter}`
          : "/mobileapp/api/vote/?count=" + this.count + "&startFrom=0",
      })
        .then((response) => {
          this.polls = response.data.data;
          this.isEnd = response.data.end;
          this.startFrom += this.count;
        })
        .catch(() => {
          this.polls = [];
        });
    },
    updatePolls() {
      axios({
        method: "get",
        // url:
        //   "/mobileapp/api/vote/?count=" +
        //   this.count +
        //   "&startFrom=" +
        //   this.startFrom,
        url: this.currentFilter
          ? `/mobileapp/api/vote/?count=${this.count}&startFrom=${this.startFrom}${this.currentFilter}`
          : "/mobileapp/api/vote/?count=" +
            this.count +
            "&startFrom=" +
            this.startFrom,
      })
        .then((response) => {
          this.polls = [...this.polls, ...response.data.data];
          this.isEnd = response.data.end;
          this.startFrom += this.count;
        })
        .catch(() => {
          this.polls = [];
        });
    },

    createFilter() {
      this.filter = [
        {
          name: "filter[TITLE]",
          placeholder: "Название",
          type: "text",
        },
        {
          name: "filter[VOTE_IMPORTANT]",
          placeholder: "Обязательный опрос",
          type: "radio",
          placeholderShown: true,
          radioValue: [
            {
              name: "Важный",
              code: 1,
            },
            {
              name: "Обычный",
              code: 0,
            },
          ],
        },

        {
          name: "filter[DATE_START]",
          placeholder: "C",
          type: "date",
        },
        {
          name: "filter[DATE_END]",
          placeholder: "По",
          type: "date",
        },
        {
          name: "filter[STATUS]",
          placeholder: "Статус",
          type: "select",
          multiple: false,
          selectValue: [
            {
              label: "Не пройден",
              code: "Не пройден",
            },
            {
              label: "Пройден",
              code: "Пройден",
            },
            {
              label: "Завершен",
              code: "Завершен",
            },
          ],
        },
      ];
    },
    updateFilter(data) {
      let filter = "&";
      for (let key in data.data) {
        if (key === "filter[TITLE]") {
          filter += key + "='" + data.data[key] + "'&";
        } else {
          filter += key + "=" + data.data[key] + "&";
        }
      }
      this.currentFilter = filter;
      this.loadPolls(filter);
    },
  },

  mounted() {
    this.loadPolls();
    this.createFilter();
  },
};
</script>

<style lang="scss" scoped>
.page-polls {
  &__list {
  }

  &__poll {
    &--fixed {
      margin-bottom: var(--v-rhythm-3);
    }
  }

  &__text-default {
    @extend .h2;
    color: var(--gray500);
  }

  &__filter {
  }
}
</style>
