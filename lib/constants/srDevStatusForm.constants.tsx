// src/lib/constants/srDevStatusForm.constants.tsx
import { FieldConfig } from '@/components/shared/EntityForm/EntityForm'
import { SrDevStatusFormData } from '@/lib/schemas/srDevStatus.schema'
import {
  DEFAULT_COLORS,
  DEV_CATEGORY_OPTIONS,
  DEV_PHASE_OPTIONS,
  DURATION_OPTIONS,
  PERCENTAGE_OPTIONS,
  PHASE_PERCENTAGE_RANGES,
  SEQUENCE_OPTIONS
} from './srDevStatus.constants'

export const srDevStatusFormFields: FieldConfig<SrDevStatusFormData>[] = [
  {
    name: 'srDevStatName',
    label: 'Development Status Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Site Clearing, Foundation Work, etc.'
  },
  {
    name: 'srDevStatCode',
    label: 'Status Code',
    type: 'text',
    required: true,
    placeholder: 'e.g., SITE_CLEARING, FOUNDATION, etc.'
  },
  {
    name: 'devCategory',
    label: 'Development Category',
    type: 'select',
    required: true,
    options: DEV_CATEGORY_OPTIONS
  },
  {
    name: 'devPhase',
    label: 'Development Phase',
    type: 'select',
    required: true,
    options: DEV_PHASE_OPTIONS,
    onChange: (value, form) => {
      // Auto-set percentage based on phase
      if (form) {
        const phase = value as string
        const range =
          PHASE_PERCENTAGE_RANGES[phase as keyof typeof PHASE_PERCENTAGE_RANGES]
        if (range) {
          form.setValue('percentageComplete', range.min)
        }
      }
    }
  },
  {
    name: 'percentageComplete',
    label: 'Percentage Complete',
    type: 'select',
    required: true,
    options: PERCENTAGE_OPTIONS,
    showWhen: values => {
      return true
    },

    getOptions: values => {
      if (!values.devPhase) return PERCENTAGE_OPTIONS

      const range =
        PHASE_PERCENTAGE_RANGES[
          values.devPhase as keyof typeof PHASE_PERCENTAGE_RANGES
        ]

      if (!range) return PERCENTAGE_OPTIONS

      return PERCENTAGE_OPTIONS.filter(
        option => option.value >= range.min && option.value <= range.max
      )
    }
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Describe this development status...',
    rows: 3
  },
  {
    name: 'colorCode',
    label: 'Color',
    type: 'select',
    required: true,
    options: DEFAULT_COLORS.map(color => ({
      value: color.value,
      label: (
        <div className='flex items-center gap-2'>
          <div
            className='w-4 h-4 rounded-full border'
            style={{ backgroundColor: color.value }}
          />
          <span>{color.name}</span>
        </div>
      )
    }))
  },
  {
    name: 'sequence',
    label: 'Display Sequence',
    type: 'select',
    required: true,
    options: SEQUENCE_OPTIONS
  },
  {
    name: 'estimatedDurationDays',
    label: 'Estimated Duration',
    type: 'select',
    options: DURATION_OPTIONS,
    placeholder: 'Select duration'
  },
  {
    name: 'isActive',
    label: 'Active Status',
    type: 'switch',
    defaultValue: true
  },
  {
    name: 'isDefault',
    label: 'Default Status',
    type: 'switch',
    defaultValue: false
  },
  {
    name: 'requiresDocumentation',
    label: 'Requires Documentation',
    type: 'switch',
    defaultValue: false
  },
  {
    name: 'icon',
    label: 'Icon Name',
    type: 'text',
    placeholder: 'e.g., wrench, building, check-circle'
  }
]
