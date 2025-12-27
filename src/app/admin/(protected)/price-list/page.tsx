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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePriceList } from "./actions";
import { Badge } from "@/components/ui/badge";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export default async function PriceListPage() {
  const currentPriceList = await prisma.priceList.findFirst({
    orderBy: { uploadedAt: "desc" },
  });

  const daysSinceUpload = currentPriceList
    ? Math.floor(
        (Date.now() - new Date(currentPriceList.uploadedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Price List</h1>
        <p className="text-neutral-600 mt-1">
          Manage your downloadable price list file
        </p>
      </div>

      {currentPriceList && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Current File"
              value={currentPriceList.filename.substring(0, 20) + "..."}
              description="Active price list"
              icon={FileText}
            />
            <StatsCard
              title="Last Updated"
              value={`${daysSinceUpload}d ago`}
              description={new Date(
                currentPriceList.uploadedAt
              ).toLocaleDateString()}
              icon={Clock}
            />
            <StatsCard
              title="Status"
              value="Active"
              description="Available for download"
              icon={Download}
            />
          </div>
        </>
      )}

      {/* Current Price List */}
      {currentPriceList && (
        <Card className="border-neutral-200 bg-white shadow-sm">
          <CardHeader className="border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5 text-neutral-700" />
                Current Price List
              </CardTitle>
              <Badge variant="secondary" className="font-normal">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-sm font-medium text-neutral-500 mb-1">
                    Filename
                  </p>
                  <p className="font-medium text-neutral-900">
                    {currentPriceList.filename}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Uploaded on{" "}
                    {new Date(currentPriceList.uploadedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={currentPriceList.path} download>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </a>
                <DeleteButton priceListId={currentPriceList.id} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Section */}
      <Card className="border-neutral-200 bg-white shadow-sm">
        <CardHeader className="border-b border-neutral-200">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Upload className="h-5 w-5 text-neutral-700" />
            {currentPriceList ? "Upload New Price List" : "Upload Price List"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <UploadForm />
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-sm text-neutral-600">
              {currentPriceList ? (
                <>
                  <span className="font-medium">Note:</span> Uploading a new
                  file will replace the existing price list. The old file will
                  be permanently deleted.
                </>
              ) : (
                <>
                  <span className="font-medium">Upload your first</span> price
                  list file. Supported formats: PDF, Excel, Word, and other
                  documents.
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DeleteButton({ priceListId }: { priceListId: string }) {
  async function handleDelete() {
    "use server";
    await deletePriceList(priceListId);
  }

  return (
    <form action={handleDelete}>
      <Button variant="destructive" size="sm" type="submit" className="gap-2">
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </form>
  );
}
