import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import './AddClient.css';

function Dashboard() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('lista');
  const role = localStorage.getItem('role');

  const fetchClientes = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API}/get_clients.php`);
    setClientes(res.data);
  };

  useEffect(() => {
    if (!role) window.location.href = '/';
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing ? 'update_client.php' : 'add_client.php';
    await axios.post(`${process.env.REACT_APP_API}/${url}`, form);
    fetchClientes();
    setForm({});
    setEditing(false);
    setActiveTab('lista');
  };

  const handleDelete = async (id) => {
    if (role !== 'administrador') {
      alert('Solo el administrador puede eliminar clientes');
      return;
    }
    await axios.post(`${process.env.REACT_APP_API}/delete_client.php`, { id });
    fetchClientes();
  };

  const handleEdit = (cliente) => {
    setForm(cliente);
    setEditing(true);
    setActiveTab('añadir');
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Clientes Taller de Gas</h2>
        <div>
          <button onClick={() => setActiveTab('añadir')}>AÑADIR CLIENTE</button>
          <button onClick={handleLogout} style={{ marginLeft: '10px', backgroundColor: '#ff4d4d', color: 'white' }}>CERRAR SESIÓN</button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button onClick={() => setActiveTab('lista')} className={activeTab === 'lista' ? 'active' : ''}>Lista de Clientes</button>
        <button onClick={() => setActiveTab('añadir')} className={activeTab === 'añadir' ? 'active' : ''}>Añadir Cliente</button>
      </div>

      {activeTab === 'lista' && (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Placa</th>
              <th>Celular</th>
              <th>Recalificación</th>
              <th>Inspección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.placa}</td>
                <td>{cliente.celular}</td>
                <td>{cliente.fecha_recalificacion}</td>
                <td>{cliente.fecha_inspeccion}</td>
                <td>
                  <button onClick={() => handleEdit(cliente)}>Editar</button>
                  {role === 'administrador' && <button onClick={() => handleDelete(cliente.id)}>Eliminar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'añadir' && (
        <div className="add-client-form-container">
          <form onSubmit={handleSubmit} className="add-client-form">
            <label>Nombre Completo</label>
            <input name="nombre" placeholder="Nombre" value={form.nombre || ''} onChange={handleChange} required />
            <input name="apellido" placeholder="Apellido" value={form.apellido || ''} onChange={handleChange} required />

            <label className="form-title">Información Vehicular</label>
            <input name="placa" placeholder="Placa Vehicular" value={form.placa || ''} onChange={handleChange} required />
            <input name="celular" placeholder="Telefono" value={form.celular || ''} onChange={handleChange} required />

            <label className="form-title">Recalificación</label>
            <input type="date" name="fecha_recalificacion" value={form.fecha_recalificacion || ''} onChange={handleChange} required />

            <label className="form-title">Inspección Anual</label>
            <input type="date" name="fecha_inspeccion" value={form.fecha_inspeccion || ''} onChange={handleChange} required />

            <button type="submit">{editing ? 'ACTUALIZAR' : 'INGRESAR'}</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
