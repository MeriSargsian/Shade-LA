// src/components/Solutions.jsx
import React, { useMemo, useState } from "react";
import solutions from "../data/Solutions.json";

const TABLE_COLUMNS = [
  { key: "name", label: "Name", type: "text" },
  { key: "shadeCategory", label: "Shade Category", type: "text" },
  { key: "primaryMaterial", label: "Primary Material", type: "text" },
  { key: "techIntegration", label: "Tech Integration", type: "text" },
  { key: "idealPlacementTitle", label: "Ideal Placement", type: "text" },
];

// Filters requirements:
// - Keep all dropdown selects (shadeCategory, primaryMaterial, techIntegration)
// - Add dropdown select for Placement.Title (call it "Ideal Placement")
// - Delete filters for ID, Name, Ideal Placement (Description)
const FILTER_FIELDS = [
  { key: "shadeCategory", label: "Shade Category" },
  { key: "primaryMaterial", label: "Primary Material" },
  { key: "techIntegration", label: "Tech Integration" },
  { key: "idealPlacementTitle", label: "Ideal Placement" },
];

function toText(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}

export default function Solutions() {
  // Flatten nested idealPlacement into simple fields for table + filtering
  const rows = useMemo(() => {
    return (solutions ?? []).map((s) => ({
      ...s,
      idealPlacementTitle: s.idealPlacement?.title ?? "",
      idealPlacementDescription: s.idealPlacement?.description ?? "",
    }));
  }, []);

  // Dropdown options for each filter field
  const selectOptions = useMemo(() => {
    const opts = {};
    for (const field of FILTER_FIELDS) {
      const set = new Set(
        rows.map((r) => toText(r[field.key]).trim()).filter(Boolean)
      );
      opts[field.key] = Array.from(set).sort((a, b) => a.localeCompare(b));
    }
    return opts;
  }, [rows]);

  const [globalQuery, setGlobalQuery] = useState("");
  const [selectFilters, setSelectFilters] = useState(() => {
    const init = {};
    for (const f of FILTER_FIELDS) init[f.key] = ""; // "" = All
    return init;
  });

  const filteredRows = useMemo(() => {
    const gq = globalQuery.trim().toLowerCase();

    return rows.filter((r) => {
      // Global search across all non-photo columns (including ID/Name/Description)
      if (gq) {
        const hit = TABLE_COLUMNS.some((col) => {
          if (col.type === "photo") return false;
          return toText(r[col.key]).toLowerCase().includes(gq);
        });
        if (!hit) return false;
      }

      // Dropdown filters only
      for (const f of FILTER_FIELDS) {
        const selected = toText(selectFilters[f.key]).trim();
        if (!selected) continue; // All
        if (toText(r[f.key]).trim() !== selected) return false;
      }

      return true;
    });
  }, [rows, globalQuery, selectFilters]);

  const clearAll = () => {
    setGlobalQuery("");
    setSelectFilters(() => {
      const init = {};
      for (const f of FILTER_FIELDS) init[f.key] = "";
      return init;
    });
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Top controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ fontWeight: 600 }}>Search:</label>
          <input
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            placeholder="Search all fields..."
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              minWidth: 260,
              background: "transparent",
              color: "inherit",
            }}
          />
        </div>

        <button
          onClick={clearAll}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          Clear
        </button>

        <div style={{ opacity: 0.85 }}>
          Showing <b>{filteredRows.length}</b> of <b>{rows.length}</b>
        </div>
      </div>

      {/* Dropdown filters */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 10,
          marginBottom: 12,
        }}
      >
        {FILTER_FIELDS.map((f) => (
          <div key={f.key} style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>
              {f.label}
            </span>

           <select
              className="custom-select"
              value={selectFilters[f.key]}
              onChange={(e) =>
                setSelectFilters((prev) => ({ ...prev, [f.key]: e.target.value }))
              }
            >
              <option value="">All</option>
              {(selectOptions[f.key] ?? []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

          </div>
        ))}
      </div>

      {/* Scrollable table */}
      <div
        style={{
          maxHeight: 220,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.3) transparent",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    position: "sticky",
                    top: 0,
                    background: "rgba(0,0,0,0.25)",
                    backdropFilter: "blur(6px)",
                    borderBottom: "1px solid rgba(255,255,255,0.15)",
                    whiteSpace: "nowrap",
                    zIndex: 1,
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={TABLE_COLUMNS.length} style={{ padding: 14, opacity: 0.75 }}>
                  No results. Try clearing filters.
                </td>
              </tr>
            ) : (
              filteredRows.map((r) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {TABLE_COLUMNS.map((col) => {
                    return (
                      <td key={col.key} style={{ padding: "10px 12px" }}>
                        {toText(r[col.key])}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}