// src/app/(dashboard)/plotblocks/create/page.tsx
'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { EntityForm } from '@/components/shared/EntityForm/EntityForm'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { plotBlockFormFields } from '@/lib/constants/plotblockForm.constants'
import { hasPermission, UserRole } from '@/lib/constants/roles'
import { useCreatePlotBlock } from '@/lib/hooks/entities/usePlotBlock'
import { useProjects } from '@/lib/hooks/entities/useProject'
import { useAuth } from '@/lib/hooks/useAuth'
import { plotBlockSchema } from '@/lib/schemas/plotblock.schema'
import { CreatePlotBlockDto } from '@/lib/types/plotblock'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { customToast } from '@/lib/utils/customToast'

export default function CreatePlotBlockPage () {
  const router = useRouter()
  const { user } = useAuth()
  const [formFields, setFormFields] = useState(plotBlockFormFields)
  const { data: projects, isLoading: projectsLoading } = useProjects({
    limit: 100
  })

  const transformedFields = useMemo(() => {
    return plotBlockFormFields.map(field => {
      if (field.name === 'projectId' && projects?.items) {
        return {
          ...field,
          options: projects.items.map(proj => ({
            label: `${proj.projName}${
              proj.projCode ? ` (${proj.projCode})` : ''
            }`,
            value: proj._id
          }))
        }
      }
      return field
    })
  }, [projects?.items]) // Only recompute when projects.items changes

  const createMutation = useCreatePlotBlock()

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
              You don&apos;t have permission to create plot blocks.
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
      await createMutation.mutateAsync(data as CreatePlotBlockDto)
      customToast.success('Plot Block created successfully')
      router.push('/plotblocks')
    } catch (error) {
      customToast.error(
        'Failed to create plot block' +
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
          Back to Plot Blocks
        </Button>

        <h1 className='text-3xl font-bold'>Create New Plot Block</h1>
        <p className='text-gray-500 mt-2'>
          Fill in all the required information to create a new plot block.
        </p>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <EntityForm
            schema={plotBlockSchema}
            fields={plotBlockFormFields}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel='Create Plot Block'
            cancelLabel='Cancel'
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}
