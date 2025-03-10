AFRAME.registerComponent('wizard-model', {
    init: function() {
        // Create wizard body parts
        this.el.innerHTML = `
            <!-- Robe -->
            <a-cylinder color="#321853" height="1.8" radius="0.4" position="0 0.9 0"></a-cylinder>
            <!-- Hood -->
            <a-cone color="#321853" height="0.5" radius-bottom="0.3" radius-top="0.1" position="0 1.9 0"></a-cone>
            <!-- Head -->
            <a-sphere color="#FFE0BD" radius="0.2" position="0 1.7 0.1"></a-sphere>
            <!-- Beard -->
            <a-cone color="#CCCCCC" height="0.4" radius-bottom="0.2" radius-top="0.05" position="0 1.5 0.15" rotation="-20 0 0"></a-cone>
            <!-- Staff -->
            <a-cylinder color="#8B4513" height="1.8" radius="0.03" position="0.3 0.9 0"></a-cylinder>
            <a-sphere color="#4A90E2" radius="0.06" position="0.3 1.8 0"></a-sphere>
        `;
    }
});

AFRAME.registerComponent('spellbook-model', {
    init: function() {
        this.el.innerHTML = `
            <!-- Book cover -->
            <a-box color="#8B4513" width="0.3" height="0.4" depth="0.05"></a-box>
            <!-- Pages -->
            <a-box color="#FFF5E1" width="0.28" height="0.38" depth="0.04" position="0 0 0.01"></a-box>
            <!-- Runes -->
            <a-text value="✧❋⚝" color="gold" align="center" position="0 0 0.03" scale="0.2 0.2 0.2"></a-text>
        `;
    }
});

AFRAME.registerComponent('potion-model', {
    schema: {
        color: {type: 'color', default: '#FF0000'}
    },
    init: function() {
        this.el.innerHTML = `
            <!-- Bottle -->
            <a-cylinder color="#A3E4D7" height="0.15" radius="0.04" position="0 0 0"></a-cylinder>
            <!-- Neck -->
            <a-cylinder color="#A3E4D7" height="0.08" radius="0.02" position="0 0.11 0"></a-cylinder>
            <!-- Liquid -->
            <a-cylinder color="${this.data.color}" height="0.1" radius="0.035" position="0 0.02 0"></a-cylinder>
            <!-- Cork -->
            <a-cylinder color="#8B4513" height="0.02" radius="0.02" position="0 0.16 0"></a-cylinder>
        `;
    }
});
