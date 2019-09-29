export const fetchPeriods = async function ({ commit, state }) {
  if (state.periods.length) return
  let more = true
  while (more) {
    const result = await this.$transit.getTableRows({
      code: process.env.SMARTCONTRACT,
      scope: process.env.SMARTCONTRACT,
      table: 'periods',
      lowerBound: state.periods.length ? state.periods[state.periods.length - 1].period_id : '',
      limit: 100
    })

    commit('addPeriods', result.rows)
    more = result.more
  }
  commit('flushPeriods')
}