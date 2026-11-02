import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { Field } from "@cloudflare/kumo/components/field";
import { Input, type InputProps } from "@cloudflare/kumo/components/input";
import {
  forwardRef,
  useId,
  useState,
  type ReactNode,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";

export type KumoInputProps = InputProps & {
  /** Decorative icon displayed inside the input, before its text. */
  icon?: ReactNode;
  /** Show an accessible clear action inside the input. */
  onClear?: () => void;
  clearLabel?: string;
};

export const KumoInput: ForwardRefExoticComponent<
  KumoInputProps & RefAttributes<HTMLInputElement>
> = forwardRef<HTMLInputElement, KumoInputProps>(function KumoInput(
  {
    icon,
    onClear,
    clearLabel = "Limpar",
    label,
    labelTooltip,
    description,
    error,
    className = "",
    ...props
  },
  ref,
) {
  const labelId = useId();
  const [clearing, setClearing] = useState(false);
  if (!icon && !onClear && !clearing) {
    return (
      <Input
        {...props}
        ref={ref}
        label={label}
        labelTooltip={labelTooltip}
        description={description}
        error={error}
        className={`min-h-11 rounded-[10px] ${className}`}
      />
    );
  }

  const control = (
    <div
      className={`relative min-w-0 ${icon ? "kumo-input-with-icon" : ""} ${onClear || clearing ? "kumo-input-with-clear" : ""}`}
    >
      <Input
        {...props}
        ref={ref}
        aria-labelledby={
          props["aria-labelledby"] ?? (label ? labelId : undefined)
        }
        aria-invalid={props["aria-invalid"] ?? (error ? true : undefined)}
        variant={props.variant ?? (error ? "error" : undefined)}
        className={`min-h-11 w-full rounded-[10px] ${className}`}
      />
      {icon && (
        <span
          aria-hidden="true"
          className="kumo-input-icon pointer-events-none absolute top-1/2 left-3.5 flex size-5 -translate-y-1/2 items-center justify-center text-kumo-subtle [&>svg]:size-5"
        >
          {icon}
        </span>
      )}
      {(onClear || clearing) && (
        <button
          type="button"
          aria-label={clearLabel}
          disabled={props.disabled || clearing}
          data-clearing={clearing || undefined}
          className="kumo-input-clear absolute top-1/2 right-0 flex -translate-y-1/2 items-center justify-center text-kumo-subtle hover:text-kumo-default focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-primary"
          onClick={() => setClearing(true)}
          onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget) return;
            onClear?.();
            setClearing(false);
            event.currentTarget.parentElement?.querySelector("input")?.focus();
          }}
        >
          <XIcon size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );

  return label || error || description ? (
    <Field
      label={label ? <span id={labelId}>{label}</span> : undefined}
      hideLabel={!label}
      required={props.required}
      labelTooltip={labelTooltip}
      description={description}
      error={
        typeof error === "string" ? { message: error, match: true } : error
      }
    >
      {control}
    </Field>
  ) : (
    control
  );
});
