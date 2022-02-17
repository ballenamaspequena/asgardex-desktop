import { WalletType } from '../../../shared/wallet/types'
import { observableState } from '../../helpers/stateHelper'
import * as C from '../clients'
import { client$ } from './common'

/**
 * `ObservableState` to reload `Balances`
 * Sometimes we need to have a way to understand if it simple "load" or "reload" action
 * e.g. @see src/renderer/services/wallet/balances.ts:getChainBalance$
 */
const { get$: reloadBalances$, set: setReloadBalances } = observableState<boolean>(false)

const resetReloadBalances = () => {
  setReloadBalances(false)
}

const reloadBalances = () => {
  setReloadBalances(true)
}

// State of balances loaded by Client
const balances$ = (walletType: WalletType, walletIndex: number): C.WalletBalancesLD =>
  C.balances$({ client$, trigger$: reloadBalances$, walletType, walletIndex, walletBalanceType: 'all' })

// State of balances loaded by Client
const balancesConfirmed$ = (walletType: WalletType, walletIndex: number): C.WalletBalancesLD =>
  C.balances$({ client$, trigger$: reloadBalances$, walletType, walletIndex, walletBalanceType: 'confirmed' })

// State of balances loaded by Client and Address
const getBalanceByAddress$ = C.balancesByAddress$({ client$, trigger$: reloadBalances$, walletBalanceType: 'all' })

const getBalanceConfirmedByAddress$ = C.balancesByAddress$({
  client$,
  trigger$: reloadBalances$,
  walletBalanceType: 'confirmed'
})

export {
  balances$,
  balancesConfirmed$,
  reloadBalances,
  getBalanceByAddress$,
  getBalanceConfirmedByAddress$,
  reloadBalances$,
  resetReloadBalances
}
