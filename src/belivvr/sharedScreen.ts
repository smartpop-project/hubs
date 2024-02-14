/**
 * belivvr custom
 * 화면 공유시에 칠판 컴포넌트가 있으면 칠판에 딱 붙는 작업을 위한 함수들 모음 파일.
 */

export function getSharedScreen(src: MediaStream | string) {
  const isMediaStream = src instanceof MediaStream;
  const defaultOffset = { x: 0, y: 0, z: -1.5 };
  const defaultTarget = "#avatar-pov-node";

  if (!isMediaStream) {
    return {
      sharedScreen: null,
      offset: defaultOffset,
      target: defaultTarget
    }
  }

  /**
  * belivvr custom
  * 칠판 컴포넌트가 있으면 칠판에 0.001만큼 띄우고
  * 없으면 아바타 앞에 기본 offset 값으로 띄운다.
  */
  const sharedScreen = document.querySelector("[shared-screen]");
  const z = sharedScreen !== null ? 0.001 : defaultOffset.z;

  return {
    sharedScreen,
    offset: { ...defaultOffset, z },
    target: sharedScreen || defaultTarget
  };
}

export function setScaleFromSharedScreen(entity: HTMLElement, sharedScreen: HTMLElement) {
  entity.setAttribute("scale", sharedScreen.getAttribute("scale")!);
}

export function setPinned(entity: HTMLElement) {
  // @ts-ignore
  entity.setAttribute("pinnable", { pinned: true });
}