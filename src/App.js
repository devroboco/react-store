import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Switch, useParams } from "react-router-dom";
import axios from "axios";
import { Image } from "antd";
import "./App.css";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((response) => {
      const products = response.data;
      const formattedProducts = [];
      for (const product of products) {
        const title =
          product.title.length > 25
            ? product.title.substring(0, 25) + "..."
            : product.title;

        formattedProducts.push({
          ...product,
          title: title,
          price: `R$${Number(product.price).toFixed(2)}`.replace(".", ","),
        });
      }

      setProducts(formattedProducts);
    });
  }, []);

  return (
    <div className="app">
      <h1 className="app-title">Produtos</h1>
      <div className="product-list">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <Link to={`/product/${item.id}`} className="product-link">
              <Image src={item.image} alt={item.title} preview={false} className="product-image" />
              <h2 className="product-title">{item.title}</h2>
              <p className="product-price">Preço: {item.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar detalhes do produto:", error);
      });
  }, [id]);

  if (!product) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="app">
      <h1 className="app-title">Detalhes do Produto</h1>
      <div className="product-detail">
        <Image src={product.image} alt={product.title} preview={false} className="product-image" />
        <h2 className="product-title">{product.title}</h2>
        <p className="product-price">Preço: {`R$${Number(product.price).toFixed(2)}`.replace(".", ",")}</p>
        <p className="product-description">Descrição: {product.description}</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={ProductList} />
        <Route path="/product/:id" component={ProductDetail} />
      </Switch>
    </Router>
  );
}

export default App;
