import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
    Plus, 
    Upload, 
    Download, 
    Search,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CrimeList = () => {
    const { user } = useAuth();
    const [crimes, setCrimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCrimes();
    }, [page, search]);

    const fetchCrimes = async () => {
        try {
            const res = await api.get(`/api/crimes?page=${page}&limit=10&location=${search}`);
            setCrimes(res.data.data);
            setTotal(res.data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('/api/crimes/upload', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Upload successful!');
            fetchCrimes();
        } catch (err) {
            alert('Upload failed: ' + err.message);
        }
    };

    return (
        <div className="space-y-6 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold italic">Crime Ledger</h2>
                    <p className="text-gray-400">Detailed logs of all reported criminal activities.</p>
                </div>
                <div className="flex gap-3">
                    <button className="secondary-button flex items-center gap-2">
                        <Download size={18} />
                        Export
                    </button>
                    {user?.role === 'admin' && (
                        <>
                            <label className="primary-button flex items-center gap-2 cursor-pointer">
                                <Upload size={18} />
                                Upload CSV
                                <input type="file" className="hidden" accept=".csv" onChange={handleUpload} />
                            </label>
                            <button className="primary-button flex items-center gap-2 bg-accent-purple hover:bg-accent-purple/80">
                                <Plus size={18} />
                                New Record
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by location..." 
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                                <th className="px-6 py-4 font-semibold">Crime ID</th>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Location</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {crimes.map((crime) => (
                                <tr key={crime._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-mono text-accent-blue">{crime.crimeId}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10">
                                            {crime.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{crime.location}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">
                                        {new Date(crime.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            crime.status === 'Solved' ? 'bg-accent-green/20 text-accent-green' :
                                            crime.status === 'In Progress' ? 'bg-accent-blue/20 text-accent-blue' :
                                            'bg-accent-red/20 text-accent-red'
                                        }`}>
                                            {crime.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-400">
                    <p>Showing {(page-1)*10 + 1} to {Math.min(page*10, total)} of {total} entries</p>
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="px-4 py-2 bg-accent-blue/10 text-accent-blue rounded-lg font-bold">
                            {page}
                        </span>
                        <button 
                            disabled={page * 10 >= total}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrimeList;
