import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { PeopleSidebar } from "./PeopleSidebar";
import { getMicrophonePresences } from "../../utils/microphone-presence";
import ProfileEntryPanel from "../profile-entry-panel";
import { UserProfileSidebarContainer } from "./UserProfileSidebarContainer";
import { useCan } from "./hooks/useCan";
import { useRoomPermissions } from "./hooks/useRoomPermissions";
import { useRole } from "./hooks/useRole";

export function userFromPresence(
  sessionId,
  presence,
  micPresences,
  mySessionId,
  voiceEnabled,
  isShare,
  isMute,
  isFreeze
) {
  const meta = presence.metas[presence.metas.length - 1];
  const micPresence = micPresences.get(sessionId);
  if (micPresence && !voiceEnabled && !meta.permissions.voice_chat) {
    micPresence.muted = true;
  }
  return { id: sessionId, isMe: mySessionId === sessionId, micPresence, isShare, isMute, isFreeze, ...meta };
}

function usePeopleList(presences, mySessionId, micUpdateFrequency = 500) {
  const [people, setPeople] = useState([]);
  const { voice_chat: voiceChatEnabled } = useRoomPermissions();

  useEffect(() => {
    let timeout;

    function updateMicrophoneState() {
      const micPresences = getMicrophonePresences();

      /**
       * belivvr custom
       * 초반에는 people 값이 비어 있어서 people.find(); 로 {isShare, isMute, isFreeze} 값을 찾는게 불가능함.
       * 따라서 초반에는 기존 모질라 허브 오리지널 소스 그대로 setPeople로 초기화를 해줌.
       */
      if (people.length === 0) {
        setPeople(
          Object.entries(presences).map(([id, presence]) => {
            return userFromPresence(id, presence, micPresences, mySessionId, voiceChatEnabled);
          })
        );
        return;
      }

      setPeople(
        Object.entries(presences).map(([id, presence]) => {
          const person = people.find(person => person.id === id);
          // belivvr custom "isShare", "isMute", "isFreeze" 추가
          const { isShare, isMute, isFreeze } = person || false;

          // belivvr custom "isShare", "isMute", "isFreeze" 추가
          return userFromPresence(id, presence, micPresences, mySessionId, voiceChatEnabled, isShare, isMute, isFreeze);
        })
      );

      timeout = setTimeout(updateMicrophoneState, micUpdateFrequency);
    }

    updateMicrophoneState();

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presences, micUpdateFrequency, setPeople, mySessionId, voiceChatEnabled]);

  return [people, setPeople];
}

function PeopleListContainer({ hubChannel, people, onSelectPerson, onClose }) {
  const onMuteAll = useCallback(() => {
    for (const person of people) {
      if (person.presence === "room" && person.permissions && !person.permissions.mute_users) {
        hubChannel.mute(person.id);
      }
    }
  }, [people, hubChannel]);
  const canVoiceChat = useCan("voice_chat");
  const { voice_chat: voiceChatEnabled } = useRoomPermissions();
  const isMod = useRole("owner");

  return (
    <PeopleSidebar
      people={people}
      onSelectPerson={onSelectPerson}
      onClose={onClose}
      onMuteAll={onMuteAll}
      showMuteAll={hubChannel.can("mute_users")}
      canVoiceChat={canVoiceChat}
      voiceChatEnabled={voiceChatEnabled}
      isMod={isMod}
    />
  );
}

PeopleListContainer.propTypes = {
  onSelectPerson: PropTypes.func.isRequired,
  hubChannel: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  people: PropTypes.array.isRequired
};

export function PeopleSidebarContainer({
  hubChannel,
  presences,
  mySessionId,
  displayNameOverride,
  store,
  mediaSearchStore,
  performConditionalSignIn,
  onCloseDialog,
  showNonHistoriedDialog,
  onClose
}) {
  const [people, setPeople] = usePeopleList(presences, mySessionId);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const selectedPerson = people.find(person => person.id === selectedPersonId);
  const setSelectedPerson = useCallback(
    person => {
      setSelectedPersonId(person.id);
    },
    [setSelectedPersonId]
  );

  if (selectedPerson) {
    if (selectedPerson.id === mySessionId) {
      return (
        <ProfileEntryPanel
          containerType="sidebar"
          displayNameOverride={displayNameOverride}
          store={store}
          mediaSearchStore={mediaSearchStore}
          finished={() => setSelectedPersonId(null)}
          history={history}
          showBackButton
          onBack={() => setSelectedPersonId(null)}
        />
      );
    } else {
      return (
        <UserProfileSidebarContainer
          user={selectedPerson}
          hubChannel={hubChannel}
          performConditionalSignIn={performConditionalSignIn}
          showBackButton
          onBack={() => setSelectedPersonId(null)}
          onCloseDialog={onCloseDialog}
          showNonHistoriedDialog={showNonHistoriedDialog}
          people={people}
          setPeople={setPeople}
        />
      );
    }
  }

  return (
    <PeopleListContainer onSelectPerson={setSelectedPerson} onClose={onClose} hubChannel={hubChannel} people={people} />
  );
}

PeopleSidebarContainer.propTypes = {
  displayNameOverride: PropTypes.string,
  store: PropTypes.object.isRequired,
  mediaSearchStore: PropTypes.object.isRequired,
  hubChannel: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  mySessionId: PropTypes.string.isRequired,
  presences: PropTypes.object.isRequired,
  performConditionalSignIn: PropTypes.func.isRequired,
  onCloseDialog: PropTypes.func.isRequired,
  showNonHistoriedDialog: PropTypes.func.isRequired
};
