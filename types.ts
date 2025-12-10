
export enum ToolType {
  UNIT_ECONOMICS = 'UNIT_ECONOMICS',
  MARKETING_BUDGET = 'MARKETING_BUDGET',
  BREAK_EVEN = 'BREAK_EVEN',
  INVENTORY = 'INVENTORY',
  PAYMENT_GATEWAY = 'PAYMENT_GATEWAY',
  PRODUCT_PRICING = 'PRODUCT_PRICING'
}

export interface NavItem {
  id: ToolType;
  label: string;
  icon: string;
  description: string;
}

export interface UnitEconomicsData {
  sellingPrice: number;
  cogs: number;
  shipping: number;
  packaging: number;
  marketingCpa: number;
  paymentGatewayPercent: number;
  returnsPercent: number;
}

export interface BreakEvenData {
  fixedCosts: number;
  avgSellingPrice: number;
  avgVariableCost: number;
  cashInBank: number;
  currentMonthlyRevenue: number;
  monthlyGrowthRate: number;
}

export interface MarketingData {
  targetRevenue: number;
  aov: number;
  targetRoas: number;
  cpc: number;
}
