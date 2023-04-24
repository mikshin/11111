<template>
  <div class="ui-kit">
    <AppPage>
      <div class="ui-kit__content">
        <!-- QuestionAnswer -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'QuestionAnswer'"
          :description="'!TODO добавить описание'"
          :contentModif="'col'"
        >
          <!-- QuestionAnswerHeader -->
          <div class="ui-kit__column">
            <b>QuestionAnswerHeader</b>
            <QuestionAnswerHeader
              :type="'question'"
              :person="QuestionAnswer.QuestionAnswerHeader.person"
            />

            <QuestionAnswerHeader
              :type="'answer'"
              :person="QuestionAnswer.QuestionAnswerHeader.person"
            />
          </div>

          <!-- QuestionAnswerMain -->
          <div class="ui-kit__column">
            <b>QuestionAnswerMain</b>
            <QuestionAnswerMain
              :text="QuestionAnswer.QuestionAnswerMain.text"
              :files="QuestionAnswer.QuestionAnswerMain.files"
              :rights="['edit', 'delete']"
            />
          </div>

          <!-- QuestionAnswerFooter -->
          <div class="ui-kit__column">
            <b>QuestionAnswerFooter</b>
            <QuestionAnswerFooter :date="'23 сентября 2022, 10:15'" />
          </div>
        </ui-kit-section>

        <!-- ManagerQuestion -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'ManagerQuestion'"
          :description="'!TODO добавить описание'"
          :contentModif="'col'"
        >
          <ManagerQuestion
            :questionData="QuestionAnswer.ManagerQuestion"
            :recipient="{
              ID: '8',
              FULL_NAME: 'd;sfgsd',
            }"
          />
        </ui-kit-section>
        <!-- Базовые компоненты страницы -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Базовые компоненты страницы'"
          :description="''"
        >
          <AppPage
            :pageTitle="'Можно передать заголовок'"
            :breadcrumbsDopName="` доп.имя`"
          >
            <MainSidebar :directionReverse="true">
              <template #main>Main</template>
              <template #sidebar>sidebar</template>
            </MainSidebar>
          </AppPage>
        </ui-kit-section>
        <!-- Типографика -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Типографика'"
          :description="'В стилях компонента в нужном селекторе в самом начале с помощью @extend добавляется класс типографики. Например: @extend .h1 .'"
          :contentModif="'col'"
        >
          <ui-kit-tipography
            :modif="modif"
            :key="i"
            v-for="(modif, i) in tipography"
          />
        </ui-kit-section>
        <!-- Заголовки -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Заголовки'"
          :description="'Тут представлены стилизованные заголовки. Название заголовка это класс, который вы можете использовать для стилизации вашего заголовка.'"
          :contentModif="'col'"
        >
          <div class="main-title">main-title</div>
        </ui-kit-section>
        <!-- Иконки -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Иконки'"
          :description="'Если вам нужны иконки, то используйте компонент UserIcons.vue (подключен глобально). В атрибут \':iconName\' нужно передать строкой название иконки. Размерами иконки можно управлять через css'"
          :contentModif="'col'"
        >
          <UiKitUserIcons
            :iconName="iconName"
            :key="i"
            v-for="(iconName, i) in iconsNames"
          />
        </ui-kit-section>
        <!-- Иконки -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Триггеры'"
          :description="'!TODO Добавить описание'"
          :contentModif="'col'"
        >
          <div class="ui-kit__column">
            <b>SimpleTrigger</b>
            <SimpleTrigger
              :count="15"
              :title="'Участников'"
              :iconName="'group'"
            />
          </div>
        </ui-kit-section>
        <!-- AppFile -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'AppFile'"
          :description="'!TODO дописать описание. Иконка подставляется автоматически в зависимости от расширения файла. Для docx и xlsx подставляются иконки с doc и xls Мобилка есть. Для картинок формата png, jpg, jpeg, gif, svg, webp подставляется единая иконка.'"
          :contentModif="'col'"
        >
          <AppFile
            :fileTitle="'title.PDF'"
            :fileSize="'5 Mb'"
            :fileExtension="'PDF'"
            :fileDate="'30.08.2022'"
          />
          <AppFile
            :fileTitle="'title.docx'"
            :fileSize="'5 Mb'"
            :fileExtension="'docx'"
            :fileDate="'30.08.2022'"
          />
          <AppFile
            :fileTitle="'title.xlsx'"
            :fileSize="'5 Mb'"
            :fileExtension="'xlsx'"
            :fileDate="'30.08.2022'"
          />
          <AppFile
            :fileTitle="'title.pptx'"
            :fileSize="'5 Mb'"
            :fileExtension="'pptx'"
            :fileDate="'30.08.2022'"
          />
          <AppFile
            :fileTitle="'title.zip'"
            :fileSize="'5 Mb'"
            :fileExtension="'zip'"
            :fileDate="'30.08.2022'"
          />
          <AppFile
            :fileTitle="'title.PNG'"
            :fileSize="'5 Mb'"
            :fileExtension="'PNG'"
            :fileDate="'30.08.2022'"
          />
          <AppFile
            :fileTitle="'title.avi'"
            :fileSize="'5 Mb'"
            :fileExtension="'avi'"
            :fileDate="'30.08.2022'"
          />
          <AppFile
            :fileTitle="'title.mp3'"
            :fileSize="'5 Mb'"
            :fileExtension="'mp3'"
            :fileDate="'30.08.2022'"
          />
          <AppFile
            :fileTitle="'title.mp4'"
            :fileSize="'5 Mb'"
            :fileExtension="'mp4'"
            :fileDate="'30.08.2022'"
          />
          <AppFile
            :fileTitle="'title.wav'"
            :fileSize="'5 Mb'"
            :fileExtension="'wav'"
            :fileDate="'30.08.2022'"
          />
        </ui-kit-section>
        <!-- AppDocument -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'AppDocument'"
          :description="''"
          :contentModif="'col'"
        >
          <AppDocument
            :fileTitle="'title.wav'"
            :fileSize="'5 Mb'"
            :fileLink="'../files/test.wav'"
            :fileExtension="'wav'"
            :fileDate="'30.08.2022'"
            :hasButtonCross="true"
          />
        </ui-kit-section>
        <!-- SocialMedia -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'SocialMedia'"
          :description="'!TODO дописать описание. Компонент SocialMedia.vue.'"
        >
          <SocialMedia
            :socialMediaData="socialMedia.socialMediaData"
            :iconSize="socialMedia.iconSize"
          />
        </ui-kit-section>
        <!-- Кнопки -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Кнопки'"
          :description="'Что бы стилизовать кнопку к ней нужно добавить один из классов представленных ниже (классы подключены глобально). Кнопки адаптируются под мобилку. Иконку в кнопку можно добавить с помощью компонента UserIcons.vue. Только в этом случае текст внутри кнопки нужно обернуть в span. Примеры использования представлены ниже.'"
          :contentModif="'col'"
        >
          <!-- primary-btn -->
          <div class="ui-kit__column">
            <b>primary-btn</b>
            <button class="primary-btn">Button</button>
            <button class="primary-btn">
              <user-icons :iconName="'arrow-down'" /> <span>Button</span>
            </button>
            <button class="primary-btn">
              <span>Button</span> <user-icons :iconName="'arrow-down'" />
            </button>
            <b>primary-btn primary-btn--invert</b>
            <button class="primary-btn primary-btn--invert">Button</button>
            <b>primary-btn primary-btn--disabled</b>
            <button class="primary-btn" disabled="true">Button</button>
          </div>

          <!-- secondary-btn -->
          <div class="ui-kit__column">
            <b>secondary-btn</b>
            <button class="secondary-btn">Button</button>
            <button class="secondary-btn">
              <user-icons :iconName="'arrow-down'" /> <span>Button</span>
            </button>
            <button class="secondary-btn">
              <span>Button</span> <user-icons :iconName="'arrow-down'" />
            </button>
            <b>secondary-btn secondary-btn--invert</b>
            <button class="secondary-btn secondary-btn--invert">Button</button>
            <b>secondary-btn secondary-btn--disabled</b>
            <button class="secondary-btn secondary-btn--disabled">
              Button
            </button>
          </div>

          <!-- text-btn -->
          <div class="ui-kit__column">
            <b>text-btn</b>
            <button class="text-btn">Button</button>
            <button class="text-btn">
              <user-icons :iconName="'arrow-down'" /> <span>Button</span>
            </button>
            <button class="text-btn">
              <span>Button</span> <user-icons :iconName="'arrow-down'" />
            </button>
            <b>text-btn text-btn--invert</b>
            <button class="text-btn text-btn--invert"></button>
            <b>text-btn text-btn--disabled</b>
            <button class="text-btn text-btn--disabled">Button</button>
          </div>
        </ui-kit-section>
        <!-- Chips -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Chips'"
          :description="'!TODO написать описание'"
          :contentModif="'col'"
        >
          <!-- FilterChip -->
          <div class="ui-kit__column">
            <b>filter-chip</b>
            <filter-chip>Filter</filter-chip>
            <b>:isActive="true"</b>
            <filter-chip :isActive="true">Filter</filter-chip>
            <b>:isDisabled="true"</b>
            <filter-chip :isDisabled="true">Filter</filter-chip>
          </div>
        </ui-kit-section>
        <!-- События -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'События'"
          :description="'!TODO написать описание'"
          :contentModif="'col'"
        >
          <!-- DateTime -->
          <div class="ui-kit__column">
            <b>DateTime</b>
            <DateTime
              :day="'06'"
              :month="'августа'"
              :year="'2022'"
              :timeList="['10:00', '10:00']"
            />
          </div>

          <!-- EventCard -->
          <div class="ui-kit__column" style="max-width: 286px">
            <b>EventCard</b>
            <EventCard
              :id="'2542'"
              :dateTime="{
                day: '06',
                month: 'августа',
                timeList: ['10:00', '10:00'],
              }"
              :title="'title'"
              :officeNumber="'6'"
              :meetingRoomNumber="'1'"
              :otherPlace="'Парк «Спортивный» Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure voluptas, nostrum consequatur cumque porro voluptates saepe expedita impedit temporibus debitis mollitia laborum. Voluptatum saepe autem voluptates libero minus, illum esse.'"
            />
          </div>

          <!-- SliderCalendar -->
          <div class="ui-kit__column">
            <b>SliderCalendar</b>
            <SliderCalendar />
          </div>
        </ui-kit-section>
        <!-- Labels -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Labels'"
          :description="'!TODO написать описание'"
          :contentModif="'col'"
        >
          <!-- AppLabel -->
          <div class="ui-kit__column">
            <b>AppLabel</b>
            <AppLabel :collorClass="'red700'">red700</AppLabel>
            <AppLabel :collorClass="'red900'">red900</AppLabel>
            <AppLabel :collorClass="'chat-primary'">chat-primary</AppLabel>
          </div>

          <!-- TaskStatus -->
          <div class="ui-kit__column">
            <b>TaskStatus</b>
            <TaskStatus :status="'Ждет выполнения'" />
            <TaskStatus :status="'Выполняется'" />
            <TaskStatus :status="'Завершена'" />
            <TaskStatus :status="'Отложена'" />
            <TaskStatus :status="'Просрочена'" />
          </div>

          <!-- PhotoContestStatus -->
          <div class="ui-kit__column">
            <b>PhotoContestStatus</b>
            <PhotoContestStatus :active="true" />
            <PhotoContestStatus :active="false" />
          </div>

          <!-- EventStatus -->
          <div class="ui-kit__column">
            <b>EventStatus</b>
            <EventStatus :status="'Подтверждено'" />
            <EventStatus :status="'Ожидается'" />
            <EventStatus :status="'отклонено'" />
          </div>

          <!-- SimpleLabel -->
          <div class="ui-kit__column">
            <b>SimpleLabel</b>
            <SimpleLabel :labelText="'Любой текст'" />
          </div>

          <!-- VacationLabel -->
          <div class="ui-kit__column">
            <b>VacationLabel</b>
            <VacationLabel />
          </div>

          <!-- FiredLabel -->
          <div class="ui-kit__column">
            <b>FiredLabel</b>
            <FiredLabel />
          </div>
        </ui-kit-section>
        <!-- Inputs -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Инпуты'"
          :description="'!TODO написать описание'"
          :contentModif="'col'"
        >
          <!-- SimpleInput -->
          <div class="ui-kit__column">
            <b>SimpleInput</b>
            <SimpleInput :placeholder="'Простой интуп'" :type="'text'" />
            <SimpleInput :placeholder="'Не активный'" :isDisabled="true" />
          </div>
          <!-- SimpleInputRadios -->
          <div class="ui-kit__column">
            <b>SimpleInputRadios</b>
            <SimpleInputRadios
              :name="'test-radio'"
              :inputsData="[
                {
                  value: 'test1',
                  title: 'test1 test1sedfsar',
                },
                { value: 'test2', title: 'test2' },
                { value: 'test3', title: 'disabled', disabled: 'true' },
              ]"
              @changeRadio="changeRadio"
            />
          </div>
        </ui-kit-section>
        <!-- AppLogo -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Логотип'"
          :description="'AppLogo.vue компонент логотипа. Размеры регулируются через scss из компонента, куда логотип импортируется.'"
          :contentModif="'col'"
        >
          <div
            style="background-color: var(--gray700); width: 100%; padding: 20px"
          >
            <app-logo />
          </div>
        </ui-kit-section>
        <!-- слайды -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Слайды'"
          :description="'!TODO добавить описание'"
          :contentModif="'col'"
        >
          <div style="width: 200px">
            <SlideCard
              :title="'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit aperiam, unde cum, ex exercitationem provident eligendi quis perferendis blanditiis eius ducimus architecto consectetur doloremque? Nemo id ex fugiat ut? Ex at odit tempora reprehenderit nemo quo similique, nam consectetur! Similique doloribus illum quos accusamus quo voluptatibus dolores ratione voluptatum doloremque.'"
              :id="'8'"
            />
          </div>
        </ui-kit-section>
        <!-- carousels -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Карусели'"
          :description="'!TODO добавить описание'"
        >
          <div class="" style="position: relative; z-index: 2">
            <CarouselBtn :prevNext="'prev'" :id="'simple-carousel-prev'" />
            <CarouselBtn :prevNext="'next'" :id="'simple-carousel-next'" />
          </div>
          <Swiper
            :options="carousels.SimpleCarousel.swiperOption"
            class="simple-carousel swiper"
            style="margin: -20px -8px; padding: 20px 8px"
          >
            <SlideCard
              class="swiper-slide"
              v-for="slide in carousels.SimpleCarousel.slides"
              :key="slide.ID"
              :title="slide.NAME"
              :id="slide.ID"
            />
          </Swiper>
          <div style="margin-top: 20px" id="simple-carousel-pagination"></div>
        </ui-kit-section>
        <!-- EventsTimeline -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'EventsTimeline'"
          :description="''"
        >
          <EventsTimeline
            :eventsList="EventsTimeline"
            :date="new Date().setHours(0, 0, 0, 0)"
          />
        </ui-kit-section>
        <!-- AppSearch -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'AppSearch'"
          :description="'!TODO написать описание'"
        >
          <app-search :searchQuery="'Можно указать запрос'" />
        </ui-kit-section>
        <!-- SimpleSearch -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'SimpleSearch'"
          :description="'!TODO написать описание'"
        >
          <Simple-search />
        </ui-kit-section>
        <!-- Лоадер -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Лоадер'"
          :description="'!TODO нужно переделать. Что бы использовать лоадер нужно просто добавть класс \'loading\' нужному элементу.'"
          :contentModif="'col'"
        >
          <div class="loading" style="width: 52px"></div>
        </ui-kit-section>
        <!-- Списки пользователей -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Списки пользователей'"
          :description="'!TODO добавить кастомный скроллбар.'"
          :contentModif="'col'"
        >
          <PeopleTooltip :people="peopleTooltipData" />
          <PeopleList :peopleList="PeopleList" :updataIsEnd="true" />
          <PeopleList :peopleList="[]" :updataIsEnd="true" />
          <!-- Есть еще компонент ParticipantsListV2 -->
          <ParticipantsList :participants="participantsSecond.member" />
        </ui-kit-section>
        <!-- Тултип -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Тултип'"
          :description="'!TODO дополнить описание. Для тултипов на проекте используется библиотека vue-tippy. Компонент tippy подключен глобально. Тут представлены два варианта использования этого компонента. Подробнее с настройками компонента можно ознакомиться на их сайте https://kabbouchi.github.io/vue-tippy/4.0/demo.html'"
          :contentModif="'col'"
        >
          <!-- Пример -->
          <div class="ui-kit__column">
            <b>Пример</b>
            <tippy
              trigger="click"
              interactive
              animation="fade"
              :animate-fill="false"
              arrow
              theme="light"
            >
              <template v-slot:trigger>
                <button>Tooltip using component</button>
              </template>

              <div class="">I'm a Tippy tooltip!</div>
            </tippy>
          </div>

          <!-- SimpleTooltip -->
          <div class="ui-kit__column">
            <b>SimpleTooltip</b>
            <SimpleTooltip
              :iconName="'info'"
              :content="'Сюда можно передать любой текстовый контент.'"
            />
          </div>

          <!-- PrintTooltip -->
          <div class="ui-kit__column">
            <b>PrintTooltip</b>
            <PrintTooltip :content="'Распечатать'" />
          </div>

          <!-- WelcomeTooltip -->
          <div class="ui-kit__column">
            <b>WelcomeTooltip</b>
            <WelcomeTooltip :content="'Приветствовать'" />
          </div>
        </ui-kit-section>
        <!-- Счетчики -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Компонент AppCounters'"
          :description="'!TODO сейчас url прописаны внутри компонента, что бы сделать компонент более универсальным, нужно сделать, что бы url передавался динамически. Компонент AppCounters принмает следующие параметры: :urlId - используется для связи с элементом, к которому относятся счетсики; :isReverse - если передать true, меняет порядок счетчиков в обратном направлении; :counterViews - принимает объект с настройками для просмотров (подробнее смотри компонент ViewsCounter.vue); :counterLikes - принимает объект с настройками для лайков (подробнее смотри компонент LikesCounter.vue); :counterComments - принимает объект с настройками для комментариев (подробнее смотри компонент CommentsCounter.vue). Если не передать объект с настройками для конкретного счетчика, то этот счетчик отображаться не будет.'"
          :contentModif="'col'"
        >
          <div class="ui-kit__column">
            <b>AppCounters</b>
            <AppCounters
              :urlId="appCounters.urlId"
              :isReverse="appCounters.isReverse"
              :counterViews="appCounters.counterViews"
              :counterLikes="appCounters.counterLikes"
              :counterComments="appCounters.counterComments"
            />
          </div>

          <div class="ui-kit__column">
            <b>SimpleLikesCounter</b>
            <SimpleLikesCounter
              :url="'/mobileapp/api/photoContest/photo/like/'"
              :fetchParametrs="{
                photoContestId: '565478568',
                cardId: '34234234',
              }"
              :counterNumber="1"
              :isLiked="false"
              :isDisabled="false"
              @likeClick="() => {}"
            />
          </div>
        </ui-kit-section>
        <!-- Модалки -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Модалки'"
          description="!TODO дополнить описание."
          :contentModif="'col'"
        >
          <div>
            <button
              class="primary-btn"
              @click="modal.ThanksModal.isOpen = true"
            >
              Поблагодарить
            </button>
            <ThanksModal
              :dataObj="modal.ThanksModal"
              @onClose="modal.ThanksModal.isOpen = false"
            />
          </div>

          <div>
            <button
              class="primary-btn"
              @click="modal.HappyBirthdayModal.isOpen = true"
            >
              Поздравить с ДР
            </button>
            <transition name="fade">
              <HappyBirthdayModal
                :isVisible="modal.HappyBirthdayModal.isOpen"
                :user="modal.HappyBirthdayModal.user"
                @closePopup="modal.HappyBirthdayModal.isOpen = false"
              />
            </transition>
          </div>

          <div>
            <button
              class="primary-btn"
              @click="modal.BirthdayReminderModal.isOpen = true"
            >
              Напомнить о ДР
            </button>
            <transition name="fade">
              <BirthdayReminderModal
                :isVisible="modal.BirthdayReminderModal.isOpen"
                :user="modal.BirthdayReminderModal.user"
                @closePopup="modal.BirthdayReminderModal.isOpen = false"
              />
            </transition>
          </div>

          <div>
            <button
              class="primary-btn"
              @click="modal.galleryModal.isOpen = true"
            >
              Добавить фото
            </button>
            <transition name="fade">
              <!-- При вызове модалки надо указывать галлерею куд отправлять эти фотки -->
              <ModalAddPhoto
                v-if="modal.galleryModal.isOpen"
                photoContestId="4801"
                @close="modal.galleryModal.isOpen = false"
              />
            </transition>
          </div>
        </ui-kit-section>
        <!-- Виджеты -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Виджеты'"
          description="!TODO дополнить описание."
          :contentModif="'col'"
        >
          <!-- WidgetWrapper -->
          <div class="" style="width: 100%; max-width: 437px">
            <WidgetWrapper
              :iconName="'like'"
              :title="'Название виджета'"
              :textBtn="'Кнопка'"
            >
              Любой контент
            </WidgetWrapper>
          </div>
          <!-- BirthdaysWidgetTabs -->
          <div class="" style="width: 100%; max-width: 437px">
            <BirthdaysWidgetTabs />
          </div>
          <!-- ThanksWidgetTabs -->
          <div class="" style="width: 100%; max-width: 437px">
            <ThanksWidgetTabs />
          </div>
          <!-- NewEmployeesWidget -->
          <div class="" style="width: 100%; max-width: 437px">
            <NewEmployeesWidget />
          </div>
          <!-- EmployeesWidget -->
          <div class="" style="width: 100%; max-width: 437px">
            <EmployeesWidget :depId="'31'" />
          </div>
          <!-- BirthdaysWidgetList -->
          <div class="" style="width: 100%; max-width: 437px">
            <BirthdaysWidgetList :depId="'4646'" />
          </div>
          <!-- MyCalendarWidget -->
          <div class="" style="width: 100%; max-width: 437px">
            <MyCalendarWidget />
          </div>
          <!-- CommunitiesWidgetTabs -->
          <div class="" style="width: 100%; max-width: 437px">
            <CommunitiesWidgetTabs />
          </div>
        </ui-kit-section>
        <!-- SimplePicture -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'SimplePicture'"
          :description="'!TODO добавить описание'"
        >
          <SimplePicture
            style="width: 200px; height: 200px"
            :alt="SimplePicture.alt"
            :src="SimplePicture.src"
            :src2x="SimplePicture.src2x"
            :webpSrc="SimplePicture.webpSrc"
            :webpSrc2x="SimplePicture.webpSrc2x"
            :mediaArray="SimplePicture.mediaArray"
          />
        </ui-kit-section>
        <!-- Компоненты для рейтингов -->
        <ui-kit-section
          class="ui-kit__section"
          title="Компоненты для рейтингов"
          description="!TODO добавить описание. У AppReward готова мобиьная версия."
          contentModif="col"
        >
          <!-- RewardMedal -->
          <RewardMedal :place="'1'" :fontSize="'18px'" />

          <!-- AppReward -->
          <AppReward
            :place="'1'"
            :title="'Рейтинг бригад'"
            :time="'02.03.2022'"
          />
        </ui-kit-section>
        <!-- Компоненты данных пользователя -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'Компоненты данных пользователя'"
          :description="'!TODO добавить описание. Для ProfileName, SimplePersonCard мобильная версия готова.'"
          :contentModif="'col'"
        >
          <!-- ProfileName -->
          <div class="ui-kit__column">
            <b>ProfileName</b>
            <ProfileName
              :id="'8'"
              :label="'label'"
              :name="'Full name'"
              :company="'company'"
              :division="'division'"
              :profession="'profession'"
              :birthday="'20 января'"
            />

            <b>small</b>
            <ProfileName
              :id="'8'"
              :isSmall="true"
              :label="'label'"
              :name="'Full name'"
              :company="'company'"
              :division="'division'"
              :profession="'profession'"
              :birthday="'20 января'"
            />
          </div>

          <!-- SimplePersonCard -->
          <div class="ui-kit__column">
            <b>SimplePersonCard</b>
            <SimplePersonCard
              :avatar="{ alt: 'ggg' }"
              fullName="Full Name"
              profession="profession"
              :link="true"
              :id="'8'"
              :vacation="true"
            />
            <b>SimplePersonCard mini</b>
            <SimplePersonCard
              :avatar="{ alt: 'ggg' }"
              fullName="Full Name"
              profession="profession"
              :isMiniSize="true"
              :vacation="true"
            />
          </div>

          <!-- AppProfile -->
          <div class="ui-kit__column">
            <b>AppProfile</b>
            <AppProfile
              :simplePicture="AppProfile.simplePicture"
              :profileName="AppProfile.profileName"
            />
          </div>

          <!-- AppAvatar -->
          <div class="ui-kit__column">
            <b>AppAvatar</b>
            <AppAvatar
              style="width: 220px; height: 220px"
              src="img/person/driller/1.jpg"
              alt="Full name"
            />
          </div>

          <!-- SubdivisionTree -->
          <div class="ui-kit__column">
            <b>SubdivisionTree</b>
            <SubdivisionTree :dataObj="SubdivisionTree" />
          </div>
        </ui-kit-section>
        <!-- PersonCard -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'PersonCard'"
          :description="'!TODO добавить описание. Адаптировано под мобилку.'"
        >
          <PersonCard :personData="PersonCard.personData" />
        </ui-kit-section>
        <!-- LeaderCard -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'LeaderCard'"
          :description="'!TODO добавить описание. Адаптив под мобилку готов.'"
        >
          <LeaderCard
            id="8"
            src=""
            fullName="Full name"
            company="company"
            division="division"
            workPosition="profession"
            workPhone="8 (495) 197-87-04"
            innerWorkPhone="1515"
            personPhone="8 (904) 900-56-00"
            workEmail="adress@naftagaz.com"
            workAddress="г. Москва, ул. Уличная, д. 5, 4 этаж, 401 каб."
            deputySrc=""
            deputyFullName="Full Name"
            deputyWorkPosition="profession"
            deputyID="8"
            headSrc=""
            headFullName="Full Name"
            headWorkPosition="profession"
            headID="8"
            :vacation="true"
            :fired="false"
            :headVacation="true"
          />
        </ui-kit-section>
        <!-- ThankCard -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'ThankCard'"
          :description="'!TODO добавить описание. Мобилка готова'"
          contentModif="col"
        >
          <div class="">
            <ThankCard
              :userFrom="{
                id: 0,
                fullName: 'Full Name',
                workPosition: 'position',
              }"
              :congratulation="'С днем рожденья поздравляю, желаю всего самого наилучшего, вдохновения и упорства на достижение всех целей, и пусть все мечты сбываются, рамок нет.'"
              :date="'15.04.2022'"
            />
          </div>
          <div class="">
            <ThankCard
              :userTo="{
                id: 0,
                fullName: 'Full Name',
                workPosition: 'position',
              }"
              :congratulation="'С днем рожденья поздравляю, желаю всего самого наилучшего, вдохновения и упорства на достижение всех целей, и пусть все мечты сбываются, рамок нет.'"
              :date="'15.04.2022'"
            />
          </div>
        </ui-kit-section>
        <!-- LkCard -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'LkCard'"
          :description="'!TODO добавить описание.'"
        >
          <b>Своя карта</b>
          <LkCard :isMine="true" id="8" />
          <b>Карта другого пользователя</b>
          <LkCard :isMine="false" id="8" />
        </ui-kit-section>
        <!-- TabsNav -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'TabsNav'"
          :description="'!TODO добавить описание.'"
          :contentModif="'col'"
        >
          <!-- TabsNav -->
          <div class="ui-kit__column">
            <b>TabsNav</b>
            <TabsNav
              :tabs="TabsNav.tabs"
              :activeTabObj="TabsNav.tabsActive"
              @changeTab="(e) => (TabsNav.tabsActive = e)"
            />
            <div>
              <template
                v-if="TabsNav.tabsActive.name === TabsNav.tabs[0].name"
                >{{ TabsNav.tabs[0].name }}</template
              >
              <template
                v-else-if="TabsNav.tabsActive.name === TabsNav.tabs[1].name"
                >{{ TabsNav.tabs[1].name }}</template
              >
              <template
                v-else-if="TabsNav.tabsActive.name === TabsNav.tabs[2].name"
                >{{ TabsNav.tabs[2].name }}</template
              >
            </div>
          </div>
          <!-- isAdditionally -->
          <div class="ui-kit__column">
            <b>isAdditionally</b>
            <TabsNav
              :tabs="TabsNav.tabsAdditionally"
              :isAdditionally="true"
              @changeTab="(e) => (TabsNav.tabsAdditionallyActive = e)"
            />
            <div>
              <template
                v-if="
                  TabsNav.tabsAdditionallyActive.name ===
                  TabsNav.tabsAdditionally[0].name
                "
                >{{ TabsNav.tabsAdditionally[0].name }}</template
              >
              <template
                v-else-if="
                  TabsNav.tabsAdditionallyActive.name ===
                  TabsNav.tabsAdditionally[1].name
                "
                >{{ TabsNav.tabsAdditionally[1].name }}</template
              >
              <template
                v-else-if="
                  TabsNav.tabsAdditionallyActive.name ===
                  TabsNav.tabsAdditionally[2].name
                "
                >{{ TabsNav.tabsAdditionally[2].name }}</template
              >
            </div>
          </div>
        </ui-kit-section>
        <!-- Observer -->
        <ui-kit-section
          class="ui-kit__section"
          :title="'observer'"
          :description="''"
        >
          <div class="root">
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id
              veritatis cumque quas error accusamus dolores. Maxime ullam facere
              porro rem mollitia eveniet necessitatibus impedit nemo
              perferendis! Et, numquam quisquam. Incidunt provident, numquam
              harum ad ex sed aspernatur facilis atque, nesciunt corrupti
              doloribus ratione odit tempora ab? Excepturi aliquam quasi magnam
              ea tempora suscipit earum optio, labore ab, nam cupiditate fugit
              beatae quam molestiae minima sint corrupti architecto unde. Ut
              nostrum, nisi at ad sint cum, id consequuntur doloremque quisquam
              officia facere ratione voluptates impedit dignissimos iusto,
              delectus tempore? Eos sed, laboriosam eveniet quasi architecto
              esse accusamus deserunt perferendis earum rerum!
            </p>
            <div class="observer" v-intersection="testFunction"></div>
          </div>
        </ui-kit-section>
      </div>
    </AppPage>
  </div>
