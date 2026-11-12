import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";
import { Field } from "@/components/auth/field";
import { Button } from "@/components/ui/button";
import { action } from "@/lib/ui";
import { cn } from "@/lib/utils";
import {
  register,
  RegisterApiError,
  type RegisterRequest,
} from "@/services/auth/register";

const EMAIL_PATTERN = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+$/;
const INVALID_REQUEST_MESSAGE = "The registration request is invalid.";
const EMAIL_ALREADY_REGISTERED_MESSAGE = "Email already registered.";
const EMAIL_FIELD_ALERT_MESSAGE = "Please check the email field.";
const NETWORK_ERROR_MESSAGE =
  "Unable to connect to RASTRO. Please check your connection and try again.";
const REQUEST_FAILED_MESSAGE = "Unable to complete the registration request.";
const FIELD_ORDER = [
  "name",
  "lastName",
  "email",
  "phoneNumber",
  "password",
  "confirmPassword",
] as const;

type FieldName = (typeof FIELD_ORDER)[number];
type FieldErrors = Partial<Record<FieldName, string>>;
type RegisterFormValues = Record<FieldName, string>;

function readValues(form: HTMLFormElement): RegisterFormValues {
  const formData = new FormData(form);
  return Object.fromEntries(
    FIELD_ORDER.map((field) => [field, String(formData.get(field) ?? "")]),
  ) as RegisterFormValues;
}

function validate(values: RegisterFormValues): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const lastName = values.lastName.trim();
  const email = values.email.trim();

  if (name.length < 3 || name.length > 10) {
    errors.name = "Name must contain between 3 and 10 characters.";
  }
  if (lastName.length < 3 || lastName.length > 10) {
    errors.lastName = "Last name must contain between 3 and 10 characters.";
  }
  if (email.length > 150) {
    errors.email = "Email must contain at most 150 characters.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (values.phoneNumber.trim() && values.phoneNumber.length > 20) {
    errors.phoneNumber = "Phone number must contain at most 20 characters.";
  }

  const password = values.password;
  if (password.length < 5) {
    errors.password = "Password must contain at least 5 characters.";
  } else if (!/[A-Za-z]/.test(password)) {
    errors.password = "Password must contain at least one ASCII letter.";
  } else if (!/[0-9]/.test(password)) {
    errors.password = "Password must contain at least one ASCII digit.";
  } else if (new TextEncoder().encode(password).length > 72) {
    errors.password = "Password must contain at most 72 UTF-8 bytes.";
  }

  if (values.confirmPassword.length === 0) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

function submissionErrorMessage(error: unknown) {
  if (!(error instanceof RegisterApiError)) return REQUEST_FAILED_MESSAGE;

  switch (error.code) {
    case "INVALID_REQUEST":
      return INVALID_REQUEST_MESSAGE;
    case "EMAIL_ALREADY_REGISTERED":
      return EMAIL_ALREADY_REGISTERED_MESSAGE;
    case "NETWORK_ERROR":
      return NETWORK_ERROR_MESSAGE;
    case "REQUEST_FAILED":
      return REQUEST_FAILED_MESSAGE;
  }
}

