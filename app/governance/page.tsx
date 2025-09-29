import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { GovernanceCenter } from "@/components/governance-center"

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <GovernanceCenter />
          </main>
        </div>
      </div>
    </div>
  )
}
