// src/app/(dashboard)/projects/create/page.tsx
'use client'

import { EntityForm } from '@/components/shared/EntityForm/EntityForm'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { projectFormFields } from '@/lib/constants/projectForm.constants'
import { hasPermission, UserRole } from '@/lib/constants/roles'
import { useCreateProject } from '@/lib/hooks/entities/useProject'
import { useAuth } from '@/lib/hooks/useAuth'
import { projectSchema } from '@/lib/schemas/project.schema'
import {
  CreateProjectDto,
  ProjectStatus,
  ProjectType
} from '@/lib/types/project'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { customToast } from "@/lib/utils/customToast"

export default function CreateProjectPage () {
  const router = useRouter()
  const { user } = useAuth()
  const createMutation = useCreateProject()

  const canCreate =
    user &&
    hasPermission(
      user.role as UserRole,
      [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[]
    )

  if (!canCreate) {
    return (
      <div className='p-6'>
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have permission to create projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (data: unknown) => {
    try {
      const formData = data as CreateProjectDto

      // Convert date strings to Date objects
      const submitData = {
        ...formData,
        launchDate: new Date(formData.launchDate),
        completionDate: formData.completionDate
          ? new Date(formData.completionDate)
          : undefined,
        totalArea: Number(formData.totalArea),
        amenities: formData.amenities || [],
        isActive: formData.isActive ?? true,
        country: formData.country || 'Pakistan',
        projType: (formData.projType || 'residential') as ProjectType,
        projStatus: (formData.projStatus || 'planning') as ProjectStatus,
        projPrefix: formData.projPrefix?.toUpperCase() || ''
      }
      await createMutation.mutateAsync(submitData)
      customToast.success('Project created successfully')
      router.push('/projects')
    } catch (error) {
      customToast.error(
        'Failed to create project' +
          (error instanceof Error ? `: ${error.message}` : '')
      )
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <Button variant='ghost' onClick={() => router.back()} className='mb-4'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Projects
        </Button>

        <h1 className='text-3xl font-bold'>Create New Project</h1>
        <p className='text-gray-500 mt-2'>
          Define a new housing society project with all necessary details.
        </p>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <EntityForm
            schema={projectSchema}
            fields={projectFormFields}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel='Create Project'
            cancelLabel='Cancel'
            isLoading={createMutation.isPending}
            defaultValues={{
              country: 'Pakistan',
              projType: 'residential',
              projStatus: 'planning',
              isActive: true,
              areaUnit: 'acres'
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
