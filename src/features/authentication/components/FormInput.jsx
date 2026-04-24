import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { cn } from "../../../lib/utils";

export function FormInput({
  label,
  id,
  type = "text",
  placeHolder = "",
  icon: Icon,
  rightIcon: RightIcon = "",
  onRightIconClick = {},
  error,
  className,
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeHolder}
          className={cn(
            Icon && "pl-10",
            RightIcon && "pr-10",
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <RightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
