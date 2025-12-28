import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminContent } from "@/lib/content";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const content = getAdminContent();
  const params = await searchParams;
  const error = params.error;

  const errorMessages = {
    missing_fields: "Пожалуйста, заполните все поля",
    invalid_credentials: "Неверное имя пользователя или пароль",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{content.login.title}</CardTitle>
          <CardDescription>
            {content.login.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                {errorMessages[error as keyof typeof errorMessages] || "Произошла ошибка"}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">{content.login.usernameLabel}</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{content.login.passwordLabel}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full">
              {content.login.submitButton}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
