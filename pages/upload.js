import { useState, useEffect } from 'react'
import FileUploadForm from '../components/FileUploadForm'
import SummaryForm from '../components/SummaryForm'

const CVUploadPage = () => {
    const [file, setFile] = useState(null)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [uploading, setUploading] = useState(false)
    const [summary, setSummary] = useState(null)
    const [sheets, setSheets] = useState([])

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        setMessage('')
        setError('')
        setSummary(null)
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

            const summaryRes = await fetch(`http://localhost:3000/api/cvs/${data.id}/extract_summary`)
            const summaryData = await summaryRes.json()
            if (!summaryRes.ok) throw new Error(summaryData.error || 'Failed to extract summary')

            setSummary(summaryData)
        } catch (err) {
            setError(err.message)
            setMessage('')
        } finally {
            setUploading(false)
        }
    }

    useEffect(() => {
        if (summary) {
            fetch('http://localhost:3000/api/cvs/sheets')
                .then(res => res.json())
                .then(data => setSheets(data.sheets || []))
                .catch(err => console.error('Failed to load sheets', err))
        }
    }, [summary])

    const handleChange = (field, value) => {
        setSummary(prev => ({ ...prev, [field]: value }))
    }

    const handleExperienceChange = (index, key, value) => {
        const newExperiences = [...summary.experiences]
        newExperiences[index][key] = value
        setSummary(prev => ({ ...prev, experiences: newExperiences }))
    }

    const handleAddExperience = () => {
        const newExperience = { job_details: '', period: '' }
        setSummary(prev => ({
            ...prev,
            experiences: [...(prev.experiences || []), newExperience]
        }))
    }

    const handleDeleteExperience = (index) => {
        const newExperiences = summary.experiences.filter((_, i) => i !== index)
        setSummary(prev => ({ ...prev, experiences: newExperiences }))
    }

    const handleSaveToSheet = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/cvs/save_to_sheet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ summary }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Save failed')

            setMessage(data.message || 'Saved successfully to Excel')
            setError('')

            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (err) {
            setError(err.message)
            setMessage('')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-10 space-y-10">
            <section className="bg-white border shadow rounded p-6">
                <h1 className="text-2xl font-semibold mb-4">Upload CV</h1>
                <FileUploadForm
                    onSubmit={handleSubmit}
                    onFileChange={handleFileChange}
                    uploading={uploading}
                />
                {message && <p className="mt-4 text-green-600">{message}</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </section>

            <SummaryForm
                summary={summary}
                sheets={sheets}
                onChange={handleChange}
                onExperienceChange={handleExperienceChange}
                onAddExp={handleAddExperience}
                onDelExp={handleDeleteExperience}
                onSave={handleSaveToSheet}
            />
        </div>
    )
}

export default CVUploadPage
