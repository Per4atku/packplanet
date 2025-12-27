import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/admin/stats-card";
import { UploadForm } from "./upload-form";
import {
  FileText,
  Download,
  Calendar,
  Trash2,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePriceList } from "./actions";
import { Badge } from "@/components/ui/badge";
import { getAdminContent } from "@/lib/content";
import { Separator } from "@/components/ui/separator";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export default async function PriceListPage() {
  const content = getAdminContent();

  const currentPriceList = await prisma.priceList.findFirst({
    orderBy: { uploadedAt: "desc" },
  });

  const daysSinceUpload = currentPriceList
    ? Math.floor(
        (Date.now() - new Date(currentPriceList.uploadedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const isRecent = daysSinceUpload <= 7;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">
          {content.priceList.title}
        </h1>
        <p className="mt-1 text-neutral-600">{content.priceList.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={content.priceList.currentSection.statusLabel || "Status"}
          value={currentPriceList ? "Active" : "No File"}
          description={
            currentPriceList
              ? "Price list is available"
              : "No price list uploaded"
          }
          icon={currentPriceList ? CheckCircle2 : AlertCircle}
        />
        <StatsCard
          title="Days Since Upload"
          value={currentPriceList ? daysSinceUpload : "-"}
          description={
            currentPriceList
              ? isRecent
                ? "Recently updated"
                : "Consider updating"
              : "Upload your first price list"
          }
          icon={Clock}
        />
        <StatsCard
          title="Current File"
          value={currentPriceList ? "1" : "0"}
          description="Active price list file"
          icon={FileText}
        />
        <StatsCard
          title="Last Updated"
          value={
            currentPriceList
              ? new Date(currentPriceList.uploadedAt).toLocaleDateString()
              : "-"
          }
          description="Most recent upload date"
          icon={Calendar}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Price List */}
        <Card className="border-neutral-200 bg-white shadow-sm">
          <CardHeader className="border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="h-5 w-5 text-neutral-700" />
                {content.priceList.currentSection.title}
              </CardTitle>
              {currentPriceList && (
                <Badge
                  variant="default"
                  className="bg-green-500 font-normal hover:bg-green-500"
                >
                  {content.priceList.currentSection.statusBadge}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {currentPriceList ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                      {content.priceList.currentSection.filenameLabel}
                    </p>
                    <p className="text-base font-medium text-neutral-900">
                      {currentPriceList.filename}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                        Uploaded
                      </p>
                      <div className="flex items-center gap-2 text-sm text-neutral-900">
                        <Calendar className="h-4 w-4 text-neutral-500" />
                        <span>
                          {new Date(
                            currentPriceList.uploadedAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                        Age
                      </p>
                      <div className="flex items-center gap-2 text-sm text-neutral-900">
                        <Clock className="h-4 w-4 text-neutral-500" />
                        <span>
                          {daysSinceUpload}{" "}
                          {daysSinceUpload === 1 ? "day" : "days"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href={currentPriceList.path} download className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {content.priceList.currentSection.downloadButton}
                    </Button>
                  </a>
                  <DeleteButton priceListId={currentPriceList.id} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-neutral-100 p-4">
                  <FileText className="h-8 w-8 text-neutral-400" />
                </div>
                <p className="mt-4 font-medium text-neutral-900">
                  No Price List
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  Upload your first price list to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="border-neutral-200 bg-white shadow-sm">
          <CardHeader className="border-b border-neutral-200">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Upload className="h-5 w-5 text-neutral-700" />
              {currentPriceList
                ? content.priceList.uploadSection.titleUpdate
                : content.priceList.uploadSection.titleNew}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <UploadForm content={content} />
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="border-neutral-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="rounded-full bg-blue-100 p-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900">
                {currentPriceList ? "Update Information" : "Getting Started"}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                {currentPriceList ? (
                  <>
                    {content.priceList.uploadSection.noteUpdate}{" "}
                    {content.priceList.uploadSection.noteUpdateText}
                  </>
                ) : (
                  <>
                    {content.priceList.uploadSection.noteFirst}{" "}
                    {content.priceList.uploadSection.noteFirstText}
                  </>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DeleteButton({ priceListId }: { priceListId: string }) {
  const content = getAdminContent();

  async function handleDelete() {
    "use server";
    await deletePriceList(priceListId);
  }

  return (
    <form action={handleDelete}>
      <Button variant="destructive" size="sm" type="submit" className="gap-2">
        <Trash2 className="h-4 w-4" />
        {content.priceList.currentSection.deleteButton}
      </Button>
    </form>
  );
}
