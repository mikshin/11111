<template>
  <WidgetWrapper
    class="widget-birthdays"
    :iconName="'cake'"
    :title="name"
    :class="{ loading: isLoading }"
    :textBtn="'Все дни рождения'"
    @clickWidgetBtn="navigateToGeneralBirthdaysPage"
  >
    <div class="widget-birthdays__content">
      <template v-for="(item, blockKey) in fetchData">
        <ul class="widget-birthdays__list" :key="blockKey" v-if="item.length">
          <div class="widget-birthdays__list-item-headline">
            {{ getBlockHeadlineText(blockKey) }}
          </div>
          <Birthday
            class="widget-birthdays__list-item"
            v-for="(birthday, index) in item"
            :key="index"
            :birthday="birthday"
            :day="blockKey"
            :isShowDate="false"
          />
        </ul>
      </template>
    </div>
  </WidgetWrapper>
</template>

<script>
import axios from "axios";

import Birthday from "@components/pages/birthdays/birthday.vue";
import WidgetWrapper from "@components/widgets/WidgetWrapper.vue";

export default {
  props: {
    name: String,
  },

  components: {
    Birthday,
    WidgetWrapper,
  },

  data() {
    return {
      isLoading: true,
      fetchData: null,
      daysTypes: {
        today: "Сегодня",
        tomorrow: "Завтра",
        otherday: "В другие дни",
      },
    };
  },

  methods: {
    navigateToGeneralBirthdaysPage() {
      this.$router.push("/birthdays");
    },
    getBlockHeadlineText(blockKey) {
      return this.daysTypes[blockKey];
    },
  },

  mounted() {
    axios
      .get("/mobileapp/api/birthday/vidget/")
      .then((response) => {
        this.isLoading = false;
        this.fetchData = response.data;
      })
      .catch(() => {
        this.isLoading = false;
      });
  },
};
</script>

<style lang="scss" scoped>
.widget-birthdays {
  &__content {
    padding-inline: 20px;
    padding-bottom: var(--v-rhythm-4);
    flex: 1;
    max-height: 500px;
    min-height: 150px;

    overflow-y: auto;
  }

  &__list-item-headline {
    @extend .caption-2;

    padding: var(--v-rhythm-4) 0;

    color: var(--gray500);
  }

  &__list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-block: var(--v-rhythm-2);

    fill: var(--red900);
  }
}
</style>
