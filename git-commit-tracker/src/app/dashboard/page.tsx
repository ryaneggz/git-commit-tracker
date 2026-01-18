"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RepoSelector } from "@/components/repo-selector";
import { DateRangePicker, DateRangeState } from "@/components/date-range-picker";

export default function DashboardPage() {
  const [selectedRepos, setSelectedRepos] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRangeState>({
    from: undefined,
    to: undefined,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Repositories</label>
              <RepoSelector
                selectedRepos={selectedRepos}
                onSelectionChange={setSelectedRepos}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
          </div>
          {(selectedRepos.length > 0 || dateRange.from || dateRange.to) && (
            <div className="text-sm text-muted-foreground">
              {selectedRepos.length > 0 && (
                <p>Repositories: {selectedRepos.join(", ")}</p>
              )}
              {(dateRange.from || dateRange.to) && (
                <p>
                  Date range: {dateRange.from?.toLocaleDateString() || "Any"} -{" "}
                  {dateRange.to?.toLocaleDateString() || "Any"}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Commit Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your commit timeline visualization will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
