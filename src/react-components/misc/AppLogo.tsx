import React, { useEffect, useState } from "react";

import configs from "../../utils/configs";
import { ReactComponent as HmcLogo } from "../icons/HmcLogo.svg";
import { isHmc } from "../../utils/isHmc";
import { useLogo } from "../styles/theme";
import cnuLogo from "../../assets/images/cnu-logo.png";
import cnuFavicon from "../../assets/images/cnu-favicon.png";

export function AppLogo({ className }: { className?: string }) {
  const [projectLogo, setProjectLogo] = useState('')
  const logo = useLogo();
  const shouldDisplayHmcLogo = isHmc() && !logo;

  if (document.location.origin === "https://cnumetaxr.jnu.ac.kr:4000") {
    const link = window.document.querySelector("link[rel*='icon']");
    if (link) link.setAttribute('href', cnuFavicon);
    return (
      <img className={className} alt={configs.translation("app-name")} src={cnuLogo} />
    );
  }

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
      if (res.ok) {
        const { logoUrl, faviconUrl } = await res.json()
        const link = window.document.querySelector("link[rel*='icon']");
        if (link) link.setAttribute('href', faviconUrl);

        setProjectLogo(logoUrl)
      }
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
