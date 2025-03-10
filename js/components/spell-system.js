AFRAME.registerComponent('spell-system', {
    init: function() {
        this.spells = {
            'transform': { name: 'Transform Self', ingredients: ['cat-hair', 'mandrake-root'] },
            'teleport': { name: 'Teleport', ingredients: ['mistletoe', 'amber-stone'] },
            'storm': { name: 'Brew Storm', ingredients: ['thunder-egg', 'nightshade'] }
        };
        
        this.inventory = [];
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('spellSelect', (e) => {
            this.attemptSpell(e.detail.spell);
        });
        
        document.addEventListener('itemCollect', (e) => {
            this.inventory.push(e.detail.item);
            this.updateInventoryUI();
        });
    },

    attemptSpell: function(spellName) {
        const spell = this.spells[spellName];
        if (!spell) return;

        const hasIngredients = spell.ingredients.every(
            ingredient => this.inventory.includes(ingredient)
        );

        if (hasIngredients) {
            // Remove used ingredients
            spell.ingredients.forEach(ingredient => {
                const index = this.inventory.indexOf(ingredient);
                this.inventory.splice(index, 1);
            });
            
            this.castSpell(spellName);
            this.updateInventoryUI();
        } else {
            console.log('Missing ingredients for spell:', spellName);
        }
    },

    castSpell: function(spellName) {
        // Implement spell effects
        switch(spellName) {
            case 'transform':
                // Transform player
                break;
            case 'teleport':
                // Teleport player
                break;
            case 'storm':
                // Create storm effect
                break;
        }
    },

    updateInventoryUI: function() {
        const inventory = document.getElementById('inventory');
        inventory.innerHTML = this.inventory.map(item => 
            `<div class="inventory-item" data-item="${item}"></div>`
        ).join('');
    }
});