</template>

<script>
import PeopleTooltip from "@/components/UI/tooltip/PeopleTooltip.vue";
import AppCounters from "@/components/UI/counter/AppCounters.vue";
import SimpleLikesCounter from "@/components/UI/counter/SimpleLikesCounter.vue";
import AppLogo from "@/components/UI/AppLogo.vue";
import SocialMedia from "@/components/UI/social-media/SocialMedia.vue";
import FilterChip from "@/components/UI/chips/FilterChip.vue";
import AppSearch from "@/components/UI/search/AppSearch.vue";
import SimpleSearch from "@/components/UI/search/SimpleSearch.vue";
import SimpleInput from "@/components/UI/inputs/SimpleInput.vue";
import SimpleInputRadios from "@/components/UI/inputs/SimpleInputRadios.vue";
import SimpleTooltip from "@/components/UI/tooltip/SimpleTooltip.vue";
import PrintTooltip from "@/components/UI/tooltip/PrintTooltip.vue";
import WelcomeTooltip from "@/components/UI/tooltip/WelcomeTooltip.vue";
import TabsNav from "@/components/UI/tabs/TabsNav.vue";
import SimplePicture from "@/components/UI/SimplePicture.vue";
import ProfileName from "@/components/person-cards/ProfileName.vue";
import AppProfile from "@/components/person-cards/AppProfile.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import PersonCard from "@/components/person-cards/PersonCard.vue";
import LeaderCard from "@/components/person-cards/LeaderCard.vue";
import LkCard from "@/components/person-cards/LkCard.vue";
import AppAvatar from "@/components/UI/AppAvatar.vue";
import PeopleList from "@/components/UI/PeopleList.vue";
import ThanksModal from "@/components/modals/ThanksModal.vue";
import HappyBirthdayModal from "@/components/modals/HappyBirthdayModal.vue";
import BirthdayReminderModal from "@/components/modals/BirthdayReminderModal.vue";
import RewardMedal from "@/components/UI/ratings/RewardMedal.vue";
import AppReward from "@/components/UI/ratings/AppReward.vue";
import AppPage from "@/components/UI/page/AppPage.vue";
import MainSidebar from "@/components/UI/page/MainSidebar.vue";
import SubdivisionTree from "@/components/person-cards/subdivision-tree/SubdivisionTree.vue";
import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";
import BirthdaysWidgetTabs from "@/components/widgets/BirthdaysWidgetTabs.vue";
import ThanksWidgetTabs from "@/components/widgets/ThanksWidgetTabs.vue";
import NewEmployeesWidget from "@/components/widgets/NewEmployeesWidget.vue";
import EmployeesWidget from "@/components/widgets/EmployeesWidget.vue";
import QuestionAnswerHeader from "@/components/manager-question/question-answer/QuestionAnswerHeader.vue";
import ManagerQuestion from "@/components/manager-question/manager-question/ManagerQuestion.vue";
import QuestionAnswerMain from "@/components/manager-question/question-answer/QuestionAnswerMain.vue";
import QuestionAnswerFooter from "@/components/manager-question/question-answer/QuestionAnswerFooter.vue";
import BirthdaysWidgetList from "@/components/widgets/BirthdaysWidgetList.vue";
import MyCalendarWidget from "@/components/widgets/my-calendar-widget/MyCalendarWidget.vue";
import CommunitiesWidgetTabs from "@/components/widgets/CommunitiesWidgetTabs.vue";
import ThankCard from "@/components/cards/ThankCard.vue";
import AppFile from "@/components/UI/document/AppFile.vue";
import AppDocument from "@/components/UI/document/AppDocument.vue";
import AppLabel from "@/components/UI/labels/AppLabel.vue";
import TaskStatus from "@/components/UI/labels/TaskStatus.vue";
import PhotoContestStatus from "@/components/UI/labels/PhotoContestStatus.vue";
import SimpleTrigger from "@/components/UI/triggers/SimpleTrigger.vue";
import EventStatus from "@/components/UI/labels/EventStatus.vue";
import SimpleLabel from "@/components/UI/labels/SimpleLabel.vue";
import VacationLabel from "@/components/UI/labels/VacationLabel.vue";
import FiredLabel from "@/components/UI/labels/FiredLabel.vue";
import CarouselBtn from "@/components/UI/CarouselBtn.vue";
import SlideCard from "@/components/carousels/SlideCard.vue";
import { Swiper } from "vue-awesome-swiper";
import DateTime from "@/components/UI/DateTime.vue";
import EventCard from "@/components/UI/EventCard.vue";
import SliderCalendar from "@/components/UI/SliderCalendar.vue";
import EventsTimeline from "@/components/calendar/events-timeline/EventsTimeline.vue";
import ParticipantsList from "@/components/UI/ParticipantsList.vue";

