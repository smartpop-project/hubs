import { ACTION_TYPES, getAccountId, logToXRCLOUD } from "../belivvr/logAction";

AFRAME.registerComponent("inline-frame-button", {
  schema: {
    name: { default: "" },
    src: { default: "" },
    frameOption: { default: "" }
  },

  init() {
    this.label = this.el.querySelector("[text]");

    this.onClick = async () => {
      const accountId = await getAccountId();
      const date = new Date();
      
      logToXRCLOUD({
        type: ACTION_TYPES.CLICK,
        eventTime: date,
        roomId: window.APP.hubChannel.hubId,
        userId: accountId,
        eventAction: `Inline View ${ACTION_TYPES.CLICK}: ${this.data.src}`
      })
      .catch(error => {
        console.error('Error logging event:', error);
      });
      
      window.dispatchEvent(new CustomEvent("inline-url", {
         detail: {
           url: this.data.src, 
           name: this.data.name,
           option: this.data.frameOption 
          } 
        }
      ))
    };

    NAF.utils.getNetworkedEntity(this.el).then(networkedEl => {
      this.targetEl = networkedEl;
    });
  },

  play() {
    this.el.object3D.addEventListener("interact", this.onClick);
  },

  pause() {
    this.el.object3D.removeEventListener("interact", this.onClick);
  }
});
