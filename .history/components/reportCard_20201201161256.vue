<template>
  <div>
    <v-form>
      <v-card elevation="5" class="px-6">
        <v-row>
          <v-col cols="12">
            <v-select
              :items="filterPeriodTypes"
              v-model="defaultPeriodValue"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-menu
              v-model="showFilterDatePickker"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="computedDateFormattedMoment"
                  label="Период отчёта"
                  placeholder="Выберите период"
                  v-bind="attrs"
                  :disabled="defaultPeriodValue != 'custom_period'"
                  :readonly="defaultPeriodValue != 'custom_period'"
                  outlined
                  allowed-dates
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filterDatePickerDates"
                locale="ru"
                show-current
                range
                no-title
                @input="showFilterDatePickker = false"
              >
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center">
            <v-btn
              color="primary"
              @click="refreshData"
              :loading="isLoadingData"
            >
              Обновить
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-form>
    <v-card
      class="mx-auto my-5"
      elevation="5"
      outlined
      shaped
      color="purple"
      v-if="totalPrice.length"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-4">Общая сумма заказов</div>
          <v-list-item-title class="headline mb-1">{{
            totalPrice
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-card elevation="5" class="my-5">
      <v-card-text>
        <div v-if="pie">
          <v-chart :options="pie" :init-options="initOptions" ref="pie" />
        </div>
        <div v-else class="text-center">
          <h2>Отсутствуют данные</h2>
        </div>
      </v-card-text>
    </v-card>
    <v-card
      v-for="price in prices"
      :key="price.label"
      class="mx-auto my-5"
      elevation="5"
      outlined
      shaped
      color="purple"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-4">{{ price.label }}</div>
          <v-list-item-title class="headline mb-1">
            {{ price.price }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-card class="mt-4 mx-auto" max-width="400" light>
      <v-sheet
        class="v-sheet--offset mx-auto"
        color="cyan"
        elevation="12"
        max-width="calc(100% - 32px)"
      >
        <v-sparkline
          :labels="labels"
          :value="value"
          color="white"
          line-width="2"
          padding="16"
        ></v-sparkline>
      </v-sheet>

      <v-card-text class="pt-0">
        <div class="title mb-2" align="center">1 000 000.00</div>
        <div class="subheading grey--text" align="center">Total amount</div>
        <v-divider class="my-2"></v-divider>
        <v-icon class="mr-2" small> mdi-clock </v-icon>
        <span class="caption grey--text font-weight-light"
          >last registration 26 minutes ago</span
        >
      </v-card-text>
      <div>
        <canvas id="myChart"></canvas>
      </div>
    </v-card>
  </div>
</template>

<script>
import { formatWithOptions, parseISO } from 'date-fns/fp'
import { ru } from 'date-fns/locale'
import currency from 'currency.js'
export default {
  data: () => ({
    initOptions: {
      renderer: 'canvas',
    },
    prices: [],
    pie: null,
    isLoadingData: false,
    pieInterval: null,
    totalPrice: '',
    filterDatePickerMinDate: new Date().toISOString().substr(0, 10),
    filterDatePickerDates: [new Date().toISOString().substr(0, 10)],
    showFilterDatePickker: false,
    defaultPeriodValue: 'today',
    filterPeriodTypes: [
      {
        text: 'Сегодня',
        value: 'today',
      },
      {
        text: 'Вчера',
        value: 'yesterday',
      },
      {
        text: 'Текущая неделя',
        value: 'week',
      },
      {
        text: 'Текущий месяц',
        value: 'month',
      },
      {
        text: 'Период',
        value: 'custom_period',
      },
    ],
  }),
  computed: {
    computedDateFormattedMoment() {
      const arrival = this.filterDatePickerDates
      // const dateToString = formatWithOptions({ locale: ru }, 'D MMM')
      return Array.isArray(arrival)
        ? arrival
            .sort()
            .map((item) => {
              return formatWithOptions({ locale: ru }, 'd MMM', parseISO(item))
            })
            .join(' - ')
        : ''
    },
  },
  methods: {
    async refreshData() {
      this.isLoadingData = true

      const { data } = await this.$axios.post(
        'https://gavali.fungeek.net/rest/1/l6yxn7688v0l6ewl/mysale.getReportMobApp',
        {
          periodType: this.defaultPeriodValue,
          period: this.filterDatePickerDates,
        }
      )

      if (data.result.PRICES) {
        const labels = data.result.PRICES.map((price) => price.LABEL)
        const pricesData = data.result.PRICES.map((price) => ({
          value: price.PRICE,
          name: price.LABEL,
        }))
        const pieData = {
          title: {
            text: 'Суммы в разрезе способов оплат',
            x: 'center',
          },
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              // console.log(params)
              // console.log('{a} <br/>{b} : {c} ({d}%)')
              return (
                params.name +
                ' <br />' +
                currency(+params.value, {
                  symbol: '',
                  separator: ' ',
                  decimal: ',',
                }).format() +
                ' сум (' +
                params.percent +
                '%)'
              )
            },
          },
          legend: {
            orient: 'horizontal',
            type: 'scroll',
            x: 'center',
            y: 'bottom',
            data: labels,
          },
          series: [
            {
              name: 'Способы оплат',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: pricesData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        }
        this.pie = pieData

        setTimeout(() => {
          let dataIndex = -1
          const pie = this.$refs.pie
          const dataLen = pie.options.series[0].data.length
          clearInterval(this.pieInterval)
          this.pieInterval = setInterval(() => {
            pie.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              dataIndex,
            })
            dataIndex = (dataIndex + 1) % dataLen
            pie.dispatchAction({
              type: 'highlight',
              seriesIndex: 0,
              dataIndex,
            })
            // 显示 tooltip
            pie.dispatchAction({
              type: 'showTip',
              seriesIndex: 0,
              dataIndex,
            })
          }, 1500)
        }, 100)
      }

      this.totalPrice =
        currency(+data.result.TOTAL_PRICE, {
          symbol: '',
          separator: ' ',
          decimal: ',',
        }).format() + ' сум'
      this.prices = []
      data.result.PRICES.forEach((el) => {
        this.prices.push({
          label: el.LABEL,
          price:
            currency(el.PRICE, {
              symbol: '',
              separator: ' ',
              decimal: ',',
            }).format() + ' сум',
        })
      })
      console.log(this.prices)
      this.isLoadingData = false
    },
  },
}
</script>
.v-sheet--offset { top: -24px; position: relative; }
<style scoped></style>
