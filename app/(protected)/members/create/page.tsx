"use client";

import { FileGallery } from "@/components/FileManagement/FileGallery";
import {
  EntityForm,
  FieldConfig,
} from "@/components/shared/EntityForm/EntityForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hasPermission, UserRole } from "@/lib/constants/roles";
import { useFilesByEntity } from "@/lib/hooks/entities/useFiles";
import { useCreateMember } from "@/lib/hooks/entities/useMember";
import { useAuth } from "@/lib/hooks/useAuth";
import { memberSchema } from "@/lib/schemas/member.schema";
import { CreateMemberDto } from "@/lib/types/entity";
import { EntityType } from "@/lib/types/upload.types";
import { useState } from "react";

import { ArrowLeft } from "lucide-react";

import { useRouter } from "next/navigation";
import { customToast } from "@/lib/utils/customToast";
import z from "zod";
type MemberFormData = z.infer<typeof memberSchema>;

const memberFormFields = [
  // Basic Information
  {
    name: "memName",
    label: "Member Name",
    type: "text" as const,
    required: true,
    placeholder: "Enter member name",
  },
  {
    name: "memNic",
    label: "NIC",
    type: "text" as const,
    required: true,
    placeholder: "Enter NIC number",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select" as const,
    required: false,
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date" as const,
    required: false,
  },

  // Family Information
  {
    name: "memFHName",
    label: "Father/Husband Name",
    type: "text" as const,
    required: false,
    placeholder: "Enter father/husband name",
  },
  {
    name: "memFHRelation",
    label: "Relation",
    type: "select" as const,
    required: false,
    options: [
      { label: "Father", value: "father" },
      { label: "Husband", value: "husband" },
      { label: "Guardian", value: "guardian" },
    ],
  },

  // Address Information
  {
    name: "memAddr1",
    label: "Address Line 1",
    type: "text" as const,
    required: true,
    placeholder: "Enter address line 1",
  },
  {
    name: "memAddr2",
    label: "Address Line 2",
    type: "text" as const,
    required: false,
    placeholder: "Enter address line 2",
  },
  {
    name: "memAddr3",
    label: "Address Line 3",
    type: "text" as const,
    required: false,
    placeholder: "Enter address line 3",
  },
  {
    name: "cityId",
    label: "State & City",
    type: "state-city" as const,
    required: false,
    placeholder: "Select state, then city",
  },
  {
    name: "memZipPost",
    label: "ZIP/Postal Code",
    type: "text" as const,
    required: false,
    placeholder: "Enter ZIP/postal code",
  },
  {
    name: "memCountry",
    label: "Country",
    type: "text" as const,
    required: false,
    placeholder: "Enter country",
  },

  // Contact Information
  {
    name: "memContMob",
    label: "Mobile Number",
    type: "text" as const,
    required: true,
    placeholder: "Enter mobile number",
  },
  {
    name: "memContRes",
    label: "Residential Phone",
    type: "text" as const,
    required: false,
    placeholder: "Enter residential phone",
  },
  {
    name: "memContWork",
    label: "Work Phone",
    type: "text" as const,
    required: false,
    placeholder: "Enter work phone",
  },
  {
    name: "memContEmail",
    label: "Email",
    type: "email" as const,
    required: false,
    placeholder: "Enter email address",
  },

  // Status and Overseas Information
  {
    name: "statusId",
    label: "Status",
    type: "relationship" as const,
    required: false,
    relationship: {
      endpoint: "statuses",
      labelField: "statusName",
      valueField: "_id",
      searchable: true,
    },
  },
  {
    name: "memIsOverseas",
    label: "Is Overseas Member",
    type: "switch" as const,
    required: false,
  },

  // Additional Information
  {
    name: "memOccupation",
    label: "Occupation",
    type: "text" as const,
    required: false,
    placeholder: "Enter occupation",
  },
  {
    name: "memRemarks",
    label: "Remarks",
    type: "textarea" as const,
    required: false,
    placeholder: "Enter any remarks",
  }
  ,
  {
    name: "memImg",
    label: "Profile Image",
    type: "image-upload",
    required: false,
    uploadConfig: {
      entityType: EntityType.MEMBER,
      entityId: "new", // For new members, we'll update after creation
      maxSize: 5 * 1024 * 1024, // 5MB
      aspectRatio: "square",
    },
  },

] satisfies FieldConfig<MemberFormData>[];

