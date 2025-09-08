import { useState } from 'react'

const CVUploadPage = () => {
    const [file, setFile] = useState(null)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [uploading, setUploading] = useState(false)

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        setMessage('')
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) {
            setError('Please select a file')
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        try {
            setUploading(true)
            const res = await fetch('http://localhost:3000/api/cvs/upload', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Something went wrong')

            setMessage(`Uploaded: ${data.filename}`)
            setError('')
        } catch (err) {
            setError(err.message)
            setMessage('')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Upload CV</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {uploading ? 'Uploading...' : 'Upload CV'}
                </button>
            </form>

            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    )
}

export default CVUploadPage
