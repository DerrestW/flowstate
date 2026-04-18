"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const GRAD = "linear-gradient(90deg, #2196F3 0%, #FF6B2B 100%)";
const BLUE = "#2196F3";
const D: React.CSSProperties = { fontFamily:"'Barlow Condensed',sans-serif", fontStyle:"italic", fontWeight:900 };
const TAGS = ["All","Hero","Experiences","Cities","Team","Events","Rentals","Seasonal","Other"];

type MediaItem = { id:string; name:string; url:string; size:number; type:string; tag:string; added_at:string };

function fmtSize(b:number) { return b>1000000?`${(b/1000000).toFixed(1)} MB`:b>1000?`${Math.round(b/1000)} KB`:`${b} B`; }

export default function MediaAdmin() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("All");
  const [selected, setSelected] = useState<MediaItem|null>(null);
  const [copied, setCopied] = useState<string|null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [viewMode, setViewMode] = useState<"grid"|"list">("grid");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/media");
      const d = await r.json();
      setItems(Array.isArray(d) ? d : []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function uploadFile(file: File) {
    setUploadProgress(p => [...p, `Uploading ${file.name}...`]);
    try {
      // Read file as base64
      const base64 = await new Promise<string>(res => {
        const reader = new FileReader();
        reader.onload = e => res(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isUpload: true,
          base64,
          fileName: file.name,
          fileType: file.type,
          size: file.size,
          name: file.name,
          tag: "Other",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUploadProgress(p => p.map(x => x.includes(file.name) ? `✓ ${file.name} uploaded` : x));
        await load();
      } else {
        setUploadProgress(p => p.map(x => x.includes(file.name) ? `✗ ${file.name}: ${data.error}` : x));
      }
    } catch(e: any) {
      setUploadProgress(p => p.map(x => x.includes(file.name) ? `✗ ${file.name}: failed` : x));
    }
  }

  async function handleFiles(files: FileList) {
    setUploading(true);
    setUploadProgress([]);
    for (const f of Array.from(files)) {
      await uploadFile(f);
    }
    setUploading(false);
    setTimeout(() => setUploadProgress([]), 4000);
  }

  async function addByUrl() {
    if (!urlInput.trim()) return;
    const name = urlInput.split("/").pop()?.split("?")[0] || "image";
    const res = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url: urlInput.trim(), size: 0, type: "image/jpeg", tag: "Other" }),
    });
    if (res.ok) { await load(); setUrlInput(""); setShowUrl(false); }
  }

  async function copyUrl(url: string, id: string) {
    try { await navigator.clipboard.writeText(url); } catch {}
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  async function deleteItem(id: string, url: string) {
    if (!confirm("Delete this file?")) return;
    await fetch("/api/media", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id, url }) });
    setItems(p => p.filter(i => i.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  async function updateTag(id: string, tag: string) {
    await fetch("/api/media", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id, tag }) });
    setItems(p => p.map(i => i.id===id ? {...i, tag} : i));
    setSelected(p => p?.id===id ? {...p, tag} : p);
  }

  const filtered = items
    .filter(i => activeTag==="All" || i.tag===activeTag)
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  const inp: React.CSSProperties = { padding:"7px 12px", fontSize:12, borderRadius:8, border:"0.5px solid rgba(6,7,8,0.12)", background:"#fff", outline:"none", fontFamily:"inherit" };

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Barlow',sans-serif" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"1.5rem 2rem 1rem", background:"#F0EDE8", borderBottom:"0.5px solid rgba(6,7,8,0.08)", flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.875rem", flexWrap:"wrap", gap:8 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:BLUE, marginBottom:3 }}>Assets · Saves to Supabase Storage</div>
              <h1 style={{ ...D, fontSize:30, letterSpacing:1 }}>MEDIA LIBRARY</h1>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <button onClick={() => setViewMode(v=>v==="grid"?"list":"grid")} style={{ ...inp, cursor:"pointer" }}>{viewMode==="grid"?"☰ List":"⊞ Grid"}</button>
              <button onClick={() => setShowUrl(s=>!s)} style={{ fontSize:12, fontWeight:600, padding:"8px 16px", borderRadius:100, border:"0.5px solid rgba(6,7,8,0.2)", background:"#fff", cursor:"pointer", fontFamily:"inherit" }}>+ Add URL</button>
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ fontSize:12, fontWeight:700, padding:"8px 20px", borderRadius:100, background:uploading?"rgba(6,7,8,0.3)":"#04080F", color:"#F8F6F2", border:"none", cursor:uploading?"not-allowed":"pointer", fontFamily:"inherit" }}>
                {uploading ? "Uploading..." : "+ Upload File"}
              </button>
              <input ref={fileRef} type="file" multiple accept="image/*" style={{ display:"none" }} onChange={e=>{if(e.target.files)handleFiles(e.target.files);}}/>
            </div>
          </div>

          {/* URL input */}
          {showUrl && (
            <div style={{ display:"flex", gap:8, marginBottom:"0.75rem" }}>
              <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addByUrl()} placeholder="Paste any image URL (https://...)" style={{ ...inp, flex:1 }}/>
              <button onClick={addByUrl} style={{ fontSize:12, fontWeight:700, padding:"8px 16px", borderRadius:8, background:"#04080F", color:"#F8F6F2", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Save</button>
              <button onClick={()=>{setShowUrl(false);setUrlInput("");}} style={{ fontSize:12, padding:"8px 12px", borderRadius:8, border:"0.5px solid rgba(6,7,8,0.15)", background:"transparent", cursor:"pointer", fontFamily:"inherit" }}>✕</button>
            </div>
          )}

          {/* Upload progress */}
          {uploadProgress.length > 0 && (
            <div style={{ padding:"0.75rem", background:"#fff", borderRadius:8, marginBottom:"0.75rem", border:"0.5px solid rgba(6,7,8,0.1)" }}>
              {uploadProgress.map((msg,i) => (
                <div key={i} style={{ fontSize:12, color: msg.startsWith("✓")?"#1B5E20":msg.startsWith("✗")?"#B71C1C":"rgba(6,7,8,0.6)", marginBottom:2 }}>{msg}</div>
              ))}
            </div>
          )}

          {/* Search + tags */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search files..." style={{ ...inp, minWidth:150 }}/>
            {TAGS.map(t => (
              <button key={t} onClick={()=>setActiveTag(t)} style={{ fontSize:11, padding:"5px 12px", borderRadius:100, border:"0.5px solid", background:activeTag===t?"#04080F":"transparent", color:activeTag===t?"#F8F6F2":"rgba(6,7,8,0.5)", borderColor:activeTag===t?"#04080F":"rgba(6,7,8,0.2)", cursor:"pointer", fontFamily:"inherit" }}>{t}</button>
            ))}
          </div>
          <div style={{ fontSize:11, color:"rgba(6,7,8,0.4)", marginTop:8 }}>{filtered.length} files · Uploads persist to Supabase Storage</div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"1.5rem 2rem" }}
          onDragOver={e=>{e.preventDefault();setDragOver(true);}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={e=>{e.preventDefault();setDragOver(false);if(e.dataTransfer.files)handleFiles(e.dataTransfer.files);}}>

          {/* Drop zone */}
          <div onClick={()=>fileRef.current?.click()} style={{ border:`2px dashed ${dragOver?BLUE:"rgba(6,7,8,0.15)"}`, borderRadius:12, padding:"1.5rem", textAlign:"center", background:dragOver?"rgba(33,150,243,0.04)":"#fff", marginBottom:"1.5rem", cursor:"pointer", transition:"all 0.15s" }}>
            <div style={{ fontSize:24, marginBottom:6 }}>↑</div>
            <div style={{ fontSize:13, fontWeight:600, color:"rgba(6,7,8,0.6)" }}>{dragOver?"Drop to upload":"Drag & drop images or click to upload"}</div>
            <div style={{ fontSize:11, color:"rgba(6,7,8,0.35)", marginTop:3 }}>Files upload to Supabase Storage and persist permanently</div>
          </div>

          {/* Setup notice */}
          <div style={{ padding:"1rem 1.25rem", background:"#FFF8E1", border:"0.5px solid #FFD54F", borderRadius:10, marginBottom:"1.5rem" }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#E65100", marginBottom:4 }}>⚡ One-time Supabase Storage setup required</div>
            <div style={{ fontSize:12, color:"#BF360C", lineHeight:1.6 }}>
              In Supabase dashboard: <strong>Storage → New bucket → Name: "media" → Public: ON → Create</strong>.
              Then uploads will work and persist permanently. Without this, only URL-added images will save.
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:"3rem", color:"rgba(6,7,8,0.35)" }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"3rem", color:"rgba(6,7,8,0.35)", fontSize:14 }}>
              {items.length===0 ? "No media yet. Upload files or add a URL above." : "No results for this filter."}
            </div>
          ) : viewMode==="grid" ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"1rem" }}>
              {filtered.map(item => (
                <div key={item.id} onClick={()=>setSelected(s=>s?.id===item.id?null:item)} style={{ background:"#fff", borderRadius:12, border:`0.5px solid ${selected?.id===item.id?BLUE:"rgba(6,7,8,0.08)"}`, overflow:"hidden", cursor:"pointer", transition:"border-color 0.15s" }}>
                  <div style={{ height:115, background:"rgba(6,7,8,0.04)", overflow:"hidden", position:"relative" }}>
                    <img src={item.url} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23eee' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%23999' font-size='12'%3ENo preview%3C/text%3E%3C/svg%3E";}}/>
                  </div>
                  <div style={{ padding:"0.625rem" }}>
                    <div style={{ fontSize:10, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:4, color:"rgba(6,7,8,0.8)" }}>{item.name}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:100, background:"#E3F2FD", color:"#1565C0", fontWeight:700 }}>{item.tag}</span>
                      <span style={{ fontSize:9, color:"rgba(6,7,8,0.35)" }}>{fmtSize(item.size)}</span>
                    </div>
                    <button onClick={e=>{e.stopPropagation();copyUrl(item.url,item.id);}} style={{ width:"100%", fontSize:10, padding:"5px", borderRadius:6, border:"0.5px solid rgba(6,7,8,0.12)", background:copied===item.id?"#E3F2FD":"transparent", color:copied===item.id?"#1565C0":"rgba(6,7,8,0.5)", cursor:"pointer", fontFamily:"inherit", fontWeight:copied===item.id?700:400 }}>
                      {copied===item.id?"✓ Copied!":"Copy URL"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background:"#fff", borderRadius:12, border:"0.5px solid rgba(6,7,8,0.08)", overflow:"hidden" }}>
              {filtered.map((item,i) => (
                <div key={item.id} onClick={()=>setSelected(s=>s?.id===item.id?null:item)} style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"0.75rem 1.25rem", borderBottom:i<filtered.length-1?"0.5px solid rgba(6,7,8,0.06)":"none", background:selected?.id===item.id?"rgba(33,150,243,0.04)":"transparent", cursor:"pointer" }}>
                  <div style={{ width:52, height:40, borderRadius:8, overflow:"hidden", background:"rgba(6,7,8,0.05)", flexShrink:0 }}>
                    <img src={item.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).style.opacity="0.2";}}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                    <div style={{ fontSize:11, color:"rgba(6,7,8,0.4)" }}>{item.tag} · {fmtSize(item.size)} · {new Date(item.added_at).toLocaleDateString()}</div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();copyUrl(item.url,item.id);}} style={{ fontSize:11, padding:"5px 12px", borderRadius:6, border:"0.5px solid rgba(6,7,8,0.12)", background:copied===item.id?"#E3F2FD":"transparent", color:copied===item.id?"#1565C0":"rgba(6,7,8,0.5)", cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}>
                    {copied===item.id?"Copied!":"Copy URL"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ width:260, background:"#fff", borderLeft:"0.5px solid rgba(6,7,8,0.1)", overflowY:"auto", flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", padding:"1.25rem", borderBottom:"0.5px solid rgba(6,7,8,0.08)" }}>
            <span style={{ fontSize:13, fontWeight:700 }}>Details</span>
            <button onClick={()=>setSelected(null)} style={{ background:"none", border:"none", fontSize:16, cursor:"pointer", color:"rgba(6,7,8,0.4)" }}>✕</button>
          </div>
          <div style={{ padding:"1.25rem", display:"flex", flexDirection:"column", gap:"1rem" }}>
            <img src={selected.url} alt="" style={{ width:"100%", borderRadius:8, maxHeight:150, objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
            {[["Filename",selected.name],["Size",fmtSize(selected.size)],["Type",selected.type],["Added",new Date(selected.added_at).toLocaleDateString()]].map(([k,v])=>(
              <div key={k}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(6,7,8,0.35)", marginBottom:3 }}>{k}</div>
                <div style={{ fontSize:12, fontWeight:600, wordBreak:"break-all" }}>{v}</div>
              </div>
            ))}
            <div>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(6,7,8,0.35)", marginBottom:4 }}>Tag</div>
              <select value={selected.tag} onChange={e=>updateTag(selected.id,e.target.value)} style={{ width:"100%", padding:"7px 10px", fontSize:12, borderRadius:8, border:"0.5px solid rgba(6,7,8,0.15)", background:"#F8F6F2", fontFamily:"inherit", cursor:"pointer" }}>
                {TAGS.filter(t=>t!=="All").map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <button onClick={()=>copyUrl(selected.url,selected.id)} style={{ fontSize:12, fontWeight:700, padding:9, borderRadius:8, background:copied===selected.id?"#E3F2FD":"#04080F", color:copied===selected.id?"#1565C0":"#F8F6F2", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
              {copied===selected.id?"✓ Copied URL":"Copy URL"}
            </button>
            <button onClick={()=>deleteItem(selected.id,selected.url)} style={{ fontSize:12, padding:9, borderRadius:8, background:"#FFEBEE", color:"#B71C1C", border:"0.5px solid #FFCDD2", cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