import UiKitSection from "@/components/ui-kit/UiKitSection.vue";
import UiKitTipography from "@/components/ui-kit/UiKitTipography.vue";
import UiKitUserIcons from "@/components/ui-kit/UiKitUserIcons.vue";

import ModalAddPhoto from "@/components/modals/ModalAddPhoto.vue";
export default {
  name: "PageKit",

  components: {
    EventsTimeline,
    PeopleTooltip,
    UiKitTipography,
    UiKitSection,
    UiKitUserIcons,
    AppCounters,
    SimpleLikesCounter,
    AppLogo,
    SocialMedia,
    FilterChip,
    AppSearch,
    SimpleSearch,
    SimpleInput,
    SimpleInputRadios,
    SimpleTooltip,
    PrintTooltip,
    WelcomeTooltip,
    TabsNav,
    SimplePicture,
    PersonCard,
    LeaderCard,
    LkCard,
    ProfileName,
    AppProfile,
    SimplePersonCard,
    AppAvatar,
    ThanksModal,
    HappyBirthdayModal,
    BirthdayReminderModal,
    RewardMedal,
    QuestionAnswerHeader,
    ManagerQuestion,
    QuestionAnswerMain,
    QuestionAnswerFooter,
    AppReward,
    SubdivisionTree,
    PeopleList,
    WidgetWrapper,
    BirthdaysWidgetTabs,
    ThanksWidgetTabs,
    NewEmployeesWidget,
    EmployeesWidget,
    BirthdaysWidgetList,
    MyCalendarWidget,
    CommunitiesWidgetTabs,
    ThankCard,
    AppPage,
    MainSidebar,
    AppFile,
    AppDocument,
    AppLabel,
    TaskStatus,
    PhotoContestStatus,
    EventStatus,
    SimpleLabel,
    VacationLabel,
    FiredLabel,
    CarouselBtn,
    SlideCard,
    Swiper,
    DateTime,
    EventCard,
    SliderCalendar,
    SimpleTrigger,
    ParticipantsList,
    ModalAddPhoto,
  },

  data() {
    return {
      QuestionAnswer: {
        QuestionAnswerHeader: {
          person: {
            avatar: { alt: "Full Name", src: "" },
            fullName: "Full Name",
            profession: "profession",
            link: true,
            id: "8",
          },
        },
        QuestionAnswerMain: {
          text: "sdasdsa sdf fdfdf fgfgfdg fgfgf ghthrfhfg",
          files: [
            {
              originalName: "title.wav",
              fileSize: "5 Mb",
              fileLink: "../files/test.wav",
              extension: "wav",
            },
          ],
        },
        ManagerQuestion: {
          CREATED_BY: {
            USER_PHOTO: "",
            FULL_NAME: "Full Name",
            WORK_POSITION: "profession",
            link: true,
            ID: "8",
          },
          DATE_CREATE: "30 сентября 2022 15:20",
          DETAIL_TEXT: "Просто вопрос в НГ-СЕРВИС ----- вот",
          FILES: [
            {
              originalName: "title.wav",
              fileSize: "5 Mb",
              fileLink: "../files/test.wav",
              extension: "wav",
            },
          ],
          ID: "2664",
          QUESTION_RIGHT: ["edit", "delete"],
        },
      },

      EventsTimeline: [
        {
          name: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora nihil omnis ab natus molestias, excepturi nobis iure expedita accusamus aspernatur?",
          id: "2350",
          start: "10:15",
          end: "10:45",
          office: "Центральный офис",
          otherPlace: null,
          room: "Переговорка 'Москва'",
        },
        {
          name: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
          id: "2351",
          start: "09:20",
          end: "14:40",
          office: null,
          otherPlace: "Другое место",
          room: null,
        },
      ],
      carousels: {
        SimpleCarousel: {
          swiperOption: {
            slidesPerView: 1,
            spaceBetween: 16,
            loop: false,
            observer: true,
            pagination: {
              el: "#simple-carousel-pagination",
              clickable: true,
              type: "bullets",
            },
            navigation: {
              nextEl: "#simple-carousel-next",
              prevEl: "#simple-carousel-prev",
            },
            breakpoints: {
              // when window width is >= 768px
              768: {
                slidesPerView: 2,
              },
              // when window width is >= 1300px
              1300: {
                slidesPerView: 3,
              },
            },
          },
          slides: [
            {
              ID: "1",
              NAME: "Наименование контентной страницы 1",
            },
            {
              ID: "2",
              NAME: "Наименование контентной страницы 2",
            },
            {
              ID: "670",
              NAME: "Наименование контентной страницы 1",
            },
            {
              ID: "3",
              NAME: "Наименование контентной страницы 2",
            },
            {
              ID: "4",
              NAME: "Наименование контентной страницы 1",
            },
            {
              ID: "5",
              NAME: "Наименование контентной страницы 2",
            },
          ],
        },
      },

      PeopleList: [
        {
          FULL_NAME: "Full name",
          USER_PHOTO: "",
          UF_WORK_POSITION: "profession",
        },
        {
          FULL_NAME: "Full name",
          USER_PHOTO: "",
          UF_WORK_POSITION: "profession",
        },
        {
          FULL_NAME: "Full name",
          USER_PHOTO: "",
          UF_WORK_POSITION: "profession",
        },
        {
          FULL_NAME: "Full name",
          USER_PHOTO: "",
          UF_WORK_POSITION: "profession",
        },
        {
          FULL_NAME: "Full name",
          USER_PHOTO: "",
          UF_WORK_POSITION: "profession",
        },
        {
          FULL_NAME: "Full name",
          USER_PHOTO: "",
          UF_WORK_POSITION: "profession",
        },
        {
          FULL_NAME: "Full name",
          USER_PHOTO: "",
          UF_WORK_POSITION: "profession",
        },
      ],

      participants: {
        2: { FULL_NAME: " Анонимный пользователь", USER_PHOTO: "", ID: "2" },
        3: {
          FULL_NAME: "Чапчакчи Эмиль",
          USER_PHOTO:
            "/upload/main/cc7/vcwrqm25fqnzygedn4g9u9m6irrxtjoa/GkogzzlDAjs.jpg",
          ID: "3",
        },
        6: {
          FULL_NAME: "Иванов Матвей Андреевич",
          USER_PHOTO:
            "/upload/uf/3c3/5b8oba60wto146bo7ve04whzfn9vwv1r/photo_2022-09-03_13-42-43.jpg",
          ID: "6",
        },
        9: {
          FULL_NAME: "Уткина Мария",
          USER_PHOTO:
            "/upload/main/46a/8lhpqnd4cq7hlahqokhrbbmzjnb4pk3c/photo_2021-03-01_19-37-53.jpg",
          ID: "9",
        },
        10: {
          FULL_NAME: "Александр Нечай Владимирович",
          USER_PHOTO:
            "/upload/user_photos/858/i9f90a6zp3w081s91l2jl2drdmg560pp/2020-joker-smile-4k-um.jpg",
          ID: "10",
        },
        2257: {
          FULL_NAME: "Алешкин малой Валерьевич",
          USER_PHOTO:
            "/upload/main/3e4/7nxmm66c0fnjapi9j4c9zp4f1dtwfkuk/1644932113_1-kartinkin-net-p-boss-molokosos-kartinki-1.jpg",
          ID: "2257",
        },
        2548: {
          FULL_NAME: "Бородин Алексей Владимирович",
          USER_PHOTO: "",
          ID: "2548",
        },
        3096: {
          FULL_NAME: "Иванов Даниил Андреевич",
          USER_PHOTO:
            "/upload/user_photos/901/ozn1c3pl9onpc53ol56aw9mysrf4cdd9/image-2022-06-22-20-00-52-905.png",
          ID: "3096",
        },
        3107: {
          FULL_NAME: "Вышлов Владимир Александрович",
          USER_PHOTO: "",
          ID: "3107",
        },
        3651: {
          FULL_NAME: "Дашкевич Кирилл Qwerty123!",
          USER_PHOTO:
            "/upload/user_photos/035/wnjnqyt2aoifmn182q0chyqabys80olx/2021-03-11 10.57.28.jpg",
          ID: "3651",
        },
        3659: { FULL_NAME: "Чендылов Алексей", USER_PHOTO: "", ID: "3659" },
        3675: {
          FULL_NAME: "Mikshin Дмитрий Евгеньевич",
          USER_PHOTO: "",
          ID: "3675",
        },
        3676: {
          FULL_NAME: "mikshin2 Дмитрий Евгеньевич",
          USER_PHOTO: "",
          ID: "3676",
        },
        3684: {
          FULL_NAME: "Пользователь Тестовый Письмо",
          USER_PHOTO: "",
          ID: "3684",
        },
        3686: {
          FULL_NAME: "mikshin3 Дмитрий Евгеньевич",
          USER_PHOTO: "",
          ID: "3686",
        },
      },

      SubdivisionTree: {
        NAME: "111",
        HEAD: {
          ID: "8",
          FULL_NAME: "Петров",
          UF_WORK_POSITION: "Тестовая должность 1",
        },
        CHILD: {
          NAME: "222",
          HEAD: {
            ID: "2",
            FULL_NAME: "Петров Иван",
            UF_WORK_POSITION: "Тестовая должность 1",
          },
          CHILD: {
            NAME: "333",
            HEAD: {
              ID: "2",
              FULL_NAME: "Петрович",
              UF_WORK_POSITION: "Тестовая должность 1",
            },
            CHILD: {
              NAME: "444",
              HEAD: {
                ID: "2",
                FULL_NAME: "Петров Иван Петрович",
                UF_WORK_POSITION: "Тестовая должность 1",
              },
              CHILD: {
                NAME: "555",
                HEAD: {
                  ID: "2",
                  FULL_NAME: "Петров Иван Петрович",
                  UF_WORK_POSITION: "Тестовая должность 1",
                },
                CHILD: {
                  NAME: "666",
                  HEAD: {
                    ID: "2",
                    FULL_NAME: "Петров Иван Петрович",
                    UF_WORK_POSITION: "Тестовая должность 1",
                  },
                  CHILD: {
                    NAME: "777",
                    HEAD: {
                      ID: "2",
                      FULL_NAME: "ddddd",
                      UF_WORK_POSITION: "Тестовая должность 1",
                    },
                    CHILD: {
                      NAME: "777",
                      HEAD: {
                        ID: "2",
                        FULL_NAME: "ddddd",
                        UF_WORK_POSITION: "Тестовая должность 1",
                      },
                      CHILD: {
                        NAME: "777",
                        HEAD: {
                          ID: "2",
                          FULL_NAME: "ddddd",
                          UF_WORK_POSITION: "Тестовая должность 1",
                        },
                        CHILD: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      modal: {
        ThanksModal: {
          isOpen: false,
          id: "8",
          fullName: "Full name",
        },

        HappyBirthdayModal: {
          isOpen: false,
          user: {
            ID: "8",
            FULL_NAME: "Full name",
          },
        },

        BirthdayReminderModal: {
          isOpen: false,
          user: {
            ID: "8",
            FULL_NAME: "Full name",
          },
        },
        galleryModal: {
          isOpen: false,
        },
      },

      AppProfile: {
        simplePicture: {
          alt: "hhh",
        },
        profileName: {
          label: "label",
          name: "Full name",
          company: "company",
          division: "division",
          profession: "profession",
          birthday: "20 января",
        },
      },

      PersonCard: {
        personData: {
          FULL_NAME: "Full name",
          USER_PHOTO: "",
          COMPANY: "company",
          UF_DEPARTMENT: "division",
          UF_WORK_POSITION: "profession",
          UF_PHONE_INNER: "1515",
          EMAIL: "adress@naftagaz.com",
          WORK_PHONE: "8 (904) 900-56-00",
          WORK_STREET: "г. Москва, ул. Уличная, д. 5, 4 этаж, 401 каб.",
          UF_HEAD: {
            ID: "8",
            USER_PHOTO: "",
            FULL_NAME: "Full Name",
            UF_WORK_POSITION: "profession",
          },
          VACATION: true,
        },
      },

      TabsNav: {
        tabs: [
          {
            name: "Первый",
          },
          {
            name: "Второй",
            counter: 100,
          },
          {
            name: "Третий",
            tooltip:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae ea hic nemo dolor modi, voluptatibus beatae rerum dolores nostrum iste!",
          },
        ],
        tabsActive: {
          name: "Второй",
        },
        tabsAdditionally: [
          {
            name: "Первый",
          },
          {
            name: "Второй",
          },
          {
            name: "Третий",
          },
        ],
        tabsAdditionallyActive: {},
      },

      appCounters: {
        urlId: "199",
        isReverse: false,
        counterViews: {
          counter: 0,
        },
        counterLikes: {
          counter: 2,
          isActive: true,
        },
        counterComments: {
          counter: 12,
          url: null,
        },
      },

      socialMedia: {
        socialMediaData: [
          { LINK: "", TYPE: "OK" },
          { LINK: "", TYPE: "VK" },
          { LINK: "", TYPE: "INST" },
          { LINK: "", TYPE: "YOUTB" },
          { LINK: "", TYPE: "FCB" },
          { LINK: "", TYPE: "TG" },
          { LINK: "", TYPE: "RTB" },
        ],
        iconSize: 40,
      },

      iconsNames: [
        "like-hand",
        "arrow-left",
        "arrow-right",
        "arrow-up",
        "arrow-down",
        "search",
        "check",
        "like",
        "comment",
        "eye-on",
        "lock",
        "info",
        "cake",
        "control-minus",
        "control-plus",
        "X",
        "cross",
        "pen",
        "print",
        "bell",
        "chat",
        "phone",
        "add-photo",
        "download",
        "filter",
        "home",
        "services",
        "stop",
        "more",
        "pin",
        "clock",
        "document-download",
        "tag-user",
        "group",
        "thank",
        "menu",
        "emoji-people",
        "attach",
        "plus",
        "plus-1",
        "progress",
        "archive",
        "send",
        "attention",
        "calendar",
        "double_check",
        "image",
        "trash",
        "vacation-label",
        "fired-label",
        "checkbox-false",
        "checkbox-true",
        "radio-false",
        "radio-true",
        "photo-camera",
        "question-mark",
      ],

      tipography: [
        "h1",
        "h2",
        "h3",
        "h4",
        "subtitle-1",
        "subtitle-2",
        "body-1",
        "body-2",
        "caption-1",
        "caption-2",
        "button",
        "overline",
      ],

      peopleTooltipData: [
        {
          authorInfo: {
            userId: "1",
            userName: "Василий",
            userLastName: "Евстигнеев",
            workPosition: "Главный инженер",
            userPhoto: "img/person/driller/1.jpg",
          },
        },
        {
          authorInfo: {
            userId: "2",
            userName: "Григорий",
            userLastName: "Иванов",
            workPosition: "Технический директор",
            userPhoto: "img/person/driller/3.jpg",
          },
        },
        {
          authorInfo: {
            userId: "3",
            userName: "Валерий",
            userLastName: "Епрушкин",
            workPosition: "Личный помощник",
            userPhoto: "img/person/driller/2.jpg",
          },
        },
        {
          authorInfo: {
            userId: "4",
            userName: "Илья",
            userLastName: "Кушматов",
            workPosition: "Руководитель основного пр-ва",
            userPhoto: "img/person/driller/4.jpg",
          },
        },
        {
          authorInfo: {
            userId: "5",
            userName: "Александр",
            userLastName: "Невеселов",
            workPosition: "Директор цеха производства",
            userPhoto: "img/person/driller/5.jpg",
          },
        },
        {
          authorInfo: {
            userId: "6",
            userName: "Илья",
            userLastName: "Потолоков",
            workPosition: "Директор цеха производства",
            userPhoto: "img/person/driller/7.jpg",
          },
        },
      ],

      SimplePicture: {
        alt: "hhh",
        src: "../img/test-img/default.jpg",
        src2x: "../img/test-img/default2x.jpg",
        webpSrc: "../img/test-img/default.webp",
        webpSrc2x: "../img/test-img/default2x.webp",
        mediaArray: [
          {
            media: "(max-width: 767px)",
            src: "../img/test-img/mob-default.jpg",
            src2x: "../img/test-img/mob-default2x.jpg",
            webpSrc: "../img/test-img/mob-default.webp",
            webpSrc2x: "../img/test-img/mob-default2x.webp",
          },
        ],
      },

      inputs: [
        {
          type: "text",
          placeholder: "Ваше имя",
          required: true,
          name: "213",
          maxLength: 100,
        },
        {
          type: "radio",
          placeholder: "Пол",
          name: "radio",
          radioValue: [
            {
              name: "М",
              code: "M",
            },
            {
              name: "Ж",
              code: "F",
            },
          ],
        },
        {
          type: "checkbox",
          placeholder: "Работаете?",
          required: true,
          name: "checkbox",
        },
        {
          type: "checkbox",
          placeholder: "Отдыхаете?",
          required: true,
          name: "checkbox1",
        },
        {
          type: "textarea",
          placeholder: "Расскажите о себе",
          required: true,
          name: "description",
        },
        {
          type: "select",
          placeholder:
            "Выбирай что хочешь, но только одно выбирай что хочешь, но только одно",
          name: "select",
          multiple: false,
          selectValue: [
            {
              label:
                "Управление промышленной безопасности, охраны труда и окружающей среды Томск (не использовать с 01.03.2016г)",
              code: "msk",
            },
            {
              label: "Питер",
              code: "spb",
            },
            {
              label: "Казань",
              code: "kzn",
            },
          ],
        },
        {
          type: "select",
          placeholder: "Выбирай что хочешь и много выбирай что хочешь и много",
          name: "select",
          multiple: true,
          selectValue: [
            {
              label:
                "Управление промышленной безопасности, охраны труда и окружающей среды Томск (не использовать с 01.03.2016г)",
              code: "msk",
            },
            {
              label: "Питер",
              code: "spb",
            },
            {
              label:
                "Управление промышленной безопасности, охраны труда и окружающей среды Томск (не использовать с 01.03.2016г)",
              code: "odf",
            },
          ],
        },
        {
          type: "select",
          placeholder:
            "single-tight(no checkbox) with long description single-tight with long description",
          name: "select",
          multiple: false,
          isTight: true,
          noCheckboxes: true,
          selectValue: [
            {
              label:
                "Управление промышленной безопасности, охраны труда и окружающей среды Томск (не использовать с 01.03.2016г)",
              code: "msk",
            },
            {
              label: "Питер",
              code: "spb",
            },
            {
              label: "Казань",
              code: "kzn",
            },
          ],
        },
        {
          type: "select",
          placeholder:
            "multiple-tight(no checkbox) with long description multiple-tight with long description",
          name: "select",
          multiple: true,
          isTight: true,
          noCheckboxes: true,
          selectValue: [
            {
              label:
                "Управление промышленной безопасности, охраны труда и окружающей среды Томск (не использовать с 01.03.2016г)",
              code: "msk",
            },
            {
              label: "Питер",
              code: "spb",
            },
            {
              label: "Казань",
              code: "kzn4",
            },
            {
              label: "Казань",
              code: "kzn5",
            },
            {
              label: "Казань",
              code: "kzn6",
            },
            {
              label: "Казань",
              code: "kzn7",
            },
            {
              label: "Казань",
              code: "kzn8",
            },
            {
              label: "Казань",
              code: "kzn9",
            },
          ],
        },
        {
          type: "select",
          placeholder: "multiple-tight disabled",
          name: "select",
          multiple: true,
          isTight: true,
          noCheckboxes: true,
          selectValue: [
            {
              label:
                "Управление промышленной безопасности, охраны труда и окружающей среды Томск (не использовать с 01.03.2016г)",
              code: "msk",
            },
            {
              label: "Питер",
              code: "spb",
            },
            {
              label: "Казань",
              code: "kzn4",
            },
            {
              label: "Казань",
              code: "kzn5",
            },
            {
              label: "Казань",
              code: "kzn6",
            },
            {
              label: "Казань",
              code: "kzn7",
            },
            {
              label: "Казань",
              code: "kzn8",
            },
            {
              label: "Казань",
              code: "kzn9",
            },
          ],
        },
      ],

      participantsSecond: {
        member: [
          {
            ID: "2265",
            FULL_NAME: "Новиков Дмитрий Валерьевич",
            USER_PHOTO: null,
          },
          {
            ID: "2264",
            FULL_NAME: "Злобина Ирина Александровна",
            USER_PHOTO: null,
          },
          {
            ID: "2263",
            FULL_NAME: "Курочкин Александр Александрович",
            USER_PHOTO: null,
          },
          {
            ID: "2262",
            FULL_NAME: "Нечай Александр Владимирович",
            USER_PHOTO: null,
          },
          {
            ID: "2259",
            FULL_NAME: "Широков Артем Александрович",
            USER_PHOTO: null,
          },
          {
            ID: "2258",
            FULL_NAME: "Каримова Фаниля Мафрузовна",
            USER_PHOTO: null,
          },
          {
            ID: "3",
            FULL_NAME: "Чапчакчи Эмиль",
            USER_PHOTO:
              "/upload/main/cc7/vcwrqm25fqnzygedn4g9u9m6irrxtjoa/GkogzzlDAjs.jpg",
          },
        ],
        end: true,
        totalCount: 2,
      },
    };
  },

  methods: {
    testFunction() {
      console.log("тест");
    },

    changeRadio(newValue) {
      console.log(newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.ui-kit {
  &__title {
    text-align: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-8);
  }

  &__section {
  }

  &__column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--v-rhythm-4);
    align-self: flex-start;
  }

  .root {
    width: 200px;
    height: 200px;
    background-color: red;
    overflow: scroll;

    .observer {
      width: 100%;
      height: 20px;
      background-color: green;
    }
  }
}
</style>
