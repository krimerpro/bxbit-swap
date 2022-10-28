import { ChainId } from '@kyberswap/ks-sdk-core'
import { Trans, t } from '@lingui/macro'
import React, { useRef } from 'react'
import { isMobile } from 'react-device-detect'
import {
  Award,
  BookOpen,
  Edit,
  FileText,
  Info,
  Menu as MenuIcon,
  MessageCircle,
  PieChart,
  Share2,
  Triangle,
  UserPlus,
} from 'react-feather'
import { NavLink } from 'react-router-dom'
import { useMedia } from 'react-use'
import { Text } from 'rebass'
import styled, { css } from 'styled-components'

import { ReactComponent as LightIcon } from 'assets/svg/light.svg'
import { ReactComponent as RoadMapIcon } from 'assets/svg/roadmap.svg'
import { ButtonPrimary } from 'components/Button'
import { SlideToUnlock } from 'components/Header'
import DiscoverIcon from 'components/Icons/DiscoverIcon'
import Faucet from 'components/Icons/Faucet'
import Loader from 'components/Loader'
import MenuFlyout from 'components/MenuFlyout'
import { AGGREGATOR_ANALYTICS_URL, DMM_ANALYTICS_URL } from 'constants/index'
import { NETWORKS_INFO } from 'constants/networks'
import { useActiveWeb3React } from 'hooks'
import useClaimReward from 'hooks/useClaimReward'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'
import useTheme from 'hooks/useTheme'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ExternalLink } from 'theme'

import ClaimRewardModal from './ClaimRewardModal'
import FaucetModal from './FaucetModal'
import NavDropDown from './NavDropDown'

const sharedStylesMenuItem = css`
  flex: 1;
  padding: 0.75rem 0;
  text-decoration: none;
  display: flex;
  font-weight: 500;
  white-space: nowrap;
  align-items: center;
  color: ${({ theme }) => theme.subText};

  :hover {
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    text-decoration: none;
  }

  > svg {
    margin-right: 8px;
  }
`

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text};
  }
`

const StyledRoadMapIcon = styled(RoadMapIcon)`
  path {
    stroke: ${({ theme }) => theme.subText};
  }
`
const StyledLightIcon = styled(LightIcon)`
  path {
    stroke: ${({ theme }) => theme.subText};
  }
`

const StyledMenuButton = styled.button<{ active?: boolean }>`
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};

  border-radius: 999px;

  :hover {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.buttonBlack};
  }

  ${({ active }) =>
    active
      ? css`
          cursor: pointer;
          outline: none;
          background-color: ${({ theme }) => theme.buttonBlack};
        `
      : ''}
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

export const NavMenuItem = styled(NavLink)`
  ${sharedStylesMenuItem}
`

export const ExternalNavMenuItem = styled(ExternalLink)`
  ${sharedStylesMenuItem}
`

const MenuButton = styled.div`
  ${sharedStylesMenuItem}
`

const MenuFlyoutBrowserStyle = css`
  min-width: unset;
  right: -8px;

  & ${ExternalNavMenuItem}:nth-child(1),
  & ${NavMenuItem}:nth-child(1) {
    padding-top: 0.75rem;
  }
`

const MenuFlyoutMobileStyle = css`
  & ${ExternalNavMenuItem}:nth-child(1),
  & ${NavMenuItem}:nth-child(1) {
    padding-top: 0.75rem;
  }
`
const ClaimRewardButton = styled(ButtonPrimary)`
  margin-top: 20px;
  padding: 11px;
  font-size: 14px;
  width: max-content;
`

export const NewLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.red};
  height: calc(100% + 4px);
  margin-left: 2px;
`

export default function Menu() {
  const { chainId, account } = useActiveWeb3React()
  const theme = useTheme()
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)

  const under1440 = useMedia('(max-width: 1440px)')
  const above1321 = useMedia('(min-width: 1321px)')
  const above768 = useMedia('(min-width: 768px)')
  const under369 = useMedia('(max-width: 370px)')

  const getBridgeLink = () => {
    if (!chainId) return ''
    return NETWORKS_INFO[chainId].bridgeURL
  }

  const bridgeLink = getBridgeLink()
  const toggleClaimPopup = useToggleModal(ApplicationModal.CLAIM_POPUP)
  const toggleFaucetPopup = useToggleModal(ApplicationModal.FAUCET_POPUP)
  const { pendingTx } = useClaimReward()
  const { mixpanelHandler } = useMixpanel()
  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton active={open} onClick={toggle} aria-label="Menu">
        <StyledMenuIcon />
      </StyledMenuButton>

      <MenuFlyout
        node={node}
        browserCustomStyle={MenuFlyoutBrowserStyle}
        mobileCustomStyle={MenuFlyoutMobileStyle}
        isOpen={open}
        toggle={toggle}
        translatedTitle={t`Menu`}
        hasArrow
      >
        {chainId && [ChainId.BTTC, ChainId.RINKEBY].includes(chainId) && (
          <MenuButton
            onClick={() => {
              toggleFaucetPopup()
              mixpanelHandler(MIXPANEL_TYPE.FAUCET_MENU_CLICKED)
            }}
          >
            <Faucet />
            <Text width="max-content">
              <Trans>Faucet</Trans>
            </Text>
          </MenuButton>
        )}

        {!above768 && (
          <NavMenuItem to={'/discover?tab=trending_soon'} onClick={toggle}>
            <DiscoverIcon size={14} />
            <SlideToUnlock>
              <Text width="max-content">
                <Trans>Discover</Trans>
              </Text>
            </SlideToUnlock>
            <NewLabel>
              <Trans>New</Trans>
            </NewLabel>
          </NavMenuItem>
        )}

        {under1440 && (
          <NavDropDown
            icon={<Info size={14} />}
            title={'About'}
            link={'/about'}
            options={[
              { link: '/about/kyberswap', label: 'Kyberswap' },
              { link: '/about/knc', label: 'KNC' },
            ]}
          />
        )}

        {!above1321 && (
          <NavDropDown
            icon={<PieChart size={14} />}
            link="#"
            title={'Analytics'}
            options={[
              { link: DMM_ANALYTICS_URL[chainId as ChainId], label: 'Liquidity', external: true },
              {
                link: AGGREGATOR_ANALYTICS_URL,
                label: 'Aggregator',
                external: true,
              },
            ]}
          />
        )}
        {process.env.REACT_APP_MAINNET_ENV !== 'production' && (
          <NavMenuItem to="/swap-legacy" onClick={toggle}>
            <Triangle size={14} />
            <Trans>Swap Legacy</Trans>
          </NavMenuItem>
        )}

        {!!process.env.REACT_APP_TAG && (
          <Text
            fontSize="10px"
            fontWeight={300}
            color={theme.subText}
            mt="16px"
            textAlign={isMobile ? 'left' : 'center'}
          >
            kyberswap@{process.env.REACT_APP_TAG}
          </Text>
        )}
      </MenuFlyout>
      {chainId && [ChainId.BTTC, ChainId.RINKEBY].includes(chainId) && <FaucetModal />}
    </StyledMenu>
  )
}
