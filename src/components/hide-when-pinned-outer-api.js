AFRAME.registerComponent("hide-when-pinned-outer-api", {
  schema: {
    // Hide regardless of being forbidden.
    whenPinned: { type: "boolean" }
  },
  init() {
    this._updateUI = this._updateUI.bind(this);
    this._updateUIOnStateChange = this._updateUIOnStateChange.bind(this);
    this.el.sceneEl.addEventListener("stateadded", this._updateUIOnStateChange);
    this.el.sceneEl.addEventListener("stateremoved", this._updateUIOnStateChange);

    NAF.utils.getNetworkedEntity(this.el).then(networkedEl => {
      this.targetEl = networkedEl;

      this._updateUI();
      this.targetEl.addEventListener("pinned", this._updateUI);
      this.targetEl.addEventListener("unpinned", this._updateUI);
    });
  },

  remove() {
    this.el.sceneEl.removeEventListener("stateadded", this._updateUIOnStateChange);
    this.el.sceneEl.removeEventListener("stateremoved", this._updateUIOnStateChange);

    if (this.targetEl) {
      this.targetEl.removeEventListener("pinned", this._updateUI);
      this.targetEl.removeEventListener("unpinned", this._updateUI);
    }
  },

  _updateUIOnStateChange(e) {
    if (e.detail !== "frozen") return;
    this._updateUI();
  },

  _updateUI() {
    if (!this.targetEl) return;
    const isPinned = this.targetEl.components.pinnable && this.targetEl.components.pinnable.data.pinned;
    
    this.targetEl.object3D.children.forEach((item) => {
      if (item.type === "Object3D" && item.userData.role === "admin") {
        this.el.object3D.visible = false;
      }
    })
  }
});
