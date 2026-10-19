

function SearchFilters(props) {
  return (
    <div className="filters-bar">
      <input
        type="text"
        placeholder="Buscar por nome ou descrição..."
        value={props.busca}
        onChange={(e) => props.setBusca(e.target.value)}
      />

      <select value={props.status} onChange={(e) => props.setStatus(e.target.value)}>
        <option value="">Todos os status</option>
        <option value="aguardando">Aguardando</option>
        <option value="devolvido">Devolvido</option>
      </select>

      <select value={props.categoria} onChange={(e) => props.setCategoria(e.target.value)}>
        <option value="">Todas as categorias</option>
        {props.categorias.map((cat, idx) => (
          <option key={idx} value={cat}>{cat}</option>
        ))}
      </select>

      <select value={props.local} onChange={(e) => props.setLocal(e.target.value)}>
        <option value="">Todos os locais</option>
        {props.locais.map((loc, idx) => (
          <option key={idx} value={loc}>{loc}</option>
        ))}
      </select>
    </div>
  );
}

export default SearchFilters;