import { createClient } from "@/lib/supabase/server"
import { ProjectForm } from "@/components/projects/project-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function NewProjectPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase.from("clients").select("id, name").order("name")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold md:text-4xl">New Project</h1>
          <p className="mt-2 text-muted-foreground">Create a new project</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm clients={clients || []} />
        </CardContent>
      </Card>
    </div>
  )
}
