/**
 * API Documentation Page
 * Interactive Swagger UI for API endpoints
 */

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">API Documentation</h1>
          <p className="text-muted-foreground">
            Interactive documentation for Fritz Forge API endpoints
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <SwaggerUI url="/api/docs" />
        </div>
      </div>
    </div>
  );
}
