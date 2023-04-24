<template>
  <AppPage class="page-all-documents">
    <div class="all-documents">
      <table class="all-documents__table">
        <thead
          class="all-documents__thead"
          :class="{
            'all-documents__thead--disabled': isFethingMore,
          }"
        >
          <tr class="all-documents__tr all-documents__tr--head">
            <th class="all-documents__th" :width="searchWidth">
              <span class="all-documents__th-title"> Поиск </span>
              <SimpleInput
                class="all-documents__th-input"
                :type="'search'"
                placeholder="Поиск..."
                v-model="filter.NAME"
                @changeValue="
                  (e) =>
                    e ? (this.filter.NAME = e) : (this.filter.NAME = undefined)
                "
                @keydownEnter="filterDocuments"
              />
            </th>
            <th class="all-documents__th">
              <span class="all-documents__th-title"> Дата загрузки </span>
              <InputTemplate
                :input="{
                  type: 'date',
                  placeholder: 'Дата загрузки',
                  name: 'TIMESTAMP_X',
                }"
                @onChange="getDateData"
              />
            </th>
            <th class="all-documents__th">
              <span class="all-documents__th-title">Компания</span>
              <InputTemplate
                :input="{
                  type: 'select',
                  placeholder: 'Компания',
                  name: 'LEGAL_ENTITY',
                  multiple: true,
                  isTight: true,
                  noCheckboxes: true,
                  selectValue: selectsData.company,
                }"
                @onChange="selectChangeFilter"
              />
            </th>
            <th class="all-documents__th">
              <span class="all-documents__th-title">Подразделение</span>
              <InputTemplate
                :input="{
                  type: 'select',
                  placeholder: 'Подразделение',
                  name: 'DEPARTMENT',
                  multiple: true,
                  isTight: true,
                  noCheckboxes: true,
                  selectValue: selectsData.department,
                }"
                @onChange="selectChangeFilter"
              />
            </th>
            <th class="all-documents__th">
              <span class="all-documents__th-title">Каталог</span>
              <InputTemplate
                :input="{
                  type: 'select',
                  placeholder: 'Каталог',
                  name: 'CATALOG',
                  multiple: true,
                  isTight: true,
                  noCheckboxes: true,
                  selectValue: selectsData.catalog,
                }"
                @onChange="selectChangeFilter"
              />
            </th>
          </tr>
        </thead>
        <tbody class="all-documents__tbody" :class="{ loading: isLoading }">
          <tr class="all-documents__tr" v-for="item in data" :key="item.ID">
            <td class="all-documents__td">
              <div class="all-documents__td-inner">
                <!-- файлы -->
                <ul class="media_container" v-if="item.FILE">
                  <li class="file">
                    <svg class="file_icon">
                      <use
                        :xlink:href="`/img/icons/sprites/document-icons.svg#${normalizeExtension(
                          item.FILE.extension
                        )}`"
                      ></use>
                    </svg>
                    <div class="file_data">
                      <div class="file_name" :title="item.FILE.originalName">
                        {{ item.NAME }}
                      </div>
                      <div class="file_size">{{ item.FILE.fileSize }}</div>
                    </div>
                    <div class="file_actions">
                      <a
                        :href="datFileUrl(item.FILE.fileLink)"
                        target="_blank"
                        class="file_watch"
                        v-if="
                          format(item.FILE.originalName) === 'application/pdf'
                        "
                      ></a>
                      <a
                        :href="datFileUrl(item.FILE.fileLink)"
                        download
                        class="file_download"
                      ></a>
                    </div>
                  </li>
                </ul>
              </div>
            </td>
            <td class="all-documents__td">
              <div class="all-documents__td-inner">
                {{ item.TIMESTAMP_X ? item.TIMESTAMP_X : "-" }}
              </div>
            </td>
            <td class="all-documents__td">
              <div class="all-documents__td-inner">
                {{ item.LEGAL_ENTITY ? item.LEGAL_ENTITY : "-" }}
              </div>
            </td>
            <td class="all-documents__td">
              <div class="all-documents__td-inner">
                {{ item.DEPARTMENT ? item.DEPARTMENT : "-" }}
              </div>
            </td>
            <td class="all-documents__td">
              <div class="all-documents__td-inner">
                {{ item.CATALOG ? item.CATALOG : "-" }}
              </div>
            </td>
          </tr>

          <tr class="all-documents__tr all-documents__no-doc">
            <td colspan="5" class="all-documents__td">
              <div class="all-documents__td-inner" v-if="!data.length">
                Нет документов
              </div>

              <div
                class="loading"
                v-if="!isEnd"
                v-intersection="infiniteHandler"
              ></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppPage>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import InputTemplate from "@/components/UI/inputTemplate.vue";
import SimpleInput from "@/components/UI/inputs/SimpleInput.vue";
import { mapGetters } from "vuex";
import { normalizeExtension } from "@utils";

export default {
  name: "PageAllDocuments",

  components: {
    AppPage,
    InputTemplate,
    SimpleInput,
  },

  data() {
    return {
      data: [],

      isLoading: false,
      isEnd: true,
      isFethingMore: false,

      filter: {
        NAME: undefined,
        CATALOG: undefined,
        DEPARTMENT: undefined,
        LEGAL_ENTITY: undefined,
        TIMESTAMP_X: undefined,
      },

      selectsData: {
        company: [],
        department: [],
        catalog: [],
      },
    };
  },

  methods: {
    normalizeExtension(initialExtension) {
      return normalizeExtension(initialExtension);
    },

    async getDocumentFilter() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/documentFilter/`,
        });
        response.data.forEach((item) => {
          if (item.name === "LEGAL_ENTITY") {
            this.modifResponseFilter(
              item.selectValue,
              this.selectsData.company
            );
          } else if (item.name === "DEPARTMENT") {
            this.modifResponseFilter(
              item.selectValue,
              this.selectsData.department
            );
          } else if (item.name === "CATALOG") {
            this.modifResponseFilter(
              item.selectValue,
              this.selectsData.catalog
            );
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    modifResponseFilter(obj, arr) {
      const keys = Object.keys(obj);
      keys.forEach((key) => {
        arr.push({ label: obj[key], code: key });
      });
    },

    modifResponseData(obj, arr) {
      const keys = Object.keys(obj);
      keys.forEach((key) => {
        arr.push(obj[key]);
      });
    },

    format(type) {
      if (type === "application/pdf") return "pdf";

      if (type === "application/x-zip-compressed") return "zip";
      if (type === "application/x-rar-compressed") return "rar";
      if (type === "application/x-7z-compressed") return "7z";

      if (type === "application/msword") return "doc";
      if (
        type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
        return "doc";
      if (type === "application/vnd.ms-excel") return "xls";
      if (
        type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
        return "xls";
      if (
        type === "application/vnd.ms-powerpoint" ||
        type === "application/octet-stream" ||
        type ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      )
        return "ppt";

      if (type === "image/png") return "img";
      if (type === "image/jpeg") return "img";
      if (type === "image/gif") return "img";
      // if (type==='image/png') return 'png'
      // if (type==='image/jpeg') return 'jpg'
      // if (type==='image/gif') return 'gif'
    },

    getDateData(data) {
      if (data.data.newValue === "") {
        this.filter.TIMESTAMP_X = undefined;
      } else {
        this.filter.TIMESTAMP_X = data.data.newValue;
      }
    },

    selectChangeFilter(e) {
      const obj = e.data.newValue;
      if (obj) {
        const filterName = e.data.input.name;
        this.filter[filterName] = [];
        let values;

        if (e.data.input.name === "TIMESTAMP_X") {
          values = obj;
          if (values === "") {
            this.filter[filterName] = undefined;
          } else {
            this.filter[filterName] = values;
          }
        } else {
          values = Object.values(obj);
          if (values.length === 0) {
            this.filter[filterName] = undefined;
          } else {
            values.forEach((value) => {
              this.filter[filterName].push(value.code);
            });
          }
        }

        this.filterDocuments();
      }
    },

    filterDocuments() {
      this.data = [];
      this.getDocuments(5);
    },

    async getDocuments() {
      if (this.isLoading) return;

      let tempArr = [];
      try {
        this.isEnd = true;
        this.isLoading = true;
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/orgstructure/documentList/`,
          params: {
            count: 20,
          },
          data: {
            startFrom: this.data.length,
            filter: this.filter,
          },
        });
        this.modifResponseData(response.data.documents, tempArr);
        this.data = [...this.data, ...tempArr];
        this.isEnd = response.data.end;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    infiniteHandler() {
      // Защита от ложных срабатываний
      if (this.isEnd || this.isFethingMore) {
        return;
      }

      this.isFethingMore = true;

      if (this.data.length === 0) {
        axios
          .post(
            `/mobileapp/api/orgstructure/documentList/?count=20&startFrom=0`,
            { filter: this.filter }
          )
          .then((response) => {
            this.isEnd = response.data.end;
            this.modifResponseData(response.data.documents, this.data);
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            this.isFethingMore = false;
          });
      } else {
        axios
          .post(
            `/mobileapp/api/orgstructure/documentList/?count=20&startFrom=${this.data.length}`,
            { filter: this.filter }
          )
          .then((response) => {
            this.isEnd = response.data.end;
            this.modifResponseData(response.data.documents, this.data);
          })
          .catch((error) => {
            if (error.response.status === 404) {
              this.data = undefined;
            }
          })
          .finally(() => {
            this.isFethingMore = false;
          });
      }
    },
  },

  computed: {
    filterDate() {
      return this.filter.TIMESTAMP_X;
    },

    searchWidth() {
      return this.browserWindowWidth > 767 ? "30%" : "";
    },

    ...mapGetters(["browserWindowWidth"]),

    datFileUrl() {
      // корректировк адреса для локалхоста
      const getHostame = window.location.hostname === window.location.hostname;

      const getProtocol = window.location.protocol;

      return (link) => {
        const linkParts = link.split("/");

        const ind = linkParts.indexOf("upload");

        ind !== -1 ? linkParts.splice(0, ind) : linkParts.splice(0, 1);
        const nl = new URL(
          `/${linkParts.join("/")}`,
          `${getProtocol}//${getHostame}`
        );

        return nl.href;
      };
    },
  },

  watch: {
    filterDate() {
      this.filterDocuments();
    },
  },

  mounted() {
    this.getDocumentFilter();
    this.getDocuments();
  },
};
</script>

<style lang="scss" scoped>
.all-documents {
  width: 100%;
  max-height: calc(100vh - var(--headerHeight) - var(--v-rhythm-8));
  overflow: auto;

  &__table {
    width: 1376px;

    border: 1px solid var(--gray300);

    border-collapse: collapse;
    table-layout: fixed;
  }

  &__thead {
    border-bottom: 1px solid var(--gray300);

    &--disabled {
      opacity: 0.5;

      pointer-events: none;
    }
  }

  &__tr {
    background-color: var(--white900);

    &:not(:last-child) {
      border-bottom: 1px solid var(--gray300);
    }

    &:not(.all-documents__tr--plug):not(.all-documents__tr--head) {
      cursor: pointer;

      @include hover {
        background-color: var(--gray100);
      }
    }
  }

  &__no-doc &__td {
    padding: 0;
  }

  &__no-doc &__td-inner {
    height: 300px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--gray500);
    @extend .h3;
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
    margin-bottom: var(--v-rhythm-4);

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
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
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
      .all-documents {
        &__tr {
          gap: var(--v-rhythm-1);
        }

        &__td {
        }
      }
    }
  }
}

