<template>
  <WidgetWrapper :iconName="'vacation'" :title="'Мой отпуск'">
    <div class="display_hack">
      <div class="vacation_widget__wrapper" :class="{ loading: isLoading }">
        <div
          class="vacation_widget__disclaimer"
          :class="{
            'widget-text-default': !canShowWidget,
          }"
        >
          <template v-if="canShowWidget">
            Скачайте и заполните бланк, затем отнесите его в отдел кадров на
            подпись
          </template>
          <template v-else-if="!isOwnLK">Информации об отпусках нет </template>
        </div>

        <div class="vacation_widget__current" v-if="fetchData.currentVacation">
          <div class="vacation_widget__current-header">Текущий</div>
          <ul class="vacation_widget__date-list">
            <li
              class="vacation_widget__date-list_item chat-primary"
              v-for="(list, id) in fetchData.currentVacation"
              :key="id"
            >
              <span>{{ convertDate(list.dateStart) }}</span> -
              <span>{{ convertDate(list.dateEnd) }}</span>
            </li>
          </ul>
        </div>

        <div class="vacation_widget__planning" v-if="fetchData.planingVacation">
          <div class="vacation_widget__planning-header">Запланирован</div>
          <ul class="vacation_widget__date-list">
            <li
              class="vacation_widget__date-list_item"
              v-for="(list, id) in fetchData.planingVacation"
              :key="id"
            >
              <span>{{ convertDate(list.dateStart) }}</span> -
              <span>{{ convertDate(list.dateEnd) }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="canShowWidget">
        <div class="vacation_widget__footer">
          <a
            v-if="fetchData.blankPath"
            class="vacation_widget__button secondary-btn"
            :href="fetchData.blankPath"
            download
          >
            Скачать бланк
          </a>
          <button
            class="vacation_widget__button secondary-btn"
            @click="showModal"
            :disabled="!fetchData.accessSendQuestion"
          >
            Задать вопрос
          </button>
        </div>
        <div class="vacation_widget__footer vacation_widget__add_footer">
          <button
            class="text-btn"
            @click="isSimpleModalVisible = true"
            :disabled="!isOwnLK"
          >
            Остатки отпусков
          </button>
        </div>
      </div>
    </div>
    <transition name="fade">
      <VacationModal @closeModal="showModal" v-if="isModalVisible" />
    </transition>
    <transition name="fade">
      <SimpleVacationModal
        v-if="isSimpleModalVisible"
        @onClose="isSimpleModalVisible = false"
      />
    </transition>
  </WidgetWrapper>
</template>

<script>
import axios from "axios";
import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";
import VacationModal from "@components/modals/VacationModal.vue";
import SimpleVacationModal from "@components/modals/SimpleVacationModal.vue";

export default {
  name: "VacationWidget",

  components: { WidgetWrapper, VacationModal, SimpleVacationModal },

  props: {
    userID: {
      type: [String, Number],
      default: null,
    },
  },

  data() {
    return {
      isLoading: true,
      fetchData: {},
      isModalVisible: false,
      isSimpleModalVisible: false,
    };
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
    isOwnLK() {
      const lkOwner = Object.values(this.$route.query)[0];
      const me = this.currentUser.ID;

      return lkOwner === me;
    },
    canShowWidget() {
      let result = true;

      if (
        !this.isOwnLK &&
        this.fetchData.currentVacation === null &&
        this.fetchData.planingVacation === null
      ) {
        result = false;
      }

      if (this.$route.path === "/my_services") {
        result = true;
      }

      return result;
    },
  },

  methods: {
    convertDate(d) {
      let temp = d.split(".");
      const day = temp[0];
      const month = temp[1] - 1;
      const year = temp[2];
      const valueTimestamp = new Date(year, month, day);
      return valueTimestamp.toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
    async getVacationWidgetData() {
      try {
        this.isLoading = true;
        const response = await axios.get(
          "/mobileapp/api/vacation/getVacationLKWidget",
          {
            params: {
              profileId: this.userID,
            },
          }
        );
        if (response) {
          this.fetchData = response.data;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    showModal() {
      this.isModalVisible = !this.isModalVisible;
    },
  },

  watch: {},

  mounted() {
    this.getVacationWidgetData();
  },
};
</script>

<style scoped lang="scss">
.vacation_widget {
  &__wrapper {
    padding: var(--v-rhythm-10);
  }

  &__disclaimer {
    @extend .body-1;
  }

  &__current {
    &-header {
      @extend .subtitle-1;
      margin-top: var(--v-rhythm-4);
    }
  }

  &__planning {
    &-header {
      @extend .subtitle-1;
      margin-top: var(--v-rhythm-4);
    }
  }

  &__date {
    &-list {
      margin-top: var(--v-rhythm-2);
    }

    &-list_item {
      @extend .body-2;

      margin-top: var(--v-rhythm-2);
    }
  }
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--v-rhythm-4);
    height: 76px;
    padding: 0 var(--v-rhythm-4);

    border-top: 2px solid var(--gray300);
  }
  &__add_footer {
    justify-content: center;
  }

  &__button {
    flex-grow: 1;
  }
}

.chat-primary {
  color: #05ab83;

  &:nth-last-child(1) {
    margin-bottom: var(--v-rhythm-4);
  }
}

.display_hack {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 524px;
  height: 100%;

  @include phones {
    min-height: auto;
  }
}
</style>