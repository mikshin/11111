<template>
  <div class="tasks-tabs__history">
    <div class="simple-table">
      <table class="simple-table__table">
        <thead class="simple-table__thead">
          <tr class="simple-table__tr simple-table__tr--head">
            <th class="simple-table__th" width="20%">
              <span class="simple-table__th-title">Дата изменения</span>
            </th>
            <th class="simple-table__th" width="30%">
              <span class="simple-table__th-title">Тип изменения</span>
            </th>
            <th class="simple-table__th" width="50%">
              <span class="simple-table__th-title">Изменение</span>
            </th>
          </tr>
        </thead>
        <tbody class="simple-table__tbody">
          <tr class="simple-table__tr" v-for="(item, i) in data" :key="i">
            <td class="simple-table__td">
              <div class="simple-table__td-inner">
                {{ item.CREATED_DATE ? item.CREATED_DATE : "-" }}
              </div>
            </td>
            <td class="simple-table__td">
              <div class="simple-table__td-inner">
                {{ item.NAME_EVENT ? item.NAME_EVENT : "-" }}
              </div>
            </td>
            <td class="simple-table__td">
              <div class="simple-table__td-inner">
                <div v-if="item.FIELD === 'UF_TASK_WEBDAV_FILES'">
                  <span
                    v-if="item.FROM_VALUE"
                    v-html="item.FROM_VALUE"
                    class="changes-text"
                  ></span>
                </div>

                <div v-else-if="item.FIELD === 'DESCRIPTION'">
                  <span
                    v-if="item.TO_VALUE"
                    v-html="item.TO_VALUE"
                    class="changes-text"
                  ></span>
                  <span
                    v-if="item.FROM_VALUE"
                    v-html="item.FROM_VALUE"
                    class="changes-text"
                  ></span>
                </div>

                <div v-else-if="item.FIELD === 'ACCOMPLICES'">
                  <!-- <div v-if="item.FROM_VALUE"></div> -->
                  <span
                    v-for="item in item.FROM_VALUE"
                    :key="item"
                    v-html="item"
                    class="changes-text"
                  ></span>
                  <span
                    style="white-space: nowrap; width: 100%"
                    v-if="item.FROM_VALUE"
                    >—>&nbsp;&nbsp;&nbsp;</span
                  >
                  <span
                    v-for="item in item.TO_VALUE"
                    :key="item + 1"
                    v-html="item"
                    class="changes-text"
                  ></span>
                </div>

                <div v-else>
                  <span
                    v-if="item.FROM_VALUE"
                    v-html="item.FROM_VALUE"
                    class="changes-text"
                  ></span>
                  <span
                    style="white-space: nowrap; width: 100%"
                    v-if="item.FROM_VALUE"
                    >—>&nbsp;&nbsp;&nbsp;</span
                  >
                  <span
                    class="changes-text"
                    v-if="item.TO_VALUE"
                    v-html="item.TO_VALUE"
                  ></span>
                  <span class="changes-text" v-else>"—"</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <infinite-loading @infinite="infiniteHandler">
      <div slot="spinner" class="loading">Загрузка...</div>
      <div slot="no-more"></div>
      <div slot="no-results"></div>
    </infinite-loading>
  </div>
</template>

<script>
import axios from "axios";
import InfiniteLoading from "vue-infinite-loading";

export default {
  props: {
    taskId: null,
  },
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      data: [],
      isLoaded: false,
    };
  },
  methods: {
    infiniteHandler($state) {
      // Вместо предзагрузки в mounted
      if (this.data.length === 0) {
        axios
          .get(`/mobileapp/api/task/history?taskId=${this.taskId}`)
          .then((response) => {
            this.isLoaded = true;

            if (response.data.end != true) {
              this.data.push(...response.data.data);
              $state.loaded();
            } else {
              this.data.push(...response.data.data);
              $state.complete();
            }

            if (response.data.data === false) {
              this.data = "История отсутствует";
            }
          })
          .catch((error) => {
            if (error.response.status === 404) {
              this.data = undefined;
            }
            this.isLoaded = true;
          });
      } else {
        axios
          .get(
            `mobileapp/api/task/history?taskId=${this.taskId}&count=10&startFrom=${this.data.length}`
          )
          .then((response) => {
            if (response.data.end != true) {
              this.data.push(...response.data.data);
              $state.loaded();
            } else {
              this.data.push(...response.data.data);
              $state.complete();
            }
          })
          .catch((error) => {
            if (error.response.status === 404) {
              this.data = undefined;
            }
            this.isLoaded = true;
          });
      }
    },
  },
  created() {
    if (this.$refs.InfiniteLoading) {
      this.$refs.InfiniteLoading.stateChanger.reset();
    }
  },
};
</script>

<style lang="scss" scoped>
.simple-table {
  width: 100%;
  //max-height: calc(100vh - var(--headerHeight) - var(--v-rhythm-8));
  overflow: auto;

  &__table {
    width: 100%;

    border: 1px solid var(--gray300);

    border-collapse: collapse;
    table-layout: fixed;
  }

  &__thead {
    border-bottom: 1px solid var(--gray300);
  }

  &__tr {
    background-color: var(--white900);

    &:not(:last-child) {
      border-bottom: 1px solid var(--gray300);
    }

    &:not(.simple-table__tr--plug):not(.simple-table__tr--head) {
      cursor: pointer;

      @include hover {
        background-color: var(--gray100);
      }
    }
  }

  &__th {
    padding: var(--v-rhythm-4);

    text-align: left;

    background-color: var(--gray100);
    border-right: 1px solid var(--gray300);

    &:last-child {
      border-right: unset;
    }
  }

  &__th-title {
    display: block;
    //margin-bottom: var(--v-rhythm-4);

    @extend .subtitle-1;
    color: var(--gray700);
  }

  &__th-input {
    width: 100%;
  }

  &__td {
    padding: var(--v-rhythm-4);

    text-align: left;
    @extend .body-1;
    color: var(--gray900);
  }

  &__td-inner {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    //overflow: hidden;
    text-overflow: ellipsis;

    .changes-text {
      display: flex;
      flex-direction: column;

      ::v-deep {
        a {
          color: var(--red900);
        }
      }
    }
  }

  &__person-card {
  }

  @include phones {
    margin: 0 var(--negativeMainPadding);
    width: calc(100% + 2 * var(--mainPadding));

    &__table {
      width: 100%;
      border-right: unset;
      border-left: unset;
    }

    &__th {
      border-right: unset;
    }

    &__tr {
      display: flex;
      flex-direction: column;
    }

    &__tbody {
      .simple-table {
        &__tr {
          gap: var(--v-rhythm-1);
        }

        &__td {
        }
      }
    }
  }
}
</style>