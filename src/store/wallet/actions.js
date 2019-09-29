import wallet from 'src/wallet'
import { LocalStorage } from 'quasar'
import { Api } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'

export const openWallet = async function ({ dispatch, commit }, payload) {
  const { accountName, privateKey } = payload
  try {
    this.$transitApi = new Api({ rpc: this.$transit, signatureProvider: new JsSignatureProvider([ privateKey ]), textEncoder: new TextEncoder(), textDecoder: new TextDecoder() })

    localStorage.setItem('accountName', accountName)
    localStorage.setItem('privateKey', privateKey)
  } catch (e) {
    console.log(e)
    return false
  }
  commit('setAuthenticated', accountName)
  await dispatch('profile/me', accountName, { root: true })
  return true
}

export const logout = async function ({ commit }) {
  commit('setAuthenticated')
  commit('profile/clearProfile', null, { root: true })
  localStorage.removeItem('accountName')
  localStorage.removeItem('privateKey')
  this.$transitApi = null
}

export const validateInviteCode = async function (context, inviteCode) {
  const { isValid } = await this.$axios.post('/checkInviteCode', {
    inviteCode
  })
  return isValid
}

/**
 * Refactoring
 */
export const createWallet = async ({ dispatch, commit }, payload) => {
  const { accountName, privateKey, publicKey, inviteCode } = payload

  try {
    commit('startTransaction', 'Register account')

    const transactionId = await wallet.createAccount({ accountName, publicKey, inviteCode })

    if (transactionId) {
      commit('finishTransaction', transactionId)

      LocalStorage.set('accountName', accountName)
      LocalStorage.set('privateKey', privateKey)

      await wallet.init({ privateKey, accountName })

      dispatch('feeds/loadUser', { accountName }, { root: true })

      commit('login', { accountName })
    } else {
      commit('catchTransaction', `Cannot register account ${accountName}`)
    }
  } catch (err) {
    commit('catchError', err)
  }
}

export const closeWallet = async ({ dispatch, commit }, payload) => {
  LocalStorage.remove('accountName')
  LocalStorage.remove('privateKey')

  commit('disconnect')
  commit('logout')
}

export const connectWallet = async ({ dispatch, commit }, payload) => {
  const privateKey = (payload && payload.privateKey) || null
  const accountName = (payload && payload.accountName) || null

  try {
    await wallet.init({ privateKey, accountName })

    if (accountName) {
      dispatch('feeds/loadUser', { accountName }, { root: true })
      commit('login', { accountName })
      await dispatch('profile/me', accountName, { root: true })
    }
    console.log('connect wallet')
    commit('connect')
  } catch (err) {
    commit('catchError', err)
  }
}

export const becomeMember = async ({ dispatch, commit }, payload) => {
  commit('startTransaction', 'Become Member')

  try {
    const { inviteCode } = payload
    const transactionId = await wallet.becomeMember({ inviteCode })

    commit('finishTransaction', transactionId)
  } catch (err) {
    commit('catchTransaction', err)
  }
}