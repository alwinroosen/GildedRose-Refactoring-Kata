export class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

export const BACKSTAGE_PASSES_NAME = 'Backstage passes to a TAFKAL80ETC concert';
export const SULFURAS_NAME = 'Sulfuras, Hand of Ragnaros';
export const AGED_BRIE_NAME = 'Aged Brie';
export const CONJURED_NAME = 'Conjured Mana Cake';

export class ItemWrapper extends Item implements ProductDefinition {
    static get(item: Item): ItemWrapper {
        let productDefinition: typeof ItemWrapper;
        switch(item.name) {
            case BACKSTAGE_PASSES_NAME: productDefinition = ProductBackstagePasses;break;
            case SULFURAS_NAME: productDefinition = ProductSulfuras;break;
            case AGED_BRIE_NAME: productDefinition = ProductAgedBrie;break;
            case CONJURED_NAME: productDefinition = ProductConjured;break;
            default: productDefinition = ItemWrapper;break;
        }
        return new productDefinition(item.name, item.sellIn, item.quality);
    }

    public update(): void {
        if (this.name === SULFURAS_NAME) {
            return;
        }
        this.sellIn -= 1;
        this.updateQuality();
    }

    private updateQuality(): void {
        let updatedQuality = this.quality + this.calculateQualityIncrease();
        if (updatedQuality < 0) {
            updatedQuality = 0;
        }
        if (updatedQuality > 50) {
            updatedQuality = 50;
        }
        this.quality = updatedQuality;
    }

    public calculateQualityIncrease(): number {
        return -1;
    }
}

export interface ProductDefinition extends ItemWrapper {
    calculateQualityIncrease(): number;
}

export class ProductAgedBrie extends ItemWrapper implements ProductDefinition {
    public calculateQualityIncrease(): number {
        if (this.sellIn < 0) {
            return 2;
        }
        return 1;
    }
}

export class ProductSulfuras extends ItemWrapper implements ProductDefinition {
    constructor(name, sellIn) {
        super(name, sellIn, 80);
    }

    public calculateQualityIncrease(): number {
        // Doesn't change
        return 0;
    }
}

export class ProductBackstagePasses extends ItemWrapper implements ProductDefinition {
    public calculateQualityIncrease(): number {
        if (this.sellIn < 0) {
            return this.quality * -1;
        }
        if (this.sellIn <= 5) {
            return 3;
        }
        if (this.sellIn <= 10) {
            return 2;
        }
        return 1;
    }
}

export class ProductConjured extends ItemWrapper implements ProductDefinition {
    public calculateQualityIncrease(): number {
        if (this.sellIn < 0) {
            return -4;
        }
        return -2;
    }
}

export class GildedRose {
    items: Array<Item>;

    constructor(items = [] as Array<Item>) {
        this.items = items;
    }

    updateQuality() {
        for (let i = 0; i < this.items.length; i++) {
            const product = ItemWrapper.get(this.items[i]);
            product.update();
        }

        return this.items;
    }
}
