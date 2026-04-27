// components/Player/Player.tsx

function Player() {
  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        borderRadius: "var(--radius-card)",
        background: "var(--color-surface)",
        padding: "16px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    />
  );
}

export default Player;