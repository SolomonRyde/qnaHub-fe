import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { cn } from "../../../lib/utils";

export function AuthCard({
  children,
  title,
  description,
  footer,
  className,
  ...props
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <Card
        className={cn("w-full max-w-md shadow-xl border-border", className)}
        {...props}
      >
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
        {footer && (
          <CardFooter className="flex flex-col gap-3">{footer}</CardFooter>
        )}
      </Card>
    </div>
  );
}
