import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">StreamPulse</h1>
        <p className="text-muted-foreground">
          Track your website&apos;s uptime.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/register" className={buttonVariants()}>
          Get Started
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          Login
        </Link>
      </div>

      <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Uptime Monitoring</CardTitle>
            <CardDescription>
              Check your sites on a schedule.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automatically monitor your URLs and APIs at regular intervals.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Incident Tracking</CardTitle>
            <CardDescription>
              Know when things go wrong.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get notified instantly when a check fails and track incidents.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Response Metrics</CardTitle>
            <CardDescription>
              Measure performance over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track response times and status codes for every endpoint.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
