import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [devolvidoPara, setDevolvidoPara] = useState("");
  const [showDevolverInput, setShowDevolverInput] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await api.get(`/itens/${id}`);
        setItem(response.data);
      } catch (err) {
        setError("Não foi possível carregar os detalhes do item.");
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  async function handleDevolver(e) {
    e.preventDefault();
    try {
      await api.patch(`/itens/${id}/devolver`, { devolvido_para: devolvidoPara });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao marcar como devolvido.");
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/itens/${id}`);
      navigate("/");
    } catch (err) {
      setError("Erro ao excluir o item.");
    }
  }

  if (loading) return <div className="container"><p>Carregando...</p></div>;
  if (error) return <div className="container"><div className="alert-error">{error}</div></div>;
  if (!item) return <div className="container"><p>Item não encontrado.</p></div>;

  return (
    <div className="container">
      <div style={{ marginBottom: "20px" }}>
        <Link to="/" className="btn btn-secondary">- Voltar</Link>
      </div>

      <div className="card-detail">
        <h2>{item.nome}</h2>
        <span className={`status-badge status-${item.status}`} style={{ margin: "10px 0" }}>
          {item.status}
        </span>
        <p><strong>Descrição:</strong> {item.descricao}</p>
        <p><strong>Categoria:</strong> {item.categoria}</p>
        <p><strong>Local:</strong> {item.local}</p>
        <p><strong>Encontrado em:</strong> {item.data_encontrado}</p>
        
        {item.status === "devolvido" && (
          <div style={{ marginTop: "10px", padding: "10px", background: "#f8fafc", borderRadius: "6px" }}>
            <p><strong>Devolvido para:</strong> {item.devolvido_para}</p>
            <p><strong>Data da devolução:</strong> {item.data_devolucao}</p>
          </div>
        )}

        <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to={`/editar/${item.id}`} className="btn btn-secondary">
            Editar
          </Link>
          <button onClick={() => setShowConfirmDelete(true)} className="btn btn-danger">
            Excluir
          </button>
          {item.status === "aguardando" && (
            <button onClick={() => setShowDevolverInput(!showDevolverInput)} className="btn btn-primary">
              Marcar como devolvido
            </button>
          )}
        </div>

        {showDevolverInput && (
          <form onSubmit={handleDevolver} style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Nome de quem recebeu"
              value={devolvidoPara}
              onChange={(e) => setDevolvidoPara(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">Confirmar</button>
          </form>
        )}

        {showConfirmDelete && (
          <div className="modal-confirm">
            <p style={{ marginBottom: "10px" }}>Tem certeza que deseja excluir este item?</p>
            <button onClick={handleDelete} className="btn btn-danger" style={{ marginRight: "10px" }}>
              Excluir
            </button>
            <button onClick={() => setShowConfirmDelete(false)} className="btn btn-secondary">
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}