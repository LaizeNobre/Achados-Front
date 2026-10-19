import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function ItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");
  const [dataEncontrado, setDataEncontrado] = useState("");

  const [categoriasList, setCategoriasList] = useState([]);
  const [locaisList, setLocaisList] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFormData() {
      try {
        const [resCat, resLoc] = await Promise.all([
          api.get("/categorias"),
          api.get("/locais")
        ]);
        setCategoriasList(resCat.data);
        setLocaisList(resLoc.data);

        if (isEditing) {
          const resItem = await api.get(`/itens/${id}`);
          setNome(resItem.data.nome);
          setDescricao(resItem.data.descricao);
          setCategoria(resItem.data.categoria);
          setLocal(resItem.data.local);
          setDataEncontrado(resItem.data.data_encontrado);
        }
      } catch (err) {
        setError("Erro ao carregar dados do formulário.");
      }
    }
    loadFormData();
  }, [id, isEditing]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      nome,
      descricao,
      categoria,
      local,
      data_encontrado: dataEncontrado
    };

    try {
      if (isEditing) {
        await api.put(`/itens/${id}`, payload);
      } else {
        await api.post("/itens", payload);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao salvar o item.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div style={{ marginBottom: "20px" }}>
        <Link to="/" className="btn btn-secondary">- Voltar</Link>
      </div>

      <div className="form-card">
        <h2 style={{ marginBottom: "20px", color: "#1a5b8c" }}>
          {isEditing ? "Editar Item" : "Novo Item"}
        </h2>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição:</label>
            <textarea
              rows="3"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoria:</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecione a categoria</option>
              {categoriasList.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Local:</label>
            <select
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              required
            >
              <option value="">Selecione o local</option>
              {locaisList.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Data em que foi encontrado:</label>
            <input
              type="date"
              value={dataEncontrado}
              onChange={(e) => setDataEncontrado(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <Link to="/" className="btn btn-secondary">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}