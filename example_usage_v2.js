import { SmartComparisonEngine } from './src/features/compare/v2/engine.ts';
import { CATEGORY_CONFIGS } from './src/features/compare/v2/configs.ts';
/**
 * 4. EXAMPLE USAGE SCRIPT
 */
const products = [
    {
        id: 'nike-af3',
        name: 'Nike Alphafly 3',
        brand: 'Nike',
        category: 'road_running',
        price: 9400,
        specs: {
            weightG: 218,
            dropMm: 8,
            stackHeightMm: 40,
            energyReturn: 95,
            cushioning: 90,
            stability: 70,
            traction: 80
        }
    },
    {
        id: 'saucony-endorphin-speed-4',
        name: 'Saucony Endorphin Speed 4',
        brand: 'Saucony',
        category: 'road_running',
        price: 6900,
        specs: {
            weightG: 233,
            dropMm: 8,
            stackHeightMm: 36,
            energyReturn: 88,
            cushioning: 85,
            stability: 80,
            traction: 75
        }
    },
    {
        id: 'hoka-clifton-9',
        name: 'Hoka Clifton 9',
        brand: 'Hoka',
        category: 'road_running',
        price: 5400,
        specs: {
            weightG: 248,
            dropMm: 5,
            stackHeightMm: 32,
            energyReturn: 70,
            cushioning: 95,
            stability: 85,
            traction: 85
        }
    }
];
const category = CATEGORY_CONFIGS['road_running'];
const raceIntent = category.intents.find(i => i.id === 'race');
console.log('--- RACE DAY INTENT ---');
const raceResult = SmartComparisonEngine.compare(products, category.metrics, raceIntent);
console.log(JSON.stringify(raceResult, null, 2));
console.log('\n--- DAILY TRAINING INTENT ---');
const dailyIntent = category.intents.find(i => i.id === 'daily');
const dailyResult = SmartComparisonEngine.compare(products, category.metrics, dailyIntent);
console.log(JSON.stringify(dailyResult, null, 2));
