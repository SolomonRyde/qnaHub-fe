import React from "react";
import { Card, CardContent } from "../../../components/ui/Card";

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Permissions</h2>
        <p className="text-muted-foreground mt-1">
          Configure granular permissions for roles and users.
        </p>
      </div>

      <Card className="border border-border bg-card rounded-2xl p-8">
        <CardContent className="p-0">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Permissions Page
            </h3>
            <p className="text-muted-foreground">
              Permission management features coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
