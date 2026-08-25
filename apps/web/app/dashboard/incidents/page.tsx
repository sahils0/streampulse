import { Badge } from "@/components/ui/badge";
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

const incidents = [
  { id: 1, monitor: "auth.example.com", type: "Outage", duration: "14m 32s", time: "2h ago", resolved: true },
  { id: 2, monitor: "billing.example.com", type: "High Latency", duration: "Ongoing", time: "23m ago", resolved: false },
  { id: 3, monitor: "app.example.com", type: "Timeout", duration: "2m 10s", time: "6h ago", resolved: true },
  { id: 4, monitor: "auth.example.com", type: "Outage", duration: "5m 47s", time: "1d ago", resolved: true },
];

export default function IncidentsPage() {
  const activeCount = incidents.filter((i) => !i.resolved).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{incidents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {incidents.length - activeCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Monitor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((i) => (
                <TableRow key={i.id}>
                  <TableHead className="font-medium">{i.monitor}</TableHead>
                  <TableCell>{i.type}</TableCell>
                  <TableCell>{i.duration}</TableCell>
                  <TableCell>{i.time}</TableCell>
                  <TableCell>
                    <Badge variant={i.resolved ? "secondary" : "destructive"}>
                      {i.resolved ? "Resolved" : "Ongoing"}
                    </Badge>
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
