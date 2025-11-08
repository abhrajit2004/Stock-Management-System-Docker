"use client";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {

  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [loadingaction, setLoadingaction] = useState(false);

  useEffect(() => {

    const fetchProducts = async () => {
      const response = await fetch('/api/product');
      let data = await response.json();
      setProducts(data.products);
    }

    fetchProducts();

  }, [])


  const addProduct = async (e) => {

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        console.log('Product added successfully');
        setAlert("Your Product has been added!");
        setProductForm({});
      }
      else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.log('Error:', error);
    }

     const response = await fetch('/api/product');
      let data = await response.json();
      setProducts(data.products);
    e.preventDefault();
  }

  const buttonAction = async (action, slug, initialQuantity) => {

    let index = products.findIndex((item) => item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts);

        let indexdrop = dropdown.findIndex((item) => item.slug == slug);
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if (action == "plus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1;
    } else {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropdown);


    console.log(action, slug);
    setLoadingaction(true);
       const response = await fetch('/api/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({action, slug, initialQuantity}),
       });
    
    let r = await response.json();
    console.log(r);
    setLoadingaction(false);
  }

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  }

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length>3) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch('/api/search?query=' + query);
      let data = await response.json();
      setDropdown(data.products);
      setLoading(false);
    }
    else {
      setDropdown([]);
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <div className="text-center text-green-800">{alert}</div>
        <h1 className="text-3xl font-semibold my-4">Search a Product</h1>

        <div className="flex mb-2">
          <input onChange={onDropdownEdit} type="text" placeholder="Enter a product name" className="border border-gray-300 px-4 py-2 w-full" />
          <select className="border border-gray-300 px-4 py-2 rounded-r-md">
            <option value="">All</option>
            <option value="category 1">Category 1</option>
            <option value="category 2">Category 2</option>
          </select>
        </div>
        {loading && <div className="flex justify-center items-center"><LoadingSpinner /></div>}
        <div className="dropcontainer absolute bg-purple-100 w-[87vw] rounded-md">
          {dropdown.map((item) => {
            return <div key={item.slug} className="container flex justify-between p-2 my-1 border-b-2 border-white">
              <span className="slug">{item.slug} ({item.quantity} available for ₹{item.price})</span>
              <div className="mx-5">
                <button onClick={()=>buttonAction("minus", item.slug, item.quantity)} disabled={loadingaction} className="subtract cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200">-</button>
                <span className="quantity inline-block w-7 mx-3">{item.quantity}</span>
                <button onClick={()=>buttonAction("plus", item.slug, item.quantity)} disabled={loadingaction} className="add cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200">+</button>
              </div>

            </div>
          })}
        </div>

      </div>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>

        <form>
          <div className="mb-4">
            <label htmlFor="productName" className="block mb-2">Product Slug</label>
            <input value={productForm?.slug || ""} name="slug" onChange={handleChange} type="text" id="productName" className="w-full border border-gray-300 px-4 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block mb-2">Quantity</label>
            <input value={productForm?.quantity || ""} name="quantity" onChange={handleChange} type="number" id="quantity" className="w-full border border-gray-300 px-4 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block mb-2">Price</label>
            <input value={productForm?.price || ""} name="price" onChange={handleChange} type="number" id="price" className="w-full border border-gray-300 px-4 py-2" />
          </div>

          <button onClick={addProduct} type="submit" className="cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md">Add Product</button>
        </form>
      </div>

      <div className="container mx-auto p-6">

        <h1 className="text-3xl font-semibold mb-4">Display Current Stock</h1>

        {/* Stock Table */}
        <div className="overflow-x-auto bg-white shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-900 text-sm">
              <tr>
                <th scope="col" className="px-6 py-3">Product Name</th>
                <th scope="col" className="px-6 py-3">Quantity</th>
                <th scope="col" className="px-6 py-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                return <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{product.slug}</td>
                  <td className="px-6 py-4">{product.quantity}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                </tr>
              })}
            </tbody>
          </table>

        </div>
      </div>
    </>
  );
}
