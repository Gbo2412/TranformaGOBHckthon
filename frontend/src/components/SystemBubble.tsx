"use client";

type Tone = "info" | "success" | "danger";

const TONE_CLASSES: Record<Tone, string> = {
  info: "bg-state-infoBg text-state-infoFg border-state-infoFg/20",
  success: "bg-state-successBg text-state-successFg border-state-successFg/20",
  danger: "bg-state-dangerBg text-state-dangerFg border-state-dangerFg/20",
};

const ICON: Record<Tone, string> = {
  info: "ℹ",
  success: "✓",
  danger: "!",
};

interface Props {
  tone: Tone;
  message: string;
  action?: { label: string; onClick: () => void };
}

export function SystemBubble({ tone, message, action }: Props) {
  return (
    <div className="flex justify-center" role="status">
      <div
        className={`flex max-w-[90%] items-center gap-3 rounded-bubble border px-4 py-2.5 text-sm ${TONE_CLASSES[tone]}`}
      >
        <span aria-hidden="true" className="text-base font-bold">
          {ICON[tone]}
        </span>
        <span>{message}</span>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="ml-1 rounded-md px-2 py-1 text-sm font-semibold underline underline-offset-2 hover:no-underline"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
