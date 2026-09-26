import { useControllable, useHotkey, useHotkeys } from "../lib/hooks";
import { useLabels } from "../lib/labels";
import { Dialog } from "./dialog";
import { Kbd } from "./display";

export interface ShortcutsSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Key that opens it; `false` leaves opening to the app. */
  hotkey?: string | false;
}

/** Every described `useHotkey` in one sheet, grouped; opens on "?" by default. Mount once. */
export function ShortcutsSheet({ open, onOpenChange, hotkey = "shift+?" }: ShortcutsSheetProps) {
  const labels = useLabels();
  const [isOpen, setOpen] = useControllable(open, false, onOpenChange);
  const hotkeys = useHotkeys();
  useHotkey(hotkey || "", () => setOpen(!isOpen), hotkey !== false);
  const groups = new Map<string, typeof hotkeys>();
  for (const h of hotkeys) groups.set(h.group ?? "", [...(groups.get(h.group ?? "") ?? []), h]);
  return (
    <Dialog open={isOpen} onClose={() => setOpen(false)} title={labels.keyboardShortcuts} size="md">
      <div className="rk-shortcuts">
        {[...groups].map(([group, list]) => (
          <section key={group} className="rk-shortcuts-group">
            {group && <h3 className="rk-shortcuts-title">{group}</h3>}
            <dl>
              {list.map((h) => (
                <div key={`${h.combo}-${h.description}`} className="rk-shortcuts-row">
                  <dt>{h.description}</dt>
                  <dd>
                    <Kbd keys={h.combo} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </Dialog>
  );
}