// ФАЙЛЫ TODO:вынести в компонент
.file {
  display: flex;
  max-width: 100%;
  overflow: hidden;

  &:hover {
    .file_actions {
      opacity: 1;
    }
  }
}

.file_icon {
  width: 32px;
  height: 32px;

  flex-shrink: 0;

  fill: var(--gray700);
}

.file_data {
  padding: 0 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.file_name {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--gray900);
}

.file_size {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--gray500);
}

.file_actions {
  display: flex;
  transition: 0.3s opacity ease;
  opacity: 0;
}

.file_watch,
.file_download {
  width: 34px;
  height: 100%;
  display: block;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml,%3Csvg width='22' height='16' viewBox='0 0 22 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5ZM11 13C8.24 13 6 10.76 6 8C6 5.24 8.24 3 11 3C13.76 3 16 5.24 16 8C16 10.76 13.76 13 11 13ZM11 5C9.34 5 8 6.34 8 8C8 9.66 9.34 11 11 11C12.66 11 14 9.66 14 8C14 6.34 12.66 5 11 5Z' fill='%23A5B2BA'/%3E%3C/svg%3E%0A");
}

.file_download {
  background-image: url("data:image/svg+xml,%3Csvg width='14' height='17' viewBox='0 0 14 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 17H14V15H0V17ZM14 6H10V0H4V6H0L7 13L14 6Z' fill='%23A5B2BA'/%3E%3C/svg%3E%0A");
}
</style>
