AFRAME.registerComponent('interaction', {
    // ...existing code...

    onClick: function() {
        const position = this.el.getAttribute('position');
        const id = this.el.id;

        switch(id) {
            case 'dining-table':
                this.showMessage("A heavy wooden dining table.");
                break;
            case 'kitchen-area':
                this.showMessage("The kitchen area where meals are prepared.");
                break;
            case 'stairs':
                this.teleportToSecondFloor();
                break;
        }
    },

    showMessage: function(text) {
        const messageEl = document.getElementById('message-overlay') || this.createMessageOverlay();
        messageEl.innerHTML = text;
        setTimeout(() => messageEl.innerHTML = '', 3000);
    },

    createMessageOverlay: function() {
        const overlay = document.createElement('div');
        overlay.id = 'message-overlay';
        document.body.appendChild(overlay);
        return overlay;
    },

    teleportToSecondFloor: function() {
        // To be implemented when second floor is added
        this.showMessage("The stairs lead to the second floor.");
    }
});
