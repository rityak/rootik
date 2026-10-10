import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "./tokens.css";

globalStyle(".rk-native-select-wrap", {
  position: "relative",
  display: "inline-flex",
  width: "100%",
  minWidth: "0",
});

globalStyle(".rk-native-select", {
  appearance: "none",
  paddingInlineEnd: `calc(${tokens.space} * 8)`,
  textOverflow: "ellipsis",
});

globalStyle(".rk-native-select-chevron", {
  position: "absolute",
  insetInlineEnd: `calc(${tokens.space} * 2.5)`,
  top: "50%",
  translate: "0 -50%",
  color: `${tokens.text3}`,
  pointerEvents: "none",
});

globalStyle(".rk-native-select,\n  .rk-native-select::picker(select)", {
  // csstype 3.2 omits base-select; the value remains a native CSS keyword through this local variable.
  "@supports": {
    "(appearance: base-select)": {
      appearance: "var(--rk-native-appearance)",
      vars: { "--rk-native-appearance": "base-select" },
    },
  },
});

globalStyle(".rk-native-select::picker-icon", {
  "@supports": { "(appearance: base-select)": { display: "none" } },
});

globalStyle(".rk-native-select::picker(select)", {
  "@supports": {
    "(appearance: base-select)": {
      marginBlock: "6px",
      padding: "5px",
      border: "0",
      borderRadius: `${tokens.radiusMd}`,
      background: `${tokens.glassBg}`,
      backdropFilter: `blur(${tokens.blur}) saturate(1.3)`,
      boxShadow: `${tokens.shadowPop}`,
      color: `${tokens.text}`,
    },
  },
});

globalStyle(".rk-native-select option", {
  "@supports": {
    "(appearance: base-select)": {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      minHeight: `calc(${tokens.hSm} + 2px)`,
      padding: `4px calc(${tokens.space} * 2.5)`,
      borderRadius: `calc(${tokens.radiusMd} - 5px)`,
      fontSize: `${tokens.textMd}`,
    },
  },
});

globalStyle(".rk-native-select option:is(:hover, :focus-visible)", {
  "@supports": { "(appearance: base-select)": { background: `${tokens.press}`, outline: "none" } },
});

globalStyle(".rk-native-select option:checked", {
  "@supports": { "(appearance: base-select)": { fontWeight: "500" } },
});

globalStyle(".rk-native-select option::checkmark", {
  "@supports": {
    "(appearance: base-select)": { order: "1", marginInlineStart: "auto", color: `${tokens.accentText}` },
  },
});
