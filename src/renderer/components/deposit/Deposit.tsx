import React, { useMemo } from 'react'

import * as RD from '@devexperts/remote-data-ts'
import { Chain } from '@xchainjs/xchain-util'
import { Grid } from 'antd'
import * as FP from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { useIntl } from 'react-intl'

import { WalletAddress } from '../../../shared/wallet/types'
import { eqAddress, eqOAddress } from '../../helpers/fp/eq'
import { PoolDetailRD as PoolDetailMayaRD, PoolShareRD as PoolShareMayaRD } from '../../services/mayaMigard/types'
import { PoolDetailRD, PoolShareRD, PoolSharesRD } from '../../services/midgard/types'
import { getSharesByAssetAndType } from '../../services/midgard/utils'
import { MimirHalt } from '../../services/thorchain/types'
import { KeystoreState } from '../../services/wallet/types'
import { hasImportedKeystore, isLocked } from '../../services/wallet/util'
import { AssetWithDecimal } from '../../types/asgardex'
import { Props as SymDepositContentProps } from '../../views/deposit/add/SymDepositView.types'
import { Props as WidthdrawContentProps } from '../../views/deposit/withdraw/WithdrawDepositView.types'
import { AddWallet } from '../wallet/add'
import * as Styled from './Deposit.styles'

type TabKey = 'deposit-sym' | 'deposit-saver' | 'withdraw-sym' | 'withdraw-saver-asset'

type Tab = {
  key: TabKey
  label: string
  disabled: boolean
  content: JSX.Element
}

export type Props = {
  haltedChains: Chain[]
  mimirHalt: MimirHalt
  asset: AssetWithDecimal
  shares: PoolSharesRD
  poolDetail: PoolDetailRD | PoolDetailMayaRD
  ShareContent: React.ComponentType<{
    asset: AssetWithDecimal
    poolShare: PoolShareRD | PoolShareMayaRD
    smallWidth?: boolean
    poolDetail: PoolDetailRD | PoolDetailMayaRD
  }>
  SymDepositContent: React.ComponentType<SymDepositContentProps>
  WidthdrawContent: React.ComponentType<WidthdrawContentProps>
  keystoreState: KeystoreState
  dexWalletAddress: WalletAddress
  assetWalletAddress: WalletAddress
}

export const Deposit: React.FC<Props> = (props) => {
  const {
    asset: assetWD,
    ShareContent,
    haltedChains,
    mimirHalt,
    SymDepositContent,
    WidthdrawContent,
    keystoreState,
    shares: poolSharesRD,
    poolDetail: poolDetailRD,
    dexWalletAddress,
    assetWalletAddress
  } = props

  const { asset } = assetWD
  const intl = useIntl()

  const isDesktopView = Grid.useBreakpoint()?.md ?? false

  const walletIsImported = useMemo(() => hasImportedKeystore(keystoreState), [keystoreState])
  const walletIsLocked = useMemo(() => isLocked(keystoreState), [keystoreState])

  const symPoolShare: PoolShareRD = useMemo(
    () =>
      FP.pipe(
        poolSharesRD,
        RD.map((shares) => getSharesByAssetAndType({ shares, asset, type: 'sym' })),
        RD.map((oPoolShare) =>
          FP.pipe(
            oPoolShare,
            O.filter(({ runeAddress, assetAddress: oAssetAddress }) => {
              // use shares of current selected addresses only
              return (
                eqOAddress.equals(runeAddress, O.some(dexWalletAddress.address)) &&
                FP.pipe(
                  oAssetAddress,
                  O.map((assetAddress) =>
                    // Midgard returns addresses in lowercase - it might be changed in the future
                    eqAddress.equals(assetAddress.toLowerCase(), assetWalletAddress.address.toLowerCase())
                  ),
                  O.getOrElse<boolean>(() => false)
                )
              )
            })
          )
        )
      ),
    [asset, assetWalletAddress, poolSharesRD, dexWalletAddress]
  )

  const hasPoolShare = (poolShare: PoolShareRD): boolean => FP.pipe(poolShare, RD.toOption, O.flatten, O.isSome)
  const hasSymPoolShare: boolean = useMemo(() => hasPoolShare(symPoolShare), [symPoolShare])

  const tabs = useMemo(
    (): Tab[] => [
      {
        key: 'deposit-sym',
        disabled: false,
        label: intl.formatMessage({ id: 'deposit.add.sym' }),
        content: (
          <SymDepositContent
            poolDetail={poolDetailRD}
            asset={assetWD}
            dexWalletAddress={dexWalletAddress}
            assetWalletAddress={assetWalletAddress}
            haltedChains={haltedChains}
            mimirHalt={mimirHalt}
          />
        )
      },
      {
        key: 'withdraw-sym',
        disabled: !hasSymPoolShare,
        label: intl.formatMessage({ id: 'deposit.withdraw.sym' }),
        content: (
          <WidthdrawContent
            poolDetail={poolDetailRD}
            asset={assetWD}
            dexWalletAddress={dexWalletAddress}
            assetWalletAddress={assetWalletAddress}
            poolShare={symPoolShare}
            haltedChains={haltedChains}
            mimirHalt={mimirHalt}
          />
        )
      }
    ],
    [
      intl,
      SymDepositContent,
      poolDetailRD,
      assetWD,
      dexWalletAddress,
      assetWalletAddress,
      haltedChains,
      mimirHalt,
      hasSymPoolShare,
      WidthdrawContent,
      symPoolShare
    ]
  )

  return (
    <Styled.Container>
      <Styled.ContentContainer>
        {walletIsImported && !walletIsLocked ? (
          <>
            <Styled.DepositContentCol xs={24} xl={15}>
              <Styled.Tabs destroyInactiveTabPane tabs={tabs} centered defaultActiveKey="deposit-sym" />
            </Styled.DepositContentCol>
            <Styled.ShareContentCol xs={24} xl={9}>
              <Styled.ShareContentWrapper alignTop={hasSymPoolShare}>
                <ShareContent
                  poolDetail={poolDetailRD}
                  asset={assetWD}
                  poolShare={symPoolShare}
                  smallWidth={!isDesktopView}
                />
              </Styled.ShareContentWrapper>
            </Styled.ShareContentCol>
          </>
        ) : (
          <AddWallet isLocked={walletIsImported && walletIsLocked} />
        )}
      </Styled.ContentContainer>
    </Styled.Container>
  )
}
