import { BTCChain } from '@xchainjs/xchain-bitcoin'
import { BCHChain } from '@xchainjs/xchain-bitcoincash'
import { BSCChain } from '@xchainjs/xchain-bsc'
import { Balance, Network } from '@xchainjs/xchain-client'
import { THORChain } from '@xchainjs/xchain-thorchain'
import { assetAmount, baseAmount, bn } from '@xchainjs/xchain-util'
import { Chain } from '@xchainjs/xchain-util'
import * as O from 'fp-ts/lib/Option'

import { ApiUrls } from '../../../shared/api/types'
import { BSC_ADDRESS_TESTNET, RUNE_ADDRESS_TESTNET } from '../../../shared/mock/address'
import { ASSETS_MAINNET } from '../../../shared/mock/assets'
import { AssetBSC, AssetBTC, AssetRuneNative } from '../../../shared/utils/asset'
import { WalletAddress } from '../../../shared/wallet/types'
import { SymDepositAddresses } from '../../services/chain/types'
import { PoolAddress, PoolShare } from '../../services/midgard/types'
import { ApiError, ErrorId } from '../../services/wallet/types'
import { AssetWithAmount } from '../../types/asgardex'
import { PricePool } from '../../views/pools/Pools.types'
import { mockWalletAddress } from '../test/testWalletHelper'
import {
  eqAsset,
  eqBaseAmount,
  eqBalance,
  eqBalances,
  eqAssetsWithAmount,
  eqAssetWithAmount,
  eqApiError,
  eqBigNumber,
  eqOAsset,
  eqChain,
  eqOChain,
  eqPoolShares,
  eqPoolShare,
  eqPoolAddresses,
  eqONullableString,
  eqAssetAmount,
  eqPricePool,
  eqOString,
  eqWalletAddress,
  eqOWalletAddress,
  eqSymDepositAddresses,
  eqWalletType,
  eqKeystoreId,
  eqNetwork,
  eqApiUrls
} from './eq'

