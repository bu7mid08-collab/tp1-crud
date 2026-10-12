import { useEffect, useState } from "react";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./api.js";

const EMPTY = { name: "", description: "", price: "", quantity: "" };

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setProducts(await getProducts());
      setError("");
    } catch (e) {
      setError("Impossible de joindre le backend : " + e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity || "0", 10),
    };
    try {
      if (editingId) await updateProduct(editingId, data);
      else await createProduct(data);
      setForm(EMPTY);
      setEditingId(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  function onEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      quantity: String(p.quantity),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onCancel() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function onView(id) {
    try {
      setSelected(await getProduct(id));
    } catch (e) {
      setError(e.message);
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await deleteProduct(id);
      if (selected && selected.id === id) setSelected(null);
      if (editingId === id) onCancel();
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="container">
      <h1>Gestion de produits</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={onSubmit} className="card">
        <h2>{editingId ? `Modifier le produit #${editingId}` : "Ajouter un produit"}</h2>
        <input name="name" placeholder="Nom" value={form.name} onChange={onChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={onChange} />
        <input name="price" type="number" step="0.01" min="0" placeholder="Prix" value={form.price} onChange={onChange} required />
        <input name="quantity" type="number" min="0" placeholder="Quantité" value={form.quantity} onChange={onChange} />
        <div className="row">
          <button type="submit">{editingId ? "Enregistrer" : "Ajouter"}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={onCancel}>
              Annuler
            </button>
          )}
        </div>
      </form>

      {selected && (
        <div className="card detail">
          <h2>Détails du produit #{selected.id}</h2>
          <p><b>Nom :</b> {selected.name}</p>
          <p><b>Description :</b> {selected.description || "—"}</p>
          <p><b>Prix :</b> {selected.price} €</p>
          <p><b>Quantité :</b> {selected.quantity}</p>
          <button className="secondary" onClick={() => setSelected(null)}>Fermer</button>
        </div>
      )}

      <div className="card">
        <h2>Liste des produits ({products.length})</h2>
        {products.length === 0 ? (
          <p>Aucun produit pour le moment.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Nom</th><th>Prix</th><th>Qté</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.price} €</td>
                  <td>{p.quantity}</td>
                  <td className="actions">
                    <button onClick={() => onView(p.id)}>Voir</button>
                    <button onClick={() => onEdit(p)}>Modifier</button>
                    <button className="danger" onClick={() => onDelete(p.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
