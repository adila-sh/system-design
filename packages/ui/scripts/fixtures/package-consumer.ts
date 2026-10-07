import { Button as RootButton } from "@adila-sh/ui";
import { Button } from "@adila-sh/ui/button";
import {
  ToastToaster,
  toastManager,
  Toaster,
  toast,
  Questionnaire as RootQuestionnaire,
} from "@adila-sh/ui";
import { Toaster as BaseToaster, toast as baseToast } from "@adila-sh/ui/toast";
import { Questionnaire } from "@adila-sh/ui/questionnaire";
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
} from "@adila-sh/ui/sonner";

const granularButton: typeof RootButton = Button;
void granularButton;

const granularQuestionnaire: typeof RootQuestionnaire = Questionnaire;
const baseToaster: typeof ToastToaster = BaseToaster;
const baseManager: typeof toastManager = baseToast;
const existingToaster: typeof Toaster = SonnerToaster;
const existingToast: typeof toast = sonnerToast;
void [
  granularQuestionnaire,
  baseToaster,
  baseManager,
  existingToaster,
  existingToast,
];
