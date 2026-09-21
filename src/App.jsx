import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Add your styling preferences here

const API_URL = "https://localhost:7125/api/employee"; // Update with your actual API Port

function App() {
  const [employees, setEmployees] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  // READ Operation
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // CREATE or UPDATE Operation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !department || !salary) return alert("Please fill all fields");

    const employeeData = { name, department, salary: parseFloat(salary) };

    try {
      if (isEditing) {
        // UPDATE (PUT)
        await axios.put(`${API_URL}/${id}`, { id, ...employeeData });
        setIsEditing(false);
      } else {
        // CREATE (POST)
        await axios.post(API_URL, employeeData);
      }
      clearForm();
      fetchEmployees();
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  // Populate form for Edit
  const handleEdit = (employee) => {
    setIsEditing(true);
    setId(employee.id);
    setName(employee.name);
    setDepartment(employee.department);
    setSalary(employee.salary);
  };

  // DELETE Operation
  const handleDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${API_URL}/${employeeId}`);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting data: ", error);
      }
    }
  };

  const clearForm = () => {
    setId('');
    setName('');
    setDepartment('');
    setSalary('');
    setIsEditing(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Employee Management System (React + .NET Core + SQL Server)</h2>
      
      {/* Form Section */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" placeholder="Name" 
          value={name} onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="text" placeholder="Department" 
          value={department} onChange={(e) => setDepartment(e.target.value)} 
        />
        <input 
          type="number" placeholder="Salary" 
          value={salary} onChange={(e) => setSalary(e.target.value)} 
        />
        <button type="submit">{isEditing ? 'Update' : 'Add'} Employee</button>
        {isEditing && <button type="button" onClick={clearForm}>Cancel</button>}
      </form>

      {/* Table Section */}
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.department}</td>
              <td>${emp.salary}</td>
              <td>
                <button onClick={() => handleEdit(emp)} style={{ marginRight: '5px' }}>Edit</button>
                <button onClick={() => handleDelete(emp.id)} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;