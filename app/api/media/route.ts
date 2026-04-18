import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("media_library")
    .select("*")
    .order("added_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, url, size, type, tag, isUpload, base64, fileName, fileType } = body;

    let finalUrl = url;

    // If this is a file upload, save to Supabase Storage
    if (isUpload && base64 && fileName) {
      // Convert base64 to buffer
      const base64Data = base64.split(",")[1] || base64;
      const buffer = Buffer.from(base64Data, "base64");
      
      // Upload to Supabase Storage bucket "media"
      const filePath = `${Date.now()}-${fileName.replace(/[^a-z0-9.-]/gi, "-").toLowerCase()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, buffer, {
          contentType: fileType || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        // If storage bucket doesn't exist or fails, store URL as-is
        console.error("Storage upload error:", uploadError.message);
        // Fall back to storing as data URL reference
        finalUrl = url || `/uploads/${filePath}`;
      } else {
        // Get public URL from storage
        const { data: { publicUrl } } = supabase.storage
          .from("media")
          .getPublicUrl(filePath);
        finalUrl = publicUrl;
      }
    }

    const { data, error } = await supabase
      .from("media_library")
      .insert({ 
        name: name || fileName || "image", 
        url: finalUrl, 
        size: size || 0, 
        type: type || fileType || "image/jpeg", 
        tag: tag || "Other" 
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Media POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id, url } = await req.json();
  
  // Try to delete from storage if it's a Supabase Storage URL
  if (url && url.includes("/storage/v1/object/")) {
    const path = url.split("/media/")[1];
    if (path) await supabase.storage.from("media").remove([path]);
  }
  
  const { error } = await supabase.from("media_library").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const { id, tag } = await req.json();
  const { error } = await supabase.from("media_library").update({ tag }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
