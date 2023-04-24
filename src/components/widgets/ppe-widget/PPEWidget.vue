<template>
  <WidgetWrapper
    :iconName="'ppe'"
    :title="'СИЗ и спецодежда'"
    v-if="fetchData && fetchData.siz_expired"
  >
    <div class="display_hack">
      <div class="ppe_widget__wrapper" :class="{ loading: isLoading }">
        <div v-if="fetchData.siz_expired" class="ppe_widget__expired">
          <div class="ppe_widget__header">Срок носки</div>
          <table class="ppe_widget__table">
            <tbody>
              <tr
                v-for="(item, idx) in fetchData.siz_expired"
                :key="idx"
                class="ppe_widget__table_row"
              >
                <td
                  valign="top"
                  class="ppe_widget__table_left"
                  :title="item.name"
                >
                  {{ item.name }}
                </td>
                <td valign="top" class="ppe_widget__table_right">
                  до {{ item.date_expired }}
                </td>
                <td valign="top" class="ppe_widget__table_icon" align="right">
                  <UserIcons :iconName="item.type" class="red" />
                  <!-- <span v-if="item.type === 'летний'">
                    <UserIcons :iconName="'summer'" class="red" />
                  </span> -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="fetchData.siz_sizes" class="ppe_widget__sizes">
          <div class="ppe_widget__header">Мои антропометрические данные</div>
          <table class="ppe_widget__table">
            <tbody>
              <tr
                v-for="(item, idx) in fetchData.siz_sizes"
                :key="idx"
                class="ppe_widget__table_row ppe_widget__second_row"
              >
                <td class="ppe_widget__table_left">{{ item.name }}:</td>
                <td class="ppe_widget__table_right">{{ item.value }}</td>
                <td class="ppe_widget__table_icon"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="ppe_widget__footer">
        <!-- <router-link to="/services" class="ppe_widget__link"
          >Карточка всех СИЗ</router-link
        > -->
        <button class="text-btn" @click="ppeModalVisible = true">
          Карточка всех СИЗ
        </button>
      </div>
    </div>
    <transition name="fade">
      <PPEModal @onClose="ppeModalVisible = false" v-if="ppeModalVisible" />
    </transition>
  </WidgetWrapper>
</template>

<script>
import axios from "axios";
import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";
import PPEModal from "../../modals/PPEModal.vue";
// import UserIcons from "../../global/UserIcons.vue";
export default {
  name: "PPEWidget",

  components: { WidgetWrapper, PPEModal },

  props: {
    // some: {
    //   type: String,
    //   required: false,
    //   default: "",
    // },
  },

  data() {
    return {
      isLoading: true,
      fetchData: null,
      ppeModalVisible: false,
    };
  },

  computed: {},

  methods: {
    async getPPEData() {
      try {
        this.isLoading = true;
        const response = await axios.get("/mobileapp/api/siz/lkWidget");
        if (response) {
          this.fetchData = response.data;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },

  watch: {},

  mounted() {
    this.getPPEData();
  },
};
</script>

<style scoped lang="scss">
.display_hack {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.ppe_widget {
  &__wrapper {
    padding: var(--v-rhythm-6);
  }
  &__header {
    @extend .subtitle-2;
    margin-bottom: var(--v-rhythm-4);
  }
  &__expired {
    padding-bottom: var(--v-rhythm-6);
    border-bottom: 1px solid var(--gray200);
    margin-bottom: var(--v-rhythm-6);
  }
  &__table {
    padding-left: var(--v-rhythm-4);
    width: 100%;
  }
  &__table_row {
    width: 100%;
    td {
      // padding-bottom: var(--v-rhythm-3);
    }
  }
  &__table_left {
    @extend .subtitle-1;
    width: 45%;
    max-width: 200px;
    width: 100%;
    text-align: left;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 43px;
    color: var(--gray700);
    // padding-top: 6px;
    @include phones {
      height: 38px;
    }
  }
  &__table_right {
    @extend .body-1;
    text-align: right;
    color: var(--gray900);
    width: 25%;
  }
  &__second_row {
    height: auto;
    margin-bottom: var(--v-rhythm-1);
    .ppe_widget__table_left {
      height: auto;
      padding: 0;
      padding-bottom: var(--v-rhythm-1);
      max-width: 200px;
    }
    .ppe_widget__table_right {
      width: 25%;
      padding-right: 4px;
      text-align: right;
    }
    .ppe_widget__table_icon {
      width: 10%;
    }
  }
  &__table_icon {
    padding-left: var(--v-rhythm-4);
  }
  &__footer {
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 2px solid var(--gray300);
  }
  &__link {
    color: var(--red900);
    font-weight: bold;
    font-size: 14px;
  }
}
.red {
  fill: var(--red900);
  max-width: 22px;
  max-height: 22px;
}
</style>