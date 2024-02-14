import React from "react";
import PropTypes from "prop-types";
import { Button, AcceptButton } from "../input/Button";
import styles from "./AvatarSettingsContent.scss";
import { TextInputField } from "../input/TextInputField";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";

export function AvatarSettingsContent({
  displayName,
  pronouns,
  displayNameInputRef,
  pronounsInputRef,
  disableDisplayNameInput,
  onChangeDisplayName,
  onChangePronouns,
  avatarPreview,
  displayNamePattern,
  pronounsPattern,
  onChangeAvatar,
  ...rest
}) {
  const canAvatarChange = new URLSearchParams(location.search).get("funcs")?.split(",").some(str => str === "avatar-changeable");
  return (
    <Column as="form" className={styles.content} {...rest}>
      <TextInputField
        disabled={disableDisplayNameInput}
        label={<FormattedMessage id="avatar-settings-content.display-name-label" defaultMessage="Display Name" />}
        value={displayName}
        pattern={displayNamePattern}
        spellCheck="false"
        required
        onChange={onChangeDisplayName}
        description={
          <FormattedMessage
            id="avatar-settings-content.display-name-description"
            defaultMessage="Alphanumerics, hyphens, underscores, and tildes. At least 3 characters, no more than 32"
          />
        }
        ref={displayNameInputRef}
      />
      {
        /**
         * belivvr custom
         * 별칭의 개념이 있는 것 같아서 닉네임과 겹친다 판단하고 빼버림
         */
      }
      {/* <TextInputField
        label={<FormattedMessage id="avatar-settings-content.pronouns-label" defaultMessage="Pronouns (optional)" />}
        value={pronouns}
        pattern={pronounsPattern}
        spellCheck="false"
        onChange={onChangePronouns}
        ref={pronounsInputRef}
      /> */}
      <div className={styles.avatarPreviewContainer}>
        {avatarPreview || <div />}
        {
          /**
           * belivvr custom
           * funcs=avatar-changeable 일 경우에는 아바타 변경이 가능함
           */
          canAvatarChange && (
            <Button type="button" preset="basic" onClick={onChangeAvatar}>
              <FormattedMessage id="avatar-settings-content.change-avatar-button" defaultMessage="Change Avatar" />
            </Button>
          )
        }
      </div>
      <AcceptButton preset="accept" type="submit" />
    </Column>
  );
}

AvatarSettingsContent.propTypes = {
  className: PropTypes.string,
  displayName: PropTypes.string,
  pronouns: PropTypes.string,
  displayNameInputRef: PropTypes.func,
  pronounsInputRef: PropTypes.func,
  disableDisplayNameInput: PropTypes.bool,
  displayNamePattern: PropTypes.string,
  pronounsPattern: PropTypes.string,
  onChangeDisplayName: PropTypes.func,
  onChangePronouns: PropTypes.func,
  avatarPreview: PropTypes.node,
  onChangeAvatar: PropTypes.func
};
