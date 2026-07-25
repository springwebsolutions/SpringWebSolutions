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
      <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white tracking-tight">Central Media Manager</h3>
            <p className="text-xs text-slate-500 mt-1">Upload installers, documentation PDFs, and blog images to storage buckets.</p>
          </div>

          {/* Upload Button Trigger */}
          <label className="btn-primary flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow">
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Uploading Asset...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>Upload File</span>
              </>
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
          <div className={`p-4 rounded-xl flex items-start gap-2.5 text-sm ${
            notification.type === 'success' ? 'bg-brand-emerald/15 border border-brand-emerald/20 text-brand-emerald' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={16} /> : <AlertCircle className="shrink-0 mt-0.5" size={16} />}
            <span>{notification.msg}</span>
          </div>
        )}

        {/* Search and folders selector row */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-y border-white/5 py-4 dark:border-white/5 light:border-slate-200">
          {/* Folders tabs */}
          <div className="flex space-x-2">
            {['general', 'blog', 'products'].map(fold => (
              <button
                key={fold}
                onClick={() => setSelectedFolder(fold)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedFolder === fold
                    ? 'bg-brand-emerald text-white'
                    : 'bg-white/5 text-slate-400 hover:text-white light:bg-slate-100 light:text-slate-600'
                }`}
              >
                {fold}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald light:bg-slate-900/5 light:border-slate-200"
              placeholder="Search assets..."
            />
          </div>
        </div>

        {/* Media Grid Cards */}
        {loading ? (
          <div className="h-48 flex items-center justify-center text-brand-emerald">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs font-medium">
            This folder is empty. Upload images or installers to start seeding.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className="group rounded-2xl glass-panel border border-white/5 p-4 flex flex-col justify-between hover:shadow-lg transition-all overflow-hidden relative"
              >
                {/* Visual Preview Box */}
                <div className="aspect-square rounded-lg bg-black/30 border border-white/5 flex items-center justify-center relative overflow-hidden">
                  {file.mime_type.startsWith('image/') ? (
                    <img
                      src={file.file_path}
                      alt={file.filename}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                    />
                  ) : (
                    getFileIcon(file.mime_type)
                  )}
                </div>

                {/* Details */}
                <div className="mt-3 space-y-1">
                  <div className="text-xs font-bold text-white truncate" title={file.filename}>
                    {file.filename}
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>{formatSize(file.file_size)}</span>
                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Delete Hover Bar overlay */}
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={file.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded bg-black/60 text-slate-300 hover:text-white"
                    title="Open Url"
                  >
                    <ExternalLink size={12} />
                  </a>
                  <button
                    onClick={() => handleDelete(file)}
                    className="p-1 rounded bg-rose-500/80 text-white hover:bg-rose-500"
                    title="Delete permanently"
                  >
                    <Trash2 size={12} />
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
