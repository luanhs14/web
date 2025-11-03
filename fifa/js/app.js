// FIFA Career Mode Assistant - Aplicação Principal com Supabase
const { useState, useEffect } = React;
const { createClient } = supabase;

// CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://djyacpdolggbubhadvmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqeWFjcGRvbGdnYnViaGFkdm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNjY5MDUsImV4cCI6MjA3Nzc0MjkwNX0.1xyed5hWXIp77Nt-kttglmlVufZ4Do2QwsyQ1g188Es';

// Cliente Supabase
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Componente de classificação por estrelas
function StarRating({ rating, onRatingChange, readOnly = false }) {
    const [hover, setHover] = useState(0);

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
                    onClick={() => !readOnly && onRatingChange(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

// Componente principal
function FIFACareerAssistant() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [positionsNeeded, setPositionsNeeded] = useState([]);
    const [scouts, setScouts] = useState([]);
    const [currentSquad, setCurrentSquad] = useState([]);
    const [academy, setAcademy] = useState([]);
    const [budget, setBudget] = useState(0);
    const [spent, setSpent] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPosition, setFilterPosition] = useState('Todas');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const positions = ['GOL', 'LD', 'ZAG', 'LE', 'VOL', 'MC', 'MD', 'ME', 'MEI', 'ATA'];
    const priorities = ['Alta', 'Média', 'Baixa'];
    const statuses = ['Titular', 'Reserva', 'Promessa'];

    // Carregar dados do Supabase ao iniciar
    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Carregar todas as tabelas em paralelo
            const [positionsRes, scoutsRes, squadRes, academyRes, budgetRes] = await Promise.all([
                supabaseClient.from('positions_needed').select('*').order('id', { ascending: true }),
                supabaseClient.from('scouts').select('*').order('id', { ascending: true }),
                supabaseClient.from('current_squad').select('*').order('id', { ascending: true }),
                supabaseClient.from('academy').select('*').order('id', { ascending: true }),
                supabaseClient.from('budget_info').select('*').limit(1).single()
            ]);

            if (positionsRes.error) throw positionsRes.error;
            if (scoutsRes.error) throw scoutsRes.error;
            if (squadRes.error) throw squadRes.error;
            if (academyRes.error) throw academyRes.error;
            if (budgetRes.error && budgetRes.error.code !== 'PGRST116') throw budgetRes.error;

            setPositionsNeeded(positionsRes.data || []);
            setScouts(scoutsRes.data || []);
            setCurrentSquad(squadRes.data || []);
            setAcademy(academyRes.data || []);

            if (budgetRes.data) {
                setBudget(budgetRes.data.budget || 0);
                setSpent(budgetRes.data.spent || 0);
            }

            setLoading(false);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            setError('Erro ao carregar dados. Verifique se as tabelas foram criadas no Supabase.');
            setLoading(false);
        }
    };

    // Função para formatar valor em dólares
    const formatValue = (value) => {
        if (!value) return '$0';
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
        }
        return `$${(value / 1000).toFixed(0)}K`;
    };

    // Função para abrir modal de adição/edição
    const openModal = (type, item = null) => {
        setModalType(type);
        setEditingItem(item);
        setShowModal(true);
    };

    // Função para adicionar/editar item
    const handleSave = async (formData) => {
        try {
            let result;

            if (modalType === 'position') {
                if (editingItem) {
                    result = await supabaseClient
                        .from('positions_needed')
                        .update(formData)
                        .eq('id', editingItem.id)
                        .select();
                    if (result.error) throw result.error;
                    setPositionsNeeded(positionsNeeded.map(p => p.id === editingItem.id ? result.data[0] : p));
                } else {
                    result = await supabaseClient
                        .from('positions_needed')
                        .insert([formData])
                        .select();
                    if (result.error) throw result.error;
                    setPositionsNeeded([...positionsNeeded, result.data[0]]);
                }
            } else if (modalType === 'scout') {
                if (editingItem) {
                    result = await supabaseClient
                        .from('scouts')
                        .update(formData)
                        .eq('id', editingItem.id)
                        .select();
                    if (result.error) throw result.error;
                    setScouts(scouts.map(s => s.id === editingItem.id ? result.data[0] : s));
                } else {
                    result = await supabaseClient
                        .from('scouts')
                        .insert([formData])
                        .select();
                    if (result.error) throw result.error;
                    setScouts([...scouts, result.data[0]]);
                }
            } else if (modalType === 'player') {
                if (editingItem) {
                    result = await supabaseClient
                        .from('current_squad')
                        .update(formData)
                        .eq('id', editingItem.id)
                        .select();
                    if (result.error) throw result.error;
                    setCurrentSquad(currentSquad.map(p => p.id === editingItem.id ? result.data[0] : p));
                } else {
                    result = await supabaseClient
                        .from('current_squad')
                        .insert([formData])
                        .select();
                    if (result.error) throw result.error;
                    setCurrentSquad([...currentSquad, result.data[0]]);
                }
            } else if (modalType === 'academy') {
                if (editingItem) {
                    result = await supabaseClient
                        .from('academy')
                        .update(formData)
                        .eq('id', editingItem.id)
                        .select();
                    if (result.error) throw result.error;
                    setAcademy(academy.map(p => p.id === editingItem.id ? result.data[0] : p));
                } else {
                    result = await supabaseClient
                        .from('academy')
                        .insert([formData])
                        .select();
                    if (result.error) throw result.error;
                    setAcademy([...academy, result.data[0]]);
                }
            }

            setShowModal(false);
            setEditingItem(null);
        } catch (err) {
            console.error('Erro ao salvar:', err);
            alert('Erro ao salvar: ' + err.message);
        }
    };

    // Função para deletar item
    const handleDelete = async (type, id) => {
        if (!window.confirm('Tem certeza que deseja excluir?')) return;

        try {
            let result;

            if (type === 'position') {
                result = await supabaseClient.from('positions_needed').delete().eq('id', id);
                if (result.error) throw result.error;
                setPositionsNeeded(positionsNeeded.filter(p => p.id !== id));
            } else if (type === 'scout') {
                result = await supabaseClient.from('scouts').delete().eq('id', id);
                if (result.error) throw result.error;
                setScouts(scouts.filter(s => s.id !== id));
            } else if (type === 'player') {
                result = await supabaseClient.from('current_squad').delete().eq('id', id);
                if (result.error) throw result.error;
                setCurrentSquad(currentSquad.filter(p => p.id !== id));
            } else if (type === 'academy') {
                result = await supabaseClient.from('academy').delete().eq('id', id);
                if (result.error) throw result.error;
                setAcademy(academy.filter(p => p.id !== id));
            }
        } catch (err) {
            console.error('Erro ao deletar:', err);
            alert('Erro ao deletar: ' + err.message);
        }
    };

    // Função para atualizar orçamento
    const updateBudget = async (newBudget, newSpent) => {
        try {
            const { data, error } = await supabaseClient
                .from('budget_info')
                .upsert({ id: 1, budget: newBudget, spent: newSpent })
                .select();

            if (error) throw error;

            setBudget(newBudget);
            setSpent(newSpent);
        } catch (err) {
            console.error('Erro ao atualizar orçamento:', err);
            alert('Erro ao atualizar orçamento: ' + err.message);
        }
    };

    // Modal de formulário
    const FormModal = () => {
        const [formData, setFormData] = useState(editingItem || {});

        const handleSubmit = (e) => {
            e.preventDefault();
            handleSave(formData);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4">
                        {editingItem ? 'Editar' : 'Adicionar'} {
                            modalType === 'position' ? 'Posição Necessária' :
                            modalType === 'scout' ? 'Jogador de Interesse' :
                            modalType === 'player' ? 'Jogador do Elenco' :
                            'Jogador da Base'
                        }
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {modalType === 'position' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Posição</label>
                                    <select
                                        className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                        value={formData.position || ''}
                                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                                        required
                                    >
                                        <option value="">Selecione</option>
                                        {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Prioridade</label>
                                    <select
                                        className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                        value={formData.priority || ''}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                        required
                                    >
                                        <option value="">Selecione</option>
                                        {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Observações</label>
                                    <textarea
                                        className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                        value={formData.observations || ''}
                                        onChange={(e) => setFormData({...formData, observations: e.target.value})}
                                        rows="3"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nome</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Posição</label>
                                        <select
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                            value={formData.position || ''}
                                            onChange={(e) => setFormData({...formData, position: e.target.value})}
                                            required
                                        >
                                            <option value="">Selecione</option>
                                            {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Idade</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                            value={formData.age || ''}
                                            onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                                            required
                                        />
                                    </div>
                                </div>
                                {modalType === 'scout' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Clube Atual</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                            value={formData.club || ''}
                                            onChange={(e) => setFormData({...formData, club: e.target.value})}
                                        />
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Overall</label>
                                        <input
                                            type="number"
                                            min="40"
                                            max="99"
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                            value={formData.overall || ''}
                                            onChange={(e) => setFormData({...formData, overall: parseInt(e.target.value)})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Potencial</label>
                                        <input
                                            type="number"
                                            min="40"
                                            max="99"
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                            value={formData.potential || ''}
                                            onChange={(e) => setFormData({...formData, potential: parseInt(e.target.value)})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Valor ($)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                        value={formData.value || ''}
                                        onChange={(e) => setFormData({...formData, value: parseInt(e.target.value)})}
                                        required
                                    />
                                </div>
                                {modalType === 'player' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Status</label>
                                            <select
                                                className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                                value={formData.status || ''}
                                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            >
                                                <option value="">Selecione</option>
                                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="loan_listed"
                                                    className="mr-2"
                                                    checked={formData.loan_listed || false}
                                                    onChange={(e) => setFormData({...formData, loan_listed: e.target.checked})}
                                                />
                                                <label htmlFor="loan_listed">Na lista de empréstimo</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="transfer_listed"
                                                    className="mr-2"
                                                    checked={formData.transfer_listed || false}
                                                    onChange={(e) => setFormData({...formData, transfer_listed: e.target.checked})}
                                                />
                                                <label htmlFor="transfer_listed">Na lista de transferência</label>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {(modalType === 'player' || modalType === 'academy') && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Avaliação</label>
                                        <StarRating
                                            rating={formData.rating || 0}
                                            onRatingChange={(rating) => setFormData({...formData, rating})}
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Observações</label>
                                    <textarea
                                        className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                                        value={formData.observations || ''}
                                        onChange={(e) => setFormData({...formData, observations: e.target.value})}
                                        rows="3"
                                    />
                                </div>
                            </>
                        )}
                        <div className="flex gap-2 pt-4">
                            <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium">
                                Salvar
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-medium"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // Dashboard
    const Dashboard = () => {
        const available = budget - spent;
        const totalValue = currentSquad.reduce((sum, p) => sum + (p.value || 0), 0);
        const avgAge = currentSquad.length > 0
            ? (currentSquad.reduce((sum, p) => sum + p.age, 0) / currentSquad.length).toFixed(1)
            : 0;

        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold">Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="text-sm text-gray-400 mb-1">Orçamento Total</div>
                        <div className="text-2xl font-bold text-green-400">{formatValue(budget)}</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="text-sm text-gray-400 mb-1">Gasto</div>
                        <div className="text-2xl font-bold text-red-400">{formatValue(spent)}</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="text-sm text-gray-400 mb-1">Disponível</div>
                        <div className="text-2xl font-bold text-blue-400">{formatValue(available)}</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="text-sm text-gray-400 mb-1">Valor do Elenco</div>
                        <div className="text-2xl font-bold text-yellow-400">{formatValue(totalValue)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Estatísticas do Elenco</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total de Jogadores:</span>
                                <span className="font-bold">{currentSquad.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Idade Média:</span>
                                <span className="font-bold">{avgAge} anos</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Para Empréstimo:</span>
                                <span className="font-bold">{currentSquad.filter(p => p.loan_listed).length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Para Venda:</span>
                                <span className="font-bold">{currentSquad.filter(p => p.transfer_listed).length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Outras Informações</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Jogadores da Base:</span>
                                <span className="font-bold">{academy.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Alvos de Contratação:</span>
                                <span className="font-bold">{scouts.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Posições Prioritárias:</span>
                                <span className="font-bold">{positionsNeeded.filter(p => p.priority === 'Alta').length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {positionsNeeded.length > 0 && (
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Posições que Precisam de Reforços</h3>
                        <div className="space-y-2">
                            {positionsNeeded.map(pos => (
                                <div key={pos.id} className="flex items-center justify-between bg-gray-700 p-3 rounded">
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-lg">{pos.position}</span>
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            pos.priority === 'Alta' ? 'bg-red-600' :
                                            pos.priority === 'Média' ? 'bg-yellow-600' :
                                            'bg-green-600'
                                        }`}>
                                            {pos.priority}
                                        </span>
                                        <span className="text-sm text-gray-400">{pos.observations}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Lista de jogadores genérica
    const PlayerList = ({ players, type, title }) => {
        const filteredPlayers = players.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPosition = filterPosition === 'Todas' || p.position === filterPosition;
            return matchesSearch && matchesPosition;
        });

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">{title}</h2>
                    <button
                        onClick={() => openModal(type)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium"
                    >
                        + Adicionar
                    </button>
                </div>

                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar jogador..."
                        className="flex-1 bg-gray-800 rounded px-4 py-2 text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="bg-gray-800 rounded px-4 py-2 text-white"
                        value={filterPosition}
                        onChange={(e) => setFilterPosition(e.target.value)}
                    >
                        <option value="Todas">Todas as Posições</option>
                        {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredPlayers.map(player => (
                        <div key={player.id} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold">{player.name}</h3>
                                        <span className="bg-blue-600 px-2 py-1 rounded text-sm">{player.position}</span>
                                        {player.club && <span className="text-sm text-gray-400">{player.club}</span>}
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                                        <div>
                                            <span className="text-gray-400 text-sm">Idade:</span>
                                            <span className="ml-2 font-medium">{player.age}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-sm">Overall:</span>
                                            <span className="ml-2 font-medium">{player.overall}</span>
                                        </div>
                                        {player.potential && (
                                            <div>
                                                <span className="text-gray-400 text-sm">Potencial:</span>
                                                <span className="ml-2 font-medium">{player.potential}</span>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-gray-400 text-sm">Valor:</span>
                                            <span className="ml-2 font-medium">{formatValue(player.value)}</span>
                                        </div>
                                    </div>
                                    {player.status && (
                                        <div className="mb-2">
                                            <span className="bg-gray-700 px-2 py-1 rounded text-sm">{player.status}</span>
                                            {player.loan_listed && <span className="ml-2 bg-yellow-600 px-2 py-1 rounded text-sm">Empréstimo</span>}
                                            {player.transfer_listed && <span className="ml-2 bg-red-600 px-2 py-1 rounded text-sm">Transferência</span>}
                                        </div>
                                    )}
                                    {player.rating !== undefined && player.rating !== null && (
                                        <div className="mb-2">
                                            <StarRating rating={player.rating} readOnly={true} />
                                        </div>
                                    )}
                                    {player.observations && (
                                        <p className="text-sm text-gray-400 mt-2">{player.observations}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(type, player)}
                                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(type, player.id)}
                                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPlayers.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                        Nenhum jogador encontrado
                    </div>
                )}
            </div>
        );
    };

    // Tela de loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">⚽</div>
                    <div className="text-xl text-gray-400">Carregando dados...</div>
                </div>
            </div>
        );
    }

    // Tela de erro
    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-red-900 border border-red-700 rounded-lg p-6 max-w-2xl">
                    <h2 className="text-2xl font-bold text-red-200 mb-4">Erro ao conectar com Supabase</h2>
                    <p className="text-red-100 mb-4">{error}</p>
                    <div className="bg-gray-800 p-4 rounded mb-4">
                        <p className="text-sm text-gray-300 mb-2">Por favor, execute o script SQL no Supabase:</p>
                        <ol className="text-sm text-gray-300 list-decimal list-inside space-y-1">
                            <li>Acesse o SQL Editor no painel do Supabase</li>
                            <li>Copie e cole o conteúdo de supabase-setup.sql</li>
                            <li>Execute o script</li>
                            <li>Recarregue esta página</li>
                        </ol>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-3xl font-bold text-green-400">⚽ FIFA - Modo Carreira</h1>
                    <p className="text-gray-400 mt-1">Gerencie seu modo carreira como um profissional</p>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="container mx-auto px-4">
                    <div className="flex gap-1 overflow-x-auto">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                            { id: 'positions', label: 'Posições Necessárias', icon: '🎯' },
                            { id: 'scouts', label: 'Jogadores de Interesse', icon: '🔍' },
                            { id: 'squad', label: 'Elenco Atual', icon: '👥' },
                            { id: 'academy', label: 'Base', icon: '🌱' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-gray-700 text-green-400 border-b-2 border-green-400'
                                        : 'text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'positions' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold">Posições que Precisam de Reforços</h2>
                            <button
                                onClick={() => openModal('position')}
                                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium"
                            >
                                + Adicionar Posição
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {positionsNeeded.map(pos => (
                                <div key={pos.id} className="bg-gray-800 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold">{pos.position}</span>
                                            <span className={`px-2 py-1 rounded text-sm ${
                                                pos.priority === 'Alta' ? 'bg-red-600' :
                                                pos.priority === 'Média' ? 'bg-yellow-600' :
                                                'bg-green-600'
                                            }`}>
                                                {pos.priority}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openModal('position', pos)}
                                                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete('position', pos.id)}
                                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-400">{pos.observations}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'scouts' && <PlayerList players={scouts} type="scout" title="Jogadores de Interesse (Scouts)" />}
                {activeTab === 'squad' && <PlayerList players={currentSquad} type="player" title="Elenco Atual" />}
                {activeTab === 'academy' && <PlayerList players={academy} type="academy" title="Jogadores da Base" />}
            </main>

            {/* Modal */}
            {showModal && <FormModal />}

            {/* Footer */}
            <footer className="bg-gray-800 border-t border-gray-700 mt-12">
                <div className="container mx-auto px-4 py-6 text-center text-gray-400">
                    <p className="mb-2">✅ Conectado ao Supabase - Seus dados estão salvos na nuvem</p>
                    <p className="text-xs">Acesse de qualquer dispositivo com suas credenciais</p>
                </div>
            </footer>
        </div>
    );
}

// Render da aplicação
ReactDOM.render(<FIFACareerAssistant />, document.getElementById('root'));
