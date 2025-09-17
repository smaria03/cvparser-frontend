import { useState } from 'react'

const CVUploadPage = () => {
    const [file, setFile] = useState(null)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [uploading, setUploading] = useState(false)
    const [summary, setSummary] = useState(null)

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

    const handleChange = (field, value) => {
        setSummary(prev => ({ ...prev, [field]: value }))
    }

    const handleExperienceChange = (index, key, value) => {
        const newExperiences = [...summary.experiences]
        newExperiences[index][key] = value
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

    const handleDeleteExperience = (index) => {
        const newExperiences = summary.experiences.filter((_, i) => i !== index)
        setSummary(prev => ({ ...prev, experiences: newExperiences }))
    }

    const handleAddExperience = () => {
        const newExperience = { job_details: '', period: '' }
        setSummary(prev => ({
            ...prev,
            experiences: [...(prev.experiences || []), newExperience]
        }))
    }

    const renderSummary = () => {
        if (!summary) return null

        return (
            <section className="mt-8 bg-white border shadow rounded p-6 space-y-6">
                <h2 className="text-2xl font-bold mb-2">Extracted Summary</h2>
                <div className="grid grid-cols-1 gap-4">
                    <label>
                        <span className="font-medium">Name:</span>
                        <input
                            type="text"
                            value={summary.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="mt-1 block w-full border rounded px-3 py-2"/>
                    </label>
                    <label>
                        <span className="font-medium">Email:</span>
                        <input
                            type="email"
                            value={summary.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="mt-1 block w-full border rounded px-3 py-2"/>
                    </label>

                    <label>
                        <span className="font-medium">Current Job Details:</span>
                        <input
                            type="text"
                            value={summary.current_job?.job_details || ''}
                            onChange={(e) => {
                                const updated = { ...summary.current_job, job_details: e.target.value }
                                setSummary(prev => ({ ...prev, current_job: updated }))
                            }}
                            className="mt-1 block w-full border rounded px-3 py-2"/>
                    </label>
                    <label>
                        <span className="font-medium">Current Job Period:</span>
                        <input
                            type="text"
                            value={summary.current_job?.period || ''}
                            onChange={(e) => {
                                const updated = { ...summary.current_job, period: e.target.value }
                                setSummary(prev => ({ ...prev, current_job: updated }))
                            }}
                            className="mt-1 block w-full border rounded px-3 py-2"/>
                    </label>

                    <label>
                        <span className="font-medium">Total Experience:</span>
                        <input
                            type="text"
                            value={summary.total_experience_years}
                            onChange={(e) => handleChange('total_experience_years', e.target.value)}
                            className="mt-1 block w-full border rounded px-3 py-2"/>
                    </label>

                    <label>
                        <span className="font-medium">Skills:</span>
                        <textarea
                            value={summary.skills}
                            onChange={(e) => handleChange('skills', e.target.value)}
                            rows={3}
                            className="mt-1 block w-full border rounded px-3 py-2"/>
                    </label>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mt-6 mb-2">Experiences</h3>
                    {summary.experiences.map((exp, index) => (
                        <div key={index} className="mb-4 flex items-center gap-2">
                            <input
                                type="text"
                                value={exp.job_details}
                                onChange={(e) => handleExperienceChange(index, 'job_details', e.target.value)}
                                className="flex-1 border rounded px-3 py-2"
                                placeholder="Job details"/>
                            <input
                                type="text"
                                value={exp.period}
                                onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                                className="w-48 text-sm text-gray-500 border rounded px-2 py-1"
                                placeholder="Period"/>
                            <button
                                type="button"
                                onClick={() => handleDeleteExperience(index)}
                                className="text-red-500 hover:text-red-700 font-bold text-lg"
                                title="Delete">
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddExperience}
                        className="mt-2 font-semibold"
                        title="Add Experience">
                        +Add
                    </button>
                </div>
                <div className="pt-4">
                    <button
                        onClick={handleSaveToSheet}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Save to Excel
                    </button>
                </div>
            </section>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 p-10 space-y-10">
            <section className="bg-white border shadow rounded p-6">
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
            </section>

            {renderSummary()}
        </div>
    )
}

export default CVUploadPage
