// src/app/(dashboard)/installment-categories/create/page.tsx
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
import { installmentCategoryFormFields } from '@/lib/constants/installmentCategoryForm.constants'
import { hasPermission, UserRole } from '@/lib/constants/roles'
import { useCreateInstallmentCategory } from '@/lib/hooks/entities/useInstallmentCategory'
import { useAuth } from '@/lib/hooks/useAuth'
import { installmentCategorySchema } from '@/lib/schemas/installmentCategory.schema'
import { CreateInstallmentCategoryDto } from '@/lib/types/installmentCategory'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { customToast } from "@/lib/utils/customToast"

export default function CreateInstallmentCategoryPage () {
  const router = useRouter()
  const { user } = useAuth()
  const createMutation = useCreateInstallmentCategory()

  const canCreate =
    user &&
    hasPermission(user.role as UserRole, [UserRole.ADMIN, UserRole.SUPER_ADMIN])

  if (!canCreate) {
    return (
      <div className='p-6'>
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have permission to create installment categories.
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
      const formData = data as CreateInstallmentCategoryDto

      const submitData = {
        ...formData,
        sequenceOrder: Number(formData.sequenceOrder),
        isRefundable: formData.isRefundable ?? false,
        isMandatory: formData.isMandatory ?? true,
        isActive: formData.isActive ?? true
      }

      await createMutation.mutateAsync(submitData)
      customToast.success('Category created successfully')
      router.push('/installment-categories')
    } catch (error) {
      customToast.error(
        'Failed to create category' +
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
          Back to Categories
        </Button>

        <h1 className='text-3xl font-bold'>Create Installment Category</h1>
        <p className='text-gray-500 mt-2'>
          Define a new payment category for installment plans.
        </p>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <EntityForm
            schema={installmentCategorySchema}
            fields={installmentCategoryFormFields}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel='Create Category'
            cancelLabel='Cancel'
            isLoading={createMutation.isPending}
            defaultValues={{
              isRefundable: false,
              isMandatory: true,
              isActive: true,
              sequenceOrder: 1
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
