<template>
  <tippy
    class="views-counter"
    interactive
    animation="fade"
    :animate-fill="false"
    :delay="[300, 0]"
    :onShown="getPeopleList"
    :hideOnClick="false"
  >
    <template v-slot:trigger>
      <AppCounter
        class="views-counter__btn"
        :counterIcon="'eye-on'"
        :counterNumber="counter"
      />
    </template>

    <PeopleTooltip
      v-if="counter > 0"
      class="views-counter__tooltip"
      :people="peopleList"
      :isEnd="isEnd"
      :isLoading="isLoading"
      @getPeople="fetchPeopleList"
    />
  </tippy>
</template>

<script>
import AppCounter from "@/components/UI/counter/AppCounter.vue";
import PeopleTooltip from "@/components/UI/tooltip/PeopleTooltip.vue";
import axios from "axios";

export default {
  name: "ViewsCounter",

  components: { PeopleTooltip, AppCounter },

  props: {
    counter: {
      type: Number,
      required: true,
    },

    urlId: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      peopleList: [],
      isEnd: true,
      isLoading: false,
    };
  },

  computed: {},

  methods: {
    async getPeopleList() {
      if (this.peopleList.length === 0) {
        this.fetchPeopleList();
      }
    },

    async fetchPeopleList() {
      try {
        this.isLoading = true;
        this.isEnd = true;
        const response = await axios({
          method: "get",
          url: "/mobileapp/api/news/views",
          params: {
            newsId: this.urlId,
            count: 20,
            startFrom: this.peopleList.length,
          },
        });

        this.peopleList = [...this.peopleList, ...response.data.data];
        this.isEnd = response.data.end;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.views-counter {
  cursor: default;

  &__btn {
  }

  &__tooltip {
  }
}
</style>