export default function CreateMemberPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [createdMemberId, setCreatedMemberId] = useState<string | null>(null);
const [profileImage, setProfileImage] = useState<string>('') // Track uploaded image

  const createMutation = useCreateMember();

  // Fetch files for the created member
  const { data: memberFiles, refetch: refetchFiles } = useFilesByEntity(
    EntityType.MEMBER,
    createdMemberId || "",
  );

  const canCreate =
    user &&
    hasPermission(
      user.role as UserRole,
      [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
    );

  if (!canCreate) {
    return (

          <div className="flex flex-1 flex-col font-sans overflow-auto scrollbar-hide p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Members</h1>
                <p className="text-muted-foreground">
                  Manage the complete lifecycle of housing society projects
                </p>
              </div>
              <div className="">
                <Card>
                  <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>
                      You don&apos;t have permission to create members.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => router.back()}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Go Back
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

    );
  }

  const handleSubmit = async (data: CreateMemberDto) => {
    try {
     const memberData = {
  ...data,
  memImg: profileImage // Use the uploaded Cloudinary URL
}

const result = await createMutation.mutateAsync(memberData)

      customToast.success("Member created successfully");

      // Set created member ID to show file upload section
      setCreatedMemberId(result._id);
    } catch (error: unknown) {
      let errorMessage = "Something went wrong";

      if (typeof error === "object" && error !== null) {
        const err = error as {
          message?: string;
          response?: { data?: { message?: string } };
          status?: number;
        };

        if (err.message) {
          errorMessage = err.message;
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.status === 409) {
          errorMessage =
            "A member with this NIC or mobile number already exists";
        } else if (err.status === 400) {
          errorMessage =
            "Please check all required fields are filled correctly";
        }
      }

      customToast.error(errorMessage);
    }
  };
const handleImageUpload = (url: string, fieldName: string) => {
  if (fieldName === 'memImg') {
    setProfileImage(url)
  }
}

  const handleCancel = () => {
    router.back();
  };

  return (

        <div className="flex flex-1 flex-col font-sans overflow-auto scrollbar-hide p-6">
          <div className="space-y-6">
            <div className="">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="mb-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Members
                </Button>

                <h1 className="text-3xl font-bold">Create New Member</h1>
                <p className="text-gray-500 mt-2">
                  Fill in all the required information to create a new member
                  record.
                </p>
              </div>

              {!createdMemberId ? (
                <Card>
                  <CardContent className="pt-6">
                    <EntityForm
                      schema={memberSchema}
                      fields={memberFormFields}
                      onSubmit={handleSubmit}
                      onCancel={handleCancel}
                      submitLabel="Create Member"
                      cancelLabel="Cancel"
                      isLoading={createMutation.isPending}
                   onImageUpload = { handleImageUpload }

                    />
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-900">
                        ✓ Member Created Successfully
                      </CardTitle>
                      <CardDescription className="text-green-800">
                        Your member record has been created. Now you can upload
                        related files.
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  {/* File Upload Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Files</CardTitle>
                      <CardDescription>
                        Upload documents, images, or other files related to this
                        member
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {memberFiles && memberFiles.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium mb-4">
                            Uploaded Files ({memberFiles.length})
                          </h4>
                          <FileGallery
                            files={memberFiles}
                            onRefresh={() => refetchFiles()}
                            showPreview={true}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Continue Button */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/members")}
                    >
                      View Members
                    </Button>
                    <Button onClick={() => router.push("/members/create")}>
                      Create Another Member
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

  );
}
