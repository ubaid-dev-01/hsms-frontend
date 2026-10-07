// src/app/(dashboard)/plotblocks/edit/[id]/page.tsx
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
import { plotBlockFormFields } from '@/lib/constants/plotblockForm.constants'
import { hasPermission, UserRole } from '@/lib/constants/roles'
import {
  usePlotBlock,
  useUpdatePlotBlock
} from '@/lib/hooks/entities/usePlotBlock'
import { useAuth } from '@/lib/hooks/useAuth'
import { plotBlockSchema } from '@/lib/schemas/plotblock.schema'
import { UpdatePlotBlockDto } from '@/lib/types/plotblock'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { customToast } from "@/lib/utils/customToast"
import { FormPageSkeleton } from '@/components/shared/PageSkeleton'

export default function EditPlotBlockPage () {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const updateMutation = useUpdatePlotBlock()

  const id = params.id as string
  const { data: plotBlock, isLoading, error } = usePlotBlock(id)

  const canUpdate =
    user &&
    hasPermission(
      user.role as UserRole,
      [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[]
    )

  if (!canUpdate) {
    return (
      <div className='p-6'>
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have permission to edit plot blocks.
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

  if (isLoading) {
    return <FormPageSkeleton />
  }

  if (error || !plotBlock) {
    return (
      <div className='p-6'>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load plot block data.</CardDescription>
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

  // Prepare default values
  const defaultValues = {
    projectId:
      typeof plotBlock.projectId === 'object'
        ? plotBlock.projectId._id
        : plotBlock.projectId || '',
    plotBlockName: plotBlock.plotBlockName,
    plotBlockDesc: plotBlock.plotBlockDesc || '',
    blockTotalArea: plotBlock.blockTotalArea || undefined,
    blockAreaUnit:
      (plotBlock.blockAreaUnit as
        | 'acres'
        | 'hectares'
        | 'sqft'
        | 'sqm'
        | 'km²') || undefined
  }

  const handleSubmit = async (data: unknown) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: data as UpdatePlotBlockDto
      })
      customToast.success('Plot Block updated successfully')
      router.push('/plotblocks')
    } catch (error) {
      customToast.error(
        'Failed to update plot block' +
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

        <h1 className='text-3xl font-bold'>Edit Plot Block</h1>
        <p className='text-gray-500 mt-2'>Update plot block information.</p>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <EntityForm
            schema={plotBlockSchema}
            fields={plotBlockFormFields}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel='Update Plot Block'
            cancelLabel='Cancel'
            isLoading={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}
