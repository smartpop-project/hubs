import React from "react";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import { Button } from "../input/Button";
import { Column } from "../layout/Column";

export const LeaveReason = {
  leaveRoom: "leaveRoom",
  joinRoom: "joinRoom",
  createRoom: "createRoom"
};

const reasonMessages = defineMessages({
  [LeaveReason.leaveRoom]: {
    id: "leave-room-modal.leave-room.message",
    defaultMessage: "Are you sure you want to leave the room?"
  },
  [LeaveReason.joinRoom]: {
    id: "leave-room-modal.join-room.message",
    defaultMessage: "Joining a new room will leave this one. Are you sure?"
  },
  [LeaveReason.createRoom]: {
    id: "leave-room-modal.create-room.message",
    defaultMessage: "Creating a new room will leave this one. Are you sure?"
  }
});

const confirmationMessages = defineMessages({
  [LeaveReason.leaveRoom]: {
    id: "leave-room-modal.leave-room.confirm",
    defaultMessage: "Leave Room"
  },
  [LeaveReason.joinRoom]: {
    id: "leave-room-modal.join-room.confirm",
    defaultMessage: "Join Room"
  },
  [LeaveReason.createRoom]: {
    id: "leave-room-modal.create-room.confirm",
    defaultMessage: "Leave and Create Room"
  }
});

export function LeaveRoomModal({ reason, destinationUrl, onClose }) {
  const intl = useIntl();

  const handleLeaveClick = (e) => {
  if (!destinationUrl) {
    e.preventDefault(); // a 태그 기본 동작 방지

    if (onClose) {
      onClose(); // 모달 닫기
    } else {
      // history가 1이면 이전 페이지가 없으므로 창 닫기
      if (window.history.length > 1) {
        window.history.back(); // 이전 페이지로 이동
      } else {
        window.close(); // 이전 페이지가 없으면 창 닫기
      }
    }
  }
};

  return (
    <Modal
      title={<FormattedMessage id="leave-room-modal.title" defaultMessage="Leave Room" />}
      beforeTitle={<CloseButton onClick={onClose} />}
    >
      <Column padding center centerMd="both" grow>
        <p>{intl.formatMessage(reasonMessages[reason])}</p>
        <Button 
          as="a" 
          preset="cancel" 
          href={destinationUrl || "#"} // destinationUrl이 없으면 기본값으로 "#"을 설정
          rel="noopener noreferrer"
          onClick={handleLeaveClick} // handleLeaveClick 연결
        >
          {intl.formatMessage(confirmationMessages[reason])}
        </Button>
      </Column>
    </Modal>
  );
}

LeaveRoomModal.propTypes = {
  reason: PropTypes.string,
  destinationUrl: PropTypes.string,
  onClose: PropTypes.func
};
