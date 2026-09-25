import type { Story } from "@ladle/react";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { Field, PasswordInput } from "..";

export default { title: "Inputs" };

export const Password: Story = () => {
  const [value, setValue] = useState("hunter2-correct-horse");
  const [visible, setVisible] = useState(false);
  return (
    <div className="story-col" style={{ maxWidth: 320 }}>
      <Field label="Password" hint="The toggle keeps the caret in the field">
        <PasswordInput value={value} onChange={(e) => setValue(e.target.value)} />
      </Field>
      <Field label="API key" hint={`Controlled: ${visible ? "shown" : "hidden"}`}>
        <PasswordInput
          mono
          icon={<KeyRound />}
          autoComplete="off"
          defaultValue="sk-live-9f2c1a7b3e"
          visible={visible}
          onVisibleChange={setVisible}
        />
      </Field>
      <Field label="New password" error="At least 12 characters">
        <PasswordInput size="sm" autoComplete="new-password" defaultValue="short" />
      </Field>
      <PasswordInput size="lg" aria-label="Disabled" disabled defaultValue="secret" />
    </div>
  );
};
