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
      :isLoading="isLoading"
      :isEnd="isEnd"
      @getPeople="fetchPeopleList"
    />
  </tippy>
</template>

<script>
import axios from "axios";
import AppCounter from "@/components/UI/counter/AppCounter.vue";
import PeopleTooltip from "@/components/UI/tooltip/PeopleTooltip.vue";
export default {
  name: "UniversalViewsCounter",

  components: { AppCounter, PeopleTooltip },

  props: {
    counter: {
      type: Number,
      required: true,
      default: 0,
    },
    endpoint: {
      type: Object,
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
          url: this.endpoint.getListURL,
          params: {
            groupNewsId: this.urlId,
            count: 20,
            startFrom: this.peopleList.length,
          },
        });
        if (response) {
          this.peopleList = [
            ...this.peopleList,
            ...this.updateShittyLegacyFormatPeopleList(response.data.data),
          ];
          this.isEnd = response.data.end;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    updateShittyLegacyFormatPeopleList(arr) {
      return arr.map((i) => {
        return {
          authorInfo: {
            userId: i.ID,
            userName: i.FULL_NAME,
            userPhoto: i.USER_PHOTO,
            VACATION: i.VACATION,
            FIRED: i.FIRED,
          },
        };
      });
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss"></style>