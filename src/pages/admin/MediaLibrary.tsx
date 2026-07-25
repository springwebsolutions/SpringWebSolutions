import React, { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { 
  Image as ImageIcon, Folder, Upload, Trash2, Search, 
  FileText, FileArchive, ExternalLink, Loader2, CheckCircle, AlertCircle 
} from 'lucide-react'

interface MediaFile {
  id: string
  filename: string
  file_path: string
  file_size: number
  mime_type: string
  folder: string
  category: string
  created_at: string
}

export const MediaLibrary: React.FC = () => {
  const { user } = useAuthStore()
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string>('general')
  
  // Upload states
  const [uploading, setUploading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const fetchMedia = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (err) {
      console.error('Error loading media library:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0 || !isSupabaseConfigured) return

    setUploading(true)
    setNotification(null)
    const file = fileList[0]
    const fileExt = file.name.split('.').pop()
    const cleanFileName = `${Math.random().toString(36).substring(2, 10)}-${Date.now()}.${fileExt}`
    
    // Select bucket based on file extension
    const isCodeDistribution = ['zip', 'dmg', 'exe', 'bin', 'crx'].includes(fileExt?.toLowerCase() || '')
    const bucketName = isCodeDistribution ? 'software-distributions' : 'media-assets'

    try {
      // 1. Upload to Supabase Storage Bucket
      const { data: storageData, error: storageErr } = await supabase.storage
        .from(bucketName)
        .upload(cleanFileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (storageErr) throw storageErr

      // 2. Fetch Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(cleanFileName)

      // 3. Write metadata record to media_library table
      const { error: dbErr } = await supabase.from('media_library').insert({
        filename: file.name,
        file_path: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        folder: selectedFolder,
        category: file.type.split('/')[0] || 'other',
        uploaded_by: user?.id
      })

      if (dbErr) throw dbErr

      setNotification({ type: 'success', msg: `Successfully uploaded ${file.name} to ${bucketName}.` })
      fetchMedia()
    } catch (err: any) {
      console.error(err)
      setNotification({ type: 'error', msg: err.message || 'File upload failed.' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileItem: MediaFile) => {
    if (!window.confirm(`Are you sure you want to delete ${fileItem.filename}? This will permanently delete the file from the database and storage buckets.`)) return

    try {
      // Extract file name from public url
      const pathParts = fileItem.file_path.split('/')
      const cleanName = pathParts[pathParts.length - 1]
      const bucketName = fileItem.file_path.includes('software-distributions') ? 'software-distributions' : 'media-assets'

      // 1. Delete from Storage Bucket
      const { error: storageErr } = await supabase.storage.from(bucketName).remove([cleanName])
      if (storageErr) throw storageErr

      // 2. Delete from Metadata table
      const { error: dbErr } = await supabase.from('media_library').delete().eq('id', fileItem.id)
      if (dbErr) throw dbErr

      setFiles(files.filter(f => f.id !== fileItem.id))
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Error occurred during deletion.')
    }
  }

  const filteredFiles = files.filter(f => 
    f.filename.toLowerCase().includes(search.toLowerCase()) && 
    f.folder === selectedFolder
  )

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mime: string) => {
    if (mime.startsWith('image/')) return <ImageIcon className="text-emerald-500" size={24} />
    if (mime.includes('zip') || mime.includes('x-zip') || mime.includes('octet-stream')) return <FileArchive className="text-brand-indigo" size={24} />
    return <FileText className="text-blue-400" size={24} />
  }

  return (
    <div className="space-y-6">
      
      {/* Media Board */}
      <div className="admin-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-white/[0.06] flex items-center justify-center">
              <ImageIcon size={18} className="text-sky-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Media Library</h1>
              <p className="text-[12px] text-slate-500 mt-0.5">Upload images, PDFs, and software distributions to storage buckets.</p>
            </div>
          </div>

          {/* Upload Button Trigger */}
          <label className="btn-admin-primary cursor-pointer">
            {uploading ? (
              <><Loader2 className="animate-spin" size={14} /><span>Uploading…</span></>
            ) : (
              <><Upload size={14} /><span>Upload File</span></>
            )}
            <input
              type="file"
              disabled={uploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {notification && (
          <div className={`p-3.5 rounded-xl flex items-start gap-2.5 text-xs border ${
            notification.type === 'success' ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/8 border-rose-500/20 text-rose-400'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={14} /> : <AlertCircle className="shrink-0 mt-0.5" size={14} />}
            <span>{notification.msg}</span>
          </div>
        )}

        {/* Toolbar: Folder tabs + search */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-y border-white/[0.05] py-4">
          <div className="flex gap-1.5 flex-wrap">
            {['general', 'blog', 'products'].map(fold => (
              <button
                key={fold}
                onClick={() => setSelectedFolder(fold)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedFolder === fold
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                    : 'bg-white/[0.04] text-slate-500 hover:text-slate-200 border border-white/[0.06]'
                }`}
              >
                <Folder size={11} className="inline mr-1" />
                {fold}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input pl-8"
              placeholder="Search assets…"
            />
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500" size={28} />
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <ImageIcon size={32} className="mx-auto text-slate-700" />
            <div className="text-sm font-semibold text-slate-600">No files in this folder</div>
            <div className="text-xs text-slate-700">Upload images, PDFs, or installers to get started.</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className="group relative bg-white/[0.025] border border-white/[0.06] rounded-xl p-3 flex flex-col gap-2 hover:border-white/15 transition-all overflow-hidden"
              >
                {/* Preview */}
                <div className="aspect-square rounded-lg bg-black/30 border border-white/[0.05] flex items-center justify-center overflow-hidden">
                  {file.mime_type.startsWith('image/') ? (
                    <img
                      src={file.file_path}
                      alt={file.filename}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      {getFileIcon(file.mime_type)}
                      <span className="text-[9px] text-slate-600 font-mono uppercase">{file.filename.split('.').pop()}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-200 truncate" title={file.filename}>{file.filename}</div>
                  <div className="text-[10px] text-slate-600 flex justify-between mt-0.5">
                    <span>{formatSize(file.file_size)}</span>
                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions — visible on hover */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={file.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-black/70 text-slate-300 hover:text-white transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink size={11} />
                  </a>
                  <button
                    onClick={() => handleDelete(file)}
                    className="p-1.5 rounded-lg bg-rose-500/80 text-white hover:bg-rose-500 transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default MediaLibrary
