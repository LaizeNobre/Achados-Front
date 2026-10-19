function FormFields(props) {
  return (
    <>
      <div className="form-group">
        <label>Nome:</label>
        <input
          type="text"
          value={props.nome}
          onChange={(e) => props.setNome(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Descrição:</label>
        <textarea
          rows="4"
          value={props.descricao}
          onChange={(e) => props.setDescricao(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Categoria:</label>
        <select
          value={props.categoria}
          onChange={(e) => props.setCategoria(e.target.value)}
          required
        >
          <option value="">Selecione a categoria</option>
          {props.categoriasList.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Local:</label>
        <select
          value={props.local}
          onChange={(e) => props.setLocal(e.target.value)}
          required
        >
          <option value="">Selecione o local</option>
          {props.locaisList.map((loc, idx) => (
            <option key={idx} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Data em que foi encontrado:</label>
        <input
          type="date"
          value={props.dataEncontrado}
          onChange={(e) => props.setDataEncontrado(e.target.value)}
          required
        />
      </div>
    </>
  );
}

export default FormFields;