export function RegisterForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [requestError, setRequestError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const submittingRef = useRef(false);
  const mountedRef = useRef(true);
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const pendingFocusRef = useRef<FieldName | undefined>(undefined);
  const duplicateEmailRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (registrationComplete) successRef.current?.focus();
  }, [registrationComplete]);

  useEffect(() => {
    const field = pendingFocusRef.current;
    if (!field) return;

    pendingFocusRef.current = undefined;
    const input = formRef.current?.elements.namedItem(field);
    if (input instanceof HTMLElement) input.focus();
  }, [errors]);

  function handleFieldChange(
    field: FieldName,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const form = event.currentTarget.form;
    if (!form) return;

    const nextError = validate(readValues(form))[field];
    setErrors((current) => {
      if (!current[field] || current[field] === nextError) return current;

      const next = { ...current };
      if (nextError) next[field] = nextError;
      else delete next[field];
      return next;
    });

    if (
      field === "email" &&
      duplicateEmailRef.current !== undefined &&
      event.currentTarget.value !== duplicateEmailRef.current
    ) {
      duplicateEmailRef.current = undefined;
      setRequestError(undefined);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const form = event.currentTarget;
    const values = readValues(form);
    const nextErrors = validate(values);

    duplicateEmailRef.current = undefined;
    const firstInvalidField = FIELD_ORDER.find((field) => nextErrors[field]);
    pendingFocusRef.current = firstInvalidField;
    setErrors(nextErrors);
    setRequestError(undefined);
    if (firstInvalidField) return;

    const request: RegisterRequest = {
      name: values.name.trim(),
      lastName: values.lastName.trim(),
      email: values.email,
      password: values.password,
    };
    if (values.phoneNumber.trim()) {
      request.phoneNumber = values.phoneNumber;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      await register(request);
      if (!mountedRef.current) return;
      setRegistrationComplete(true);
    } catch (error) {
      if (!mountedRef.current) return;
      const message = submissionErrorMessage(error);
      if (
        error instanceof RegisterApiError &&
        error.code === "EMAIL_ALREADY_REGISTERED"
      ) {
        const emailInput = form.elements.namedItem("email");
        if (!(emailInput instanceof HTMLInputElement)) return;
        if (emailInput.value !== request.email) return;

        duplicateEmailRef.current = request.email;
        pendingFocusRef.current = "email";
        setRequestError(EMAIL_FIELD_ALERT_MESSAGE);
        setErrors((current) => ({
          ...current,
          email: EMAIL_ALREADY_REGISTERED_MESSAGE,
        }));
      } else {
        setRequestError(message);
      }
    } finally {
      submittingRef.current = false;
      if (mountedRef.current) setIsSubmitting(false);
    }
  }

  if (registrationComplete) {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="animate-in fade-in slide-in-from-bottom-4 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] duration-500"
      >
        <h1 className="font-heading text-4xl font-extrabold">
          Account created successfully.
        </h1>
        <p className="mt-3 text-muted-foreground">Log in to continue.</p>
        <Link to="/login" className={cn(action({ size: "lg" }), "mt-6")}>
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <p className="text-sm font-extrabold uppercase tracking-widest text-primary">
        Join the community
      </p>
      <h1 className="mt-2 text-4xl font-extrabold">Become someone's hero</h1>
      <p className="mt-3 text-muted-foreground">
        It's free. Get alerts about pets near you and help bring them home.
      </p>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isSubmitting}
        className="mt-8 grid gap-5 sm:grid-cols-2"
      >
        <Field
          label="Name"
          name="name"
          autoComplete="given-name"
          placeholder="Lucia"
          required
          error={errors.name}
          onChange={(event) => handleFieldChange("name", event)}
        />
        <Field
          label="Last name"
          name="lastName"
          autoComplete="family-name"
          placeholder="Fernandez"
          required
          error={errors.lastName}
          onChange={(event) => handleFieldChange("lastName", event)}
        />
        <Field
          className="sm:col-span-2"
          label="Email"
          name="email"
          type="text"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          error={errors.email}
          onChange={(event) => handleFieldChange("email", event)}
        />
        <Field
          className="sm:col-span-2"
          label="Phone number (optional)"
          name="phoneNumber"
          type="tel"
          autoComplete="tel"
          placeholder="+34 612 345 678"
          error={errors.phoneNumber}
          onChange={(event) => handleFieldChange("phoneNumber", event)}
        />
        <Field
          className="sm:col-span-2"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 5 characters"
          required
          error={errors.password}
          onChange={(event) => handleFieldChange("password", event)}
        />
        <Field
          className="sm:col-span-2"
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          required
          error={errors.confirmPassword}
          onChange={(event) => handleFieldChange("confirmPassword", event)}
        />
        {requestError ? (
          <p
            role="alert"
            className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive sm:col-span-2"
          >
            {requestError}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className={cn(action({ size: "lg" }), "mt-2 w-full sm:col-span-2")}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              Creating your account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-muted-foreground">
        Already a member?{" "}
        <Link to="/login" className="font-bold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
