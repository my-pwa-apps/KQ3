AFRAME.registerComponent('movement-controls', {
    init: function() {
        this.onThumbstickChanged = this.onThumbstickChanged.bind(this);
        this.el.addEventListener('thumbstickmoved', this.onThumbstickChanged);
    },

    onThumbstickChanged: function(evt) {
        const { x, y } = evt.detail;
        const rotation = this.el.object3D.rotation;
        const speed = 0.1;
        
        const direction = new THREE.Vector3();
        this.el.object3D.getWorldDirection(direction);
        
        if (Math.abs(y) > 0.2) {
            this.el.object3D.position.add(direction.multiplyScalar(speed * -y));
        }
        
        if (Math.abs(x) > 0.2) {
            rotation.y += x * 0.05;
        }
    }
});