describe('helpers/fp/eq', () => {
  describe('eqOString', () => {
    it('same some(string) are equal', () => {
      const a = O.some('hello')
      const b = O.some('hello')
      expect(eqOString.equals(a, b)).toBeTruthy()
    })
    it('different some(asset) are not equal', () => {
      const a = O.some('hello')
      const b = O.some('world')
      expect(eqOString.equals(a, b)).toBeFalsy()
    })
    it('none/some are not equal', () => {
      const b = O.some('hello')
      expect(eqOString.equals(O.none, b)).toBeFalsy()
    })
    it('none/none are equal', () => {
      expect(eqOString.equals(O.none, O.none)).toBeTruthy()
    })
  })

  describe('eqBigNumber', () => {
    it('is equal', () => {
      expect(eqBigNumber.equals(bn(1.01), bn(1.01))).toBeTruthy()
    })
    it('is not equal', () => {
      expect(eqBigNumber.equals(bn(1), bn(1.01))).toBeFalsy()
    })
  })

  describe('eqAsset', () => {
    it('is equal', () => {
      const a = AssetRuneNative
      expect(eqAsset.equals(a, a)).toBeTruthy()
    })
    it('is not equal', () => {
      const a = AssetRuneNative
      const b = AssetBSC
      expect(eqAsset.equals(a, b)).toBeFalsy()
    })
  })

  describe('eqOAsset', () => {
    it('same some(asset) are equal', () => {
      const a = O.some(AssetRuneNative)
      expect(eqOAsset.equals(a, a)).toBeTruthy()
    })
    it('different some(asset) are not equal', () => {
      const a = O.some(AssetRuneNative)
      const b = O.some(AssetBSC)
      expect(eqOAsset.equals(a, b)).toBeFalsy()
    })
    it('none/some are not equal', () => {
      const b = O.some(AssetBSC)
      expect(eqOAsset.equals(O.none, b)).toBeFalsy()
    })
    it('none/none are equal', () => {
      expect(eqOAsset.equals(O.none, O.none)).toBeTruthy()
    })
  })

  describe('eqChain', () => {
    it('is equal', () => {
      expect(eqChain.equals(THORChain, THORChain)).toBeTruthy()
    })
    it('is not equal', () => {
      expect(eqChain.equals(THORChain, BTCChain)).toBeFalsy()
    })
  })

  describe('eqOChain', () => {
    it('same some(chain) are equal', () => {
      const a: O.Option<Chain> = O.some(THORChain)
      expect(eqOChain.equals(a, a)).toBeTruthy()
    })
    it('different some(chain) are not equal', () => {
      const a: O.Option<Chain> = O.some(THORChain)
      const b: O.Option<Chain> = O.some(BTCChain)
      expect(eqOChain.equals(a, b)).toBeFalsy()
    })
    it('none/some are not equal', () => {
      const b: O.Option<Chain> = O.some(BTCChain)
      expect(eqOChain.equals(O.none, b)).toBeFalsy()
    })
    it('none/none are equal', () => {
      expect(eqOChain.equals(O.none, O.none)).toBeTruthy()
    })
  })

  describe('eqNetwork', () => {
    it('equal', () => {
      expect(eqNetwork.equals(Network.Testnet, Network.Testnet)).toBeTruthy()
      expect(eqNetwork.equals(Network.Mainnet, Network.Mainnet)).toBeTruthy()
      expect(eqNetwork.equals(Network.Stagenet, Network.Stagenet)).toBeTruthy()
    })
    it('not equal', () => {
      expect(eqNetwork.equals(Network.Stagenet, Network.Mainnet)).toBeFalsy()
    })
  })

  describe('eqBaseAmount', () => {
    it('is equal', () => {
      const a = baseAmount(100, 18)
      expect(eqBaseAmount.equals(a, a)).toBeTruthy()
    })
    it('is not equal', () => {
      const a = baseAmount(100, 18)
      const b = baseAmount(222, 18)
      expect(eqBaseAmount.equals(a, b)).toBeFalsy()
    })
  })

  describe('eqAssetAmount', () => {
    it('is equal', () => {
      const a = assetAmount(100, 18)
      expect(eqAssetAmount.equals(a, a)).toBeTruthy()
    })
    it('is not equal', () => {
      const a = assetAmount(100, 18)
      const b = assetAmount(222, 18)
      expect(eqAssetAmount.equals(a, b)).toBeFalsy()
    })
  })

  describe('eqApiError', () => {
    const a: ApiError = {
      errorId: ErrorId.GET_BALANCES,
      msg: 'msg'
    }
    it('is equal', () => {
      expect(eqApiError.equals(a, a)).toBeTruthy()
    })
    it('is not equal with different msg', () => {
      const b: ApiError = {
        ...a,
        msg: 'anotherMsg'
      }
      expect(eqApiError.equals(a, b)).toBeFalsy()
    })
    it('is not equal with different msg', () => {
      const b: ApiError = {
        ...a,
        errorId: ErrorId.SEND_TX
      }
      expect(eqApiError.equals(a, b)).toBeFalsy()
    })
  })

  describe('eqBalance', () => {
    it('is equal', () => {
      const a: Balance = {
        amount: baseAmount('1'),
        asset: AssetBSC
      }
      expect(eqBalance.equals(a, a)).toBeTruthy()
    })
    it('is not equal', () => {
      const a: Balance = {
        amount: baseAmount('1'),
        asset: AssetBSC
      }
      // b = same as a, but another amount
      const b: Balance = {
        ...a,
        amount: baseAmount('2')
      }
      // c = same as a, but another asset
      const c: Balance = {
        ...a,
        asset: AssetRuneNative
      }
      expect(eqBalance.equals(a, b)).toBeFalsy()
      expect(eqBalance.equals(a, c)).toBeFalsy()
    })
  })

  describe('eqAssetWithAmount', () => {
    it('is equal', () => {
      const a: AssetWithAmount = {
        amount: baseAmount('1'),
        asset: AssetBSC
      }
      expect(eqAssetWithAmount.equals(a, a)).toBeTruthy()
    })
    it('is not equal', () => {
      const a: AssetWithAmount = {
        amount: baseAmount('1'),
        asset: AssetBSC
      }
      // b = same as a, but another amount
      const b: AssetWithAmount = {
        ...a,
        amount: baseAmount('2')
      }
      // c = same as a, but another asset
      const c: AssetWithAmount = {
        ...a,
        asset: AssetRuneNative
      }
      expect(eqAssetWithAmount.equals(a, b)).toBeFalsy()
      expect(eqAssetWithAmount.equals(a, c)).toBeFalsy()
    })
  })

  describe('eqONullableString', () => {
    it('is equal', () => {
      expect(eqONullableString.equals(O.some('MEMO'), O.some('MEMO'))).toBeTruthy()
      expect(eqONullableString.equals(O.none, O.none)).toBeTruthy()
      expect(eqONullableString.equals(undefined, undefined)).toBeTruthy()
    })
    it('is not equal', () => {
      expect(eqONullableString.equals(O.none, O.some('MEMO'))).toBeFalsy()
      expect(eqONullableString.equals(O.some('MEMO'), O.none)).toBeFalsy()
      expect(eqONullableString.equals(O.some('MEMO'), undefined)).toBeFalsy()
      expect(eqONullableString.equals(undefined, O.some('MEMO'))).toBeFalsy()
      expect(eqONullableString.equals(undefined, O.none)).toBeFalsy()
      expect(eqONullableString.equals(O.none, undefined)).toBeFalsy()
    })
  })

  describe('eqBalances', () => {
    const a: Balance = {
      amount: baseAmount('1'),
      asset: AssetRuneNative
    }
    const b: Balance = {
      ...a,
      asset: AssetBSC
    }
    const c: Balance = {
      ...a,
      asset: ASSETS_MAINNET.DOGE
    }
    it('is equal', () => {
      expect(eqBalances.equals([a, b], [a, b])).toBeTruthy()
    })
    it('is not equal with different elements', () => {
      expect(eqBalances.equals([a, b], [b, c])).toBeFalsy()
    })
    it('is not equal if elements has been flipped', () => {
      expect(eqBalances.equals([a, b], [b, a])).toBeFalsy()
    })
  })

  describe('eqAssetsWithAmount', () => {
    const a: AssetWithAmount = {
      amount: baseAmount('1'),
      asset: AssetRuneNative
    }
    const b: AssetWithAmount = {
      ...a,
      asset: AssetBSC
    }
    const c: AssetWithAmount = {
      ...a,
      asset: ASSETS_MAINNET.DOGE
    }
    it('is equal', () => {
      expect(eqAssetsWithAmount.equals([a, b], [a, b])).toBeTruthy()
    })
    it('is not equal with different elements', () => {
      expect(eqAssetsWithAmount.equals([a, b], [b, c])).toBeFalsy()
    })
    it('is not equal if elements has been flipped', () => {
      expect(eqAssetsWithAmount.equals([a, b], [b, a])).toBeFalsy()
    })
  })

  describe('eqPoolShare', () => {
    it('is equal', () => {
      const a: PoolShare = {
        type: 'asym',
        units: bn(1),
        asset: AssetRuneNative,
        runeAddress: O.some(RUNE_ADDRESS_TESTNET),
        assetAddress: O.none,
        assetAddedAmount: baseAmount(1)
      }
      expect(eqPoolShare.equals(a, a)).toBeTruthy()
    })
    it('is not equal', () => {
      const a: PoolShare = {
        type: 'asym',
        units: bn(1),
        asset: AssetRuneNative,
        runeAddress: O.some(RUNE_ADDRESS_TESTNET),
        assetAddress: O.none,
        assetAddedAmount: baseAmount(1)
      }
      // b = same as a, but another units
      const b: PoolShare = {
        ...a,
        units: bn(2)
      }
      // c = same as a, but another asset
      const c: PoolShare = {
        ...a,
        asset: AssetBSC
      }
      expect(eqPoolShare.equals(a, b)).toBeFalsy()
      expect(eqPoolShare.equals(a, c)).toBeFalsy()
    })
  })

  describe('eqPoolShares', () => {
    const a: PoolShare = {
      type: 'asym',
      units: bn(1),
      asset: AssetRuneNative,
      runeAddress: O.some(RUNE_ADDRESS_TESTNET),
      assetAddress: O.none,
      assetAddedAmount: baseAmount(1)
    }
    const b: PoolShare = {
      type: 'sym',
      units: bn(1),
      asset: AssetBSC,
      assetAddress: O.some(BSC_ADDRESS_TESTNET),
      runeAddress: O.some(RUNE_ADDRESS_TESTNET),
      assetAddedAmount: baseAmount(0.5)
    }
    const c: PoolShare = {
      type: 'all',
      units: bn(1),
      asset: AssetBTC,
      assetAddress: O.some('btc-address'),
      runeAddress: O.some(RUNE_ADDRESS_TESTNET),
      assetAddedAmount: baseAmount(1)
    }
    it('is equal', () => {
      expect(eqPoolShares.equals([a, b], [a, b])).toBeTruthy()
    })
    it('is not equal with different elements', () => {
      expect(eqPoolShares.equals([a, b], [b, c])).toBeFalsy()
    })
    it('is not equal if elements has been flipped', () => {
      expect(eqPoolShares.equals([a, b], [b, a])).toBeFalsy()
    })
  })
  describe('eqPoolAddresses', () => {
    const a: PoolAddress = {
      chain: BCHChain,
      address: 'addressA',
      router: O.none,
      halted: false
    }
    const b: PoolAddress = {
      chain: BSCChain,
      address: 'addressB',
      router: O.some('routerB'),
      halted: false
    }
    it('is equal', () => {
      expect(eqPoolAddresses.equals(a, a)).toBeTruthy()
      expect(eqPoolAddresses.equals(b, b)).toBeTruthy()
    })
    it('is not equal', () => {
      expect(eqPoolAddresses.equals(a, b)).toBeFalsy()
      expect(eqPoolAddresses.equals(b, a)).toBeFalsy()
    })
  })

  describe('eqPricePool', () => {
    const a: PricePool = {
      asset: AssetRuneNative,
      poolData: {
        dexBalance: baseAmount(1),
        assetBalance: baseAmount(1)
      }
    }
    const b: PricePool = {
      asset: AssetRuneNative,
      poolData: {
        dexBalance: baseAmount(2),
        assetBalance: baseAmount(1)
      }
    }
    const c: PricePool = {
      asset: AssetBSC,
      poolData: {
        dexBalance: baseAmount(2),
        assetBalance: baseAmount(1)
      }
    }

    it('is equal', () => {
      expect(eqPricePool.equals(a, a)).toBeTruthy()
      expect(eqPricePool.equals(b, b)).toBeTruthy()
    })
    it('is not equal', () => {
      expect(eqPricePool.equals(a, b)).toBeFalsy()
      expect(eqPricePool.equals(b, c)).toBeFalsy()
    })
  })

  describe('eqKeystoreId', () => {
    it('equal', () => {
      expect(eqKeystoreId.equals(1, 1)).toBeTruthy()
    })
    it('not equal', () => {
      expect(eqKeystoreId.equals(1, 2)).toBeFalsy()
    })
  })

  describe('eqWalletAddress', () => {
    const a: WalletAddress = mockWalletAddress()

    it('is equal', () => {
      expect(eqWalletAddress.equals(a, a)).toBeTruthy()
    })

    it('is not equal', () => {
      expect(eqWalletAddress.equals(a, { ...a, address: 'another' })).toBeFalsy()
      expect(eqWalletAddress.equals(a, { ...a, type: 'ledger' })).toBeFalsy()
      expect(eqWalletAddress.equals(a, { ...a, chain: BSCChain })).toBeFalsy()
      expect(eqWalletAddress.equals(a, { ...a, walletIndex: 1 })).toBeFalsy()
    })
  })

  describe('eqWalletType', () => {
    it('is equal', () => {
      expect(eqWalletType.equals('keystore', 'keystore')).toBeTruthy()
      expect(eqWalletType.equals('ledger', 'ledger')).toBeTruthy()
    })

    it('is not equal', () => {
      expect(eqWalletType.equals('keystore', 'ledger')).toBeFalsy()
      expect(eqWalletType.equals('ledger', 'keystore')).toBeFalsy()
    })
  })

  describe('eqOWalletAddress', () => {
    const a: WalletAddress = mockWalletAddress()

    it('is equal', () => {
      expect(eqOWalletAddress.equals(O.some(a), O.some(a))).toBeTruthy()
      expect(eqOWalletAddress.equals(O.none, O.none)).toBeTruthy()
    })

    it('is not equal', () => {
      expect(eqOWalletAddress.equals(O.some(a), O.some({ ...a, address: 'another' }))).toBeFalsy()
      expect(eqOWalletAddress.equals(O.some(a), O.some({ ...a, type: 'ledger' }))).toBeFalsy()
      expect(eqOWalletAddress.equals(O.some(a), O.some({ ...a, chain: BSCChain }))).toBeFalsy()
      expect(eqOWalletAddress.equals(O.some(a), O.some({ ...a, walletIndex: 1 }))).toBeFalsy()
    })
  })

  describe('eqSymDepositAddresses', () => {
    const rune: WalletAddress = mockWalletAddress()
    const oRune: O.Option<WalletAddress> = O.some(rune)
    const asset: WalletAddress = mockWalletAddress({ chain: BSCChain })
    const oAsset: O.Option<WalletAddress> = O.some(asset)
    const addresses: SymDepositAddresses = { dex: oRune, asset: oAsset }

    it('are equal', () => {
      expect(eqSymDepositAddresses.equals(addresses, addresses)).toBeTruthy()
    })

    it('are not equal', () => {
      expect(
        eqSymDepositAddresses.equals(addresses, { asset: oAsset, dex: O.some({ ...rune, address: 'another' }) })
      ).toBeFalsy()
      expect(
        eqSymDepositAddresses.equals(addresses, { asset: oAsset, dex: O.some({ ...rune, type: 'ledger' }) })
      ).toBeFalsy()
      expect(
        eqSymDepositAddresses.equals(addresses, { asset: oAsset, dex: O.some({ ...rune, chain: BSCChain }) })
      ).toBeFalsy()
      expect(
        eqSymDepositAddresses.equals(addresses, { asset: oAsset, dex: O.some({ ...rune, walletIndex: 1 }) })
      ).toBeFalsy()
      expect(eqSymDepositAddresses.equals(addresses, { asset: oAsset, dex: O.none })).toBeFalsy()
      expect(eqSymDepositAddresses.equals(addresses, { asset: O.none, dex: oRune })).toBeFalsy()
      expect(eqSymDepositAddresses.equals(addresses, { asset: O.none, dex: O.none })).toBeFalsy()
    })
  })
  describe('eqApiUrls', () => {
    const a: ApiUrls = {
      mainnet: 'mainnet-a',
      stagenet: 'stagenet-a',
      testnet: 'testnet-a'
    }
    const b: ApiUrls = {
      mainnet: 'mainnet-b',
      stagenet: 'stagenet-b',
      testnet: 'testnet-b'
    }
    it('equal', () => {
      expect(eqApiUrls.equals(a, a)).toBeTruthy()
      expect(eqApiUrls.equals(b, b)).toBeTruthy()
    })
    it('not equal', () => {
      expect(eqApiUrls.equals(a, b)).toBeFalsy()
      expect(eqApiUrls.equals(b, a)).toBeFalsy()
    })
  })
})
