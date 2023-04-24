<template>
  <AppFilter
    :key="filterKey"
    :isLoading="isFilterLoading"
    :isDisabledSubmit="false"
    :isDisabledReset="false"
    @filterSubmit="filterSubmit"
    @filterReset="filterReset"
  >
    <!-- <div
      class="advertisements_filter__wrapper"
      :class="{ loading: isFilterLoading }"
    > -->
    <!-- <div v-for="input in filterData" :key="input.name">
      <InputTemplate
        class="page-search-filter__input-template"
        :input="input"
        :ref="input.name"
        @onChange="getInputTemplateNewValue"
      />
    </div> -->
    <div v-if="!isFilterLoading" :key="formKey">
      <InputText :input="filterRubric" ref="filterName" />
      <InputSelect :input="filterTheme" ref="filterTheme" />
      <div class="publication_date-header">Дата</div>
      <SimpleInputRadios
        :selectedInput="'simpleDate'"
        :name="'period'"
        :inputsData="isPeriodRadio"
        @changeRadio="getPeriodType"
        class="publication_date-radio_inputs"
      />
      <div class="publication_date-radio_inputs">
        <InputDatePicker
          :input="startFromInput"
          :key="Date.now() + 1"
          ref="filterDateFrom"
          @onChange="changeFromDate"
        />
      </div>

      <div v-if="!isPeriod" class="publication_date-radio_inputs">
        <InputDatePicker
          :input="endToInput"
          :key="Date.now()"
          ref="filterDateTo"
        />
      </div>
      <InputCheckbox :input="filterIsMine" ref="filterIsMine" />
    </div>
    <!-- </div> -->
  </AppFilter>
</template>

<script>
import axios from "axios";
import AppFilter from "@/components/filter/AppFilter.vue";
// import InputTemplate from "@/components/UI/inputTemplate.vue";
import InputText from "@/components/UI/inputs/InputText.vue";
import InputSelect from "@/components/UI/inputs/InputSelect.vue";
import SimpleInputRadios from "@/components/UI/inputs/SimpleInputRadios.vue";
import InputDatePicker from "@/components/UI/inputs/InputDatePicker.vue";
import InputCheckbox from "@/components/UI/inputs/InputCheckbox.vue";
export default {
  name: "AdvertisementsFilter",

  components: {
    AppFilter,
    InputText,
    InputSelect,
    SimpleInputRadios,
    InputDatePicker,
    InputCheckbox,
  },

  props: {
    // filterData: {
    //   type: Object,
    //   required: true,
    // },
  },

  data() {
    return {
      isFilterLoading: true,
      filterData: [],
      filterKey: Date.now(),
      filterRubric: null,
      filterTheme: null,
      filterPeriod: null,
      filterIsMine: null,
      isPeriod: true,
      isSimpleDate: true,
      startFromInput: {
        name: "startDate",
        placeholder: "Дата",
        type: "date",
        required: false,
      },
      endToInput: {
        name: "endDate",
        placeholder: "По",
        type: "date",
        required: false,
        disabled: true,
        fromDate: undefined,
      },
      isPeriodRadio: [
        { value: "simpleDate", title: "Точная дата" },
        { value: "period", title: "Период" },
      ],
      formKey: "10101",
    };
  },

  computed: {},

  methods: {
    async getAdvertisementsFilters() {
      try {
        const response = await axios.get("/mobileapp/api/advertising/filter");
        if (response) {
          this.filterData = response.data;
          this.filterRubric = this.filterData[0];
          this.filterTheme = this.filterData[1];
          this.filterPeriod = this.filterData[2];
          this.filterIsMine = this.filterData[3];
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isFilterLoading = false;
      }
    },
    filterSubmit() {
      const data = [];
      const tmp = this.$refs;
      for (let i in tmp) {
        if (this.$refs[i]?.newValue) {
          let val = this.$refs[i].newValue;
          if (i === "filterTheme") {
            val = this.$refs[i].newValue.map((i) => {
              return i.code;
            });
          }
          const obj = {};
          if (Array.isArray(val)) {
            obj[i] = val;
          } else {
            obj[i] = val;
          }
          data.push(obj);
        }
      }
      // let result = {
      //   NAME: null,
      //   THEMA: null,
      //   ACTIVE_FROM: {
      //     date_from: null,
      //     date_to: null,
      //   },
      //   MY: null,
      // };
      let result = {};
      let DateRange = { date_from: "", date_to: "" };
      data.forEach((item) => {
        if (Object.keys(item)[0] === "filterName") {
          result.NAME = Object.values(item)[0];
        }
        if (Object.keys(item)[0] === "filterTheme") {
          result.THEMA = Object.values(item)[0];
        }
        if (Object.keys(item)[0] === "filterDateFrom") {
          DateRange.date_from = Object.values(item)[0];
          result.ACTIVE_FROM = DateRange;
          if (this.isPeriod) {
            DateRange.date_to = DateRange.date_from;
          }
        }
        if (Object.keys(item)[0] === "filterDateTo") {
          DateRange.date_to = Object.values(item)[0];
          result.ACTIVE_FROM = DateRange;
        }
        if (Object.keys(item)[0] === "filterIsMine") {
          if (Object.values(item)[0]) {
            result.MY = "Y";
          } else {
            result.MY = "N";
          }
        }
      });

      this.$emit("filterOptions", result);
    },
    filterReset() {
      this.formKey += this.formKey;
      this.endToInput.disabled = true;
      this.$emit("filterOptions", "");
    },
    changeFromDate(e) {
      if (e.data.newValue) {
        let wrongDate = e.data.newValue;
        wrongDate = wrongDate.split(".");
        let fromDate = new Date(wrongDate[2], wrongDate[1] - 1, wrongDate[0]);
        this.endToInput.disabled = false;
        this.endToInput.fromDate = fromDate;
      }
    },
    getInputTemplateNewValue() {
      console.log("something changed");
    },
    getPeriodType(e) {
      e === "simpleDate" ? (this.isPeriod = true) : (this.isPeriod = false);
      if (!this.isPeriod) {
        this.startFromInput.placeholder = "C";
      } else {
        this.startFromInput.placeholder = "Дата";
      }
    },
  },

  watch: {},

  mounted() {
    this.getAdvertisementsFilters();
  },
};
</script>

<style scoped lang="scss">
.publication_date {
  &-header {
    @extend .subtitle-2;
    color: var(--gray500);
    margin-top: var(--v-rhythm-2);
    margin-bottom: var(--v-rhythm-4);
  }
  &-radio_inputs {
    margin-bottom: var(--v-rhythm-4);
  }
}
</style>