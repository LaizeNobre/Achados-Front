import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import FormFields from "../components/FormFields";

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
    <div className="container-wide">
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Link to="/" className="btn btn-secondary">- Voltar</Link>
      </div>

      <div className="form-card-wide">
        <h2 style={{ color: "#1a5b8c", fontSize: "1.6rem", marginBottom: "24px", textAlign: "center" }}>
          {isEditing ? "Editar Item" : "Novo Item"}
        </h2>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <FormFields
            nome={nome}
            setNome={setNome}
            descricao={descricao}
            setDescricao={setDescricao}
            categoria={categoria}
            setCategoria={setCategoria}
            local={local}
            setLocal={setLocal}
            dataEncontrado={dataEncontrado}
            setDataEncontrado={setDataEncontrado}
            categoriasList={categoriasList}
            locaisList={locaisList}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "center" }}>
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