import React, { useEffect, useState } from "react";
import configs from "../../utils/configs";
import { ReactComponent as HmcLogo } from "../icons/HmcLogo.svg";
import { isHmc } from "../../utils/isHmc";
import { useLogo } from "../styles/theme";
import cnuLogo from "../../assets/images/cnu-logo.png";
import cnuFavicon from "../../assets/images/cnu-favicon.png";

export function AppLogo({ className }: { className?: string }) {
  const [projectLogo, setProjectLogo] = useState('');

  /* BELIVVR CUSTOM Start
  *  Title : Injection logo img by QueryString and for CNU Custom
  *  Author : luke.yang
  *  Modified Date : 2024-09-12
  */
  
  // logoImg 쿼리 파라미터에서 값 가져오기
  const queryLogoUrl = new URLSearchParams(window.location.search).get("logoImg");

  // logoImg 파라미터가 있으면 해당 이미지를 사용
  let logo = queryLogoUrl || useLogo();

  const shouldDisplayHmcLogo = isHmc() && !logo;

  // CNU 도메인일 경우 CNU 로고 사용
  if (document.location.origin === "https://cnumetaxr.jnu.ac.kr:4000") {
    const link = window.document.querySelector("link[rel*='icon']");
    if (link) link.setAttribute('href', cnuFavicon);
    return (
      <img className={className} alt={configs.translation("app-name")} src={cnuLogo} />
    );
  }
  /* BELIVVR CUSTOM END */

  useEffect(() => {
    const roomId = new URLSearchParams(window.location.search).get("private") || new URLSearchParams(window.location.search).get("public");
    const privateType = new URLSearchParams(window.location.search).get("private") && "private";
    const publicType = new URLSearchParams(window.location.search).get("public") && "public";
    
    fetch(`${(window as any).serverUrl}/api/rooms/option/${roomId}?type=${privateType || publicType}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(async (res) => {
      if (res.ok) {
        const { logoUrl, faviconUrl } = await res.json();
        const link = window.document.querySelector("link[rel*='icon']");
        if (link) link.setAttribute('href', faviconUrl);

        // API에서 받아온 logoUrl을 projectLogo에 저장
        setProjectLogo(logoUrl);
      }
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  return shouldDisplayHmcLogo ? (
    <HmcLogo className="hmc-logo" />
  ) : (
    // logoImg 파라미터가 있으면 항상 queryLogoUrl 사용, 없으면 projectLogo 또는 기본 로고 사용
    <img className={className} alt={configs.translation("app-name")} src={queryLogoUrl || projectLogo || logo} />
  );
}
