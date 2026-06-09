export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h1>🏀 NBA All-Time Draft Simulator</h1>

      <p>
        Create a draft room, invite friends, draft teams, and simulate an NBA
        season.
      </p>

      <button>Create Draft Room</button>

      <button>Join Draft Room</button>
    </main>
  );
}