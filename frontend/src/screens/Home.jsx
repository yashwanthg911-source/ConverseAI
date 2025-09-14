import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const { user, setUser } = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState("")
    const [project, setProject] = useState([])

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        axios.post('/projects/create', { name: projectName })
            .then(() => {
                setIsModalOpen(false)
                setProjectName("")
                return axios.get('/projects/all')
            })
            .then((res) => {
                if (res) setProject(res.data.projects)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function handleLogout() {
        localStorage.clear()
        setUser(null)
        navigate('/login')
    }

    function handleDelete(id) {
        const confirmDelete = window.confirm("Are you sure you want to delete this project?")
        if (!confirmDelete) return;

        axios.delete(`/projects/${id}`)
            .then(() => {
                setProject(prev => prev.filter(p => p._id !== id))
            })
            .catch(err => {
                console.error("Delete failed", err)
            })
    }

    useEffect(() => {
        axios.get('/projects/all')
            .then((res) => setProject(res.data.projects))
            .catch(err => console.log(err))
    }, [])

    return (
        <main className="min-h-screen p-6 bg-gray-50 flex justify-start items-start relative">
            {/* Logout button at top-right corner */}
            <button
                onClick={handleLogout}
                className="absolute top-4 right-6 text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 z-10"
            >
                Logout
            </button>

            {/* Project Container */}
            <div className="w-full max-w-md bg-purple-100 rounded-lg shadow-md p-6 ml-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Your Projects</h1>
                </div>

                {/* Create New Project Button */}
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#5e35b1]"
                    >
                        Create New Project
                    </button>
                </div>

                {/* Projects List */}
                {project.length === 0 ? (
                    <div className="text-center text-gray-700 font-medium">
                        No projects yet
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-1">
                        {project.map((project) => (
                            <div
                                key={project._id}
                                className="relative bg-white border rounded-md p-4 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                    navigate(`/project`, {
                                        state: { project },
                                    })
                                }
                            >
                                {/* Delete Icon */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(project._id)
                                    }}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    title="Delete"
                                >
                                    <i className="ri-delete-bin-line text-lg" />
                                </button>

                                <h2 className="text-lg font-medium">{project.name}</h2>
                                <p className="text-sm mt-1">
                                    <i className="ri-user-line mr-1"></i>
                                    Collaborators: {project.users.length}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-80">
                        <h2 className="text-xl mb-4 font-semibold">Create New Project</h2>
                        <form onSubmit={createProject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#673ab7] text-white rounded-md hover:bg-[#5e35b1]"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Home
