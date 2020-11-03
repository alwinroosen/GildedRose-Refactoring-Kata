import { expect } from 'chai';
import {
    Item,
    GildedRose,
    AGED_BRIE_NAME,
    ItemWrapper,
    SULFURAS_NAME,
    BACKSTAGE_PASSES_NAME, ProductAgedBrie, ProductSulfuras, ProductBackstagePasses, CONJURED_NAME,
} from '../app/gilded-rose';

describe('Gilded Rose', () => {
    const DEFAULT_TEST_ITEM: Item = {
        quality: 5,
        sellIn: 15,
        name: ''
    };

    it('Name should still match after update', () => {
        const gildedRose = new GildedRose([ new Item('foo', 0, 0) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].name).to.equal('foo');
    });

    describe('Testing product definitions calculateQualityIncrease method', () => {

        describe('Fallback', () => {
            it('When no product definition, quality decreases with 1', () => {
                const productDefinition = ItemWrapper.get(DEFAULT_TEST_ITEM);
                expect(productDefinition.calculateQualityIncrease()).to.eq(-1);
            });
            it('When no product definition and sell date passed, quality decreases with 1', () => {
                const productDefinition = ItemWrapper.get({
                    ...DEFAULT_TEST_ITEM,
                    sellIn: -1
                });
                expect(productDefinition.calculateQualityIncrease()).to.eq(-1);
            });
        });

        describe('ProductAgedBrie', () => {
            const AGED_BRIE_TEST_ITEM = {
                ...DEFAULT_TEST_ITEM,
                name: AGED_BRIE_NAME
            };

            it('When Aged Brie, quality increases with 1', () => {
                const productDefinition: ProductAgedBrie = ItemWrapper.get(AGED_BRIE_TEST_ITEM);
                expect(productDefinition.calculateQualityIncrease()).to.eq(1);
            });

            it('When Aged Brie and sell date passed, quality increases twice as fast', () => {
                const productDefinition: ProductAgedBrie = ItemWrapper.get({
                    ...AGED_BRIE_TEST_ITEM,
                    sellIn: -1
                });
                expect(productDefinition.calculateQualityIncrease()).to.eq(2);
            });
        });

        describe('ProductSulfuras', () => {
            const SULFURAS_TEST_ITEM = {
                ...DEFAULT_TEST_ITEM,
                name: SULFURAS_NAME
            };

            it('When Sulfuras, quality is always 80', () => {
                const productDefinition: ProductSulfuras = ItemWrapper.get(SULFURAS_TEST_ITEM);
                expect(productDefinition.quality).to.eq(80);
                expect(productDefinition.calculateQualityIncrease()).to.eq(0);
            });

            it('When Sulfuras and sell date passed, quality is always 80', () => {
                const productDefinition: ProductSulfuras = ItemWrapper.get({
                    ...SULFURAS_TEST_ITEM,
                    sellIn: -1
                });
                expect(productDefinition.quality).to.eq(80);
                expect(productDefinition.calculateQualityIncrease()).to.eq(0);
            });
        });

        describe('ProductBackstagePasses', () => {
            const BACKSTAGE_PASSES_TEST_ITEM = {
                ...DEFAULT_TEST_ITEM,
                name: BACKSTAGE_PASSES_NAME
            };

            it('When Backstage Passes, quality increases', () => {
                const productDefinition: ProductBackstagePasses = ItemWrapper.get(BACKSTAGE_PASSES_TEST_ITEM);
                expect(productDefinition.calculateQualityIncrease()).to.eq(1);
            });

            it('When Backstage Passes and 11 days until sell date, quality increases by 1', () => {
                const productDefinition: ProductBackstagePasses = ItemWrapper.get({
                    ...BACKSTAGE_PASSES_TEST_ITEM,
                    sellIn: 11
                });
                expect(productDefinition.calculateQualityIncrease()).to.eq(1);
            });

            it('When Backstage Passes and 10 days or less until sell date, quality increases by 2', () => {
                const productDefinition: ProductBackstagePasses = ItemWrapper.get({
                    ...BACKSTAGE_PASSES_TEST_ITEM,
                    sellIn: 10
                });
                expect(productDefinition.calculateQualityIncrease()).to.eq(2);
            });

            it('When Backstage Passes and 6 days until sell date, quality increases by 2', () => {
                const productDefinition: ProductBackstagePasses = ItemWrapper.get({
                    ...BACKSTAGE_PASSES_TEST_ITEM,
                    sellIn: 6
                });
                expect(productDefinition.calculateQualityIncrease()).to.eq(2);
            });

            it('When Backstage Passes and 5 days or less until sell date, quality increases by 3', () => {
                const productDefinition: ProductBackstagePasses = ItemWrapper.get({
                    ...BACKSTAGE_PASSES_TEST_ITEM,
                    sellIn: 5
                });
                expect(productDefinition.calculateQualityIncrease()).to.eq(3);
            });

            it('When Backstage Passes and sell date passed, quality is 0', () => {
                const productDefinition: ProductBackstagePasses = ItemWrapper.get({
                    ...BACKSTAGE_PASSES_TEST_ITEM,
                    sellIn: -1
                });
                expect(productDefinition.calculateQualityIncrease()).to.eq(productDefinition.quality * -1);
            });
        });

        describe('ProductConjured', () => {
            const CONJURED_TEST_ITEM = {
                ...DEFAULT_TEST_ITEM,
                name: CONJURED_NAME
            };

            it('When Conjured, quality decreases with 2', () => {
                const productDefinition: ProductBackstagePasses = ItemWrapper.get(CONJURED_TEST_ITEM);
                expect(productDefinition.calculateQualityIncrease()).to.eq(-2);
            });

            it('When Conjured and sell date passed, quality decreases with 4', () => {
                const productDefinition: ProductBackstagePasses = ItemWrapper.get({
                    ...CONJURED_TEST_ITEM,
                    sellIn: -1
                });
                expect(productDefinition.calculateQualityIncrease()).to.eq(-4);
            });
        });
    });

    describe('Testing ItemWrapper update() method', () => {
        it('When Sulfuras, no changes happen', () => {
            const productDefinition: ProductSulfuras = ItemWrapper.get({
                ...DEFAULT_TEST_ITEM,
                name: SULFURAS_NAME
            });
            expect(productDefinition.quality).to.eq(80);
            expect(productDefinition.sellIn).to.eq(15);
            productDefinition.update();
            expect(productDefinition.quality).to.eq(80);
            expect(productDefinition.sellIn).to.eq(15);
        });

        it('Should decrease the sellIn value', () => {
            const productDefinition: ProductSulfuras = ItemWrapper.get(DEFAULT_TEST_ITEM);
            expect(productDefinition.sellIn).to.eq(15);
            productDefinition.update();
            expect(productDefinition.sellIn).to.eq(14);
        });

        it('Quality should never go below 0', () => {
            const productDefinition: ProductSulfuras = ItemWrapper.get({
                ...DEFAULT_TEST_ITEM,
                quality: 0
            });
            expect(productDefinition.quality).to.eq(0);
            productDefinition.update();
            expect(productDefinition.quality).to.eq(0);
        });

        it('Quality should never go over 50', () => {
            const productDefinition: ProductSulfuras = ItemWrapper.get({
                ...DEFAULT_TEST_ITEM,
                quality: 50,
                name: AGED_BRIE_NAME // Aged Brie increase its quality over time
            });
            expect(productDefinition.quality).to.eq(50);
            productDefinition.update();
            expect(productDefinition.quality).to.eq(50);
        });
    });

});
