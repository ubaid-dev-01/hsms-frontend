// src/lib/constants/plotsizeForm.constants.ts
import { FieldConfig } from "@/components/shared/EntityForm/EntityForm";
import { PlotSizeFormData } from "@/lib/schemas/plotsize.schema";

export const plotSizeFormFields: FieldConfig<PlotSizeFormData>[] = [
  {
    name: "plotSizeName",
    label: "Plot Size Name",
    type: "text",
    required: true,
    placeholder: "Enter plot size name (e.g., '5 Marla', '10 Marla')",
  },
  {
    name: "totalArea",
    label: "Total Area",
    type: "number",
    required: true,
    placeholder: "Enter total area",
    min: 0.01,
    step: 0.01,
  },
  {
    name: "areaUnit",
    label: "Area Unit",
    type: "select",
    required: true,
    options: [
      { label: "Marla", value: "marla" },
      { label: "Square Feet (sqft)", value: "sqft" },
      { label: "Square Meter (sqm)", value: "sqm" },
      { label: "Acre", value: "acre" },
      { label: "Hectare", value: "hectare" },
      { label: "Kanal", value: "kanal" },
    ],
    placeholder: "Select area unit",
  },
  {
    name: "ratePerUnit",
    label: "Rate Per Unit",
    type: "number",
    required: true,
    placeholder: "Enter rate per unit area",
    min: 0,
    step: 0.01,
  },
  {
    name: "standardBasePrice",
    label: "Standard Base Price",
    type: "number",
    required: false,
    placeholder: "Will be calculated automatically",
    min: 0,
    step: 0.01,
  },
];
