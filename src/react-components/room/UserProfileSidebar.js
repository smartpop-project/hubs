import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Sidebar } from "../sidebar/Sidebar";
import { CloseButton } from "../input/CloseButton";
import { BackButton } from "../input/BackButton";
import { Button } from "../input/Button";
import { Column } from "../layout/Column";
import styles from "./UserProfileSidebar.scss";
import { FormattedMessage, useIntl } from "react-intl";
import { Slider } from "../input/Slider";
import { ToolbarButton } from "../input/ToolbarButton";
import { ReactComponent as VolumeHigh } from "../icons/VolumeHigh.svg";
import { ReactComponent as VolumeMuted } from "../icons/VolumeMuted.svg";
import useAvatarVolume from "./hooks/useAvatarVolume";
import { calcLevel, calcGainMultiplier, MAX_VOLUME_LABELS } from "../../utils/avatar-volume-utils";

const MIN = 0;
const MAX = MAX_VOLUME_LABELS - 1;

export function UserProfileSidebar({
  className,
  userId,
  displayName,
  pronouns,
  identityName,
  avatarPreview,
  hasMicPresence,
  isSignedIn,
  canPromote,
  onPromote,
  canDemote,
  onDemote,
  isHidden,
  onToggleHidden,
  canMute,
  isNetworkMuted,
  onMute,
  canKick,
  onKick,
  showBackButton,
  onBack,
  onClose,
  canShare,
  onToggleShareScreen,
  canApplyMute,
  onToggleMute,
  canFreeze,
  onToggleFreeze,
  isShare,
  isMute,
  isFreeze,
  ...rest
}) {
  const intl = useIntl();
  const [multiplier, updateMultiplier, isMuted, updateMuted] = useAvatarVolume(userId);
  const onLevelChanged = useCallback(
    level => {
      updateMultiplier(calcGainMultiplier(level));
    },
    [updateMultiplier]
  );
  const newLevel = calcLevel(multiplier);
  const qsFuncs = new URLSearchParams(location.search).get("funcs")?.split(",");
  const funcsIsShareScreen = qsFuncs?.some(str => str === "share-screen");
  const funcsIsMute = qsFuncs?.some(str => str === "mute");
  const funcsIsFreeze = qsFuncs?.some(str => str === "freeze");

  return (
    <Sidebar
      beforeTitle={showBackButton ? <BackButton onClick={onBack} /> : <CloseButton onClick={onClose} />}
      className={className}
      {...rest}
    >
      <Column center padding>
        <h2 className={styles.displayName}>{identityName ? `${displayName} (${identityName})` : displayName}</h2>
        {pronouns && <span className={styles.pronouns}>{pronouns}</span>}
        <div className={styles.avatarPreviewContainer}>{avatarPreview || <div />}</div>
        {hasMicPresence && (
          <div className={styles.sliderContainer}>
            <ToolbarButton
              icon={isNetworkMuted || isMuted ? <VolumeMuted /> : <VolumeHigh />}
              selected={isNetworkMuted || isMuted}
              preset="accent4"
              style={{ display: "block" }}
              onClick={() => {
                updateMuted(!isMuted);
              }}
              disabled={isNetworkMuted}
            />
            <Slider
              min={MIN}
              max={MAX}
              step={1}
              value={newLevel}
              onChange={onLevelChanged}
              className={styles.sliderInputContainer}
              disabled={isNetworkMuted || isMuted}
            />
          </div>
        )}
        {
          /**
           * belivvr custom
           * 관리자 권한 부여 및 회수 버튼 삭제
           */
          /* {canPromote && (
            <Button
              preset="accept"
              disabled={!isSignedIn}
              title={
                isSignedIn
                  ? intl.formatMessage({ id: "user-profile-sidebar.promote-button", defaultMessage: "Promote" })
                  : intl.formatMessage(
                      {
                        id: "user-profile-sidebar.promote-button-disabled-label",
                        defaultMessage: "{displayName} is signed out."
                      },
                      { displayName }
                    )
              }
              onClick={onPromote}
            >
              <FormattedMessage id="user-profile-sidebar.promote-button" defaultMessage="Promote" />
            </Button>
          )}
          {canDemote && (
            <Button
              preset="cancel"
              disabled={!isSignedIn}
              title={
                isSignedIn
                  ? intl.formatMessage({ id: "user-profile-sidebar.demote-button", defaultMessage: "Demote" })
                  : intl.formatMessage(
                      {
                        id: "user-profile-sidebar.demote-button-disabled-label",
                        defaultMessage: "{displayName} is signed out."
                      },
                      { displayName }
                    )
              }
              onClick={onDemote}
            >
              <FormattedMessage id="user-profile-sidebar.demote-button" defaultMessage="Demote" />
            </Button>
          )} */
        }
        {
          /**
           * belivvr custom
           * 유저 숨기기 버튼 삭제
           */
          /* <Button onClick={onToggleHidden}>
            {isHidden ? (
              <FormattedMessage id="user-profile-sidebar.unhide-button" defaultMessage="Unhide" />
            ) : (
              <FormattedMessage id="user-profile-sidebar.hide-button" defaultMessage="Hide" />
            )}
          </Button> */
        }
        {
          /**
           * belivvr custom
           * 유저 음소거 버튼 삭제
           * 해당 음소거 버튼은 나에게만 안들리고 다른 사람에게는 여전히 들린다.
           * 따라서 아래에 새로 음소거 기능을 만들어 추가함.
           */
          /* {canMute && (
            <Button preset="cancel" onClick={onMute}>
              <FormattedMessage id="user-profile-sidebar.mute-button" defaultMessage="Mute" />
            </Button>
          )} */
        }
        {
          /**
           * belivvr custom
           * 방장인 경우 강퇴 버튼 추가
           */
          canKick && (
            <Button preset="belivvr-accept" onClick={onKick}>
              <FormattedMessage id="user-profile-sidebar.kick-button" defaultMessage="Kick" />
            </Button>
          )
        }
        {
          /**
           * belivvr custom
           * funcs=share-screen 이 있는 경우이자 방장인 경우에는 화면공유 권한 부여 및 회수 버튼 추가
           */
          canShare && funcsIsShareScreen && (
            <>
              {isShare ? (
                <Button preset="belivvr-cancel" onClick={onToggleShareScreen}>
                  <FormattedMessage
                    id="user-profile-sidebar.revoke-share-screen-button"
                    defaultMessage="Revoke Screen Sharing"
                  />
                </Button>
              ) : (
                <Button preset="belivvr-accept" onClick={onToggleShareScreen}>
                  <FormattedMessage
                    id="user-profile-sidebar.grant-share-screen-button"
                    defaultMessage="Grant Screen Sharing"
                  />
                </Button>
              )}
            </>
          )
        }
        {
          /**
           * belivvr custom
           * funcs=mute 이 있는 경우이자 방장인 경우 유저 음소거 기능 추가
           */
          canApplyMute && funcsIsMute && (
            <>
              {isMute ? (
                <Button preset="belivvr-cancel" onClick={onToggleMute}>
                  <FormattedMessage id="user-profile-sidebar.cancel-mute-button" defaultMessage="Cancel muted user" />
                </Button>
              ) : (
                <Button preset="belivvr-accept" onClick={onToggleMute}>
                  <FormattedMessage id="user-profile-sidebar.apply-mute-button" defaultMessage="Mute user" />
                </Button>
              )}
            </>
          )
        }
        {
          /**
           * belivvr custom
           * funcs=freeze 이 있는 경우이자 방장인 경우에 유저 움직임 제어 기능 추가
           */
          canFreeze && funcsIsFreeze && (
            <>
              {isFreeze ? (
                <Button preset="belivvr-cancel" onClick={onToggleFreeze}>
                  <FormattedMessage id="user-profile-sidebar.unfreeze-button" defaultMessage="Unfreeze user" />
                </Button>
              ) : (
                <Button preset="belivvr-accept" onClick={onToggleFreeze}>
                  <FormattedMessage id="user-profile-sidebar.freeze-button" defaultMessage="Freeze user" />
                </Button>
              )}
            </>
          )
        }
      </Column>
    </Sidebar>
  );
}

UserProfileSidebar.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.string,
  displayName: PropTypes.string,
  pronouns: PropTypes.string,
  identityName: PropTypes.string,
  avatarPreview: PropTypes.node,
  hasMicPresence: PropTypes.bool,
  isSignedIn: PropTypes.bool,
  canPromote: PropTypes.bool,
  onPromote: PropTypes.func,
  canDemote: PropTypes.bool,
  onDemote: PropTypes.func,
  isHidden: PropTypes.bool,
  onToggleHidden: PropTypes.func,
  canMute: PropTypes.bool,
  isNetworkMuted: PropTypes.bool,
  onMute: PropTypes.func,
  canKick: PropTypes.bool,
  onKick: PropTypes.func,
  showBackButton: PropTypes.bool,
  onBack: PropTypes.func,
  onCancelMute: PropTypes.func,
  onClose: PropTypes.func,
  canShare: PropTypes.bool,
  onToggleShareScreen: PropTypes.func,
  canApplyMute: PropTypes.bool,
  onToggleMute: PropTypes.func,
  canFreeze: PropTypes.bool,
  onToggleFreeze: PropTypes.func,
  isShare: PropTypes.bool,
  isMute: PropTypes.bool,
  isFreeze: PropTypes.bool
};
