import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Home() {
  const [user, setUser] = useState(null);
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [resUser, resCat, resLoc] = await Promise.all([
          api.get("/eu"),
          api.get("/categorias"),
          api.get("/locais")
        ]);
        setUser(resUser.data);
        setCategorias(resCat.data);
        setLocais(resLoc.data);
      } catch (err) {
        setError("Não foi possível carregar. Verifique sua chave.");
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function fetchItens() {
      setLoading(true);
      try {
        const params = {};
        if (busca.trim()) params.busca = busca.trim();
        if (status) params.status = status;
        if (categoria) params.categoria = categoria;
        if (local) params.local = local;

        const response = await api.get("/itens", { params });
        setItens(response.data);
        setError("");
      } catch (err) {
        setError("Erro ao buscar itens.");
      } finally {
        setLoading(false);
      }
    }
    fetchItens();
  }, [busca, status, categoria, local]);

  return (
    <div className="container">
      <header className="app-header">
        <h1>Achados e Perdidos IFRN</h1>
        {user && <div className="user-badge">Olá, {user.nome}</div>}
      </header>

      <div style={{ marginBottom: "20px" }}>
        <Link to="/novo" className="btn btn-primary">
          + Novo item
        </Link>
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="aguardando">Aguardando</option>
          <option value="devolvido">Devolvido</option>
        </select>

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas as categorias</option>
          {categorias.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option value="">Todos os locais</option>
          {locais.map((loc, idx) => (
            <option key={idx} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <p>Carregando itens...</p>
      ) : itens.length === 0 ? (
        <p>Nenhum item encontrado.</p>
      ) : (
        <div className="items-grid">
          {itens.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-info">
                <span className={`status-badge status-${item.status}`}>
                  {item.status}
                </span>
                <h3>{item.nome}</h3>
                <p className="item-meta">
                  <strong>Categoria:</strong> {item.categoria} &bull; <strong>Local:</strong> {item.local}
                </p>
              </div>
              <div>
                <Link to={`/item/${item.id}`} className="btn btn-secondary">
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}