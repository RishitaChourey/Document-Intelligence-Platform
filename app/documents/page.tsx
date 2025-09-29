import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DocumentManager } from "@/components/document-manager"

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <DocumentManager />
          </main>
        </div>
      </div>
    </div>
  )
}
