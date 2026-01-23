import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataSourcesTab } from "@/components/dashboard/DataSourcesTab";
import { DomainKPIsTab } from "@/components/dashboard/DomainKPIsTab";
import { DataQualityTab } from "@/components/dashboard/DataQualityTab";
import { 
  Database, 
  BarChart3, 
  ShieldCheck,
  Settings,
  Bell,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [activeTab, setActiveTab] = useState("data-sources");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Data Governance</h1>
                  <p className="text-xs text-muted-foreground">Metadata Validation Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </Button>
              <div className="w-px h-6 bg-border" />
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-foreground">Admin</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-card/50 border border-border/50 p-1 rounded-xl">
            <TabsTrigger 
              value="data-sources" 
              className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg px-6 py-3"
            >
              <Database className="w-4 h-4" />
              Data Sources & Validation
            </TabsTrigger>
            <TabsTrigger 
              value="domain-kpis" 
              className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg px-6 py-3"
            >
              <BarChart3 className="w-4 h-4" />
              Domain KPIs
            </TabsTrigger>
            <TabsTrigger 
              value="data-quality" 
              className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg px-6 py-3"
            >
              <ShieldCheck className="w-4 h-4" />
              Data Quality Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data-sources" className="mt-8">
            <DataSourcesTab />
          </TabsContent>
          
          <TabsContent value="domain-kpis" className="mt-8">
            <DomainKPIsTab />
          </TabsContent>
          
          <TabsContent value="data-quality" className="mt-8">
            <DataQualityTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
