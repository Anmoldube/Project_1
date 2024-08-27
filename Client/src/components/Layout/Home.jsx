import React, { useEffect, useState } from "react";
import axios from "axios";
import FormTable from "./FormTable";

function App() {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    StartDate: "",
    EXP: "",
  });
  const [formDataEdit, setFormDataEdit] = useState({
    Name: "",
    StartDate: "",
    EXP: "",
    _id: "",
  });
  const [dataList, setDataList] = useState([]);

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3001/UserInfo/SoftwareData/create",
        formData
      );
      if (data.success) {
        setAddSection(false);
        alert(data.message);
        getFetchData();
        setFormData({
          Name: "",
          StartDate: "",
          EXP: "",
        });
      }
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const getFetchData = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3001/UserInfo/SoftwareData"
      );
      if (data.success) {
        setDataList(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3001/UserInfo/SoftwareData/delete/${id}`
      );
      if (data.success) {
        getFetchData();
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        `http://localhost:3001/UserInfo/SoftwareData/update/${formDataEdit._id}`,
        formDataEdit
      );
      if (data.success) {
        getFetchData();
        alert(data.message);
        setEditSection(false);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleEditOnChange = (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h1 className="text-xl font-bold mb-4">Read Records</h1>
      <button
        className="btn btn-add bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setAddSection(true)}
      >
        Create Record
      </button>

      {addSection && (
        <FormTable
          handleSubmit={handleSubmit}
          handleOnChange={handleOnChange}
          handleClose={() => setAddSection(false)}
          rest={formData}
        />
      )}
      {editSection && (
        <FormTable
          handleSubmit={handleUpdate}
          handleOnChange={handleEditOnChange}
          handleClose={() => setEditSection(false)}
          rest={formDataEdit}
        />
      )}

      <div className="tableContainer mt-6">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-700">
                Name
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-700">
                StartDate
                <span className="align-top text-xs ml-1 bg-slate-200 animate-pulse">
                  mm:dd:yyyy
                </span>
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-700">
                Expire
                <span className="align-top text-xs ml-1 animate-pulse bg-slate-200">
                  mm:dd:yyyy
                </span>
              </th>

              <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {dataList.length > 0 ? (
              dataList.map((el) => (
                <tr
                  key={el._id}
                  className="hover:bg-gray-100 border-b border-gray-200 p-10"
                >
                  <td className=" p-4 ">{el.Name}</td>
                  <td className="">
                    {new Date(el.StartDate).toLocaleDateString()}
                  </td>
                  <td className="">{new Date(el.EXP).toLocaleDateString()}</td>
                  <td className="">
                    <button
                      className="btn btn-edit bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2 transition-colors duration-200"
                      onClick={() => handleEdit(el)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-200"
                      onClick={() => handleDelete(el._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 px-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
