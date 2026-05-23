"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { FileUploader } from "react-drag-drop-files";
import { Button } from "@headlessui/react";
import { updateProduct } from "@/lib/actions/updateProduct";
import { toast } from "react-toastify";
import { Product } from "@/lib/Entities";

const fileTypes = ["JPG", "PNG"];

const EditProductForm = ({ product }: { product: Product }) => {
  const [productName, setProductName] = useState<string>(product.productname);
  const [description, setDescription] = useState<string>(product.description);
  const [price, setPrice] = useState<string | "">(product.price.toString());
  const [stock, setStock] = useState<string | "">(product.stock.toString());
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setProductName(product.productname);
    setDescription(product.description);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
  }, [product]);

  const handleFileUpload = (file: File) => {
    setFile(file);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!productName || productName.length < 3)
      newErrors.productName =
        "El nombre del producto debe tener al menos 3 caracteres";
    if (!description || description.length < 20)
      newErrors.description =
        "La descripción debe tener al menos 20 caracteres";
    if (!price || isNaN(Number(price)) || Number(price) <= 0)
      newErrors.price = "El precio debe ser un número positivo";
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0)
      newErrors.stock = "El stock debe ser un número no negativo";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!navigator.onLine) {
      toast.error(
        "Sin conexión. Esta acción requiere internet para poder realizarse.",
        { position: "top-right" },
      );
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData: FormData = new FormData();
      formData.append("id", product.id);
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      if (file) {
        formData.append("image", file);
      }

      const result = await updateProduct(formData);

      if (result.success) {
        toast.success("Producto actualizado exitosamente", {
          position: "top-right",
        });
      } else {
        toast.error("Error al actualizar producto", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      toast.error("Error al enviar datos", { position: "top-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto rounded overflow-hidden shadow-lg bg-white m-4 flex flex-col">
      <div className="px-6 py-4 flex-1 flex flex-col justify-between">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Editar Producto</h2>
          <p className="mt-2 text-sm text-gray-600">
            Edita los siguientes campos para actualizar el producto.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-800"
            >
              Nombre del Producto
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className={clsx(
                "mt-1 block w-full rounded-xl border bg-gray-50 py-2 px-3 text-sm text-gray-800",
                "focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition",
                errors.productName ? "border-red-400" : "border-gray-200",
              )}
            />
            {errors.productName && (
              <p className="text-red-500 text-xs mt-1">{errors.productName}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-800"
            >
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={clsx(
                "mt-1 block w-full rounded-xl border bg-gray-50 py-2 px-3 text-sm text-gray-800",
                "focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition",
                errors.description ? "border-red-400" : "border-gray-200",
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-800"
            >
              Precio
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={clsx(
                "mt-1 block w-full rounded-xl border bg-gray-50 py-2 px-3 text-sm text-gray-800",
                "focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition",
                errors.price ? "border-red-400" : "border-gray-200",
              )}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-800"
            >
              Stock
            </label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={clsx(
                "mt-1 block w-full rounded-xl border bg-gray-50 py-2 px-3 text-sm text-gray-800",
                "focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition",
                errors.stock ? "border-red-400" : "border-gray-200",
              )}
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
            )}
          </div>
          <label
            htmlFor="productImage"
            className="block text-sm font-medium text-gray-800"
          >
            Nueva imagen
          </label>
          <label
            htmlFor="productImage"
            className="block text-sm font-medium text-gray-500"
          >
            (en caso de querer cambiar la imagen agregue otra, si no se agrega
            el producto simplemente seguirá con la misma imagen)
          </label>
          <FileUploader
            handleChange={handleFileUpload}
            name="imagen"
            types={fileTypes}
            classes={clsx(errors.file && "border-red-500")}
          />
          {errors.file && (
            <p className="text-red-500 text-xs mt-1">{errors.file}</p>
          )}
          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={clsx(
                "mt-4 w-full rounded-xl py-2.5 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#004AAD]",
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#004AAD] hover:bg-[#003d8f]",
              )}
            >
              {isSubmitting ? "Actualizando..." : "Actualizar Producto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
