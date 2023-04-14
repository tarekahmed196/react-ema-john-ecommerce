import React, { useEffect, useState } from 'react';
import './Shop.css'
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import { Link, useLoaderData } from 'react-router-dom';


const Shop = () => {

    const products = useLoaderData();
    const [cart, setCart]= useState([]);

    const clearCart =()=>{
        setCart([]);
        deleteShoppingCart();
    }

    useEffect(()=>{
        const storedCart = getShoppingCart();
        const savedCart = [];
        for(const id in storedCart){
            const addedProduct = products.find(product=>product.id ===id)
            if(addedProduct){
                const quantity = storedCart[id];
                addedProduct.quantity= quantity;
                savedCart.push(addedProduct);
            }
        }
        setCart(savedCart);

    },[products])

    const handleAddToCart = (selectedProduct)=>{
        // cart.push(product)
        let newCart = [];
        const exists = cart.find(product=> product.id === selectedProduct.id);
        if(!exists){
            selectedProduct.quantity=1;
            newCart = [...cart, selectedProduct]
        }
        else{
            const rest = cart.filter(product=> product.id !== selectedProduct.id);
            exists.quantity = exists.quantity +1;
            newCart = [...rest, exists];
        }
        
        setCart(newCart);
        addToDb(selectedProduct.id)
    }
    return (
        <div className='shop-container'>
            <div className="product-container">
                {
                    products.map(product =><Product 
                        key={product.id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    
                    ></Product> )
                }
            </div>
            <div className="cart-container">
                <Cart clearCart={clearCart} cart={cart}>
                    <Link to="/orders">
                        <button>Review Order</button>
                    </Link>
                </Cart>
                
            </div>
        </div>
    );
};

export default Shop;