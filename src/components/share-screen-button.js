/**
  * belivvr custom
  * 화면공유를 위한 버튼 컴포넌트 모음집 (사용하지 않음)
*/
AFRAME.registerComponent("share-screen-button", {
  init() {
    this.onClick = () => {
      this.shareScreen(this.owner);
    };
    NAF.utils.getNetworkedEntity(this.el).then(networkedEl => {
      this.owner = networkedEl.components.networked.data.owner;
    });
  },

  play() {
    this.el.object3D.addEventListener("interact", this.onClick);
  },

  pause() {
    this.el.object3D.removeEventListener("interact", this.onClick);
  },

  async shareScreen(clientId) {
    this.el.sceneEl.emit("action_share_screen_client", { clientId });
  }
});
