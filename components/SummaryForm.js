import React from 'react'

const SummaryForm = ({ summary, sheets, onChange, onExperienceChange, onAddExp, onDelExp, onSave }) => {
    if (!summary) return null

    const renderExperiences = () => (
        <div>
            <h3 className="text-lg font-semibold mb-2">Experiences</h3>
            {summary.experiences.map((exp, index) => (
                <div key={index} className=" flex items-center gap-2">
                    <input
                        type="text"
                        value={exp.job_details}
                        onChange={(e) => onExperienceChange(index, 'job_details', e.target.value)}
                        className="flex-1 border rounded px-3 py-2"
                        placeholder="Job details"
                    />
                    <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => onExperienceChange(index, 'period', e.target.value)}
                        className="w-48 text-sm text-gray-500 border rounded px-2 py-1"
                        placeholder="Period"
                    />
                    <button
                        type="button"
                        onClick={() => onDelExp(index)}
                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                        title="Delete"
                    >
                        X
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={onAddExp}
                className="mt-2 font-semibold"
                title="Add Experience"
            >
                +Add
            </button>
        </div>
    )

    return (
        <section className="mt-8 bg-white border shadow rounded p-6 space-y-6">
            <h2 className="text-2xl font-bold mb-2">Extracted Summary</h2>
            <div className="grid grid-cols-1 gap-4">
                <label>
                    <span className="text-lg font-semibold mt-6 mb-2">Name:</span>
                    <input
                        type="text"
                        value={summary.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        className="mt-1 block w-full border rounded px-3 py-2"
                    />
                </label>
                <label>
                    <span className="text-lg font-semibold mt-6 mb-2">Email:</span>
                    <input
                        type="email"
                        value={summary.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        className="mt-1 block w-full border rounded px-3 py-2"
                    />
                </label>
                <label>
                    <span className="text-lg font-semibold mt-6 mb-2">Applied For:</span>
                    <input
                        type="text"
                        value={summary.applied_for || ''}
                        onChange={(e) => onChange('applied_for', e.target.value)}
                        className="mt-1 block w-full border rounded px-3 py-2"
                        placeholder="Enter job title"
                    />
                </label>
                <label>
                    <span className="text-lg font-semibold mt-6 mb-2">Current Job Details:</span>
                    <input
                        type="text"
                        value={summary.current_job?.job_details || ''}
                        onChange={(e) => {
                            const updated = { ...summary.current_job, job_details: e.target.value }
                            onChange('current_job', updated)
                        }}
                        className="mt-1 block w-full border rounded px-3 py-2"
                    />
                </label>
                <label>
                    <span className="text-lg font-semibold mt-6 mb-2">Current Job Period:</span>
                    <input
                        type="text"
                        value={summary.current_job?.period || ''}
                        onChange={(e) => {
                            const updated = { ...summary.current_job, period: e.target.value }
                            onChange('current_job', updated)
                        }}
                        className="mt-1 block w-full border rounded px-3 py-2"
                    />
                </label>
                <label>
                    <span className="text-lg font-semibold mt-6 mb-2">Total Experience:</span>
                    <input
                        type="text"
                        value={summary.total_experience_years}
                        onChange={(e) => onChange('total_experience_years', e.target.value)}
                        className="mt-1 block w-full border rounded px-3 py-2"
                    />
                </label>
                <label>
                    <span className="text-lg font-semibold mt-6 mb-2">Skills:</span>
                    <textarea
                        value={summary.skills}
                        onChange={(e) => onChange('skills', e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border rounded px-3 py-2"
                    />
                </label>
                {renderExperiences()}
                <label>
                    <span className="font-medium">Sheet:</span>
                    <select
                        value={summary.sheet || ''}
                        onChange={(e) => onChange('sheet', e.target.value)}
                        className="mt-1 block w-full border rounded px-3 py-2 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select sheet</option>
                        {sheets.map((sheet) => (
                            <option key={sheet} value={sheet}>
                                {sheet}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="pt-4">
                <button
                    onClick={onSave}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Save to Excel
                </button>
            </div>
        </section>
    )
}

export default SummaryForm
