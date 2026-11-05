import { ShieldCheck, ShieldOff } from "lucide-react";
import { useEffect, useState } from "react";
import { PowerButton } from "../controls/power-button";
import { SegmentedControl } from "../navigation/segmented";

export function VpnPowerStudy() {
  const [variant, setVariant] = useState<"signal" | "reactor">("signal");
  const [state, setState] = useState<"off" | "connecting" | "on" | "disconnecting">("off");
  const pending = state === "connecting" || state === "disconnecting";
  const connected = state === "on" || state === "disconnecting";
  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(() => setState(state === "connecting" ? "on" : "off"), 1800);
    return () => clearTimeout(timer);
  }, [pending, state]);
  return (
    <div className="cm-vpn">
      <div className="cm-vpn-dial">
        <PowerButton
          label="VPN-подключение"
          variant={variant}
          size="lg"
          on={connected}
          pending={pending}
          icon={connected ? <ShieldCheck /> : pending ? undefined : <ShieldOff />}
          onChange={() =>
            setState(pending ? (connected ? "on" : "off") : connected ? "disconnecting" : "connecting")
          }
        />
      </div>
      <div className="cm-vpn-copy">
        <code>ROOTIK / SECURE SIGNAL</code>
        <h2>
          {pending
            ? connected
              ? "Отключаемся…"
              : "Создаём туннель…"
            : connected
              ? "Соединение защищено"
              : "Готов к подключению"}
        </h2>
        <p role="status">
          {pending
            ? "Нажмите ещё раз, чтобы отменить"
            : connected
              ? "Северный шлюз · соединение активно"
              : "Нажмите на кнопку подключения"}
        </p>
        <SegmentedControl
          aria-label="Вариант VPN-кнопки"
          value={variant}
          onChange={setVariant}
          options={[
            { value: "signal", label: "Signal" },
            { value: "reactor", label: "Reactor" },
          ]}
        />
        <small>Демонстрация состояний. Реальное VPN-соединение не создаётся.</small>
      </div>
    </div>
  );
}
