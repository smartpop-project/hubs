import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { PromoteClientModal } from "./PromoteClientModal";
import { getAvatarThumbnailUrl } from "../../utils/avatar-utils";
import { UserProfileSidebar } from "./UserProfileSidebar.js";
import { SignInMessages } from "../auth/SignInModal";

export function UserProfileSidebarContainer({
  user,
  hubChannel,
  performConditionalSignIn,
  showBackButton,
  onBack,
  onClose,
  onCloseDialog,
  showNonHistoriedDialog
}) {
  const [avatarThumbnailUrl, setAvatarThumbnailUrl] = useState();

  const {
    id: userId,
    profile: { displayName, identityName, avatarId, pronouns },
    roles
  } = user;
  const mayKick = hubChannel.canOrWillIfCreator("kick_users");
  const hasMicPresence = !!user.micPresence;
  const isNetworkMuted = user.micPresence?.muted;
  const mayMute = !isNetworkMuted && hubChannel.canOrWillIfCreator("mute_users");
  const [isOwner, setIsOwner] = useState(!!roles.owner);
  const isCreator = !!roles.creator;
  const isSignedIn = !!roles.signed_in;
  const mayAddOwner = hubChannel.canOrWillIfCreator("update_roles") && !isOwner && !isCreator;
  const mayRemoveOwner = hubChannel.canOrWillIfCreator("update_roles") && isOwner && !isCreator;
  const mayShare = hubChannel.canOrWillIfCreator("grant_share_screen");
  const mayApplyMute = hubChannel.canOrWillIfCreator("apply_mute");
  const mayFreeze = hubChannel.canOrWillIfCreator("freeze");
  const [isHidden, setIsHidden] = useState(hubChannel.isHidden(user.id));
  const [isShareScreen, setIsShareScreen] = useState(hubChannel.isShareScreen(user.id));
  const [isMute, setIsMute] = useState(hubChannel.isMute(user.id));
  const [isFreeze, setIsFreeze] = useState(hubChannel.isFreeze(user.id));

  useEffect(() => {
    if (avatarId) {
      getAvatarThumbnailUrl(avatarId).then(avatarThumbnailUrl => setAvatarThumbnailUrl(avatarThumbnailUrl));
    }
  }, [avatarId, setAvatarThumbnailUrl, user]);

  const addOwner = useCallback(() => {
    performConditionalSignIn(
      () => hubChannel.can("update_roles"),
      async () => {
        showNonHistoriedDialog(PromoteClientModal, {
          displayName,
          onConfirm: async () => {
            setIsOwner(true);
            await hubChannel.addOwner(userId);
            onCloseDialog();
          }
        });
      },
      SignInMessages.addOwner
    );
  }, [performConditionalSignIn, hubChannel, showNonHistoriedDialog, userId, onCloseDialog, displayName]);

  const removeOwner = useCallback(() => {
    performConditionalSignIn(
      () => hubChannel.can("update_roles"),
      async () => {
        setIsOwner(false);
        await hubChannel.removeOwner(userId);
      },
      SignInMessages.removeOwner
    );
  }, [performConditionalSignIn, hubChannel, userId]);

  const toggleHidden = useCallback(() => {
    if (isHidden) {
      hubChannel.unhide(userId);
    } else {
      hubChannel.hide(userId);
    }

    setIsHidden(!isHidden);
  }, [isHidden, userId, hubChannel]);

  const mute = useCallback(() => {
    performConditionalSignIn(
      () => hubChannel.can("mute_users"),
      async () => await hubChannel.mute(userId),
      SignInMessages.muteUser
    );
  }, [performConditionalSignIn, hubChannel, userId]);

  const kick = useCallback(() => {
    performConditionalSignIn(
      () => hubChannel.can("kick_users"),
      async () => await hubChannel.kick(userId),
      SignInMessages.kickUser
    );

    if (onClose) {
      onClose();
    } else if (onBack) {
      onBack();
    }
  }, [performConditionalSignIn, hubChannel, userId, onClose, onBack]);

  /**
   * belivvr custom
   * 움직임 제어 토글 함수 추가
   */
  const toggleFreeze = useCallback(() => {
    if (isFreeze) {
      hubChannel.unfreeze(userId);
    } else {
      hubChannel.freeze(userId);
    }

    setIsFreeze(!isFreeze);
  }, [isFreeze, userId, hubChannel]);

  /**
   * belivvr custom
   * 화면공유 권한 부여 토글 함수 추가
   */
  const toggleShareScreen = useCallback(() => {
    if (isShareScreen) {
      hubChannel.revokeShareScreen(userId);
    } else {
      hubChannel.grantShareScreen(userId);
    }

    setIsShareScreen(!isShareScreen);
  }, [isShareScreen, userId, hubChannel]);

  /**
   * belivvr custom
   * 음소거 토글 함수 추가
   */
  const toggleMute = useCallback(() => {
    if (isMute) {
      hubChannel.cancelMute(userId);
    } else {
      hubChannel.applyMute(userId);
    }

    setIsMute(!isMute);
  }, [isMute, userId, hubChannel]);

  return (
    <UserProfileSidebar
      userId={user.id}
      displayName={displayName}
      pronouns={pronouns}
      identityName={identityName}
      avatarPreview={<img src={avatarThumbnailUrl} />}
      isSignedIn={isSignedIn}
      canPromote={mayAddOwner}
      onPromote={addOwner}
      canDemote={mayRemoveOwner}
      onDemote={removeOwner}
      isHidden={isHidden}
      onToggleHidden={toggleHidden}
      canMute={mayMute}
      onToggleMute={toggleMute}
      isNetworkMuted={isNetworkMuted}
      onMute={mute}
      canKick={mayKick}
      onKick={kick}
      showBackButton={showBackButton}
      onClose={onClose}
      onBack={onBack}
      hasMicPresence={hasMicPresence}
      canShare={mayShare}
      onToggleShareScreen={toggleShareScreen}
      canApplyMute={mayApplyMute}
      canFreeze={mayFreeze}
      onToggleFreeze={toggleFreeze}
      isShare={isShareScreen}
      isMute={isMute}
      isFreeze={isFreeze}
    />
  );
}

UserProfileSidebarContainer.propTypes = {
  user: PropTypes.object.isRequired,
  hubChannel: PropTypes.object,
  performConditionalSignIn: PropTypes.func,
  showBackButton: PropTypes.bool,
  onBack: PropTypes.func,
  onClose: PropTypes.func,
  onCloseDialog: PropTypes.func.isRequired,
  showNonHistoriedDialog: PropTypes.func,
  people: PropTypes.array,
  setPeople: PropTypes.func
};
