import React from "react";
import { Card, CardContent } from "../../../components/ui/Card";

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Roles Management</h2>
        <p className="text-muted-foreground mt-1">
          Define and manage user roles and access levels.
        </p>
      </div>

      <Card className="border border-border bg-card rounded-2xl p-8">
        <CardContent className="p-0">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Roles Page
            </h3>
            <p className="text-muted-foreground">
              Role management features coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
