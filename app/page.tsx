"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Tab = { id: number; title: string; content: string };

export default function HomePage() {
  // ---------------- state ----------------
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [componentType, setComponentType] = useState<"Interactive Tabs">(
    "Interactive Tabs"
  );

  // holds the last generated HTML for preview/copy
  const [previewHtml, setPreviewHtml] = useState<string>("");

  // protect saving until first load finishes
  const loaded = useRef(false);

  // ------------- LOAD once from localStorage -------------
  useEffect(() => {
    try {
      const savedTabs = localStorage.getItem("tabsData");
      const savedIdx = localStorage.getItem("tabsActiveIndex");

      if (savedTabs) {
        const parsed = JSON.parse(savedTabs) as Tab[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTabs(parsed);
          const idxNum = savedIdx ? Number(savedIdx) : 0;
          setActive(Math.min(Math.max(0, idxNum), parsed.length - 1));
          loaded.current = true;
          return;
        }
      }
    } catch (err) {
      console.error("Error loading localStorage:", err);
    }

    setTabs([{ id: 1, title: "Tab 1", content: "" }]);
    setActive(0);
    loaded.current = true;
  }, []);

  // ------------- SAVE on change -------------
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem("tabsData", JSON.stringify(tabs));
      localStorage.setItem("tabsActiveIndex", String(active));
    } catch (err) {
      console.error("Error saving localStorage:", err);
    }
  }, [tabs, active]);

  // ------------- actions -------------
  const addTab = () => {
    if (tabs.length >= 15) {
      alert("You can make up to 15 tabs only.");
      return;
    }
    const nextId = (tabs.at(-1)?.id ?? 0) + 1;
    const next = [
      ...tabs,
      { id: nextId, title: `Tab ${tabs.length + 1}`, content: "" },
    ];
    setTabs(next);
    setActive(next.length - 1);
  };

  const removeActive = () => {
    if (tabs.length <= 1) {
      alert("Keep at least one tab.");
      return;
    }
    const next = tabs.filter((_, i) => i !== active);
    setTabs(next);
    setActive(Math.max(0, active - 1));
  };

  const updateTitle = (i: number, v: string) => {
    const next = [...tabs];
    next[i] = { ...next[i], title: v };
    setTabs(next);
  };

  const updateContent = (i: number, v: string) => {
    const next = [...tabs];
    next[i] = { ...next[i], content: v };
    setTabs(next);
  };

  // ------------- generator (inline-only HTML) -------------
  const generatedHtml = useMemo(() => {
    const data = JSON.stringify(tabs.map(t => ({ title: t.title, content: t.content })));

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Tabs Output</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:20px;font-family:system-ui,Arial,Helvetica,sans-serif;background:#ffffff;color:#111111;">
  <h1 style="margin:0 0 12px 0;font-size:24px;">Tabs Output</h1>
  <div id="tabsRoot"></div>

  <script>
  (function(){
    const data = ${data};

    const el = (tag, styles = {}, text = "") => {
      const n = document.createElement(tag);
      for (const k in styles) n.style[k] = styles[k];
      if (text) n.textContent = text;
      return n;
    };

    const root = document.getElementById("tabsRoot");
    const wrap = el("div", { display: "flex", flexDirection: "column", gap: "12px" });
    const bar = el("div", { display: "flex", gap: "8px", flexWrap: "wrap" });
    const panels = el("div", {});

    let active = 0;

    const buttons = data.map((t, i) => {
      const b = el("button", {
        padding: "8px 12px",
        border: "1px solid #999",
        background: i === active ? "#111" : "#fff",
        color: i === active ? "#fff" : "#111",
        cursor: "pointer",
        borderRadius: "6px"
      }, t.title || ("Tab " + (i+1)));
      b.setAttribute("aria-selected", i === active ? "true" : "false");
      b.addEventListener("click", () => activate(i));
      return b;
    });

    const contents = data.map((t, i) => {
      const p = el("div", {
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        display: i === active ? "block" : "none",
        whiteSpace: "pre-wrap"
      });
      p.textContent = t.content || "";
      return p;
    });

    function activate(i){
      active = i;
      buttons.forEach((b, j) => {
        b.style.background = j === active ? "#111" : "#fff";
        b.style.color = j === active ? "#fff" : "#111";
        b.setAttribute("aria-selected", j === active ? "true" : "false");
      });
      contents.forEach((c, j) => c.style.display = j === active ? "block" : "none");
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") activate((active + 1) % buttons.length);
      if (e.key === "ArrowLeft")  activate((active - 1 + buttons.length) % buttons.length);
    });

    buttons.forEach(b => bar.appendChild(b));
    contents.forEach(c => panels.appendChild(c));
    wrap.appendChild(bar);
    wrap.appendChild(panels);
    root.appendChild(wrap);
  })();
  </script>
</body>
</html>`;
  }, [tabs]);

  const generateForPreview = () => {
    // could branch by componentType in future
    setPreviewHtml(generatedHtml);
  };

  const copyCode = async () => {
    const html = previewHtml || generatedHtml;
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
      alert("Copy failed. Scroll down to the 'Generated HTML' box and copy manually.");
    }
  };

  // ------------- render -------------
  return (
    <main style={{ display: "grid", gap: 20, maxWidth: 1000, margin: "0 auto" }}>
      {/* GENERATOR TOP */}
      <h1 style={{ margin: 0 }}>HTML Code Generator</h1>
      <p style={{ marginTop: -6 }}>
        Generate HTML5 + JavaScript code with inline CSS for interactive components like tabs.
      </p>

      {/* Component type (for rubric parity) */}
      <label style={{ display: "grid", gap: 6 }}>
        <span><strong>HTML Component Generator</strong></span>
        <div>
          <span style={{ marginRight: 8 }}>Select Component Type:&nbsp;</span>
          <select
            value={componentType}
            onChange={(e) => setComponentType(e.target.value as any)}
            style={{ padding: "6px 8px" }}
          >
            <option value="Interactive Tabs">Interactive Tabs</option>
          </select>
        </div>
      </label>

      {/* Controls: Add/remove/reset */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={addTab} style={{ padding: "8px 12px", border: "1px solid #333", cursor: "pointer", borderRadius: 6 }}>
          + Add Tab
        </button>
        <button onClick={removeActive} style={{ padding: "8px 12px", border: "1px solid #333", cursor: "pointer", borderRadius: 6 }}>
          − Remove Current
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("tabsData");
            localStorage.removeItem("tabsActiveIndex");
            window.location.reload();
          }}
          style={{ padding: "8px 12px", border: "1px solid #999", cursor: "pointer", borderRadius: 6 }}
        >
          Reset Tabs
        </button>
      </div>

      {/* Tab pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setActive(i)}
            style={{
              padding: "6px 10px",
              border: "1px solid #999",
              background: i === active ? "#111" : "#fff",
              color: i === active ? "#fff" : "#111",
              cursor: "pointer",
              borderRadius: 6
            }}
            aria-selected={i === active}
          >
            {t.title || `Tab ${i + 1}`}
          </button>
        ))}
      </div>

      {/* Editor for active tab */}
      {tabs[active] && (
        <section style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Tab Title</span>
            <input
              value={tabs[active].title}
              onChange={(e) => updateTitle(active, e.target.value)}
              style={{ padding: "8px", border: "1px solid #ccc", borderRadius: 6 }}
              placeholder="Enter tab title"
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Tab Content</span>
            <textarea
              value={tabs[active].content}
              onChange={(e) => updateContent(active, e.target.value)}
              rows={6}
              style={{ padding: "8px", border: "1px solid #ccc", borderRadius: 6, whiteSpace: "pre-wrap" }}
              placeholder="Write the tab content…"
            />
          </label>
        </section>
      )}

      {/* GENERATE + COPY */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={generateForPreview}
          style={{ padding: "8px 12px", border: "1px solid #333", cursor: "pointer", borderRadius: 6 }}
        >
          Generate HTML Code
        </button>
        <button
          onClick={copyCode}
          style={{ padding: "8px 12px", border: "1px solid #333", cursor: "pointer", borderRadius: 6 }}
        >
          Copy Code
        </button>
        {copied && <span>✅ Copied!</span>}
      </div>

      {/* LIVE PREVIEW */}
      <section>
        <h2 style={{ marginBottom: 8 }}>Live Preview:</h2>
        <div style={{ border: "1px solid #ddd", borderRadius: 6, overflow: "hidden" }}>
          <iframe
            title="preview"
            srcDoc={previewHtml || "<div style='padding:16px;font-family:system-ui'>Click <b>Generate HTML Code</b> to preview here.</div>"}
            style={{ width: "100%", minHeight: 360, border: "0" }}
          />
        </div>
      </section>

      {/* Optional: Show generated HTML (manual copy fallback) */}
      {previewHtml && (
        <section style={{ display: "grid", gap: 8 }}>
          <h3>Generated HTML</h3>
          <textarea
            readOnly
            value={previewHtml}
            rows={14}
            style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6, fontFamily: "monospace" }}
          />
        </section>
      )}

      {/* Instructions section (to match rubric and your friend’s page) */}
      <section>
        <h2>How to Use Generated Code:</h2>
        <ol style={{ lineHeight: 1.6 }}>
          <li>Configure your tabs using the options above.</li>
          <li>Click <strong>Generate HTML Code</strong> to create the code.</li>
          <li>Copy the generated code using the <strong>Copy Code</strong> button.</li>
          <li>Paste into a new file (e.g., <code>Hello.html</code>).</li>
          <li>Open the file in any web browser to see your component.</li>
          <li>Upload to MOODLE LMS as needed.</li>
        </ol>

        <h3>Interactive Components</h3>
        <p>Generate tabs and similar interactive UI with inline CSS/JS—no frameworks required.</p>

        <h3>Copy &amp; Paste Ready</h3>
        <p>Generated code includes inline CSS and JavaScript. Just paste into a single HTML file.</p>

        <h3>LMS Compatible</h3>
        <p>All generated code is optimized for LMS deployments where external files aren’t allowed.</p>
      </section>

      {/* Generator footer (separate from your site footer) */}
      <section
        aria-label="generator footer"
        style={{
          borderTop: "1px solid #eee",
          paddingTop: 12,
          color: "#555",
          fontSize: 14,
          display: "grid",
          gap: 6,
        }}
      >
        
      </section>
    </main>
  );
}
