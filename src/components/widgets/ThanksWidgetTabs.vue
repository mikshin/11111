<template>
  <WidgetWrapper class="thanks-widget-tabs" :iconName="'thank'" :title="name">
    <div class="thanks-widget-tabs__content" :class="{ loading: isLoading }">
      <TabsNav
        class="thanks-widget-tabs__tabs-nav"
        :tabs="tabs"
        :activeTabObj="tabsActive"
        @changeTab="
          (e) => {
            tabsActive = e;
          }
        "
      />
      <div class="thanks-widget-tabs__main">
        <template v-if="tabsActive.name === 'Меня поблагодарили'">
          <div class="thanks-widget-tabs__main-list" v-if="dataMy">
            <ThankCard
              v-for="item in dataMy.data"
              :key="item.ID"
              :userTo="{
                id: item.UF_AUTHOR.ID,
                fullName: item.UF_AUTHOR.FIO,
                workPosition: item.UF_AUTHOR.WORK_POSITION,
                vacation: item.UF_AUTHOR.VACATION,
                fired: item.UF_AUTHOR.FIRED,
              }"
              :congratulation="item.UF_TEXT"
              :date="item.UF_DATE_ADD"
            />
            <div
              :key="'my'"
              v-if="!dataMy.end"
              v-intersection="() => updata('my')"
            ></div>
          </div>
          <div class="thanks-widget-tabs__main-default" v-else>
            {{ textdefault }}
          </div>
        </template>
        <template v-else-if="tabsActive.name === 'Я поблагодарил'">
          <div class="thanks-widget-tabs__main-list" v-if="dataSent">
            <ThankCard
              v-for="item in dataSent.data"
              :key="item.ID"
              :userFrom="{
                id: item.UF_RECIPIENT.ID,
                src: item.UF_RECIPIENT.USER_PHOTO,
                fullName: item.UF_RECIPIENT.FIO,
                workPosition: item.UF_RECIPIENT.WORK_POSITION,
                vacation: item.UF_RECIPIENT.VACATION,
                fired: item.UF_RECIPIENT.FIRED,
              }"
              :congratulation="item.UF_TEXT"
              :date="item.UF_DATE_ADD"
            />
            <div
              :key="'sent'"
              v-if="!dataSent.end"
              v-intersection="() => updata('sent')"
            ></div>
          </div>
          <div class="thanks-widget-tabs__main-default" v-else>
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
  name: "ThanksWidgetTabs",

  components: {
    WidgetWrapper,
    TabsNav,
    ThankCard,
  },

  data() {
    return {
      tabsActive: {
        name: "Меня поблагодарили",
      },

      isLoading: false,

      dataMy: null,
      dataSent: null,
      counterMy: 0,
      counterSent: 0,

      textdefault: "Благодарностей нет",
    };
  },

  props: {
    name: {
      type: String,
      required: false,
      default: "Благодарности",
    },
  },

  computed: {
    tabs() {
      return [
        {
          name: "Меня поблагодарили",
          counter: this.counterMy,
        },
        {
          name: "Я поблагодарил",
          counter: this.counterSent,
        },
      ];
    },
  },

  methods: {
    date(day, month, year) {
      return `${day} ${month} ${year}`;
    },

    async writeData() {
      try {
        this.isLoading = true;
        this.dataMy = await this.fetchData("my", 0);
        this.dataSent = await this.fetchData("sent", 0);

        const counters = await this.fetchCounters();
        this.counterMy = counters.my;
        this.counterSent = counters.sent;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchData(url, startFrom) {
      try {
        const response = await axios({
          method: "get",
          url: `mobileapp/api/gratitude/${url}/?count=5&startFrom=${startFrom}`,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },

    async fetchCounters() {
      try {
        const response = await axios({
          method: "get",
          url: `mobileapp/api/gratitude/count/`,
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
        } else if (str === "sent") {
          url = "sent";
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
        container: ".thanks-widget-tabs__main",
      });
    },
  },

  mounted() {
    this.writeData();
  },
};
</script>

<style lang="scss" scoped>
.thanks-widget-tabs {
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