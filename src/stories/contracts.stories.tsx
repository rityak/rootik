import type { Story } from "@ladle/react";
import { useRef, useState } from "react";
import { Button, Card, Combobox, Floating, RootikProvider, Scope, SegmentedControl, Tabs } from "..";

export default { title: "Contracts" };
const tabs = [
  { value: "one", label: "First" },
  { value: "two", label: "Second" },
];
const options = [{ value: "one", label: "Original" }];
const fail = () => Promise.reject(new Error("Network unavailable"));

function Scopes() {
  return (
    <Card title="Nested style boundaries">
      <Scope values={{ style: "fluent" }}>
        <Tabs aria-label="Outer Fluent" variant="pill" items={tabs} />
        <Scope values={{ style: "rootik" }}>
          <Tabs aria-label="Inner Rootik" variant="pill" items={tabs} />
          <SegmentedControl aria-label="Rootik segments" options={tabs} defaultValue="one" />
          <Scope values={{ style: "fluent" }}>
            <Tabs aria-label="Nested Fluent" variant="pill" items={tabs} />
          </Scope>
        </Scope>
      </Scope>
    </Card>
  );
}
function Shift() {
  const anchor = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(false);
  return (
    <Card title="Floating layout shift">
      <Button onClick={() => setShift(!shift)}>Shift anchor</Button>
      <div style={{ paddingTop: shift ? 80 : 0 }}>
        <Button ref={anchor} onClick={() => setOpen(!open)}>
          Open floating
        </Button>
        <Floating
          open={open}
          anchor={anchor}
          manual
          role="dialog"
          aria-label="Following anchor"
          className="rk-menu"
        >
          Anchored content
        </Floating>
      </div>
    </Card>
  );
}
function Combo() {
  const [updated, setUpdated] = useState(false);
  return (
    <Card title="Combobox label and failure">
      <Button onClick={() => setUpdated(!updated)}>Update label</Button>
      <Combobox
        aria-label="Current label"
        value="one"
        options={updated ? [{ value: "one", label: "Updated" }] : options}
      />
      <Combobox aria-label="Failed load" loadOptions={fail} debounce={0} />
    </Card>
  );
}
export const Lifecycle: Story = () => (
  <RootikProvider theme="rain">
    <div className="story-col">
      <Scopes />
      <Shift />
      <Combo />
    </div>
  </RootikProvider>
);
