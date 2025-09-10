import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/ui/navigation";
import EmergencyButton from "@/components/ui/emergency-button";

interface DashboardStats {
  totalSessions: number;
  emergencyActions: number;
  auditEntries: number;
  lastActivity: string | null;
}

export default function CreatorDashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!(user?.isCreator || user?.isAdmin),
  });

  if (!user?.isCreator && !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background" data-testid="dashboard-unauthorized">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You need creator or admin privileges to access this dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="creator-dashboard">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold" data-testid="heading-dashboard">
                Creator Dashboard
              </h1>
              <p className="text-muted-foreground" data-testid="text-welcome">
                Welcome back, {user.username}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {user.isCreator && (
                <Badge variant="default" data-testid="badge-creator">Creator</Badge>
              )}
              {user.isAdmin && (
                <Badge variant="destructive" data-testid="badge-admin">Admin</Badge>
              )}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card data-testid="card-total-sessions">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalSessions || 0}</div>
              </CardContent>
            </Card>

            <Card data-testid="card-emergency-actions">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Emergency Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{stats?.emergencyActions || 0}</div>
              </CardContent>
            </Card>

            <Card data-testid="card-audit-entries">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Audit Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.auditEntries || 0}</div>
              </CardContent>
            </Card>

            <Card data-testid="card-last-activity">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Last Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {stats?.lastActivity 
                    ? new Date(stats.lastActivity).toLocaleDateString()
                    : "No activity"
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="content" className="space-y-6" data-testid="tabs-dashboard">
            <TabsList className="grid w-full grid-cols-4" data-testid="tabs-list-dashboard">
              <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
              <TabsTrigger value="avatars" data-testid="tab-avatars">Avatars</TabsTrigger>
              <TabsTrigger value="monetization" data-testid="tab-monetization">Monetization</TabsTrigger>
              <TabsTrigger value="admin" disabled={!user.isAdmin} data-testid="tab-admin">
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6" data-testid="content-tab">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card data-testid="card-content-creation">
                  <CardHeader>
                    <CardTitle data-testid="heading-content-creation">Content Creation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start" data-testid="button-create-avatar">
                      <i className="fas fa-user-plus mr-2"></i>
                      Create New Avatar
                    </Button>
                    <Button className="w-full justify-start" data-testid="button-design-experience">
                      <i className="fas fa-magic mr-2"></i>
                      Design Experience
                    </Button>
                    <Button className="w-full justify-start" data-testid="button-content-library">
                      <i className="fas fa-folder mr-2"></i>
                      Content Library
                    </Button>
                  </CardContent>
                </Card>

                <Card data-testid="card-universe-management">
                  <CardHeader>
                    <CardTitle data-testid="heading-universe-management">Universe Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start" data-testid="button-manage-zones">
                      <i className="fas fa-globe mr-2"></i>
                      Manage Zones
                    </Button>
                    <Button className="w-full justify-start" data-testid="button-content-ratings">
                      <i className="fas fa-star mr-2"></i>
                      Content Ratings
                    </Button>
                    <Button className="w-full justify-start" data-testid="button-safety-controls">
                      <i className="fas fa-shield-alt mr-2"></i>
                      Safety Controls
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="avatars" className="space-y-6" data-testid="avatars-tab">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card data-testid="card-live-avatars">
                  <CardHeader>
                    <CardTitle data-testid="heading-live-avatars">Live Avatars</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Javari</span>
                        <Badge variant="default">Live</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Kairo</span>
                        <Badge variant="default">Live</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>CRAI</span>
                        <Badge variant="default">Live</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-avatar-analytics">
                  <CardHeader>
                    <CardTitle data-testid="heading-avatar-analytics">Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Total Interactions</span>
                        <span className="font-medium">1,234</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Session</span>
                        <span className="font-medium">12m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>User Satisfaction</span>
                        <span className="font-medium">4.8/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-avatar-settings">
                  <CardHeader>
                    <CardTitle data-testid="heading-avatar-settings">Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full" data-testid="button-personality-tuning">
                      Personality Tuning
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" data-testid="button-voice-settings">
                      Voice Settings
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" data-testid="button-learning-preferences">
                      Learning Preferences
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="monetization" className="space-y-6" data-testid="monetization-tab">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card data-testid="card-revenue-overview">
                  <CardHeader>
                    <CardTitle data-testid="heading-revenue-overview">Revenue Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-500">$2,456</div>
                        <p className="text-sm text-muted-foreground">This Month</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subscriptions</span>
                          <span>$1,890</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tips</span>
                          <span>$456</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Premium Content</span>
                          <span>$110</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-monetization-tools">
                  <CardHeader>
                    <CardTitle data-testid="heading-monetization-tools">Monetization Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" data-testid="button-subscription-tiers">
                      <i className="fas fa-crown mr-2"></i>
                      Subscription Tiers
                    </Button>
                    <Button className="w-full justify-start" data-testid="button-premium-content">
                      <i className="fas fa-star mr-2"></i>
                      Premium Content
                    </Button>
                    <Button className="w-full justify-start" data-testid="button-payment-settings">
                      <i className="fas fa-credit-card mr-2"></i>
                      Payment Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {user.isAdmin && (
              <TabsContent value="admin" className="space-y-6" data-testid="admin-tab">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-red-500/30" data-testid="card-emergency-controls">
                    <CardHeader>
                      <CardTitle className="text-red-400" data-testid="heading-emergency-controls">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        Emergency Controls
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="destructive" size="sm" className="w-full" data-testid="button-emergency-stop">
                        Emergency Stop
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" data-testid="button-system-lockdown">
                        System Lockdown
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" data-testid="button-content-review">
                        Content Review
                      </Button>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-user-management">
                    <CardHeader>
                      <CardTitle data-testid="heading-user-management">User Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" size="sm" className="w-full" data-testid="button-manage-users">
                        Manage Users
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" data-testid="button-age-verification-logs">
                        Age Verification Logs
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" data-testid="button-content-reports">
                        Content Reports
                      </Button>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-system-monitoring">
                    <CardHeader>
                      <CardTitle data-testid="heading-system-monitoring">System Monitoring</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" size="sm" className="w-full" data-testid="button-server-status">
                        Server Status
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" data-testid="button-audit-logs">
                        Audit Logs
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" data-testid="button-performance-metrics">
                        Performance Metrics
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {user.isAdmin && <EmergencyButton />}
    </div>
  );
}
