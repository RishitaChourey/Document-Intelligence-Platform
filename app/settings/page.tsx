import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SettingsCenter } from "@/components/settings-center"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <SettingsCenter />
          </main>
        </div>
      </div>
    </div>
  )
}
