import { Crop } from '../types';

export interface ProfitPrediction {
  revenue: number;
  totalCost: number;
  netProfit: number;
  roi: number;
  yield: number;
  costBreakdown: {
    labor: number;
    fertilizer: number;
    irrigation: number;
    seed: number;
    pesticide: number;
  };
}

export const predictProfit = (
crop: Crop,
landSizeAcres: number,
sellingPricePerQuintal: number)
: ProfitPrediction => {
  const defaultPrices: { [key: string]: number } = {
    tomato: 3000,
    rice: 3800,
    wheat: 2275,
    cotton: 7500,
    sugarcane: 350,
    groundnut: 6000,
    potato: 1800,
    onion: 2400,
    chilli: 18500,
    maize: 2200,
    soybean: 4500,
    mustard: 5400,
    sunflower: 6000,
    banana: 2500,
    turmeric: 8000,
    muskmelon: 2800,
    watermelon: 1800,
    pomegranate: 8500
  };

  let price = sellingPricePerQuintal;
  if (!price || price <= 0) {
    const cropKey = crop.name ? crop.name.toLowerCase().trim() : '';
    price = defaultPrices[cropKey] || 3000; // default to 3000 if not found
  }

  // If crop's avgYieldPerAcre is small (e.g. <= 5 tons), scale by 10 to get quintals (1 ton = 10 quintals)
  const yieldFactor = crop.avgYieldPerAcre <= 5 ? 10 : 1;
  const totalYield = crop.avgYieldPerAcre * yieldFactor * landSizeAcres;
  const revenue = totalYield * price;

  // Mock cost calculations based on land size and crop type
  const baseCostPerAcre = 15000;
  const totalBaseCost = baseCostPerAcre * landSizeAcres;

  const costBreakdown = {
    labor: totalBaseCost * 0.3,
    fertilizer: totalBaseCost * 0.25,
    irrigation: totalBaseCost * 0.15,
    seed: totalBaseCost * 0.1,
    pesticide: totalBaseCost * 0.2
  };

  const totalCost = Object.values(costBreakdown).reduce(
    (sum, cost) => sum + cost,
    0
  );
  const netProfit = revenue - totalCost;
  const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  return {
    revenue,
    totalCost,
    netProfit,
    roi,
    yield: totalYield,
    costBreakdown
  };
};