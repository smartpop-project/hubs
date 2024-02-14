import React, { useEffect, useState } from "react";

import configs from "../../utils/configs";
import { ReactComponent as HmcLogo } from "../icons/HmcLogo.svg";
import { isHmc } from "../../utils/isHmc";
import { useLogo } from "../styles/theme";

export function AppLogo({ className }: { className?: string }) {
  const [projectLogo, setProjectLogo] = useState('')
  const logo = useLogo();
  // Display HMC logo if account is HMC and no custom logo is configured
  const shouldDisplayHmcLogo = isHmc() && !logo;

  useEffect(() => {
    const roomId = new URLSearchParams(window.location.search).get("private") || new URLSearchParams(window.location.search).get("public")
    const privateType = new URLSearchParams(window.location.search).get("private") && "private"
    const publicType = new URLSearchParams(window.location.search).get("public") && "public"
    fetch(`${(window as any).serverUrl}/api/rooms/option/${roomId}?type=${privateType || publicType}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(async (res) => {
      const { logoUrl } = await res.json()
      setProjectLogo(logoUrl)
    }).catch((error) => {
      console.log(error)
    })
  }, [])

  return shouldDisplayHmcLogo ? (
    <HmcLogo className="hmc-logo" />
  ) : (
    <img className={className} alt={configs.translation("app-name")} src={projectLogo === '' ? logo : projectLogo} />
  );
}
