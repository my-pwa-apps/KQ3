AFRAME.registerComponent('interaction', {
    schema: {
        type: { type: 'string', default: 'generic' }
    },

    init: function() {
        this.el.addEventListener('click', this.onClick.bind(this));
        this.el.addEventListener('mouseenter', () => {
            this.el.setAttribute('color', '#ff0');
        });
        this.el.addEventListener('mouseleave', () => {
            this.el.setAttribute('color', this.originalColor);
        });
        this.originalColor = this.el.getAttribute('color');
    },

    onClick: function() {
        switch(this.data.type) {
            case 'book':
                this.toggleSpellMenu();
                break;
            case 'wand':
                this.addToInventory('wand');
                break;
        }
    },

    toggleSpellMenu: function() {
        const spellMenu = document.getElementById('spell-menu');
        spellMenu.classList.toggle('hidden');
        if (!spellMenu.classList.contains('hidden')) {
            spellMenu.innerHTML = `
                <h2>Spells</h2>
                <ul>
                    <li>Transform Self</li>
                    <li>Teleport</li>
                    <li>Brew Storm</li>
                </ul>
            `;
        }
    },

    addToInventory: function(item) {
        const inventory = document.getElementById('inventory');
        const itemEl = document.createElement('div');
        itemEl.className = 'inventory-item';
        itemEl.setAttribute('data-item', item);
        inventory.appendChild(itemEl);
        this.el.parentNode.removeChild(this.el);
    }
});
