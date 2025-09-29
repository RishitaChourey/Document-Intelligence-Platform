import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { UploadHub } from "@/components/upload-hub"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <UploadHub />
          </main>
        </div>
      </div>
    </div>
  )
}
