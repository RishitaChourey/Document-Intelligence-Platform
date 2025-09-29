import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Analytics } from "@/components/analytics"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <Analytics />
          </main>
        </div>
      </div>
    </div>
  )
}
