import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

const breadcrumbsItems = [
  { label: 'Главная', link: '/RIP_front/events' },
  { label: 'Редактирование', link: '/RIP_front/edit_events' },
  { label: 'Добавление события', link: '' },
];

const AddEvents = () => {
  const navigateTo = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',
    Start_date: '',
    End_date: '',
    Image: '',
    Status: 'S', // Default status value
    Info: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      Image: file,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      Status: selectedStatus,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('Name', formData.Name);
    formDataToSend.append('Start_date', formData.Start_date);
    formDataToSend.append('End_date', formData.End_date);
    formDataToSend.append('Image', formData.Image);
    formDataToSend.append('Status', formData.Status);
    formDataToSend.append('Info', formData.Info);

    try {
        await axios.post('http://localhost:8000/events/add/', formDataToSend, {
          withCredentials: true,
        });
  
        // Redirect after successful event addition
        navigateTo('/RIP_front/events');
      } catch (error) {
        console.error('Error adding event:', error);
        // Handle errors
      }
    };

  return (
    <div>
      <Header />
      <Breadcrumbs items={breadcrumbsItems} />

      <form onSubmit={handleSubmit}>
      <h4>Name:</h4>
        <input
          type="text"
          id="name"
          className='registration-input'
          name="Name"
          value={formData.Name}
          onChange={handleInputChange}
          required
        />
        <h4>Start Date:</h4>
        <input
          type="date"
          id="start_date"
          className='registration-input'
          name="Start_date"
          value={formData.Start_date}
          onChange={handleInputChange}
          required
        />

        <h4>End Date:</h4>
        <input
          type="date"
          id="end_date"
          className='registration-input'
          name="End_date"
          value={formData.End_date}
          onChange={handleInputChange}
          required
        />
        

        <h4>Image:</h4>
        <input
          type="file"
          id="image"
          className='btn-login'
          name="Image"
          accept="image/*"
          onChange={handleFileChange}
        />

        <h4>Status:</h4>
        <select
          id="status"
          className='registration-input'
          name="Status"
          value={formData.Status}
          onChange={handleStatusChange}
        >
          <option value="S">Скоро</option>
          <option value="A">Доступно</option>
          <option value="C">Завершено</option>
        </select>

        <h4>Info:</h4>
        <textarea
          id="info"
          className='registration-input'
          name="Info"
          value={formData.Info}
          onChange={handleInputChange}
        />

        <button className='btn-custom' type="submit">Добавить</button>
      </form>
    </div>
  );
};

export default AddEvents;
