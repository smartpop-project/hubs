import { guessContentType } from "../utils/media-url-utils";
import { handleExitTo2DInterstitial } from "../utils/vr-interstitial";

AFRAME.registerComponent("inline-frame-button", {
  schema: {
    src: { default: "" },
    frameOption: { default: "" }
  },

  init() {
    this.label = this.el.querySelector("[text]");

    this.updateSrc = async () => {
      if (!this.targetEl.parentNode) return; // If removed
      const mediaLoader = this.targetEl.components["media-loader"].data;
      const src = (this.src = (mediaLoader.mediaOptions && mediaLoader.mediaOptions.href) || mediaLoader.src);
      const visible = src && guessContentType(src) !== "video/vnd.hubs-webrtc";

      this.el.object3D.visible = !!visible;

      if (visible) {
        let label = "Open frame";
        this.label.setAttribute("text", "value", label);
      }
    };

    this.onClick = async () => {
      // const exitImmersive = async () => await handleExitTo2DInterstitial(false, () => {}, true);
      // await exitImmersive();
      window.dispatchEvent(new CustomEvent("inline-url", { detail: { url: this.data.src, option: this.data.frameOption } }))
    };

    NAF.utils.getNetworkedEntity(this.el).then(networkedEl => {
      this.targetEl = networkedEl;
      this.targetEl.addEventListener("media_resolved", this.updateSrc, { once: true });
      this.updateSrc();
    });
  },

  play() {
    this.el.object3D.addEventListener("interact", this.onClick);
  },

  pause() {
    this.el.object3D.removeEventListener("interact", this.onClick);
  }
});
