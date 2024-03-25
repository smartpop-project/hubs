import configs from "../utils/configs";

interface Props {
    type: ACTION_TYPES;
    eventTime: Date;
    roomId: string;
    userId: string;
    eventAction: string;
}

export enum ACTION_TYPES {
    CLICK = 'click-event',
}

export async function logToXRCLOUD({ type, eventTime, roomId, userId, eventAction }: Props) {
    return fetch(`${(window as any).serverUrl}/events/hub`, {
        method: "POST",
        headers: {
        "content-type": "application/json",
        },
        body: JSON.stringify({
        type,
        eventTime,
        roomId,
        userId,
        eventAction
        })
    }).then(response => {
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      })
      .catch(error => {
        console.error("Failed to log event to XRCLOUD:", error);
        throw error;
      });
}

export async function getAccountId(): Promise<string> {
    const account = await fetch(`${(configs as any).UPLOADS_HOST}/api/v1/belivvr/account?token=${window.APP.store.state.credentials.token}`, {
        headers: {
          "content-type": "application/json",
        }
    })
    const { account_id } = await account.json(); 
    return account_id;
}