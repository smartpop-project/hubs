import configs from "./configs";
import { getReticulumFetchUrl } from "./phoenix-utils";

/**
 * belivvr custom
 * 공지사항 보낼때 사용하기 위해 HubID를 수집.(에단)
 */
export function getCurrentHubId() {
  const qs = new URLSearchParams(location.search);
  const defaultRoomId = configs.feature("default_room_id");

  return (
    qs.get("hub_id") ||
    (document.location.pathname === "/" && defaultRoomId
      ? defaultRoomId
      : document.location.pathname.substring(1).split("/")[0])
  );
}

/**
 * belivvr custom
 * 공지사항 보낼때 사용하기 위해 SceneID를 수집.(에단)
 * 하드코딩
 */
export async function getCurrentHubScene() {
  try {
    const params = new URLSearchParams({
      source: "rooms",
      cursor: 0,
      page_size: 10,
      hub_sids: await getCurrentHubId()
    });

    const url = new URL(getReticulumFetchUrl("/api/v1/belivvr/media/search"));
    url.search = params.toString();

    const resp = await fetch(url, { method: "GET" });

    if (resp.ok) {
      const data = await resp.json();
      if (data.entries[0].scene_id) {
        return data.entries[0].scene_id;
      } else {
        console.warn("Scene ID not found.");
      }
    } else {
      console.warn(`API call failed with status code ${resp.status}.`);
    }
  } catch (err) {
    console.warn("getCurrentHubScene() error:", err);
    throw err;
  }
}

export function updateVRHudPresenceCount({ presence }) {
  const occupantCount = Object.getOwnPropertyNames(presence.state).length;
  const vrHudPresenceCount = document.querySelector("#hud-presence-count");
  vrHudPresenceCount.setAttribute("text", "value", occupantCount.toString());
}
export function updateSceneCopresentState(presence, scene) {
  const occupantCount = Object.getOwnPropertyNames(presence.state).length;
  if (occupantCount > 1) {
    scene.addState("copresent");
  } else {
    scene.removeState("copresent");
  }
}

export function createHubChannelParams({
  permsToken,
  profile,
  pushSubscriptionEndpoint,
  isMobile,
  isMobileVR,
  isEmbed,
  hubInviteId,
  authToken
}) {
  return {
    profile,
    push_subscription_endpoint: pushSubscriptionEndpoint,
    auth_token: authToken || null,
    perms_token: permsToken || null,
    context: {
      mobile: isMobile || isMobileVR,
      embed: isEmbed,
      hmd: isMobileVR
    },
    hub_invite_id: hubInviteId
  };
}

export function isRoomOwner(clientId) {
  const presences = APP.hubChannel.presence.state;
  return presences && presences[clientId] && presences[clientId].metas[0].roles.owner;
}

export function isLockedDownDemoRoom() {
  if (APP.hubChannel?.canOrWillIfCreator("update_hub")) return;
  const hubId = getCurrentHubId();
  if (configs.feature("is_locked_down_demo_room")) {
    const idArr = configs.feature("is_locked_down_demo_room").replace(/\s/g, "").split(",");
    return idArr.includes(hubId);
  } else {
    return false;
  }
}
