import { useState, useEffect } from "react";

const C = {
  bg: "#f7f4ef",
  card: "#ffffff",
  border: "#e8e0d5",
  green: "#7a9e7e",
  greenLight: "#eef4ee",
  greenBorder: "#c5dbc6",
  text: "#3d3530",
  sub: "#8c7d72",
  danger: "#c0392b",
  dangerBg: "#fdf0ef",
};

const ITEM_HINTS = {
  "間口": { short: "大型家具が搬入できるか確認", detail: "冷蔵庫・洗濯機・ソファの搬入経路になります。間口だけでなく、廊下幅・天井高も忘れずに測りましょう。" },
  "掃き出し窓（幅×高さ）": { short: "カーテン選びに必要なサイズを確認", detail: "カーテンレールの高さ・幅も測るとサイズ選びがスムーズです。エアコンや家具との位置関係も確認しましょう。" },
  "リビング（幅×奥行×高さ）": { short: "家具を置いても通れるか確認", detail: "ダイニングテーブルやソファを置いた後の動線も考えましょう。テーブル周囲は60cm以上あると使いやすいです。" },
  "洗濯機置場（幅×奥行×高さ）": { short: "洗濯機が入るか確認", detail: "幅・奥行だけでなく、高さや蛇口・防水パンの位置も確認しましょう。ドラム式は奥行が大きい機種もあります。" },
};

const ROOM_HINTS = {
  "主寝室": {
    "部屋（幅×奥行×高さ）": { short: "ベッドを置いても通れるか確認", detail: "ベッドサイズだけでなく、両側や足元の通路も確保できるか確認しましょう。" },
    "窓（幅×高さ）": { short: "カーテン選びに必要なサイズを確認", detail: "カーテンレールの高さ・幅も測るとサイズ選びがスムーズです。エアコンとの位置関係も確認しましょう。" },
  },
  "洋室": {
    "部屋（幅×奥行×高さ）": { short: "ベッドや机が置けるか確認", detail: "ベッド・学習机・収納を置いた後も、通路が確保できるか確認しましょう。" },
    "窓（幅×高さ）": { short: "カーテン選びに必要なサイズを確認", detail: "カーテンレールの高さ・幅も測るとサイズ選びがスムーズです。エアコンとの位置関係も確認しましょう。" },
  },
};

function getHint(roomName, itemLabel) {
  if (ITEM_HINTS[itemLabel]) return ITEM_HINTS[itemLabel];
  const roomKey = ["洋室1","洋室2","洋室3"].includes(roomName) ? "洋室" : roomName;
  return ROOM_HINTS[roomKey]?.[itemLabel] || null;
}

