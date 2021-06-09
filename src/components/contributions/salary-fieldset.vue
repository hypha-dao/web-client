<script>
import { format } from '~/mixins/format'

export default {
  name: 'salary-fieldset',
  mixins: [format],
  components: {
    DynamicCommit: () => import('./dynamic-commit.vue'),
    PayoutAmounts: () => import('./payout-amounts.vue')
  },

  props: {
    tokens: {
      type: Array,
      default: () => []
    },
    commit: {
      type: Object,
      default: function () {
        return { value: 100, min: 0, max: 100 }
      },
      validator: function (val) {
        return val.min >= 0 &&
               val.min <= val.value &&
               val.value <= val.max &&
               val.max <= 100
      }
    },
    deferred: {
      type: Number,
      validator: function (val) {
        return val >= 0 && val <= 100
      }
    },
    usdEquivalent: {
      type: Number
    }
  },

  data () {
    return {
      monthly: false
    }
  },

  computed: {
    salaryCommitted () {
      if (this.commit.value < this.commit.max) {
        return `${this.commit.value}% (Max ${this.commit.max}%)`
      }
      return `${this.commit.value}%`
    },
    salaryDeferred () {
      return `${this.deferred}%`
    }
  }
}
</script>

<template lang="pug">
.salary-info.row.q-pa-md
  .col-12.col-md-6.q-pa-md
    .text-bold.q-mb-md COMPENSATION
    payout-amounts(:tokens="tokens" :multiplier="monthly ? 4 : 1")
    .row.items-center.justify-between
      .lunar-toggle.text-italic Show tokens for a full lunar cycle (ca. 1 month)
      q-toggle(v-model="monthly")
  .col-12.col-md-6.q-pa-md
    .text-bold.q-mb-md COMMITMENT
    dynamic-commit(:commit="commit")
</template>

<style lang="stylus" scoped>
.salary-info
  border-radius 24px
  background-color #F6F6F7

  .lunar-toggle
    max-width 75%
</style>