"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
} from "lucide-react";

interface ForecastResult {
  productId: string;
  productName: string;
  currentStock: number;
  averageDailySales: number;
  daysUntilStockout: number;
  recommendedReorderPoint: number;
  suggestedOrderQuantity: number;
  trend: "increasing" | "stable" | "decreasing";
  riskLevel: "low" | "medium" | "high" | "critical";
}

interface InventoryHealthSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  needsReorder: number;
  averageDaysToStockout: number;
}

export function InventoryForecastWidget() {
  const [forecasts, setForecasts] = useState<ForecastResult[]>([]);
  const [summary, setSummary] = useState<InventoryHealthSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch high-risk forecasts
      const forecastResponse = await fetch(
        "/api/admin/inventory/forecast?riskLevels=critical,high&limit=10"
      );
      const forecastData = await forecastResponse.json();
      setForecasts(forecastData.forecasts || []);

      // Fetch summary
      const summaryResponse = await fetch(
        "/api/admin/inventory/forecast?summary=true"
      );
      const summaryData = await summaryResponse.json();
      setSummary(summaryData);
    } catch (error) {
      console.error("Error fetching inventory forecasts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Forecasting</CardTitle>
          <CardDescription>Analyzing inventory levels...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayForecasts = showAll ? forecasts : forecasts.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Inventory Forecasting
            </CardTitle>
            <CardDescription>Products at risk of stockout</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {summary.critical}
              </div>
              <div className="text-xs text-gray-600">Critical</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {summary.high}
              </div>
              <div className="text-xs text-gray-600">High Risk</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {summary.needsReorder}
              </div>
              <div className="text-xs text-gray-600">Need Reorder</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700">
                {summary.averageDaysToStockout}
              </div>
              <div className="text-xs text-gray-600">Avg Days Left</div>
            </div>
          </div>
        )}

        {/* Forecast List */}
        {forecasts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            All products have healthy inventory levels 🎉
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {displayForecasts.map((forecast) => (
                <div
                  key={forecast.productId}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">
                        {forecast.productName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>Stock: {forecast.currentStock}</span>
                        <span>•</span>
                        <span>
                          Avg Daily Sales:{" "}
                          {forecast.averageDailySales.toFixed(2)}
                        </span>
                        {getTrendIcon(forecast.trend)}
                      </div>
                    </div>
                    <Badge variant={getRiskColor(forecast.riskLevel) as any}>
                      {forecast.riskLevel}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t text-xs">
                    <div>
                      <div className="text-gray-600">Days Until Stockout</div>
                      <div className="font-bold text-lg">
                        {forecast.daysUntilStockout === Infinity
                          ? "∞"
                          : forecast.daysUntilStockout}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Suggested Reorder</div>
                      <div className="font-bold text-lg">
                        {forecast.suggestedOrderQuantity}
                      </div>
                    </div>
                  </div>

                  {forecast.currentStock <=
                    forecast.recommendedReorderPoint && (
                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                      ⚠️ Below reorder point ({forecast.recommendedReorderPoint}
                      ). Consider ordering {forecast.suggestedOrderQuantity}{" "}
                      units.
                    </div>
                  )}
                </div>
              ))}
            </div>

            {forecasts.length > 5 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : `Show All ${forecasts.length} Items`}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