const TEMPLATES = {
  mansion: {
    label: "マンション（1階建て）",
    rooms: [
      { id: 1, floor: 1, name: "玄関", items: [
        { id: 1, label: "間口", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "シューズクローク幅", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 2, floor: 1, name: "LDK", items: [
        { id: 1, label: "リビング（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "キッチン（幅×奥行）", w: "", h: "", d: "", memo: "", done: false },
        { id: 3, label: "TV壁幅", w: "", h: "", d: "", memo: "", done: false },
        { id: 4, label: "掃き出し窓（幅×高さ）", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 3, floor: 1, name: "洗面所", items: [
        { id: 1, label: "洗濯機置場（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 4, floor: 1, name: "主寝室", items: [
        { id: 1, label: "部屋（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "窓（幅×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 3, label: "クローゼット幅", w: "", h: "", d: "", memo: "", done: false },
      ]},
    ]
  },
  two_story: {
    label: "2階建て",
    rooms: [
      { id: 1, floor: 1, name: "玄関", items: [
        { id: 1, label: "間口", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "シューズクローク幅", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 2, floor: 1, name: "LDK", items: [
        { id: 1, label: "リビング（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "キッチン（幅×奥行）", w: "", h: "", d: "", memo: "", done: false },
        { id: 3, label: "TV壁幅", w: "", h: "", d: "", memo: "", done: false },
        { id: 4, label: "掃き出し窓（幅×高さ）", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 3, floor: 1, name: "洗面所", items: [
        { id: 1, label: "洗濯機置場（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 4, floor: 2, name: "主寝室", items: [
        { id: 1, label: "部屋（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "窓（幅×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 3, label: "クローゼット幅", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 5, floor: 2, name: "洋室1", items: [
        { id: 1, label: "部屋（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "窓（幅×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 3, label: "クローゼット幅", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 6, floor: 2, name: "洋室2", items: [
        { id: 1, label: "部屋（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "窓（幅×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 3, label: "クローゼット幅", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 7, floor: 2, name: "洋室3", items: [
        { id: 1, label: "部屋（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "窓（幅×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 3, label: "クローゼット幅", w: "", h: "", d: "", memo: "", done: false },
      ]},
    ]
  },
  three_story: {
    label: "3階建て",
    rooms: [
      { id: 1, floor: 1, name: "玄関", items: [
        { id: 1, label: "間口", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "シューズクローク幅", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 2, floor: 1, name: "洗面所", items: [
        { id: 1, label: "洗濯機置場（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 3, floor: 2, name: "LDK", items: [
        { id: 1, label: "リビング（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "キッチン（幅×奥行）", w: "", h: "", d: "", memo: "", done: false },
        { id: 3, label: "TV壁幅", w: "", h: "", d: "", memo: "", done: false },
        { id: 4, label: "掃き出し窓（幅×高さ）", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 4, floor: 3, name: "洋室1", items: [
        { id: 1, label: "部屋（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "窓（幅×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 3, label: "クローゼット幅", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 5, floor: 3, name: "洋室2", items: [
        { id: 1, label: "部屋（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "窓（幅×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 3, label: "クローゼット幅", w: "", h: "", d: "", memo: "", done: false },
      ]},
      { id: 6, floor: 3, name: "洋室3", items: [
        { id: 1, label: "部屋（幅×奥行×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 2, label: "窓（幅×高さ）", w: "", h: "", d: "", memo: "", done: false },
        { id: 3, label: "クローゼット幅", w: "", h: "", d: "", memo: "", done: false },
      ]},
    ]
  },
};

const FLOOR_LABELS = { 1: "1階", 2: "2階", 3: "3階" };
const STORAGE_KEY = "nairan_navi_data";

function getRoomStatus(room) {
  const total = room.items.length;
  if (total === 0) return "未着手";
  const done = room.items.filter(i => i.done).length;
  if (done === 0) return "未着手";
  if (done === total) return "完了";
  return "進行中";
}

function StatusBadge({ status }) {
  const styles = {
    未着手: { background: "#f0ece6", color: C.sub },
    進行中: { background: "#fef6e4", color: "#8a6d20" },
    完了: { background: C.greenLight, color: "#3d6b41" },
  };
  return <span style={{ ...styles[status], padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{status}</span>;
}

function getItemFields(label) {
  if (label.includes("幅×奥行×高さ")) return ["幅", "奥行", "高さ"];
  if (label.includes("幅×奥行")) return ["幅", "奥行"];
  if (label.includes("幅×高さ")) return ["幅", "高さ"];
  return ["幅"];
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function HintAccordion({ hint }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 8, borderRadius: 8, border: `1px solid ${C.greenBorder}`, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", textAlign: "left", background: C.greenLight, border: "none", padding: "8px 12px", fontSize: 12, color: "#3d6b41", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{hint.short}</span>
        <span style={{ fontSize: 11, marginLeft: 8, flexShrink: 0, color: C.green }}>{open ? "閉じる" : "詳細を見る"}</span>
      </button>
      {open && (
        <div style={{ background: C.greenLight, padding: "6px 12px 12px", fontSize: 12, color: "#3d6b41", lineHeight: 1.7, borderTop: `1px solid ${C.greenBorder}` }}>
          {hint.detail}
        </div>
      )}
    </div>
  );
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.rooms || parsed.rooms.length === 0) return null;
    return parsed;
  } catch { return null; }
}

export default function App() {
  const saved = loadSaved();
  const [screen, setScreen] = useState("top");
  const [rooms, setRooms] = useState(saved ? saved.rooms : []);
  const [skipList, setSkipList] = useState(saved ? saved.skipList || [] : []);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomFloor, setNewRoomFloor] = useState(1);
  const [editingRoom, setEditingRoom] = useState(null);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [skipConfirm, setSkipConfirm] = useState(false);
  const [exportText, setExportText] = useState(null);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    try {
      if (rooms.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ rooms, skipList }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, [rooms, skipList]);

  const currentRoom = rooms.find(r => r.id === currentRoomId);
  const floors = [...new Set(rooms.map(r => r.floor))].sort();
  const totalItems = rooms.reduce((s, r) => s + r.items.length, 0);
  const doneItems = rooms.reduce((s, r) => s + r.items.filter(i => i.done).length, 0);
  const doneRooms = rooms.filter(r => getRoomStatus(r) === "完了").length;
  const progress = totalItems > 0 ? Math.round(doneItems / totalItems * 100) : 0;
  const hasSetup = rooms.length > 0;

  function selectTemplate(key) { setRooms(deepClone(TEMPLATES[key].rooms)); setScreen("setup"); }
  function addRoom() {
    if (!newRoomName.trim()) return;
    setRooms(prev => [...prev, { id: Date.now(), floor: newRoomFloor, name: newRoomName.trim(), items: [] }]);
    setNewRoomName("");
  }
  function deleteRoom(id) { setRooms(prev => prev.filter(r => r.id !== id)); if (editingRoom === id) setEditingRoom(null); }
  function addItem(roomId) {
    if (!newItemLabel.trim()) return;
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, items: [...r.items, { id: Date.now(), label: newItemLabel.trim(), w: "", h: "", d: "", memo: "", done: false }] } : r));
    setNewItemLabel("");
  }
  function deleteItem(roomId, itemId) { setRooms(prev => prev.map(r => r.id === roomId ? { ...r, items: r.items.filter(i => i.id !== itemId) } : r)); }
  function updateItem(roomId, itemId, field, val) {
    setRooms(prev => prev.map(r => r.id === roomId ? {
      ...r, items: r.items.map(i => {
        if (i.id !== itemId) return i;
        const updated = { ...i, [field]: val };
        if (val.trim()) updated.done = true;
        return updated;
      })
    } : r));
  }
  function toggleDone(roomId, itemId) { setRooms(prev => prev.map(r => r.id === roomId ? { ...r, items: r.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i) } : r)); }
  function goToRoom(id) { setCurrentRoomId(id); setShowRoomPicker(false); setSkipConfirm(false); setScreen("measure"); }
  function handleSkip() {
    setSkipList(prev => [...new Set([...prev, currentRoomId])]);
    const idx = rooms.findIndex(r => r.id === currentRoomId);
    if (idx < rooms.length - 1) setCurrentRoomId(rooms[idx + 1].id); else setScreen("done");
    setSkipConfirm(false);
  }
  function handleNext() {
    const idx = rooms.findIndex(r => r.id === currentRoomId);
    if (idx < rooms.length - 1) setCurrentRoomId(rooms[idx + 1].id); else setScreen("done");
  }
  function resetAll() { setRooms([]); setSkipList([]); setCurrentRoomId(null); setScreen("top"); try { localStorage.removeItem(STORAGE_KEY); } catch {} }
  function saveSetup() {
    setSaveToast(true);
    setTimeout(() => { setSaveToast(false); setScreen("top"); }, 1200);
  }

  const s = {
    wrap: { maxWidth: 480, margin: "0 auto", fontFamily: "-apple-system, BlinkMacSystemFont, 'Hiragino Kaku Gothic ProN', sans-serif", fontSize: 15, color: C.text, background: C.bg, minHeight: "100vh", padding: "0 0 80px" },
    header: { background: C.green, color: "#fff", padding: "14px 16px", fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "space-between" },
    section: { padding: "16px" },
    card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" },
    cardHead: { padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}` },
    btn: { background: C.green, color: "#fff", border: "none", borderRadius: 10, padding: "14px 0", width: "100%", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 },
    btnOutline: { background: "#fff", color: C.green, border: `2px solid ${C.green}`, borderRadius: 10, padding: "13px 0", width: "100%", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 },
    btnGray: { background: "#ece8e3", color: C.sub, border: "none", borderRadius: 10, padding: "13px 0", width: "100%", fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 10 },
    btnSmall: { background: C.greenLight, color: "#3d6b41", border: `1px solid ${C.greenBorder}`, borderRadius: 6, padding: "5px 10px", fontSize: 13, cursor: "pointer" },
    btnDanger: { background: C.dangerBg, color: C.danger, border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 13, cursor: "pointer" },
    input: { border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 12px", fontSize: 15, width: "100%", boxSizing: "border-box", background: "#fff" },
    inputNum: { border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 6px", fontSize: 15, width: "72px", boxSizing: "border-box", textAlign: "center", background: "#fff" },
    label: { fontSize: 12, color: C.sub, marginBottom: 4, display: "block" },
    progressBar: { height: 8, background: C.border, borderRadius: 4, overflow: "hidden", margin: "6px 0" },
    floorLabel: { fontSize: 12, fontWeight: 700, color: C.sub, letterSpacing: 1, padding: "10px 16px 4px" },
    overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" },
    sheet: { background: "#fff", borderRadius: "20px 20px 0 0", padding: 20, width: "100%", maxWidth: 480, maxHeight: "70vh", overflowY: "auto" },
  };

  // ===== TOP =====
  if (screen === "top") return (
    <div style={s.wrap}>
      <div style={{ background: C.green, padding: "40px 20px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: 1, marginBottom: 6 }}>
          内覧会ナビ
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>建売購入者のための採寸サポートアプリ</div>
      </div>

      <div style={{ ...s.section, paddingTop: 32 }}>
        <div style={{ ...s.card, padding: "20px 20px 8px", marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>事前設定</div>
          <div style={{ fontSize: 13, color: C.sub, marginBottom: 16, lineHeight: 1.6 }}>
            間取りテンプレートをもとに、測る部屋と項目を内覧会前にカスタマイズしておきましょう。
          </div>
          {hasSetup && (
            <div style={{ background: C.greenLight, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#3d6b41", marginBottom: 12 }}>
              設定済み：{rooms.length}部屋 / {totalItems}項目
            </div>
          )}
          <button onClick={() => setScreen("template")} style={s.btn}>
            {hasSetup ? "設定を変更する" : "設定をはじめる"}
          </button>
        </div>

        <div style={{ ...s.card, padding: "20px 20px 8px" }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>内覧会当日</div>
          <div style={{ fontSize: 13, color: C.sub, marginBottom: 16, lineHeight: 1.6 }}>
            事前設定した部屋リストをもとに、当日の採寸を記録します。
          </div>
          {!hasSetup && (
            <div style={{ background: "#fef6e4", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#8a6d20", marginBottom: 12 }}>
              先に事前設定を完了してください
            </div>
          )}
          <button onClick={() => { if (hasSetup) { setCurrentRoomId(rooms[0]?.id); setScreen("list"); } }}
            style={{ ...s.btn, background: hasSetup ? C.green : "#c8c0b8", cursor: hasSetup ? "pointer" : "not-allowed" }}>
            採寸をはじめる
          </button>
        </div>
      </div>
    </div>
  );

  // ===== TEMPLATE =====
  if (screen === "template") return (
    <div style={s.wrap}>
      <div style={s.header}>
        <button onClick={() => setScreen("top")} style={{ background: "transparent", color: "#fff", border: "none", fontSize: 15, cursor: "pointer", padding: 0 }}>← 戻る</button>
        <span>テンプレート選択</span>
        <span />
      </div>
      <div style={s.section}>
        <p style={{ color: C.sub, fontSize: 13, margin: "0 0 16px", lineHeight: 1.6 }}>間取りに合ったテンプレートを選んでください。選択後にカスタマイズできます。</p>
        {Object.entries(TEMPLATES).map(([key, tpl]) => (
          <button key={key} onClick={() => selectTemplate(key)}
            style={{ width: "100%", border: `1px solid ${C.border}`, background: C.card, cursor: "pointer", padding: "16px", textAlign: "left", marginBottom: 10, display: "block", borderRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: C.text }}>{tpl.label}</div>
            <div style={{ fontSize: 13, color: C.sub }}>{tpl.rooms.length}部屋 / {tpl.rooms.reduce((s, r) => s + r.items.length, 0)}項目</div>
          </button>
        ))}
      </div>
    </div>
  );

  // ===== SETUP =====
  if (screen === "setup") return (
    <div style={s.wrap}>
      <div style={s.header}>
        <button onClick={() => setScreen("template")} style={{ background: "transparent", color: "#fff", border: "none", fontSize: 15, cursor: "pointer", padding: 0 }}>← 戻る</button>
        <span>部屋の設定</span>
        <button onClick={saveSetup} style={{ background: "#fff", color: C.green, border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>保存</button>
      </div>
      {saveToast && (
        <div style={{ position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", background: C.green, color: "#fff", padding: "10px 24px", borderRadius: 20, fontSize: 14, fontWeight: 600, zIndex: 200 }}>
          保存しました
        </div>
      )}
      <div style={s.section}>
        <p style={{ color: C.sub, fontSize: 13, margin: "0 0 12px", lineHeight: 1.6 }}>部屋の追加・削除や採寸項目の編集ができます。</p>
        <div style={{ ...s.card, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>部屋を追加</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <select value={newRoomFloor} onChange={e => setNewRoomFloor(Number(e.target.value))} style={{ ...s.input, width: 80 }}>
              {[1,2,3].map(f => <option key={f} value={f}>{f}階</option>)}
            </select>
            <input value={newRoomName} onChange={e => setNewRoomName(e.target.value)} placeholder="部屋名（例：書斎）"
              style={{ ...s.input, flex: 1 }} onKeyDown={e => e.key === "Enter" && addRoom()} />
          </div>
          <button onClick={addRoom} style={s.btn}>追加する</button>
        </div>
        {floors.map(floor => (
          <div key={floor}>
            <div style={s.floorLabel}>{FLOOR_LABELS[floor] || floor + "階"}</div>
            {rooms.filter(r => r.floor === floor).map(room => (
              <div key={room.id} style={s.card}>
                <div style={s.cardHead}>
                  <span style={{ fontWeight: 600 }}>{room.name}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setEditingRoom(editingRoom === room.id ? null : room.id)} style={s.btnSmall}>{editingRoom === room.id ? "閉じる" : "項目編集"}</button>
                    <button onClick={() => deleteRoom(room.id)} style={s.btnDanger}>削除</button>
                  </div>
                </div>
                {editingRoom === room.id && (
                  <div style={{ padding: 12 }}>
                    {room.items.map(item => (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 14 }}>{item.label}</span>
                        <button onClick={() => deleteItem(room.id, item.id)} style={s.btnDanger}>削除</button>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <input value={newItemLabel} onChange={e => setNewItemLabel(e.target.value)} placeholder="項目名"
                        style={{ ...s.input, flex: 1 }} onKeyDown={e => e.key === "Enter" && addItem(room.id)} />
                      <button onClick={() => addItem(room.id)} style={{ ...s.btn, width: "auto", padding: "10px 14px", marginBottom: 0 }}>追加</button>
                    </div>
                  </div>
                )}
                {editingRoom !== room.id && <div style={{ padding: "8px 14px", fontSize: 13, color: C.sub }}>採寸項目 {room.items.length}件</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  // ===== LIST =====
  if (screen === "list") return (
    <div style={s.wrap}>
      <div style={s.header}>
        <button onClick={() => setScreen("top")} style={{ background: "transparent", color: "#fff", border: "none", fontSize: 15, cursor: "pointer", padding: 0 }}>← トップ</button>
        <span>部屋一覧</span>
        <span />
      </div>
      <div style={s.section}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.sub, marginBottom: 4 }}>
            <span>{doneRooms}/{rooms.length} 部屋完了</span>
            <span>{doneItems}/{totalItems} 項目 ({progress}%)</span>
          </div>
          <div style={s.progressBar}><div style={{ height: "100%", width: progress + "%", background: C.green, borderRadius: 4, transition: "width 0.3s" }} /></div>
        </div>
        {floors.map(floor => (
          <div key={floor}>
            <div style={s.floorLabel}>{FLOOR_LABELS[floor] || floor + "階"}</div>
            {rooms.filter(r => r.floor === floor).map(room => {
              const st = getRoomStatus(room);
              const done = room.items.filter(i => i.done).length;
              return (
                <div key={room.id} style={{ ...s.card, opacity: st === "完了" ? 0.6 : 1 }}>
                  <button onClick={() => goToRoom(room.id)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <div style={{ ...s.cardHead, borderBottom: "none", padding: "14px 16px" }}>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontWeight: 600, marginBottom: 3 }}>{room.name}</div>
                        <div style={{ fontSize: 13, color: C.sub }}>{done}/{room.items.length} 項目</div>
                      </div>
                      <StatusBadge status={st} />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ marginTop: 8 }}><button onClick={() => setScreen("done")} style={s.btnOutline}>完了サマリーを見る</button></div>
      </div>
    </div>
  );

  // ===== MEASURE =====
  if (screen === "measure" && currentRoom) {
    const roomIdx = rooms.findIndex(r => r.id === currentRoomId);
    const isLast = roomIdx === rooms.length - 1;
    return (
      <div style={s.wrap}>
        <div style={s.header}>
          <button onClick={() => setScreen("list")} style={{ background: "transparent", color: "#fff", border: "none", fontSize: 15, cursor: "pointer", padding: 0 }}>← 一覧</button>
          <span>{currentRoom.floor}階 / {currentRoom.name}</span>
          <span style={{ fontSize: 13 }}>{roomIdx + 1}/{rooms.length}</span>
        </div>
        <div style={{ height: 5, background: C.border }}><div style={{ height: "100%", width: progress + "%", background: C.green, transition: "width 0.3s" }} /></div>
        <div style={s.section}>
          {currentRoom.items.map(item => {
            const fields = getItemFields(item.label);
            const hint = getHint(currentRoom.name, item.label);
            return (
              <div key={item.id} style={{ ...s.card, marginBottom: 10 }}>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <button onClick={() => toggleDone(currentRoomId, item.id)}
                      style={{ width: 26, height: 26, borderRadius: 6, border: `2px solid ${item.done ? C.green : C.border}`, background: item.done ? C.green : "#fff", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.done && <span style={{ color: "#fff", fontSize: 14, lineHeight: 1 }}>✓</span>}
                    </button>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{item.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 10, flexWrap: "wrap" }}>
                    {fields.includes("幅") && <div><div style={s.label}>幅 (cm)</div><input inputMode="decimal" value={item.w} onChange={e => updateItem(currentRoomId, item.id, "w", e.target.value)} style={s.inputNum} placeholder="—" /></div>}
                    {fields.includes("奥行") && <div><div style={s.label}>奥行 (cm)</div><input inputMode="decimal" value={item.d} onChange={e => updateItem(currentRoomId, item.id, "d", e.target.value)} style={s.inputNum} placeholder="—" /></div>}
                    {fields.includes("高さ") && <div><div style={s.label}>高さ (cm)</div><input inputMode="decimal" value={item.h} onChange={e => updateItem(currentRoomId, item.id, "h", e.target.value)} style={s.inputNum} placeholder="—" /></div>}
                  </div>
                  <input value={item.memo} onChange={e => updateItem(currentRoomId, item.id, "memo", e.target.value)} placeholder="メモ（任意）" style={s.input} />
                  {hint && <HintAccordion hint={hint} />}
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 16 }}>
            <button onClick={handleNext} style={s.btn}>{isLast ? "完了" : "次の部屋へ"}</button>
            <button onClick={() => setShowRoomPicker(true)} style={s.btnOutline}>部屋を選んで移動</button>
            <button onClick={() => setSkipConfirm(true)} style={s.btnGray}>この部屋をスキップ</button>
          </div>
        </div>

        {skipConfirm && (
          <div style={s.overlay} onClick={() => setSkipConfirm(false)}>
            <div style={s.sheet} onClick={e => e.stopPropagation()}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>スキップしますか？</div>
              <div style={{ fontSize: 14, color: C.sub, marginBottom: 16, lineHeight: 1.6 }}>「{currentRoom.name}」をスキップして次へ進みます。後から戻ることができます。</div>
              <button onClick={handleSkip} style={s.btn}>スキップする</button>
              <button onClick={() => setSkipConfirm(false)} style={s.btnGray}>キャンセル</button>
            </div>
          </div>
        )}

        {showRoomPicker && (
          <div style={s.overlay} onClick={() => setShowRoomPicker(false)}>
            <div style={s.sheet} onClick={e => e.stopPropagation()}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>移動する部屋を選択</div>
              {floors.map(floor => (
                <div key={floor}>
                  <div style={{ fontSize: 12, color: C.sub, padding: "4px 0 2px", fontWeight: 700 }}>{FLOOR_LABELS[floor]}</div>
                  {rooms.filter(r => r.floor === floor).map(room => (
                    <button key={room.id} onClick={() => goToRoom(room.id)}
                      style={{ width: "100%", textAlign: "left", padding: "13px 10px", border: "none", borderBottom: `1px solid ${C.border}`, background: room.id === currentRoomId ? C.greenLight : "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: room.id === currentRoomId ? 700 : 400, color: C.text }}>{room.name}</span>
                      <StatusBadge status={getRoomStatus(room)} />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===== DONE =====
  if (screen === "done") return (
    <div style={s.wrap}>
      <div style={s.header}>
        <button onClick={() => setScreen("list")} style={{ background: "transparent", color: "#fff", border: "none", fontSize: 15, cursor: "pointer", padding: 0 }}>← 一覧</button>
        <span>採寸完了</span>
        <span />
      </div>
      <div style={s.section}>
        <div style={{ textAlign: "center", padding: "28px 0 20px" }}>
          <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, color: C.text }}>お疲れさまでした</div>
          <div style={{ color: C.sub, fontSize: 14 }}>内覧会の採寸が終わりました</div>
        </div>
        <div style={{ ...s.card, padding: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[["採寸部屋数", `${doneRooms} / ${rooms.length}`], ["採寸項目数", `${doneItems} / ${totalItems}`], ["スキップ数", skipList.length], ["達成率", progress + "%"]].map(([k, v]) => (
              <div key={k} style={{ textAlign: "center", background: C.bg, borderRadius: 10, padding: "12px 0" }}>
                <div style={{ fontSize: 12, color: C.sub, marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {skipList.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 8 }}>スキップした部屋</div>
            {skipList.map(id => { const r = rooms.find(x => x.id === id); return r ? <button key={id} onClick={() => goToRoom(id)} style={{ ...s.btnOutline, marginBottom: 6 }}>{r.name} を入力する</button> : null; })}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <button onClick={() => {
            const lines = [];
            floors.forEach(floor => {
              lines.push(`=== ${FLOOR_LABELS[floor] || floor + "階"} ===`);
              rooms.filter(r => r.floor === floor).forEach(room => {
                lines.push(`\n【${room.name}】`);
                room.items.forEach(item => {
                  const fields = getItemFields(item.label);
                  const parts = [];
                  if (fields.includes("幅") && item.w) parts.push(`幅${item.w}cm`);
                  if (fields.includes("奥行") && item.d) parts.push(`奥行${item.d}cm`);
                  if (fields.includes("高さ") && item.h) parts.push(`高さ${item.h}cm`);
                  const val = parts.length > 0 ? parts.join(" × ") : "未入力";
                  const memo = item.memo ? `　備考：${item.memo}` : "";
                  lines.push(`${item.label}：${val}${memo}`);
                });
              });
              lines.push("");
            });
            const text = lines.join("\n");
            setExportText(text);
            if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).catch(() => {});
          }} style={s.btn}>採寸データを表示・コピー</button>
          <button onClick={() => setScreen("top")} style={s.btnOutline}>トップに戻る</button>
          <button onClick={resetAll} style={s.btnGray}>最初からやり直す</button>
        </div>

        {exportText !== null && (
          <div style={s.overlay} onClick={() => setExportText(null)}>
            <div style={s.sheet} onClick={e => e.stopPropagation()}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>採寸データ</div>
              <div style={{ fontSize: 12, color: C.sub, marginBottom: 10 }}>下のテキストを長押しして全選択 → コピーしてください</div>
              <textarea readOnly value={exportText} onClick={e => e.target.select()}
                style={{ width: "100%", height: 240, fontSize: 13, fontFamily: "monospace", border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, boxSizing: "border-box", marginBottom: 12 }} />
              <button onClick={() => setExportText(null)} style={s.btnGray}>閉じる</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return null;
}