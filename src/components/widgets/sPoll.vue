<template>
  <div class="widget_container" v-if="data">
    <div class="widget_headline">
      <h2>Опрос</h2>
      <img src="@/assets/icons/quizsvg.svg" alt="Ещё" />
    </div>
    <div class="widget_content" :class="{ loading: !isLoaded }">
      <div class="poll_name">{{ data.TITLE }}</div>
      <template v-if="data.QUESTIONS">
        <template v-if="!this.isEnd">
          <div class="poll_number">
            Вопрос {{ questionNumber }} из {{ questions.length }}
          </div>
          <ul>
            <li v-for="(item, i) in questions" :key="i" class="poll_item">
              <PollsForm
                :item="item"
                :position="i"
                @onVote="progressVote"
                @onSend="sendForm"
                @onChange="changeAnswer"
                v-show="questionNumber === i + 1"
                :last="i + 1 === questions.length"
                :withButton="true"
                type="main"
              />
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="poll_end" v-if="openThanks">
            <h3 class="h3">Спасибо за прохождение опроса!</h3>
            <p class="poll_end__user-count">
              <span class="poll_end__user-count--red">{{ peopleDecl }}</span>
              {{ passedDecl }}
              опрос
            </p>
            <button class="poll_end__to-result" @click="closeThanks">
              К результатам
            </button>
          </div>
        </template>
      </template>
      <PollStatistic :poll="data" @onUpdate="loadPoll" type="main" v-else />
    </div>
    <router-link to="/polls" class="all">Все опросы</router-link>
  </div>
</template>
<script>
import PollsForm from "../pages/polls/pollsForm.vue";
import PollStatistic from "../pages/polls/pollStistic.vue";
import axios from "axios";
export default {
  components: {
    PollsForm,
    PollStatistic,
  },
  data() {
    return {
      data: "",
      isLoaded: true,
      questions: [],
      questionNumber: 1,
      answers: {
        voteId: 0,
        answer: {},
      },
      isEnd: false,
      openThanks: false,
      allUsersCount: 0,
    };
  },
  computed: {
    peopleDecl() {
      const slicedTwo = String(this.allUsersCount).slice(-2);
      const slicedOne = String(this.allUsersCount).slice(-1);

      if (slicedTwo == "12" || slicedTwo == "13" || slicedTwo == "14") {
        return this.allUsersCount + " человек";
      } else if (slicedOne == "2" || slicedOne == "3" || slicedOne == "4") {
        return this.allUsersCount + " человека";
      } else {
        return this.allUsersCount + " человек";
      }
    },
    passedDecl() {
      if (this.allUsersCount == 1) {
        return "прошел";
      } else {
        return "прошли";
      }
    },
  },
  methods: {
    progressVote(data) {
      this.$set(
        this.answers.answer[this.answers.voteId],
        data.data.id,
        data.data.answers
      );
      if (data.data.position) {
        this.questionNumber = data.data.position;
      }
    },
    sendForm() {
      axios.post("mobileapp/api/vote/add/", this.answers).then((response) => {
        if (response.data === "Success") {
          this.isEnd = true;
          this.openThanks = true;
          this.loadVotes(this.data.ID);
        } else {
          this.isEnd = false;
          this.openThanks = false;
        }
      });
    },
    loadVotes(id) {
      axios
        .get("/mobileapp/api/vote/usersVoted/?voteId=" + id)
        .then((response) => {
          this.allUsersCount = response.data.data.length;
        });
    },
    changeAnswer(data) {
      this.$set(
        this.answers.answer[this.answers.voteId],
        data.data.id,
        data.data.answers
      );
    },
    loadPoll() {
      axios.get("mobileapp/api/vote/vidget/").then((response) => {
        this.data = response.data.data[0];
        if (this.data.QUESTIONS) {
          this.questions = this.data.QUESTIONS[this.data.ID];
          this.answers.voteId = this.data.ID;
          this.$set(this.answers.answer, this.data.ID, {});
          this.activeQuestion = this.questions[0];
        } else {
          // console.log(this.data);
        }
      });
    },
    closeThanks() {
      this.openThanks = false;
      this.loadPoll();
    },
  },
  mounted() {
    this.loadPoll();
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/sidebarWidgets";

.widget_headline {
  background: var(--red100);
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  height: 200px;

  h2 {
    position: absolute;
    top: 22px;
    font-size: 50px;
    color: var(--red300);
    z-index: 0;
  }
  img {
    width: 170px;
    object-fit: cover;
    z-index: 1;
  }
}

.widget_content {
  padding: 0;
  background-color: var(--red100);
}

.poll_name {
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  color: var(--gray900);
  text-align: center;
  padding: 16px;
  background-color: var(--red500);
  word-break: break-word;
}

.poll_number {
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  padding: 6px;
  background-color: var(--red300);
  text-align: center;
}

.all {
  padding: 18px;
  text-align: center;
  background-color: #fff;
  color: var(--red900);
  display: block;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  text-decoration: none;
  border-top: 2px solid var(--gray300);
}
.poll_end {
  padding: var(--v-rhythm-10) var(--v-rhythm-7);
  text-align: center;

  h3 {
    margin-bottom: 40px;
  }

  &__user-count {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 24px;

    &--red {
      color: var(--red900);
    }
  }

  &__to-result {
    color: var(--red900);
    font-size: 16px;
    font-weight: 700;
  }
}
.poll_item {
  padding: 0 10px;
  & > .polls_form {
    padding-top: var(--v-rhythm-6);
  }
  &::v-deep .radio .input-radio__placeholder {
    display: none;
  }
}
.poll {
  &__statistic {
    margin: 10px 16px;
  }
}
</style>
