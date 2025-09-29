import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { WorkflowManager } from "@/components/workflow-manager"

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <WorkflowManager />
          </main>
        </div>
      </div>
    </div>
  )
}
