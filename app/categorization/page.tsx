import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CategorizationCenter } from "@/components/categorization-center"

export default function CategorizationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <CategorizationCenter />
          </main>
        </div>
      </div>
    </div>
  )
}
