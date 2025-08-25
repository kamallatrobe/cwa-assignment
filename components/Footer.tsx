
// header/footer tweak for feature branch
export default function Footer() {
  const today = new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY
  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: "1px solid #ddd",
        padding: "12px 16px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 12,
        fontSize: 14,
      }}
    >
      <span>© {new Date().getFullYear()} Kamalpreet Kaur</span>
      <span style={{ textAlign: "center" }}>Student No: 21459777</span>
      <span style={{ textAlign: "right" }}>{today}</span>
    </footer>
  );
}
