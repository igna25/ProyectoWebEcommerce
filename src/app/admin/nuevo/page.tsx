'use client'
import React, { useState } from 'react';
import clsx from 'clsx';
import { FileUploader } from "react-drag-drop-files"; 
import { createProduct } from '@/app/lib/actions/createProduct'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fileTypes = ["JPG", "PNG"]; 

interface NewProductFormProps {}

const NewProductForm: React.FC<NewProductFormProps> = () => {
  const [productName, setProductName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string | ''>('');
  const [stock, setStock] = useState<string | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleFileUpload = (file: File) => { 
    setFile(file); 
  }; 

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!productName || productName.length <3) newErrors.productName = 'El nombre del producto debe tener al menos 3 caracteres';
    if (!description || description.length <20) newErrors.description = 'La descripción debe tener al menos 20 caracteres';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'El precio debe ser un número positivo';
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) newErrors.stock = 'El stock debe ser un número no negativo';
    if (!file) newErrors.file = 'Debe seleccionar una imagen';

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData:FormData = new FormData()

      formData.append('productName', productName)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('stock', stock)
      if(file){
        formData.append('image', file)
      }
      


      const result = await createProduct(formData);
      
      if (result.success) {
        toast.success('Producto creado exitosamente', { position: "top-right" });
        setProductName('');
        setDescription('');
        setPrice('');
        setStock('');
        setFile(null);
      } else {
        toast.error('Error al crear producto', { position: "top-right" });
      }
    } catch (error) {
      console.error('Error al enviar datos:', error);
      toast.error('Error al enviar datos', { position: "top-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto rounded overflow-hidden shadow-lg bg-white m-4 flex flex-col">
      <ToastContainer />
      <div className="px-6 py-4 flex-1 flex flex-col justify-between">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Producto</h2>
          <p className="mt-2 text-sm text-gray-600">
            Por favor, completa los siguientes campos para agregar un nuevo producto.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-800">
              Nombre del Producto
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className={clsx(
                'mt-1 block w-full rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-800',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400',
                errors.productName && 'border-red-500'
              )}
            />
            {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-800">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={clsx(
                'mt-1 block w-full rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-800',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400',
                errors.description && 'border-red-500'
              )}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-800">
              Precio
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={clsx(
                'mt-1 block w-full rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-800',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400',
                errors.price && 'border-red-500'
              )}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-800">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={clsx(
                'mt-1 block w-full rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-800',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400',
                errors.stock && 'border-red-500'
              )}
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
          </div>
          <FileUploader  
            handleChange={handleFileUpload}  
            name="imagen" 
            types={fileTypes}  
            classes={clsx(errors.file && 'border-red-500')}
          /> 
          {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={clsx(
                'mt-4 w-full rounded-lg py-2 text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2',
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 focus:ring-blue-500'
              )}
            >
              {isSubmitting ? 'Enviando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductForm;
