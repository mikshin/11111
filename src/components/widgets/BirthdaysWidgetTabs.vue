<template>
  <WidgetWrapper class="birthdays-widget-tabs" :iconName="'cake'" :title="name">
    <div class="birthdays-widget-tabs__content" :class="{ loading: isLoading }">
      <TabsNav
        class="birthdays-widget-tabs__tabs-nav"
        :tabs="tabs"
        :activeTabObj="tabsActive"
        @changeTab="
          (e) => {
            tabsActive = e;
          }
        "
      />

      <div class="birthdays-widget-tabs__main">
        <template v-if="tabsActive.name === 'Меня поздравили'">
          <div class="birthdays-widget-tabs__main-list" v-if="dataMy">
            <ThankCard
              v-for="(item, i) in dataMy.data"
              :key="i"
              :userFrom="{
                id: item.user_info.ID,
                src: item.user_info.USER_PHOTO,
                fullName: item.user_info.FULL_NAME,
                workPosition: item.user_info.UF_WORK_POSITION,
                vacation: item.user_info.VACATION,
                fired: item.user_info.FIRED,
              }"
              :congratulation="item.text"
              :date="item.date_add"
            />
            <div
              :key="'my'"
              v-if="!dataMy.end"
              v-intersection="() => updata('my')"
            ></div>
          </div>
          <div class="birthdays-widget-tabs__main-default" v-else>
            {{ textdefault }}
          </div>
        </template>
        <template v-else-if="tabsActive.name === 'Я поздравил'">
          <div class="birthdays-widget-tabs__main-list" v-if="dataSent">
            <ThankCard
              v-for="(item, i) in dataSent.data"
              :key="i"
              :userTo="{
                id: item.user_info.ID,
                fullName: item.user_info.FULL_NAME,
                workPosition: item.user_info.UF_WORK_POSITION,
                vacation: item.user_info.VACATION,
                fired: item.user_info.FIRED,
              }"
              :congratulation="item.text"
              :date="item.date_add"
            />
            <div
              :key="'send'"
              v-if="!dataSent.end"
              v-intersection="() => updata('send')"
            ></div>
          </div>
          <div class="birthdays-widget-tabs__main-default" v-else>
            {{ textdefault }}
          </div>
        </template>
      </div>
    </div>
  </WidgetWrapper>
</template>

<script>
import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";
import TabsNav from "@/components/UI/tabs/TabsNav.vue";
import ThankCard from "@/components/cards/ThankCard.vue";
import axios from "axios";
import VueScrollTo from "vue-scrollto";

export default {
  name: "BirthdaysWidgetTabs",

  components: {
    WidgetWrapper,
    TabsNav,
    ThankCard,
  },

  data() {
    return {
      tabs: [
        {
          name: "Меня поздравили",
        },
        {
          name: "Я поздравил",
        },
      ],

      tabsActive: {
        name: "Меня поздравили",
      },

      isLoading: false,

      dataMy: null,
      dataSent: null,

      textdefault: "Поздравлений нет",
    };
  },

  props: {
    name: {
      type: String,
      required: false,
      default: "Дни рождения",
    },
  },

  computed: {},

  methods: {
    async writeData() {
      try {
        this.isLoading = true;
        this.dataMy = await this.fetchData("my", 0);
        this.dataSent = await this.fetchData("send", 0);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchData(url, startFrom) {
      try {
        const response = await axios({
          method: "get",
          url: `mobileapp/api/birthday/${url}/?count=5&startFrom=${startFrom}`,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },

    async updata(str) {
      try {
        this.isLoading = true;
        let url, objData;
        if (str === "my") {
          url = "my";
          objData = this.dataMy;
        } else if (str === "send") {
          url = "send";
          objData = this.dataSent;
        }

        const response = await this.fetchData(url, objData.data.length);

        objData.data = [...objData.data, ...response.data];
        objData.end = response.end;
      } finally {
        this.isLoading = false;
      }
    },
  },

  watch: {
    tabsActive() {
      VueScrollTo.scrollTo("#app", 0, {
        container: ".birthdays-widget-tabs__main",
      });
    },
  },

  mounted() {
    this.writeData();
  },
};
</script>

<style lang="scss" scoped>
.birthdays-widget-tabs {
  &__content {
  }

  &__tabs-nav {
    margin: {
      top: var(--v-rhythm-4);
      right: 10px;
      bottom: var(--v-rhythm-2);
      left: 10px;
    }
  }

  &__main {
    max-height: 476px;

    overflow-y: auto;
  }

  &__main-default {
    padding: var(--v-rhythm-8) var(--v-rhythm-4);

    @extend .body-2;
    color: var(--gray500);
  }
}
</style>