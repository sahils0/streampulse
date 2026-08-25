import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const monitors = [
  { name: "api.example.com", url: "https://api.example.com", status: "up", uptime: 99.98, latency: 42, region: "US East" },
  { name: "app.example.com", url: "https://app.example.com", status: "up", uptime: 99.91, latency: 78, region: "EU West" },
  { name: "auth.example.com", url: "https://auth.example.com", status: "down", uptime: 97.43, latency: 0, region: "US East" },
  { name: "cdn.example.com", url: "https://cdn.example.com", status: "up", uptime: 99.99, latency: 18, region: "Global" },
  { name: "billing.example.com", url: "https://billing.example.com", status: "degraded", uptime: 98.12, latency: 340, region: "EU West" },
];

function StatusBadge({ status }: { status: string }) {
  const variant = status === "up" ? "default" : status === "down" ? "destructive" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

export default function MonitorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">All Monitors</h2>
          <p className="text-sm text-muted-foreground">
            {monitors.length} monitors configured
          </p>
        </div>
        <Button>Add Monitor</Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Latency</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monitors.map((m) => (
                <TableRow key={m.name}>
                  <TableHead className="font-medium">{m.name}</TableHead>
                  <TableCell>{m.url}</TableCell>
                  <TableCell>{m.uptime}%</TableCell>
                  <TableCell>
                    {m.latency === 0 ? "—" : `${m.latency}ms`}
                  </TableCell>
                  <TableCell>{m.region}</TableCell>
                  <TableCell>
                    <StatusBadge status={m.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
