import React from 'react'

const FileUploadForm = ({ onSubmit, onFileChange, uploading }) => (
    <form onSubmit={onSubmit} className="space-y-4">
        <input
            type="file"
            accept=".pdf"
            onChange={onFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
            {uploading ? 'Uploading...' : 'Upload CV'}
        </button>
    </form>
)

export default FileUploadForm
