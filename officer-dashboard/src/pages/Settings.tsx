import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Officer Management</CardTitle>
            <CardDescription>Add or manage traffic enforcement officers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="officer-name">Officer Name</Label>
                <Input id="officer-name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="officer-email">Email</Label>
                <Input id="officer-email" type="email" placeholder="officer@snapnearn.gov" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="officer-zone">Assigned Zone</Label>
              <Select>
                <SelectTrigger id="officer-zone">
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zone-a">Zone A</SelectItem>
                  <SelectItem value="zone-b">Zone B</SelectItem>
                  <SelectItem value="zone-c">Zone C</SelectItem>
                  <SelectItem value="zone-d">Zone D</SelectItem>
                  <SelectItem value="zone-e">Zone E</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Add Officer</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zone Management</CardTitle>
            <CardDescription>Configure patrol zones and boundaries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="zone-name">Zone Name</Label>
              <Input id="zone-name" placeholder="Zone F" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zone-desc">Description</Label>
              <Input id="zone-desc" placeholder="City center area" />
            </div>
            <Button>Create Zone</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email alerts for new reports</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High Priority Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified for urgent violations</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Summary</Label>
                <p className="text-sm text-muted-foreground">Daily report digest</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize your dashboard theme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle dark theme</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
