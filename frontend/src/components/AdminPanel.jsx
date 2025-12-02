import { useEffect, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: [null, null],
    count: 0,
    category: "Men",
  });
  const [updatedImages, setUpdatedImages] = useState({});

  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.isAdmin);

  useEffect(() => {
    fetchProducts();
    window.addEventListener("beforeunload", () => {
      dispatch({ type: "admin", payload: "false" });
    });
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/products");
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAdd = async () => {
    if (!newProduct.image[0] && !newProduct.image[1]) {
      alert("Please select at least 1 image!");
      return;
    }
    const formData = new FormData();
    formData.append("productName", newProduct.name);
    formData.append("productPrice", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("productCategory", newProduct.category);
    formData.append("productCount", newProduct.count);
    newProduct.image.forEach((img) => img && formData.append("image", img));

    try {
      const res = await fetch("http://localhost:3000/products/add-product", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setNewProduct({
          name: "",
          price: "",
          description: "",
          image: [null, null],
          count: 0,
          category: "Men",
        });
        fetchProducts();
      } else alert("Failed to add product");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

 const handleUpdate = async (id, updatedProduct) => {
  try {
    const newImages = updatedImages[id] || [];
    let res;

    // Agar images update ho rahi hain → FormData bhejo
    if (newImages.length > 0) {
      const formData = new FormData();
      formData.append("productName", updatedProduct.productName);
      formData.append("productPrice", updatedProduct.productPrice);
      formData.append("description", updatedProduct.description);
      formData.append("productCategory", updatedProduct.productCategory);
      formData.append("productCount", updatedProduct.productCount);

      newImages.forEach((img) => img && formData.append("image", img));

      res = await fetch(
        `http://localhost:3000/products/update-product/${id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );
    } else {
      // Agar images change nahi hui → JSON bhejo
      // Server ko ensure karo ki content-type application/json accept karta hai
      res = await fetch(
        `http://localhost:3000/products/update-product/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: updatedProduct.productName,
            productPrice: updatedProduct.productPrice,
            description: updatedProduct.description,
            productCategory: updatedProduct.productCategory,
            productCount: updatedProduct.productCount,
          }),
        }
      );
    }

    if (res.ok) {
      fetchProducts(); // Refresh products list
      setUpdatedImages((prev) => ({ ...prev, [id]: [] }));
      alert("Product updated successfully!");
    } else {
      const errData = await res.json();
      alert(errData.message || "Failed to update product");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    alert("Something went wrong while updating product");
  }
};


  const handleDelete = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/products/delete-product/${id}`, {
      method: "DELETE",
    });
    const data = await res.json(); // <- backend ka error message
    if (res.ok) {
      alert("Product deleted successfully!");
      fetchProducts(); // Refresh products
    } else {
      alert(data.error || "Failed to delete product"); // <- proper backend error show kare
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Something went wrong while deleting product");
  }
};


  const handleChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, [field]: value } : p))
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🛒 Admin Panel
      </h1>

      {/* Add Product */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-3">
          <label className="font-medium text-gray-700">Image 1</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                image: [e.target.files[0], newProduct.image[1]],
              })
            }
            className="border rounded-lg px-3 py-2"
          />
          <label className="font-medium text-gray-700">Image 2</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                image: [newProduct.image[0], e.target.files[0]],
              })
            }
            className="border rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex flex-col gap-3 md:col-span-2">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="number"
            placeholder="Count"
            value={newProduct.count}
            onChange={(e) =>
              setNewProduct({ ...newProduct, count: e.target.value })
            }
            className="border rounded-lg px-3 py-2 w-full"
          />
          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg w-full"
          >
            ➕ Add Product
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex gap-2 overflow-x-auto">
                {Array.isArray(p.productImage)
                  ? p.productImage.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="product"
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                    ))
                  : p.productImage && (
                      <img
                        src={p.productImage}
                        alt="product"
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                    )}
              </div>

              <input
                type="text"
                value={p.productName}
                onChange={(e) => handleChange(p._id, "productName", e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                value={p.productPrice}
                onChange={(e) => handleChange(p._id, "productPrice", e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                value={p.description}
                onChange={(e) => handleChange(p._id, "description", e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                value={p.productCount}
                onChange={(e) => handleChange(p._id, "productCount", e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              <select
                value={p.productCategory}
                onChange={(e) =>
                  handleChange(p._id, "productCategory", e.target.value)
                }
                className="border rounded-lg px-3 py-2"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleUpdate(p._id, p)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} /> Update
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products found</p>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
