AFRAME.registerComponent('manannan-system', {
    init: function() {
        this.setupManannan();
        this.startRandomChecks();
        this.isManannanPresent = false;
        this.warningShown = false;
    },

    setupManannan: function() {
        const manannan = document.createElement('a-entity');
        manannan.setAttribute('id', 'manannan');
        manannan.setAttribute('position', '0 -10 0');
        manannan.setAttribute('wizard-model', '');
        this.el.appendChild(manannan);
        this.manannan = manannan;
    },

    startRandomChecks: function() {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.showWarning();
            }
        }, 30000); // Check every 30 seconds
    },

    showWarning: function() {
        if (!this.warningShown && !this.isManannanPresent) {
            this.warningShown = true;
            document.dispatchEvent(new CustomEvent('showMessage', {
                detail: { message: "You hear footsteps approaching..." }
            }));
            setTimeout(() => this.appearManannan(), 3000);
        }
    },

    appearManannan: function() {
        this.isManannanPresent = true;
        this.manannan.setAttribute('position', '0 0 -2');
        
        // Check if player is doing forbidden activities
        const spellMenu = document.querySelector('#spell-menu');
        if (!spellMenu.classList.contains('hidden')) {
            this.punishPlayer();
        }

        // Leave after 5 seconds
        setTimeout(() => this.disappearManannan(), 5000);
    },

    disappearManannan: function() {
        this.manannan.setAttribute('position', '0 -10 0');
        this.isManannanPresent = false;
        this.warningShown = false;
    },

    punishPlayer: function() {
        document.dispatchEvent(new CustomEvent('showMessage', {
            detail: { message: "Manannan catches you practicing magic!" }
        }));
        // Reset player position and inventory
        const rig = document.querySelector('#rig');
        rig.setAttribute('position', '0 1.6 0');
        document.querySelector('#inventory').innerHTML = '';
    }
});
